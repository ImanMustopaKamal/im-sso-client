<template>
  <div class="row">
    <div class="col-12">
      <div class="form-group">
        <label>Name</label>
        <input
          type="text"
          class="form-control"
          v-model="filter.name"
          @keyup="Search()"
        />
        <label
          class="text-danger mt-1 mb-0 small"
          v-if="filter_error['Name']"
          >{{ filter_error["Name"] }}</label
        >
      </div>
      <button
        class="btn btn-primary form-control"
        @click="
          () => {
            this.ClearFilter();
          }
        "
      >
        Clear Filter
      </button>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HelperMessage from "@/helpers/messages";
import FV from "@/helpers/form_validation";
export default {
  props: {
    additional_query: Object,
  },
  data() {
    return {
      filter: {
        name: "",
      },
      typing_interval: null,
      filter_error: {},
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
    }),
  },
  mounted() {
    this.Load();
  },
  methods: {
    Load() {
      this.filter.name = this.additional_query.name;
    },
    ValidationSearch() {
      let schema = {};
      if (this.filter.name) {
        schema["Name"] = {
          data: this.filter.name,
          minlength: 3,
          maxlength: 200,
        };
      }

      return FV.validation(schema, "multiple");
    },
    Search() {
      if (this.typing_interval) {
        clearTimeout(this.typing_interval);
        this.typing_interval = null;
      }
      this.typing_interval = setTimeout(() => {
        let do_validation = this.ValidationSearch();
        if (Object.keys(do_validation).length > 0) {
          this.filter_error = do_validation;
        } else {
          this.filter_error = {};
          this.$emit("SetFilter", "organization_view", {
            name: this.filter.name
          });
        }
      }, 500);
    },
    ClearFilter() {
      this.filter = {
        name: ""
      };
      this.$emit("SetFilter", "organization_view", {});
    },
  },
};
</script>
