<template>
  <div class="container px-40">
    <section class="section">
      <div class="section-body">
        <h2 class="mt-5 text-dark text-center">Company Settings</h2>
        <div class="row mt-5">
          <div class="col-12 col-sm-8 col-md-6" style="margin: 0 auto">
            <div v-if="$route.query.alert" class="alert alert-warning alert-dismissible show fade">
              <div class="alert-body">
                <button class="close" data-dismiss="alert">
                  <span>×</span>
                </button>
                Please complete the company information first!
              </div>
            </div>
            <div class="card py-4 px-2 border">
              <div class="card-body">
                <form method="POST" action="?" @submit.prevent="HandleUpdate">
                  <div class="form-group">
                    <form-avatar
                      :src="this.form.logo_file_url"
                      @set="FormAvatarSet"
                    />
                  </div>
                  <div class="form-group">
                    <label for="name" class="control-label">Company Name</label>
                    <input
                      v-model="form.name"
                      id="name"
                      type="text"
                      class="form-control"
                      name="name"
                      tabindex="1"
                      required=""
                      autofocus=""
                    />
                  </div>
                  <div class="form-group mt-4">
                    <div class="invalid-feedback" style="display: block">
                      <span class="error-block text-danger">
                        {{ this.form.error }}
                      </span>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <nuxt-link
                      class="font-weight-bold text-decoration-none"
                      to="company-settings"
                      ><i class="fa fa-trash-alt mr-1"></i> Delete
                      Company</nuxt-link
                    >
                    <button type="submit" class="btn btn-primary" tabindex="4">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <modal-loader :show="loader" />
    <modal-confirm
      :message="modals.confirm.message"
      @ok="modals.confirm.callback"
    />
    <modal-confirm-leave
      :message="modals.confirm_leave.message"
      @ok="OkLeave()"
    />
    <modal-success
      :message="modals.success.message"
      @hidden="modals.success.callback"
    />
    <modal-error
      :warning="modals.error.warning"
      :message="modals.error.message"
      @ok="modals.error.callback"
    />
  </div>
</template>
<script>
import { VueSelect } from "vue-select";
import { mapActions, mapState } from "vuex";
import ModalLoader from "@/components/modals/loader";
import ModalConfirm from "@/components/modals/confirm";
import ModalConfirmLeave from "@/components/modals/confirm-leave";
import ModalError from "@/components/modals/error";
import ModalSuccess from "@/components/modals/success";
import FormAvatar from "@/components/forms/avatar";
import HelperMessage from "@/helpers/messages";
import HelperText from "@/helpers/texts";
import FV from "@/helpers/form_validation";
export default {
  components: {
    "v-select": VueSelect,
    "modal-confirm": ModalConfirm,
    "modal-confirm-leave": ModalConfirmLeave,
    "modal-loader": ModalLoader,
    "modal-error": ModalError,
    "modal-success": ModalSuccess,
    "form-avatar": FormAvatar,
  },
  head() {
    return {
      title: "Company Settings",
    };
  },
  data() {
    return {
      form: {
        name: "",
        logo_file_url: "",
        logo_file: null,
      },
      form_fd: null,
      modals: {
        confirm: {
          message: "",
          callback: () => {},
        },
        confirm_leave: {
          message: HelperMessage.getMessage("message.modal.dialog.leave"),
        },
        success: {
          message: "",
          callback: () => {},
        },
        error: {
          warning: "",
          message: "",
          callback: () => {},
        },
      },
      loader: false,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
      tenant: (state) => state.tenant,
    }),
  },
  mounted() {
    if (this.user.groups && this.user.groups.includes("AccountOwner")) {
      this.SetTenantInfo();
    }
    else {
      this.OkLeave()
    }
  },
  methods: {
    ...mapActions("library", ["UpdateFormData"]),
    async SetTenantInfo() {
      if (this.tenant) {
        this.form = {
          name: this.tenant.name,
          logo_file_url: this.tenant.logo_file_url,
        };
      } else {
        try {
          let params = {};
          let get_data = await this.$store.dispatch("library/GetAll", {
            url: `/tenants/${this.user.tenant_id}`,
            params,
          });
          this.form = {
            name: get_data.data.name,
            logo_file_url: get_data.data.logo_file_url,
          };
          this.$store.commit("setTenant", get_data.data);
        } catch (ex) {}
      }
    },
    FormAvatarSet(fd) {
      this.form_fd = fd;
    },
    Validation() {
      let schema = {
        Name: {
          data: this.form.name,
          required: true,
          minlength: 3,
          maxlength: 200,
        },
      };

      return FV.validation(schema, "single");
    },
    async HandleUpdate() {
      let do_validation = this.Validation();
      if (do_validation) {
        this.form.error = do_validation;
        this.ShowModalError(do_validation, true);
      } else {
        await this.UpdateSubmit();
      }
    },
    async UpdateSubmit() {
      this.loader = true;
      if (!this.form_fd) {
        this.form_fd = new FormData();
      }
      this.form_fd.delete("name");
      this.form_fd.append("name", this.form.name);
      await this.UpdateFormData({
        url: `/tenants/${this.user.tenant_id}`,
        request_body: this.form_fd,
      })
        .then(async () => {
          setTimeout(() => {
            this.TenantUpdated();
          }, 500);
          this.ShowModalSuccess(
            HelperMessage.getMessage("message.modal.success.action", {
              name: "Company",
              action: "updated",
            }),
            this.OkLeave
          );
          const updateAttr = [
            { Name: "custom:tenant_name", Value: this.form.name }
          ];
          await this.$cognito.UpdateAttribute({username: this.user.user_id, userAttributes: updateAttr});
          this.$store.dispatch('refreshToken')
        })
        .catch((err) => {
          let error_code = err.error_code;
          let message = err.message;

          if (error_code && message) {
            if (error_code === 16) {
              this.ShowModalError(message, true);
            } else {
              this.ShowModalError(message, false);
            }
          } else {
            this.ShowModalError(message, false);
          }
        });
      this.loader = false;
    },
    async TenantUpdated() {
      try {
        let params = {};
        let get_data = await this.$store.dispatch("library/GetAll", {
          url: `/tenants/${this.user.tenant_id}`,
          params,
        });
        this.$store.commit("setTenant", get_data.data);
      } catch (ex) {}
    },
    ShowModalConfirm(message, callback = () => {}) {
      this.modals.confirm.message = message;
      this.modals.confirm.callback = callback;
      this.$bvModal.show("modal-confirm");
    },
    ShowModalSuccess(message, callback = () => {}) {
      this.modals.success.message = message;
      this.modals.success.callback = callback;
      this.$bvModal.show("modal-success");
    },
    ShowModalError(message, warning = false, callback = () => {}) {
      this.modals.error.warning = warning;
      this.modals.error.message = message;
      this.modals.error.callback = callback;
      this.$bvModal.show("modal-error");
    },
    ConfirmLeave() {
      this.$bvModal.show("modal-confirm-leave");
    },
    OkLeave() {
      this.$router.push({ name: "index" });
    },
    FilterNonNumericCharacters() {
      this.form.phone = this.form.phone.replace(/\D/g, "");
    },
  },
};
</script>
