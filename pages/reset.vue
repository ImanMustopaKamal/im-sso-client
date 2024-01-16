<template>
  <div class="main-wrapper container">
    <nav class="navbar navbar-expand-lg main-navbar w-100 border-0 pl-5 pr-5">
      <div class="container">
        <nuxt-link to="/" class="navbar-brand sidebar-gone-hide">
          <img src="~/assets/img/logo.png" alt="logo" width="140" />
        </nuxt-link>
        <ul class="navbar-nav navbar-right">
          <li class="nav-item">
            <a class="nav-link text-dark" href="#" style="font-size: 14pt"
              >Contact Us</a
            >
          </li>
        </ul>
      </div>
    </nav>
    <div class="main-content" style="margin: 0 auto">
      <div class="container">
        <div class="row mt-5">
          <div class="col-12">
            <div class="text-center mb-5">
              <h1 class="text-dark mb-5" style="font-size: 48px">
                Reset Password
              </h1>
            </div>
          </div>
        </div>
        <div class="row">
          <div
            class="col-12 col-sm-8 col-md-6 col-lg-6 col-xl-5"
            style="margin: 0 auto"
          >
            <div class="card p-2 border">
              <div class="card-body">
                <p class="mb-4" style="font-size: 12pt">
                  Enter a new password for your account
                </p>
                <form method="POST" action="?" @submit.prevent="ResetPassword">
                  <div class="form-group">
                    <div class="d-block">
                      <label
                        for="password"
                        class="control-label"
                        style="font-size: 10pt"
                        >New Password</label
                      >
                    </div>
                    <div class="input-group">
                      <input
                        v-model="form.new_password"
                        id="new_password"
                        :type="show_new_password ? 'text' : 'password'"
                        class="form-control"
                        name="new_password"
                        tabindex="1"
                        required=""
                        autofocus=""
                        placeholder="New password"
                        style="font-size: 10pt; height: 50px"
                      />
                      <div class="input-group-append">
                        <div
                          class="input-group-text"
                          style="
                            padding: 10px 8.1px;
                            cursor: pointer;
                            border-bottom-right-radius: 0.25rem;
                            border-top-right-radius: 0.25rem;
                            height: 50px;
                          "
                          :style="show_new_password ? 'display: none;' : ''"
                          @click="masking('new_password')"
                        >
                          <i class="fas fa-eye"></i>
                        </div>
                        <div
                          class="input-group-text"
                          style="
                            padding: 10px 8px;
                            cursor: pointer;
                            height: 50px;
                          "
                          :style="show_new_password ? '' : 'display: none;'"
                          @click="masking('new_password')"
                        >
                          <i class="fas fa-eye-slash"></i>
                        </div>
                      </div>
                    </div>
                    <div class="invalid-feedback" style="display: block">
                      <span class="error-block text-danger">
                        {{ form.error["New Password"] }}
                      </span>
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="d-block">
                      <label
                        for="confirm_password"
                        class="control-label"
                        style="font-size: 10pt"
                        >Confirm Password</label
                      >
                    </div>
                    <div class="input-group">
                      <input
                        v-model="form.confirm_password"
                        id="confirm_password"
                        :type="show_confirm_password ? 'text' : 'password'"
                        class="form-control"
                        name="confirm_password"
                        tabindex="1"
                        required=""
                        autofocus=""
                        placeholder="Confirm password"
                        style="font-size: 10pt; height: 50px"
                      />
                      <div class="input-group-append">
                        <div
                          class="input-group-text"
                          style="
                            padding: 10px 8.1px;
                            cursor: pointer;
                            border-bottom-right-radius: 0.25rem;
                            border-top-right-radius: 0.25rem;
                            height: 50px;
                          "
                          :style="show_confirm_password ? 'display: none;' : ''"
                          @click="masking('confirm_password')"
                        >
                          <i class="fas fa-eye"></i>
                        </div>
                        <div
                          class="input-group-text"
                          style="
                            padding: 10px 8px;
                            cursor: pointer;
                            height: 50px;
                          "
                          :style="show_confirm_password ? '' : 'display: none;'"
                          @click="masking('confirm_password')"
                        >
                          <i class="fas fa-eye-slash"></i>
                        </div>
                      </div>
                    </div>
                    <div class="invalid-feedback" style="display: block">
                      <span class="error-block text-danger">
                        {{ form.error["Confirm Password"] }}
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-primary btn-block"
                    style="font-size: 12pt; height: 50px"
                    :class="loading ? 'disabled btn-progress' : ''"
                    tabindex="4"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
            <div class="text-center mb-5">
              <a
                class="font-weight-bold text-decoration-none"
                style="font-size: 10pt"
                href="/login"
                >Return to Sign In</a
              >
            </div>
          </div>
        </div>
        <div style="position: fixed; bottom: 0px; left: 0px; right: 0px">
          <div class="d-flex justify-content-center">
            <div class="m-3">
              <a class="text-grey" href="#">Terms of Service</a>
            </div>
            <div class="m-3">
              <a class="text-grey" href="#">Privacy Policy</a>
            </div>
            <div class="m-3">
              <label class="text-grey">©{{ year }} {{ company }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-loader :show="loader" />
    <modal-error
      :warning="modals.error.warning"
      :message="modals.error.message"
      @ok="modals.error.callback"
    />
    <modal-success
      :message="modals.success.message"
      @hidden="modals.success.callback"
    />
  </div>
</template>

<script>
import FV from "@/helpers/form_validation";
import ModalLoader from "@/components/modals/loader";
import ModalError from "@/components/modals/error";
import ModalSuccess from "@/components/modals/success";

export default {
  layout: "blank",
  components: {
    "modal-loader": ModalLoader,
    "modal-success": ModalSuccess,
    "modal-error": ModalError,
  },
  data() {
    return {
      title: "Reset Password",
      show_new_password: false,
      show_confirm_password: false,
      loading: false,
      form: {
        new_password: "",
        confirm_password: "",
        error: {},
      },
      modals: {
        success: {
          message: "",
          callback: () => {},
        },
        error: {
          warning: false,
          message: "",
          callback: () => {},
        },
      },
      loader: false
    };
  },
  head() {
    return {
      title: this.title,
    };
  },
  computed: {
    company() {
      return process.env.COPYRIGHT_COMPANY;
    },
    year() {
      return new Date().getFullYear();
    },
  },
  mounted() {
    if (!this.$route.query.username || !this.$route.query.confirmation_code) {
      this.$router.push({ name: "login" });
    }
  },
  methods: {
    masking: function (param) {
      if (param == "new_password") {
        if (this.show_new_password) {
          this.show_new_password = !this.show_new_password;
        } else {
          this.show_new_password = !this.show_new_password;
        }
      } else if (param == "confirm_password") {
        if (this.show_confirm_password) {
          this.show_confirm_password = !this.show_confirm_password;
        } else {
          this.show_confirm_password = !this.show_confirm_password;
        }
      }
    },
    Validation() {
      let schema = {
        "New Password": {
          data: this.form.new_password,
          required: true,
          minlength: 8,
          maxlength: 20,
        },
        "Confirm Password": {
          data: this.form.confirm_password,
          required: true,
          minlength: 8,
          maxlength: 20,
          valid: this.form.new_password,
          custom_valid_message: "Confirm password did not match",
        },
      };

      return FV.validation(schema, "multiple");
    },
    async ResetPassword() {
      try {
        let do_validation = this.Validation();
        if (Object.keys(do_validation).length > 0) {
          this.form.error = do_validation;
        } else {
          this.loading = true
          let do_reset = await this.$store.dispatch("authentication/Reset", {
            username: this.$route.query.username,
            confirmation_code: this.$route.query.confirmation_code,
            password: this.form.new_password,
          });
          this.loading = false;

          if (do_reset) {
            this.form.error = {};
            this.ShowModalSuccess(
              "Your password has been updated successfully",
              () => {
                this.$router.push({ name: "login" });
              }
            );
          }
        }
      }catch (ex) {
        this.ShowModalError(ex);
        this.loading = false
      }
    },
    ShowModalError(message, warning = false, callback = () => {}) {
      this.modals.error.warning = warning;
      this.modals.error.message = message;
      this.modals.error.callback = callback;
      this.$bvModal.show("modal-error");
    },
    ShowModalSuccess(message, callback = () => {}) {
      this.modals.success.message = message;
      this.modals.success.callback = callback;
      this.$bvModal.show("modal-success");
    },
  },
};
</script>
<style scoped>
.text-grey {
  color: #6c757d;
}
.btn-forgot {
  font-size: 12pt;
  height: 52px;
  background: #74758b;
  color: white;
  font-weight: bold;
  border: 0px;
  border-radius: 3px;
}
.btn-forgot:hover {
  background: #6777ef;
}
</style>
