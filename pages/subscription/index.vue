<template>
  <div class="container px-40">
    <section class="section">
      <div class="section-body">
        <h1
          class="text-dark text-center"
          style="font-size: 48px"
        >
          Subscription
        </h1>
        <p class="mt-4">Sorry, our app is currently undergoing maintenance. We apologize for any inconvenience this may cause. Please check back later, and we'll be up and running again soon.</p>
      </div>
    </section>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  head() {
    return {
      title: "Subscription",
    };
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
    }),
  },
  async mounted() {
    await this.$store.dispatch('accessPage', {
      page: 'subscription',
    })
  },
  methods: {},
};
</script>
