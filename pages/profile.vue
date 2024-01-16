<template>
  <div class="container mt-5">
    <section class="section">
      <div class="section-body">
        <div class="row">
          <div class="col-3">
            <ul class="nav flex-column nav-pills">
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="active_menu == 'user-information' ? 'active' : ''"
                  @click="ActiveMenu('user-information')"
                  >User Information</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="active_menu == 'password' ? 'active' : ''"
                  @click="ActiveMenu('password')"
                  >Password</a
                >
              </li>
            </ul>
          </div>
          <div class="col-9">
            <UserInformationView
              ref="user-information"
              v-if="active_menu == 'user-information'"
              @Confirm="ShowModalConfirm"
              @Success="ShowModalSuccess"
              @Error="ShowModalError"
              @ShowLoader="ShowLoader"
            />
            <PasswordView
              ref="password"
              v-if="active_menu == 'password'"
              @Confirm="ShowModalConfirm"
              @Success="ShowModalSuccess"
              @Error="ShowModalError"
              @ShowLoader="ShowLoader"
            />
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
import { mapState } from "vuex";
import UserInformationView from "@/components/view/user-information/index.vue";
import PasswordView from "@/components/view/password/index.vue";
import ModalLoader from "@/components/modals/loader";
import ModalConfirm from "@/components/modals/confirm";
import ModalConfirmLeave from "@/components/modals/confirm-leave";
import ModalError from "@/components/modals/error";
import ModalSuccess from "@/components/modals/success";
import HelperMessage from "@/helpers/messages";
export default {
  components: {
    "modal-confirm": ModalConfirm,
    "modal-confirm-leave": ModalConfirmLeave,
    "modal-loader": ModalLoader,
    "modal-error": ModalError,
    "modal-success": ModalSuccess,
    UserInformationView,
    PasswordView,
  },
  head() {
    return {
      title: "Profile",
    };
  },
  data() {
    return {
      active_menu: "user-information",
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
    }),
  },
  mounted() {
    if (this.$route.query.tab == "password") {
      this.ActiveMenu("password");
      this.$router.replace({ query: null });
    }
  },
  methods: {
    ActiveMenu(menu) {
      this.active_menu = menu;
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
    ShowLoader(state) {
      this.loader = state;
    },
    OkLeave() {
      this.$router.push({ name: "index" });
    },
  },
};
</script>
