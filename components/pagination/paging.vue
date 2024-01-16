<template>
  <div class="row">
    <div class="col-12 d-flex justify-content-between">
      <div class="mt-2">
        <span class="" v-if="total_rows != 0 && limit != 0"
          >Showing {{ offset + 1 }} to
          {{ currentPage != availablePage ? offset + limit : total_rows }} of
          {{ total_rows }} Records</span
        >
        <span v-else>Showing 0 to 0 of 0 Records</span>
      </div>
      <div class="">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item" v-if="availablePage >= 4 && currentPage >= 3">
              <a
                class="page-link"
                href="javascript:void(0)"
                @click="goToPage(1)"
                >First</a
              >
            </li>
            <li class="page-item" v-if="currentPage !== 1">
              <a
                class="page-link"
                href="javascript:void(0)"
                aria-label="Previous"
                @click="goToPage(currentPage - 1)"
              >
                <span aria-hidden="true">«</span>
                <span class="sr-only">Previous</span>
              </a>
            </li>
            <li class="page-item" v-else>
              <a
                class="page-link"
                href="javascript:void(0)"
                aria-label="Previous"
              >
                <span aria-hidden="true">«</span>
                <span class="sr-only">Previous</span>
              </a>
            </li>
            <li v-if="availablePage === 0" class="page-item active">
              <a class="page-link" href="javascript:void(0)">1</a>
            </li>
            <template v-for="i in availablePage">
              <li
                :key="i"
                v-if="
                  currentPage >= 3 &&
                  i >= currentPage - 1 &&
                  i <= currentPage + 1
                "
                :class="i === currentPage ? 'page-item active' : 'page-item'"
              >
                <a
                  class="page-link"
                  href="javascript:void(0)"
                  @click="goToPage(i)"
                  >{{ i }}</a
                >
              </li>
              <template v-else-if="availablePage > 3">
                <li
                  :key="i"
                  v-if="currentPage < 3 && i <= 3"
                  :class="i === currentPage ? 'page-item active' : 'page-item'"
                >
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    @click="goToPage(i)"
                    >{{ i }}</a
                  >
                </li>
                <li
                  :key="i"
                  v-else-if="
                    currentPage == availablePage && i == availablePage - 2
                  "
                  :class="i === currentPage ? 'page-item active' : 'page-item'"
                >
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    @click="goToPage(i)"
                    >{{ i }}</a
                  >
                </li>
              </template>
              <template v-else>
                <li
                  :key="i"
                  :class="i === currentPage ? 'page-item active' : 'page-item'"
                >
                  <a
                    class="page-link"
                    href="javascript:void(0)"
                    @click="goToPage(i)"
                    >{{ i }}</a
                  >
                </li>
              </template>
            </template>
            <li class="page-item" v-if="currentPage < availablePage">
              <a
                class="page-link"
                href="javascript:void(0)"
                aria-label="Next"
                @click="goToPage(currentPage + 1)"
              >
                <span aria-hidden="true">»</span>
                <span class="sr-only">Next</span>
              </a>
            </li>
            <li class="page-item" v-else>
              <a class="page-link" href="javascript:void(0)" aria-label="Next">
                <span aria-hidden="true">»</span>
                <span class="sr-only">Next</span>
              </a>
            </li>
            <li
              class="page-item"
              v-if="availablePage >= 4 && currentPage <= availablePage - 2"
            >
              <a
                class="page-link"
                href="javascript:void(0)"
                @click="goToPage(availablePage)"
                >Last</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total_rows: 0,
    limit: 0,
    offset: 0,
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  computed: {
    availablePage: function () {
      if (this.offset == 0) {
        this.reset();
      }
      if (this.total_rows !== 0 && this.limit !== 0) {
        return Math.ceil(this.total_rows / this.limit);
      }
      return 0;
    },
  },
  methods: {
    reset: function () {
      this.currentPage = 1;
    },
    goToPage: function (page) {
      if (page !== this.currentPage) {
        if (page <= this.availablePage) {
          this.currentPage = page;
          let offset = (page - 1) * this.limit;

          return this.$emit("go_to_page", this.limit, offset);
        }
        return this.$emit("go_to_page", this.limit, 0);
      }
      return false;
    },
  },
};
</script>

<style>
.page-item:last-child .page-link {
  margin-right: 0;
}
</style>
