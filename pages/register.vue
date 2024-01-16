<template>
  <div class="d-flex flex-column justify-content-center align-items-between">
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
      <div class="main-content" style="margin: 0 auto; min-height: 231px">
        <div v-if="register_success == 1" class="container">
          <div class="row mt-5">
            <div class="col-12">
              <div class="text-center mb-5">
                <h1 class="text-dark mb-5" style="font-size: 48px">
                  Sign Up for your Riskobs Account
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
                  <form
                    method="POST"
                    action="?"
                    @submit.prevent="HandleRegister"
                  >
                    <div class="form-group">
                      <label
                        for="email"
                        class="control-label"
                        style="font-size: 10pt"
                        >Company Name</label
                      >
                      <input
                        v-model="form.company_name"
                        id="company-name"
                        type="text"
                        class="form-control"
                        name="company_name"
                        tabindex="1"
                        required=""
                        autofocus=""
                        placeholder="Your company name"
                        style="font-size: 10pt; height: 50px"
                      />
                    </div>
                    <div class="form-group">
                      <label
                        for="email"
                        class="control-label"
                        style="font-size: 10pt"
                        >Name</label
                      >
                      <input
                        v-model="form.name"
                        id="name"
                        type="text"
                        class="form-control"
                        name="name"
                        tabindex="1"
                        required=""
                        autofocus=""
                        placeholder="Your name"
                        style="font-size: 10pt; height: 50px"
                      />
                    </div>
                    <div class="form-group">
                      <label
                        for="email"
                        class="control-label"
                        style="font-size: 10pt"
                        >Email</label
                      >
                      <input
                        v-model="form.email"
                        id="email"
                        type="email"
                        class="form-control"
                        name="email"
                        tabindex="1"
                        required=""
                        autofocus=""
                        placeholder="Your email"
                        style="font-size: 10pt; height: 50px"
                      />
                    </div>
                    <div class="form-group">
                      <label
                        for="phone"
                        class="control-label"
                        style="font-size: 10pt"
                        >Phone Number</label
                      >
                      <input
                        v-model="form.phone"
                        id="phone"
                        type="text"
                        class="form-control"
                        name="phone"
                        tabindex="1"
                        required=""
                        autofocus=""
                        @input="FilterNonNumericCharacters"
                        placeholder="Your phone number"
                        style="font-size: 10pt; height: 50px"
                      />
                    </div>
                    <div class="form-group mb-2">
                      <div class="d-block">
                        <label
                          for="password"
                          class="control-label"
                          style="font-size: 10pt"
                          >Password</label
                        >
                      </div>
                      <div class="input-group">
                        <input
                          v-model="form.password"
                          id="password"
                          :type="show_password ? 'text' : 'password'"
                          class="form-control"
                          name="password"
                          tabindex="2"
                          required=""
                          placeholder="Your password"
                          style="font-size: 10pt; height: 50px"
                        />
                        <b-tooltip
                          target="password"
                          placement="right"
                          triggers="hover"
                        >
                        <div style="text-align: left;">
                          <span style="font-size: 10.5px;">* At least one uppercase letter (A-Z)</span><br>
                          <span style="font-size: 10.5px;">* At least one lowercase letter (a-z)</span><br>
                          <span style="font-size: 10.5px;">* At least one number (0-9)</span><br>
                          <span style="font-size: 10.5px;">* At least one special character (e.g., @, #, $)</span>
                        </div>
                        </b-tooltip>
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
                            :style="show_password ? 'display: none;' : ''"
                            @click="Masking"
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
                            :style="show_password ? '' : 'display: none;'"
                            @click="Masking"
                          >
                            <i class="fas fa-eye-slash"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-group mt-4">
                      <div class="invalid-feedback" style="display: block">
                        <span class="error-block text-danger">
                          {{ this.form.error }}
                        </span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg btn-block"
                      style="font-size: 12pt; height: 50px"
                      :class="loading ? 'disabled btn-progress' : ''"
                      tabindex="4"
                    >
                      Register
                    </button>
                    <div class="form-group mt-5">
                      Already have Account?
                      <a
                        class="font-weight-bold text-decoration-none"
                        style="font-size: 10pt"
                        href="/login"
                        >Log in from here</a
                      >
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="register_success == 2" class="container">
          <div class="row mt-5">
            <div class="col-12">
              <div class="text-center mb-5">
                <h1 class="text-dark mb-5" style="font-size: 48px">
                  Registration Success
                </h1>
                <h1><i class="fa fa-envelope-open"></i></h1>
                <br />
                <p>
                  You're one step closer to exploring Our App. Check your email
                  for verification.
                </p>
                <nuxt-link to="login">Go to Login Page</nuxt-link>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="register_success == 3" class="container">
          <div class="row mt-5">
            <div class="col-12">
              <div class="text-center mb-5">
                <h1 class="text-dark mb-5" style="font-size: 48px">
                  You have been registered before.
                </h1>
                <h1><i class="fa fa-envelope-open"></i></h1>
                <br />
                <p>
                  You're email address is already in use. Check your email
                  for verification.
                </p>
                <button
                  type="button"
                  class="btn btn-primary mb-3"
                  style="font-size: 12pt; height: 50px"
                  :class="loading_verify ? 'disabled btn-progress' : ''"
                  @click="VerifyRequest()"
                >
                  <i class="fa fa-sync-alt"></i> Resend Verification Link
                </button>
                <br />
                <nuxt-link to="login">Go to Login Page</nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 d-flex justify-content-center">
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
    <modal-error
      :warning="modals.error.warning"
      :message="modals.error.message"
    />
    <modal-confirm
      :message="modals.confirm.message"
      @ok="modals.confirm.callback"
    />
    <modal-success
      :message="modals.success.message"
      @hidden="modals.success.callback"
    />
  </div>
</template>
<script>
import ModalError from "@/components/modals/error";
import ModalConfirm from "@/components/modals/confirm";
import ModalSuccess from "@/components/modals/success";
import HelperMessage from "@/helpers/messages";
import HelperText from "@/helpers/texts";
import FV from "@/helpers/form_validation";

export default {
  layout: "blank",
  middleware: ["refreshToken", "notAuthenticated"],
  components: {
    "modal-error": ModalError,
    "modal-confirm": ModalConfirm,
    "modal-success": ModalSuccess,
  },
  head() {
    return {
      title: "Register",
    };
  },
  data() {
    return {
      register_success: 1,
      show_password: false,
      loading_verify: false,
      loading: false,
      form: {
        company_name: "",
        email: "",
        phone: "",
        password: "",
        error: null,
      },
      modals: {
        error: {
          warning: false,
          message: "",
        },
        confirm: {
          message: "",
          callback: () => {},
        },
        success: {
          message: "",
          callback: () => {},
        },
      },
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
  methods: {
    Masking() {
      if (this.show_password) {
        this.show_password = !this.show_password;
      } else {
        this.show_password = !this.show_password;
      }
    },
    Validation() {
      let schema = {
        "Company Name": {
          data: this.form.company_name,
          required: true,
          minlength: 3,
          maxlength: 200,
        },
        Name: {
          data: this.form.name,
          required: true,
          minlength: 3,
          maxlength: 150,
        },
        Email: {
          data: this.form.email,
          required: true,
          type: "email",
        },
        "Phone Number": {
          data: this.form.phone,
          required: true,
          minlength: 10,
          maxlength: 14,
        },
        Password: {
          data: this.form.password,
          required: true,
          type: "password",
          minlength: 10,
        },
      };

      return FV.validation(schema, "single");
    },
    HandleRegister() {
      let do_validation = this.Validation();
      if (do_validation) {
        this.form.error = do_validation;
        this.ShowModalError(do_validation, true);
      } else {
        this.ShowModalConfirm(
          HelperMessage.getMessage("message.modal.dialog.confirm", {
            name: "Register",
          }),
          this.PostRegister
        );
      }
    },
    async PostRegister() {
      try {
        this.loading = true;
        await this.$store.dispatch("authentication/Register", {
          company_name: this.form.company_name,
          name: this.form.name,
          email: this.form.email,
          phone: HelperText.PhoneNumberRecoverred(this.form.phone),
          password: this.form.password,
        });
        this.register_success = 2;
        this.loading = false;
        this.ResetForm();
      } catch (err) {
        this.loading = false;
        if (err == "registered_not_verify") {
          this.register_success = 3;
        }
        else {
          this.ShowModalError(err);
        }
      }
    },
    async VerifyRequest() {
      this.loading_verify = true;
      try {
        await this.$store.dispatch("authentication/VerifyRequest", {
          username: this.form.email,
        });
        this.ShowModalSuccess(
          HelperMessage.getMessage("message.modal.success.action", {
            name: "Verification Link",
            action: "sent",
          })
        );
      } catch (err) {
        this.ShowModalError(err);
      }
      this.loading_verify = false;
    },
    ShowModalError(message, warning = false) {
      this.modals.error.warning = warning;
      this.modals.error.message = message;
      this.$bvModal.show("modal-error");
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
    ResetForm() {
      this.form = {
        company_name: "",
        email: "",
        phone: "",
        password: "",
        error: null,
      };
    },
    FilterNonNumericCharacters() {
      this.form.phone = this.form.phone.replace(/\D/g, "");
    },
  },
};
</script>
<style scoped>
.text-grey {
  color: #6c757d;
}
</style>
