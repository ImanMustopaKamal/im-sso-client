<template>
  <div class="custom-navigation-area">
    <ul class="custom-navigation">
      <li v-for="item of menus" class="custom-navigation-list">
        <nuxt-link
          :to="item.link"
          class="custom-navigation-link"
          :exact="item.link === '/'"
          :exact-active-class="['active']"
          :active-class="['active']"
        >
          {{ item.name }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      menus: [
        {
          id: 'dashboard',
          name: "Dashboard",
          link: "/",
        },
        {
          id: 'organization',
          name: "Organization",
          link: "/organization",
        },
        {
          id: 'members',
          name: "Members",
          link: "/members",
        },
        {
          id: 'subscription',
          name: "Subscription",
          link: "/subscription",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
    }),
  },
  mounted() {
    this.menus = this.menus.filter(item => this.user.access.includes(item.id))
  },
};
</script>
