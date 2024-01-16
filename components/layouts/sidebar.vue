<template>
  <div class="main-sidebar">
    <aside id="sidebar-wrapper">
      <ul class="sidebar-menu">
        <li :class="'nav-item text-center' + NavigationActive(['index'])">
          <nuxt-link
            :to="{ name: 'index' }"
            aria-current="page"
            class="nav-link nuxt-link-exact-active nuxt-link-active"
            data-toggle="tooltip"
            data-placement="right"
            title=""
            data-original-title="Home"
          >
            <i class="fa fa-tachometer-alt" style="font-size: 1.5em"></i>
            <div>Home</div>
          </nuxt-link>
        </li>
        <li
          v-if="NavigationAccess('submissions')"
          :class="'nav-item text-center' + NavigationActive(['submissions'])"
        >
          <nuxt-link
            :to="{ name: 'submissions' }"
            aria-current="page"
            class="nav-link nuxt-link-exact-active nuxt-link-active"
            data-toggle="tooltip"
            data-placement="right"
            title=""
            data-original-title="Submissions"
          >
            <i class="fab fa-wpforms" style="font-size: 1.5em"></i>
            <div>Submissions</div>
          </nuxt-link>
        </li>
        <li
          v-if="NavigationAccess('screenings')"
          :class="'nav-item text-center' + NavigationActive(['screenings'])"
        >
          <nuxt-link
            :to="{ name: 'screenings' }"
            aria-current="page"
            class="nav-link nuxt-link-exact-active nuxt-link-active"
            data-toggle="tooltip"
            data-placement="right"
            title=""
            data-original-title="Screenings"
          >
            <i class="fas fa-search" style="font-size: 1.5em"></i>
            <div>Screenings</div>
          </nuxt-link>
        </li>
        <li
          v-if="NavigationAccess('incidents')"
          :class="'nav-item text-center' + NavigationActive(['incidents'])"
        >
          <nuxt-link
            :to="{ name: 'incidents' }"
            aria-current="page"
            class="nav-link nuxt-link-exact-active nuxt-link-active"
            data-toggle="tooltip"
            data-placement="right"
            title=""
            data-original-title="Incidents"
          >
            <i class="fa fa-car-crash" style="font-size: 1.5em"></i>
            <div>Incidents</div>
          </nuxt-link>
        </li>
        <li
          v-if="NavigationAccess('investigation')"
          :class="'nav-item text-center' + NavigationActive(['investigation'])"
        >
          <nuxt-link
            :to="{ name: 'investigation' }"
            aria-current="page"
            class="nav-link nuxt-link-exact-active nuxt-link-active"
            data-toggle="tooltip"
            data-placement="right"
            title=""
            data-original-title="Investigation"
          >
            <i class="fa fa-search-plus" style="font-size: 1.5em"></i>
            <div>Investigation</div>
          </nuxt-link>
        </li>
        <li
          v-if="NavigationAccess('library')"
          :class="
            'nav-item dropdown' +
            NavigationActive([
              'library-incident-types',
              'library-person',
              'library-assets',
            ])
          "
        >
          <a disabled="disabled" class="nav-link has-dropdown text-center">
            <i class="fas fa-book" style="font-size: 1.5em"></i>
            <div>Library</div>
          </a>
          <ul class="dropdown-menu" style="display: none">
            <li>
              <nuxt-link
                :to="{ name: 'library-incident-types' }"
                class="nav-link"
                >Incident Types</nuxt-link
              >
            </li>
            <li>
              <nuxt-link :to="{ name: 'library-person' }" class="nav-link"
                >Person</nuxt-link
              >
            </li>
            <li>
              <nuxt-link :to="{ name: 'library-assets' }" class="nav-link"
                >Assets</nuxt-link
              >
            </li>
          </ul>
        </li>
        <li
          v-if="NavigationAccess('users')"
          :class="'nav-item text-center' + NavigationActive(['users'])"
        >
          <nuxt-link
            :to="{ name: 'users' }"
            aria-current="page"
            class="nav-link nuxt-link-exact-active nuxt-link-active"
            data-toggle="tooltip"
            data-placement="right"
            title=""
            data-original-title="Users"
          >
            <i class="fa fa-users" style="font-size: 1.5em"></i>
            <div>Users</div>
          </nuxt-link>
        </li>
        <li
          v-if="NavigationAccess('roles')"
          :class="'nav-item text-center' + NavigationActive(['roles'])"
        >
          <nuxt-link
            :to="{ name: 'roles' }"
            aria-current="page"
            class="nav-link nuxt-link-exact-active nuxt-link-active"
            data-toggle="tooltip"
            data-placement="right"
            title=""
            data-original-title="Roles"
          >
            <i class="fa fa-user" style="font-size: 1.5em"></i>
            <div>Roles</div>
          </nuxt-link>
        </li>
        <li
          v-if="NavigationAccess('organizations')"
          :class="
            'nav-item dropdown' +
            NavigationActive([
              'organizations-company',
              'organizations-business-unit',
              'organizations-division',
            ])
          "
        >
          <a disabled="disabled" class="nav-link has-dropdown text-center">
            <i class="fas fa-sitemap" style="font-size: 1.5em"></i>
            <div>Organizations</div>
          </a>
          <ul class="dropdown-menu" style="display: none">
            <li>
              <nuxt-link
                :to="{ name: 'organizations-company' }"
                class="nav-link"
                >Company</nuxt-link
              >
            </li>
            <li>
              <nuxt-link
                :to="{ name: 'organizations-business-unit' }"
                class="nav-link"
                >Business Unit</nuxt-link
              >
            </li>
            <li>
              <nuxt-link
                :to="{ name: 'organizations-division' }"
                class="nav-link"
                >Division</nuxt-link
              >
            </li>
          </ul>
        </li>
        <li
          v-if="NavigationAccess('reports')"
          :class="'nav-item text-center' + NavigationActive(['reports'])"
        >
          <nuxt-link
            :to="{ name: 'reports' }"
            aria-current="page"
            class="nav-link nuxt-link-exact-active nuxt-link-active"
            data-toggle="tooltip"
            data-placement="right"
            title=""
            data-original-title="Reports"
          >
            <i class="fa fa-paste" style="font-size: 1.5em"></i>
            <div>Reports</div>
          </nuxt-link>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      user: (state) => state.auth,
    }),
    NavigationAccess() {
      return (item) => (this.user ? this.user.access.includes(item) : false);
    },
  },
  methods: {
    NavigationActive(routeNames) {
      for (let i = 0; i < routeNames.length; i++) {
        if (this.$route.name && this.$route.name.startsWith(routeNames[i])) {
          return " active";
        }
      }
      return "";
    },
  },
};
</script>
