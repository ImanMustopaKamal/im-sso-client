<template>
  <div>
    <b-modal
      v-model="show_modal"
      :title="title"
      :hide-footer="true"
      size="lg"
      no-close-on-backdrop
      :centered="true"
    >
      <div class="row">
        <div class="col-12">
          <form @submit.prevent="SubmitUnit" method="POST">
            <div class="form-row">
              <div class="col">
                <div class="form-group">
                  <label
                    >Organization
                    <span class="text-danger">*</span>
                  </label>
                  <v-select
                    :loading="loading_ddl.organization"
                    v-model="form.organization"
                    :options="options.organization"
                    label="name"
                    placeholder="--Select--"
                    :reduce="(key) => key.id"
                    :required="true"
                  >
                    <template #spinner="{ loading }">
                      <div
                        v-if="loading"
                        style="border-left-color: rgba(88, 151, 251, 0.71)"
                        class="vs__spinner"
                      ></div>
                    </template>
                    <template #search="{ attributes, events }">
                      <input
                        class="vs__search"
                        :required="!form.organization"
                        v-bind="attributes"
                        v-on="events"
                      />
                    </template>
                  </v-select>
                  <label
                    class="text-danger mt-1 mb-0 small"
                    v-if="form_error['Organization']"
                    >{{ form_error["Organization"] }}</label
                  >
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label
                    >Name
                    <span class="text-danger">*</span>
                  </label>
                  <v-select
                    :loading="loading_ddl.name"
                    v-model="form.name"
                    :options="options.name"
                    label="name"
                    placeholder="--Select--"
                    :reduce="(key) => key.id"
                    :required="true"
                  >
                    <template #spinner="{ loading }">
                      <div
                        v-if="loading"
                        style="border-left-color: rgba(88, 151, 251, 0.71)"
                        class="vs__spinner"
                      ></div>
                    </template>
                    <template #search="{ attributes, events }">
                      <input
                        class="vs__search"
                        :required="!form.name"
                        v-bind="attributes"
                        v-on="events"
                      />
                    </template>
                  </v-select>
                  <label
                    class="text-danger mt-1 mb-0 small"
                    v-if="form_error['Name']"
                    >{{ form_error["Name"] }}</label
                  >
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col">
                <div class="form-group">
                  <label>Description </label>
                  <textarea
                    class="form-control"
                    v-model="form.description"
                    rows="5"
                    style="height: 100px"
                  ></textarea>
                  <label
                    class="text-danger mt-1 mb-0 small"
                    v-if="form_error['Description']"
                    >{{ form_error["Description"] }}</label
                  >
                </div>
              </div>
            </div>
            <div class="text-right">
              <button
                type="button"
                class="btn btn-secondary"
                @click="show_modal = false"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                {{ id ? "Edit" : "Add" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import HelperMessage from "@/helpers/messages";
import FV from "@/helpers/form_validation";
export default {
  data() {
    return {
      id: null,
      title: "Add New Business Unit",
      form: {
        organization: "",
        name: "",
        description: "",
      },
      old_form: {
        organization: "",
        name: "",
        description: "",
      },
      loading_ddl: {
        organization: false,
        name: false
      },
      options: {
        organization: [],
        name: []
      },
      show_modal: false,
      form_error: {},
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
    }),
  },
  methods: {
    ...mapActions("library", ["Insert", "Update"]),
    ShowModal(state, id = null) {
      this.id = id;

      if (state) {
        if (id) {
          this.title = "Edit Business Unit";
          this.GetData(id).then(() => {
            this.GetDDLOrganization();
            this.GetDDLName();
            this.show_modal = true;
          });
        } else {
          this.title = "Add New Business Unit";
          this.form = {
            organization: "",
            name: "",
            description: "",
          };
          this.options = {
            organization: [],
            name: [],
          };
          this.form_error = {};

          this.GetDDLOrganization();
          this.GetDDLName();
          this.show_modal = true;
        }
      } else {
        this.show_modal = false;
      }
    },
    async GetData(id) {
      try {
        this.$emit("ShowLoader", true);
        let get_data = await this.$store.dispatch("library/GetData", {
          url: `/tenants/${this.user.tenant_id}/business-units/${id}`,
        });

        if (get_data.data.length > 0) {
          this.form = {
            organization: get_data.data[0].organization_id,
            name: get_data.data[0].business_unit_template_id,
            description: get_data.data[0].description,
          };
          this.old_form = {
            organization: get_data.data[0].organization_id,
            name: get_data.data[0].business_unit_template_id,
            description: get_data.data[0].description,
          };
        }

        this.$emit("ShowLoader", false);
      } catch (ex) {
        this.$emit("ShowLoader", false);
        this.$emit("Error", err.message, false, this.RedirectHome);
      }
    },
    async GetDDLOrganization() {
      try {
        let params = {};
        this.loading_ddl.organization = true;
        let get_data = await this.$store.dispatch("library/GetAll", {
          url: `/tenants/${this.user.tenant_id}/organizations`,
          params,
        });
        this.options.organization =
          get_data.data.length > 0 ? get_data.data : [];
        this.loading_ddl.organization = false;
      } catch (ex) {
        this.options.organization = [];
        this.loading_ddl.organization = false;
      }
    },
    async GetDDLName() {
      try{
        let params = {}
        this.loading_ddl.name = true
        let get_data = await this.$store.dispatch(
          'library/GetAll',
          { url: `/tenants/${this.user.tenant_id}/business-unit-templates`, params }
        )
        this.options.name = get_data.data.length > 0 ? get_data.data : []
        this.loading_ddl.name = false
      }catch(ex){
        this.form.name = ""
        this.options.name = []
        this.loading_ddl.name = false
      }
    },
    Validation() {
      let schema = {
        Organization: {
          data: this.form.organization,
          required: true,
          valid: this.options.organization,
          valid_key: "id",
        },
        Name: {
          data: this.form.name,
          required: true,
          valid: this.options.name,
          valid_key: "id",
        },
        Description: {
          data: this.form.description,
          minlength: 3,
          maxlength: 500,
        },
      };

      return FV.validation(schema, "multiple");
    },
    IsDataNotEdit() {
      return JSON.stringify(this.form) === JSON.stringify(this.old_form);
    },
    SubmitUnit() {
      let do_validation = this.Validation();
      let is_data_not_edited = this.IsDataNotEdit();
      if (Object.keys(do_validation).length > 0) {
        this.form_error = do_validation;
      } else if (this.id && is_data_not_edited) {
        this.$emit(
          "Confirm",
          HelperMessage.getMessage("message.modal.dialog.no_change", {
            page: "Business Unit",
          }),
          () => {
            this.show_modal = false;
            this.$emit("SetFilter", "unit_view", {});
          }
        );
      } else {
        let message = this.id ? "update this Unit" : "submit this Unit";
        this.$emit(
          "Confirm",
          HelperMessage.getMessage("message.modal.dialog.confirm", {
            name: message,
          }),
          this.PostData
        );
      }
    },
    PostData() {
      this.$emit("ShowLoader", true);

      let get_name = this.options.name.filter(item => item.id === this.form.name)

      let data = {
        organization_id: this.form.organization,
        business_unit_template_id: this.form.name,
        name: get_name[0].name,
        description: this.form.description,
      };

      if (this.id) {
        this.Update({
          url: `/tenants/${this.user.tenant_id}/business-units/${this.id}`,
          request_body: data,
        })
          .then(() => {
            this.$emit("ShowLoader", false);
            this.$emit(
              "Success",
              HelperMessage.getMessage("message.modal.success.action", {
                name: "Data",
                action: "updated",
              }),
              () => {
                this.show_modal = false;
                this.$emit("SetFilter", "unit_view", {});
              }
            );
          })
          .catch((err) => {
            this.$emit("ShowLoader", false);
            let error_code = err.error_code;
            let message = err.message;

            if (error_code && message) {
              if (error_code === 16) {
                this.$emit("Error", message, true);
              } else {
                this.$emit("Error", message, false, this.RedirectHome);
              }
            } else {
              this.$emit("Error", message, false, this.RedirectHome);
            }
          });
      } else {
        this.Insert({
          url: `/tenants/${this.user.tenant_id}/business-units`,
          request_body: data,
        })
          .then(() => {
            this.$emit("ShowLoader", false);
            this.$emit(
              "Success",
              HelperMessage.getMessage("message.modal.success.action", {
                name: "Data",
                action: "added",
              }),
              () => {
                this.show_modal = false;
                this.$emit("SetFilter", "unit_view", {});
              }
            );
          })
          .catch((err) => {
            this.$emit("ShowLoader", false);
            let error_code = err.error_code;
            let message = err.message;

            if (error_code && message) {
              if (error_code === 16) {
                this.$emit("Error", message, true);
              } else {
                this.$emit("Error", message, false, this.RedirectHome);
              }
            } else {
              this.$emit("Error", message, false, this.RedirectHome);
            }
          });
      }
    },
    RedirectHome() {
      this.$router.push("/");
    },
  },
};
</script>
