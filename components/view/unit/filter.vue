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
      <div class="form-group">
        <label>Organization</label>
        <v-select
          :loading="loading_ddl.organization"
          v-model="filter.organization"
          :options="options.organization"
          label="name"
          placeholder="--Select--"
          :reduce="(key) => key.id"
          @input="Search()"
        >
          <template #spinner="{ loading }">
            <div
              v-if="loading"
              style="border-left-color: rgba(88, 151, 251, 0.71)"
              class="vs__spinner"
            ></div>
          </template>
        </v-select>
        <label
          class="text-danger mt-1 mb-0 small"
          v-if="filter_error['Organization']"
          >{{ filter_error["Organization"] }}</label
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
        organization: "",
      },
      options: {
        organization: [],
      },
      loading_ddl: {
        organization: false,
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
      this.filter.organization =
        this.additional_query.organization_id;

      this.GetDDLOrganization();
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
      
      if(this.filter.organization){
        schema["Organization"] = {
          data: this.filter.organization,
          valid: this.options.organization,
          valid_key: 'id'
        }
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
          this.$emit("SetFilter", "unit_view", {
            name: this.filter.name,
            organization_id: this.filter.organization
          });
        }
      }, 500);
    },
    async GetDDLOrganization() {
      try {
        let params = {};
        this.loading_ddl.organization = true;
        let get_data = await this.$store.dispatch("library/GetAll", {
          url: `/tenants/${this.user.tenant_id}/organizations`,
          params,
        });
        this.options.organization =
          get_data.data.length > 0 ? get_data.data : [];
        this.loading_ddl.organization = false;
      } catch (ex) {
        this.options.organization = [];
        this.loading_ddl.organization = false;
      }
    },
    ClearFilter() {
      this.filter = {
        name: "",
        organization: ""
      };
      this.$emit("SetFilter", "unit_view", {});
    },
  },
};
</script>
