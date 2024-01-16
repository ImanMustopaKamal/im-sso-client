<template>
  <div class="container px-40">
    <section class="section">
      <div class="section-body">
        <div class="row">
          <div class="col-12">
            <p class="text-black h6 text-center mt-5">
              Welcome back {{ this.user ? this.user.name : "N/A" }}! It's
              {{ formattedDate }}.
            </p>
            <p class="text-black h6 text-center mt-5">
              <b>Available Products</b>
            </p>
            <div class="riskobs-app mt-5">
              <template v-if="appListLoading">
                <div v-for="(item, index) of 3" class="app-card">
                  <div class="app-card-flex w-full">
                    <div class="w-50 h-100 comment animate br"></div>
                    <div class="app-card-content w-full">
                      <div class="w-full h-25 comment animate br"></div>
                      <div class="w-full h-15 mt-2 comment animate br"></div>
                    </div>
                  </div>
                  <div class="app-card-act w-full">
                    <div class="w-full h-40 comment animate br"></div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div v-for="(item, index) of appLists" class="app-card">
                  <div class="app-card-flex">
                    <img :src="'/img/app-' + item.id + '.png'" alt="Riskobs" />
                    <div class="app-card-content">
                      <p class="text-black">{{ item.name }}</p>
                      <p>
                        {{ item.is_registered ? "Registered" : "Unregistered" }}
                      </p>
                    </div>
                  </div>
                  <div class="app-card-act">
                    <a
                      v-if="item.is_registered"
                      :href="item.url"
                      target="_blank"
                      class="btn btn-success btn-block"
                      >Open</a
                    >
                    <nuxt-link
                      v-else-if="user.groups && user.groups.includes('AccountOwner') && user.tenant_id == null"
                      to="/company-settings?alert=true"
                      class="btn btn-primary btn-block"
                      >Try Now</nuxt-link
                    >
                    <a
                      v-else-if="user.groups && user.groups.includes('AccountOwner') && user.tenant_id"
                      href="javascript:void(0)"
                      class="btn btn-primary btn-block "
                      :class="item.button_loader ? 'disabled btn-progress' : ''"
                      @click="TryApp(index, item.id, item.name)"
                      >Try Now</a
                    >
                    <a
                      v-else
                      href="javascript:void(0)"
                      class="btn btn-info btn-block"
                      >Contact Support</a
                    >
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
    <modal-error
      :warning="modals.error.warning"
      :message="modals.error.message"
    />
    <modal-success
      :message="modals.success.message"
      @hidden="modals.success.callback"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import ModalError from "@/components/modals/error";
import ModalSuccess from "@/components/modals/success";
import HelperMessage from "@/helpers/messages";
export default {
  head() {
    return {
      title: "Dashboard",
    };
  },
  components: {
    "modal-error": ModalError,
    "modal-success": ModalSuccess,
  },
  data() {
    return {
      appLists: [],
      appListLoading: false,
      currentDate: new Date(),
      modals: {
        error: {
          warning: false,
          message: "",
        },
        success: {
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
    formattedDate: function () {
      return this.FormatDate(this.currentDate);
    },
  },
  async mounted() {
    await this.$store.dispatch('accessPage', {
      page: 'dashboard',
    })

    this.GetAppList();
  },
  methods: {
    ...mapActions("library", ["Insert"]),
    async GetAppList() {
      this.appListLoading = true;
      try {
        let params = {};
        let get_data = await this.$store.dispatch("library/GetAll", {
          url: `/tenants/${this.user.tenant_id}/apps`,
          params,
        });
        let datapool = get_data.data.length > 0 ? get_data.data : [];
        for (let i = 0; i < datapool.length; i++) {
          datapool[i]['button_loader'] = false
        }
        this.appLists = datapool;
      } catch (ex) {}
      this.appListLoading = false;
    },
    async TryApp(index, appId, name) {
      this.appLists[index].button_loader = true
      try {
        await this.Insert({
          url: `/tenants/${this.user.tenant_id}/registerApp`,
          request_body: {
            app_id: appId
          },
        })
        if (appId == 1) {
          const updateAttr = [
            { Name: "custom:role", Value: "Super Admin" }
          ];
          await this.$cognito.UpdateAttribute({username: this.user.user_id, userAttributes: updateAttr});
        }
        else if (appId == 2) {
          await this.$cognito.AdminAddUserToGroup(this.user.user_id, "CoreAdmin");
        }
        this.appLists[index].button_loader = false
        this.ShowModalSuccess(
          HelperMessage.getMessage("message.modal.success.register_app", {
            name: name,
          })
        );
        this.GetAppList();
        this.$store.dispatch('refreshToken')
      } catch (err) {
        this.ShowModalError(err.message);
      }
      this.appLists[index].button_loader = false
    },
    ShowModalError(message, warning = false) {
      this.modals.error.warning = warning;
      this.modals.error.message = message;
      this.$bvModal.show("modal-error");
    },
    ShowModalSuccess(message, callback = () => {}) {
      this.modals.success.message = message;
      this.modals.success.callback = callback;
      this.$bvModal.show("modal-success");
    },
    FormatDate: function (date) {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const day = days[date.getDay()];
      const month = months[date.getMonth()];
      const dayOfMonth = date.getDate();
      const suffix = this.GetDaySuffix(dayOfMonth);

      return `${day}, ${month} ${dayOfMonth}${suffix}`;
    },
    GetDaySuffix: function (day) {
      if (day >= 11 && day <= 13) {
        return "th";
      }
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    },
  },
};
</script>
