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
          <form @submit.prevent="SubmitSubunitTemplate" method="POST">
            <div class="form-row">
              <div class="col">
                <div class="form-group">
                  <label
                    >Unit Template
                    <span class="text-danger">*</span>
                  </label>
                  <v-select
                    :loading="loading_ddl.unit_template"
                    v-model="form.unit_template"
                    :options="options.unit_template"
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
                        :required="!form.unit_template"
                        v-bind="attributes"
                        v-on="events"
                      />
                    </template>
                  </v-select>
                  <label
                    class="text-danger mt-1 mb-0 small"
                    v-if="form_error['Unit Template']"
                    >{{ form_error["Unit Template"] }}</label
                  >
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label
                    >Name
                    <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="form.name"
                    required
                  />
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
      title: "Add New Business Subunit Template",
      form: {
        unit_template: "",
        name: "",
        description: "",
      },
      old_form: {
        unit_template: "",
        name: "",
        description: "",
      },
      loading_ddl: {
        unit_template: false
      },
      options: {
        unit_template: []
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
          this.title = "Edit Business Subunit Template";
          this.GetData(id).then(() => {
            this.GetDDLUnitTemplate();
            this.show_modal = true;
          });
        } else {
          this.title = "Add New Business Subunit Template";
          this.form = {
            unit_template: "",
            name: "",
            description: "",
          };
          this.options = {
            unit_template: []
          };
          this.form_error = {};

          this.GetDDLUnitTemplate();
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
          url: `/tenants/${this.user.tenant_id}/subunit-templates/${id}`,
        });

        if (get_data.data.length > 0) {
          this.form = {
            unit_template: get_data.data[0].business_unit_template_id,
            name: get_data.data[0].name,
            description: get_data.data[0].description,
          };
          this.old_form = {
            unit_template: get_data.data[0].business_unit_template_id,
            name: get_data.data[0].name,
            description: get_data.data[0].description,
          };
        }

        this.$emit("ShowLoader", false);
      } catch (ex) {
        this.$emit("ShowLoader", false);
        this.$emit("Error", err.message, false, this.RedirectHome);
      }
    },
    async GetDDLUnitTemplate() {
      try {
        let params = {};
        this.loading_ddl.unit_template = true;
        let get_data = await this.$store.dispatch("library/GetAll", {
          url: `/tenants/${this.user.tenant_id}/business-unit-templates`,
          params,
        });
        this.options.unit_template =
          get_data.data.length > 0 ? get_data.data : [];
        this.loading_ddl.unit_template = false;
      } catch (ex) {
        this.options.unit_template = [];
        this.loading_ddl.unit_template = false;
      }
    },
    Validation() {
      let schema = {
        "Unit Template": {
          data: this.form.unit_template,
          required: true,
          valid: this.options.unit_template,
          valid_key: "id",
        },
        Name: {
          data: this.form.name,
          minlength: 3,
          maxlength: 200,
          required: true,
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
    SubmitSubunitTemplate() {
      let do_validation = this.Validation();
      let is_data_not_edited = this.IsDataNotEdit();
      if (Object.keys(do_validation).length > 0) {
        this.form_error = do_validation;
      } else if (this.id && is_data_not_edited) {
        this.$emit(
          "Confirm",
          HelperMessage.getMessage("message.modal.dialog.no_change", {
            page: "Business Subunit Template",
          }),
          () => {
            this.show_modal = false;
            this.$emit("SetFilter", "subunit_template_view", {});
          }
        );
      } else {
        let message = this.id ? "update this Subunit Template" : "submit this Subunit Template";
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

      let data = {
        business_unit_template_id: this.form.unit_template,
        name: this.form.name,
        description: this.form.description,
      };

      if (this.id) {
        this.Update({
          url: `/tenants/${this.user.tenant_id}/subunit-templates/${this.id}`,
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
                this.$emit("SetFilter", "subunit_template_view", {});
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
          url: `/tenants/${this.user.tenant_id}/subunit-templates`,
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
                this.$emit("SetFilter", "subunit_template_view", {});
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
