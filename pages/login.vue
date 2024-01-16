<template>
  <div class="d-flex flex-column justify-content-center align-items-between">
    <div class="main-wrapper container">
      <nav
        class="navbar navbar-expand-lg main-navbar w-100 border-0 pl-5 pr-5"
      >
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
        <div class="container">
          <div class="row mt-5">
            <div class="col-12">
              <div class="text-center mb-5">
                <h1 class="text-dark mb-5" style="font-size: 48px">
                  Sign In to your Riskobs Account
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
                  <form method="POST" action="?" @submit.prevent="HandleLogin">
                    <div class="form-group d-flex justify-content-center align-items-center">
                      <div class="font-weight-bold">Log in or
                      <a
                        class="font-weight-bold text-decoration-none"
                        style="font-size: 10pt"
                        href="/register"
                        >create an account</a
                      ></div>
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
                    <div class="form-group mt-3">
                      <a
                        class="font-weight-bold text-decoration-none"
                        style="font-size: 10pt"
                        href="/forgot"
                        >Forgot password?</a
                      >
                    </div>
                    <div class="form-group">
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
                      Login
                    </button>
                  </form>
                </div>
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
  </div>
</template>
<script>
import ModalError from "@/components/modals/error";
import HelperMessage from "@/helpers/messages";
import FV from "@/helpers/form_validation";

export default {
  layout: "blank",
  middleware: ["refreshToken", "notAuthenticated"],
  components: {
    "modal-error": ModalError,
  },
  head() {
    return {
      title: "Login",
    };
  },
  data() {
    return {
      show_password: false,
      loading: false,
      form: {
        email: "",
        password: "",
        error: null,
      },
      modals: {
        error: {
          warning: false,
          message: "",
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
    referrer_url() {
      return this.$route.query.ref
    }
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
        "Email": {
          data: this.form.email,
          required: true,
          type: 'email'
        },
        Password: {
          data: this.form.password,
          required: true,
          minlength: 8,
        },
      };

      return FV.validation(schema, "single");
    },
    async HandleLogin() {
      try {
        let do_validation = this.Validation();
        if (do_validation) {
          this.form.error = do_validation;
          this.ShowModalError(do_validation, true);
        } else {
          this.loading = true;
          this.$store.commit("authentication/SET_REFERRER_URL", this.referrer_url)
          await this.$store.dispatch("authentication/Login", {
            username: this.form.email,
            password: this.form.password,
          });

          this.loading = false;
        }
      } catch (err) {
        this.ShowModalError(err);
        this.$store.commit("setAuth", null);
        this.loading = false
      }
    },
    ShowModalError(message, warning = false) {
      this.modals.error.warning = warning;
      this.modals.error.message = message;
      this.$bvModal.show("modal-error");
    },
  },
};
</script>
<style scoped>
.text-grey {
  color: #6c757d;
}
</style>
