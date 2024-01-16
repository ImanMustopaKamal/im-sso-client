<template>
  <div>
    <nav class="navbar navbar-expand-lg main-navbar bg-white">
      <nuxt-link to="/" class="navbar-brand sidebar-gone-hide text-primary">
        <img src="@/assets/img/logo.png" style="height: 45px">
      </nuxt-link>
      <form class="form-inline ml-auto"></form>
      <ul class="navbar-nav navbar-right">
        <!-- <li class="dropdown">
          <a
            href="#"
            data-toggle="dropdown"
            class="nav-link nav-link-lg nav-link-user"
            @click="InitTimeago()"
          >
            <div class="d-sm-none d-lg-inline-block">
              <i class="far fa-question-circle ic-custom-question"></i></div
          ></a>
          <div class="dropdown-menu dropdown-menu-right">
            <nuxt-link :to="{ name: 'profile' }" class="dropdown-item has-icon">
              <i class="fa fa-info-circle mr-05p w-10"></i>
              Support
            </nuxt-link>
            <nuxt-link :to="{ name: 'profile' }" class="dropdown-item has-icon">
              <i class="fa fa-cookie-bite mr-05p w-10"></i>
              Cookie Policy
            </nuxt-link>
          </div>
        </li> -->
        <li class="dropdown">
          <a
            href="#"
            data-toggle="dropdown"
            class="nav-link nav-link-lg nav-link-user"
          >
            <img
              alt="image"
              :src="tenant ? (tenant.logo_file_url ? tenant.logo_file_url : (tenantPool.logo_file_url ? tenantPool.logo_file_url : '/img/icon/building.jpg')) : '/img/icon/building.jpg'"
              class="rounded mr-1"
            />
            <div class="d-sm-none d-lg-inline-block">{{ tenant ? (tenant.name ? tenant.name : tenantPool.name) : "N/A" }}</div></a
          >
          <div v-if="user.groups && user.groups.includes('AccountOwner')" class="dropdown-menu dropdown-menu-right">
            <nuxt-link :to="{ name: 'company-settings' }" class="dropdown-item has-icon">
              <i class="far fa-building mr-05p w-10"></i>
              Company Settings
            </nuxt-link>
          </div>
        </li>
        <li class="separator"></li>
        <li class="dropdown">
          <a
            href="#"
            data-toggle="dropdown"
            class="nav-link dropdown-toggle nav-link-lg nav-link-user"
            @click="InitTimeago()"
          >
            <img
              alt="image"
              src="@/assets/img/avatar/avatar-3.png"
              class="rounded-circle mr-1"
            />
            <div class="d-sm-none d-lg-inline-block"></div></a
          >
          <div class="dropdown-menu dropdown-menu-right">
            <div class="dropdown-title truncate">Hi. {{ user ? user.name : "N/A" }}</div>
            <nuxt-link :to="{ name: 'profile' }" class="dropdown-item has-icon">
              <i class="far fa-user mr-05p w-10"></i>
              Profile
            </nuxt-link>
            <a
              href="javascript:void(0)"
              class="dropdown-item has-icon text-danger"
              @click="Logout()"
            >
              <i class="fas fa-sign-out-alt ml-1p w-10"></i>
              Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import HelperText from "@/helpers/texts";
import HelperMessage from "@/helpers/messages";
export default {
  data() {
    return {
      timeago: "",
      tenantPool: {
        name: "",
        logo_file_url: ""
      }
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
      tenant: (state) => state.tenant,
    }),
  },
  mounted() {
    this.GetTenantInfo()
  },
  beforeDestroy() {},
  methods: {
    ...mapActions("library", ["Insert", "Update"]),
    async GetTenantInfo() {
      try {
        let params = {};
        let res = await this.$store.dispatch("library/GetAll", {
          url: `/tenants/${this.user.tenant_id}`,
          params,
        });
        let resData = res.data
        this.tenantPool = resData
        this.$store.commit("setTenant", resData);
      } catch (ex) {}
    },
    async Logout() {
      await this.$store.dispatch("authentication/Logout");
    },
    InitTimeago() {
      if (this.user) {
        this.timeago = HelperText.FormatTimeAgo(this.user.auth_time);
      }
    },
    TimeAgo(datetime) {
      const timestampInMilliseconds = Date.parse(datetime);
      const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);
      return HelperText.FormatTimeAgo(timestampInSeconds);
    },
    MessageNoData() {
      return HelperMessage.getMessage("message.modal.error.no_data");
    },
  },
};
</script>
