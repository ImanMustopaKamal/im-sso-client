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
          @input="() => {
            GetDDLBusinessUnit()
            Search()
          }
          "
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
      <div class="form-group">
        <label>Business Unit</label>
        <v-select
          :loading="loading_ddl.business_unit"
          v-model="filter.business_unit"
          :options="options.business_unit"
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
          v-if="filter_error['Business Unit']"
          >{{ filter_error["Business Unit"] }}</label
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
        business_unit: "",
      },
      options: {
        organization: [],
        business_unit: [],
      },
      loading_ddl: {
        organization: false,
        business_unit: false,
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
      this.filter.business_unit =
        this.additional_query.business_unit_id;

      this.GetDDLOrganization();
      this.GetDDLBusinessUnit(this.filter.business_unit);
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
      if(this.filter.business_unit){
        schema["Business Unit"] = {
          data: this.filter.business_unit,
          valid: this.options.business_unit,
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
          this.$emit("SetFilter", "subunit_view", {
            name: this.filter.name,
            organization_id: this.filter.organization,
            business_unit_id: this.filter.business_unit
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
    async GetDDLBusinessUnit(unit_selected = null) {
      try{
        let organization_id = this.filter.organization;
        
        if(!unit_selected){
          this.filter.business_unit = ""
          this.options.business_unit = []
        }

        if(organization_id){

          let params = {
            organization_id: organization_id
          }
          this.loading_ddl.business_unit = true
          let get_data = await this.$store.dispatch(
            'library/GetAll',
            { url: `/tenants/${this.user.tenant_id}/business-units`, params }
          )
          this.options.business_unit = get_data.data.length > 0 ? get_data.data : []
          this.loading_ddl.business_unit = false
        }
      }catch(ex){
        if(!unit_selected){
          this.filter.business_unit = ""
          this.options.business_unit = []
        }

        this.loading_ddl.business_unit = false
      }
    },
    ClearFilter() {
      this.filter = {
        name: "",
        organization: "",
        business_unit: ""
      };

      this.$emit("SetFilter", "subunit_view", {});
    },
  },
};
</script>
