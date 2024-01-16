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
        <div v-if="loading_init">
          <div class="container">
            <div class="row mt-5">
              <div class="col-12">
                <div class="text-center mb-5">
                  <p>Please wait..</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div v-if="verify_success" class="container">
            <div class="row mt-5">
              <div class="col-12">
                <div class="text-center mb-5">
                  <h1 class="text-dark mb-5" style="font-size: 48px">
                    Verification Complete
                  </h1>
                  <h1><i class="fa fa-check"></i></h1>
                  <br />
                  <p>
                    {{ verify_success_message }}
                  </p>
                  <nuxt-link to="login">Go to Login Page</nuxt-link>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="container">
            <div class="row mt-5">
              <div class="col-12">
                <div class="text-center mb-5">
                  <h1 class="text-dark mb-5" style="font-size: 48px">
                    Verification Failed
                  </h1>
                  <h1><i class="fa fa-times"></i></h1>
                  <br />
                  <p>{{ verify_failed_message }}</p>
                  <button
                    v-if="verify_resend"
                    type="button"
                    class="btn btn-primary mb-3"
                    style="font-size: 12pt; height: 50px"
                    :class="loading ? 'disabled btn-progress' : ''"
                    @click="VerifyRequest()"
                  >
                    <i class="fa fa-sync-alt"></i> Resend Verification Link
                  </button>
                  <nuxt-link v-else to="login">Go to Login Page</nuxt-link>
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
      title: "Verify",
    };
  },
  data() {
    return {
      verify_success: false,
      verify_success_message: "",
      verify_failed_message: "",
      verify_resend: false,
      loading_init: true,
      loading: false,
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
  mounted() {
    if (!this.$route.query.username || !this.$route.query.confirmation_code) {
      this.$router.push("/")
    }
    this.VerifyAutomatically();
  },
  methods: {
    async VerifyAutomatically() {
      this.loading_init = true;
      try {
        const request = await this.$store.dispatch("authentication/Verify", {
          username: this.$route.query.username,
          confirmation_code: this.$route.query.confirmation_code,
        });
        this.verify_success = true;
        this.verify_success_message = request.message;
      } catch (err) {
        this.verify_success = false;
        this.verify_failed_message = err;
        if (err.status == 400) {
          this.verify_resend = false;
        }
        else {
          this.verify_resend = true
        }
      }
      this.loading_init = false;
    },
    async VerifyRequest() {
      this.loading = true;
      try {
        await this.$store.dispatch("authentication/VerifyRequest", {
          username: this.$route.query.username,
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
      this.loading = false;
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
  },
};
</script>
<style scoped>
.text-grey {
  color: #6c757d;
}
</style>
