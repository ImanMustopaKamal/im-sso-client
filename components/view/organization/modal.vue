<template>
  <div>
    <b-modal
      v-model="show_modal"
      :title="title"
      :hide-footer="true"
      size="md"
      no-close-on-backdrop
      :centered="true"
    >
      <div class="row">
        <div class="col-12">
          <form @submit.prevent="SubmitOrganization" method="POST">
            <div class="form-row">
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
      title: "Add New Organization",
      form: {
        name: "",
        description: "",
      },
      old_form: {
        name: "",
        description: "",
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
          this.title = "Edit Organization";
          this.GetData(id).then(() => {
            this.show_modal = true;
          });
        } else {
          this.title = "Add New Organization";
          this.form = {
            name: "",
            description: "",
          };
          this.form_error = {};

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
          url: `/tenants/${this.user.tenant_id}/organizations/${id}`,
        });

        if (get_data.data.length > 0) {
          this.form = {
            name: get_data.data[0].name,
            description: get_data.data[0].description,
          };
          this.old_form = {
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
    Validation() {
      let schema = {
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
    SubmitOrganization() {
      let do_validation = this.Validation();
      let is_data_not_edited = this.IsDataNotEdit();
      if (Object.keys(do_validation).length > 0) {
        this.form_error = do_validation;
      } else if (this.id && is_data_not_edited) {
        this.$emit(
          "Confirm",
          HelperMessage.getMessage("message.modal.dialog.no_change", {
            page: "Organization",
          }),
          () => {
            this.show_modal = false;
            this.$emit("SetFilter", "organization_view", {});
          }
        );
      } else {
        let message = this.id
          ? "update this Organization"
          : "submit this Organization";
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
        name: this.form.name,
        description: this.form.description,
      };

      if(this.id){
        this.Update({ url: `/tenants/${this.user.tenant_id}/organizations/${this.id}`, request_body: data })
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
              this.$emit("SetFilter", "organization_view", {});
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
      }else{
        this.Insert({ url: `/tenants/${this.user.tenant_id}/organizations`, request_body: data })
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
              this.$emit("SetFilter", "organization_view", {});
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
