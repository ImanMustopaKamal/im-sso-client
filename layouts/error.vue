<template>
  <section class="section">
    <div class="container mt-5">
      <div class="page-error">
        <div class="page-inner">
          <h1>{{ error.statusCode }}</h1>
          <div v-if="error.statusCode === 404" class="page-description">
            The page you were looking for could not be found.
          </div>
          <div v-else class="page-description">
            Whoopps, something went wrong.
          </div>
          <div class="page-search">
            <div class="mt-3">
              <NuxtLink to="/">Back to Home</NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div class="simple-footer mt-5">
        Copyright &copy; {{ company }} {{ year }}
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ["error"],
  layout: "blank",
  data() {
    let date = new Date();
    let getYear = date.getFullYear();
    return {
      year: getYear,
    };
  },
  computed: {
    company() {
      return process.env.COPYRIGHT_COMPANY;
    },
  },
};
</script>
