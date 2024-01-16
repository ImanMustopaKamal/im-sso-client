<template>
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
    <div class="main-content" style="margin: 0 auto;">
      <div class="container">
        <div class="row mt-5">
          <div class="col-12">
            <div class="text-center mb-5">
              <h1 class="text-dark mb-5" style="font-size: 48px">
                Forgot Password?
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
                <p class="mb-4" style="font-size: 12pt">We'll send a recovery link to</p>
                <form method="POST" action="?" @submit.prevent="forgotPassword">
                  <div class="form-group">
                    <label for="email" style="font-size: 10pt">Email</label>
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
                    <div class="invalid-feedback mt-2" style="display: block">
                      <span class="error-block text-danger">
                        {{ this.form.error }}
                      </span>
                    </div>
                  </div>
                  <div class="form-group">
                    <button
                      type="submit"
                      class="btn btn-primary btn-block mb-3"
                      style="font-size: 12pt; height: 50px"
                      :class="loading ? 'disabled btn-progress' : ''"
                      tabindex="4"
                    >
                      Submit
                    </button>
                  </div>
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
        <div style="position: fixed; bottom: 0px; left: 30px; right: 0px">
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
import ModalError from "@/components/modals/error";
import ModalSuccess from "@/components/modals/success";

export default {
  layout: "blank",
  components: {
    "modal-success": ModalSuccess,
    "modal-error": ModalError,
  },
  data() {
    return {
      title: "Forgot Password",
      loading: false,
      form: {
        email: "",
        error: null
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
  methods: {
    Validation() {
      let schema = {
        "Email": {
          data: this.form.email,
          required: true,
          type: 'email'
        }
      };

      return FV.validation(schema, "single");
    },
    async forgotPassword() {
      try {
        let do_validation = this.Validation();
        if (do_validation) {
          this.form.error = do_validation
        }else {
          this.loading = true;

          let do_forgot = await this.$store.dispatch("authentication/Forgot", {
            email: this.form.email
          });
          this.loading = false;

          if(do_forgot){
            this.form.error = null
            this.ShowModalSuccess("Check your email for the verification code.", () => {
              this.$router.push({ name: "login" });
            })
          }
        }
      }catch(ex) {
        this.loading = false;
        this.ShowModalError(ex);
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
</style>
