<template>
  <div id="app">
    <div class="main-wrapper">
      <CHeader />
      <CNavigation />
      <div class="main-content p-0">
        <Nuxt />
      </div>
    </div>
    <modal-error
      id="modal-error-authorization"
      :warning="modals.error.warning"
      :message="modals.error.message"
      @ok="modals.error.callback"
    />
  </div>
</template>
<script>
import CHeader from "@/components/layouts/header.vue";
import CNavigation from "@/components/layouts/navigation.vue";
import CSidebar from "@/components/layouts/sidebar.vue";
import CFooter from "@/components/layouts/footer.vue";
import ModalError from "@/components/modals/error";
import HelperMessage from "@/helpers/messages";

import { mapState } from "vuex";

export default {
  middleware: ["refreshToken", "authenticated"],
  components: {
    CHeader: CHeader,
    CNavigation: CNavigation,
    CSidebar: CSidebar,
    CFooter: CFooter,
    "modal-error": ModalError,
  },
  head() {
    return {
      bodyAttrs: {
        class: "layout-2 sidebar-mini",
        style: "position: relative; background-color: #f4f6f9;",
      },
    };
  },
  data() {
    return {
      modals: {
        error: {
          warning: false,
          message: "",
          callback: () => {},
        },
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
    }),
  },
  mounted() {
    this.HandleUserInfo();
  },
  methods: {
    async HandleUserInfo() {
      await this.$store
        .dispatch("library/GetData", { url: `/tenants/${this.user.tenant_id}/users/${this.user.user_id}` })
        .then(async (result) => {
          const user_detail = result.data[0];
          this.$store.commit("setAuthUserDetail", user_detail);
        })
        .catch((err) => {
          this.ShowModalError(err.message, false)
        });
    },
    ShowModalError(message, warning = false, callback = () => {}) {
      this.modals.error.warning = warning;
      this.modals.error.message = message;
      this.modals.error.callback = callback;
      this.$bvModal.show("modal-error-authorization");
    },
  },
};
</script>
