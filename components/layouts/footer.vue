<template>
  <footer class="main-footer">
    <div class="footer-left">Copyright &copy; {{ company }} {{ year }}</div>
    <div class="footer-right">1.0.0</div>
  </footer>
</template>
<script>
export default {
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
