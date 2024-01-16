<template>
  <div class="m-5">
    <section class="section">
      <div class="section-body">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header justify-content-between">
                <div class="card-header-action">
                  <nuxt-link
                    class="btn btn-primary mr-1"
                    :to="{ name: 'members-create' }"
                    >Add New Member</nuxt-link
                  >
                </div>
                <div class="d-flex">
                  <button
                    class="btn btn-icon text-primary card-header-action-icon"
                    title="Filter"
                    @click="OpenFilter()"
                  >
                    <i class="fa fa-filter"></i>
                    <span
                      v-if="HaveFilters()"
                      class="dot"
                      style="background-color: #28a745"
                    >
                    </span>
                  </button>
                  <button
                    class="btn btn-icon text-primary card-header-action-icon"
                    title="Refresh"
                    @click="ClearFilter()"
                  >
                    <i class="fa fa-sync"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <table
                  class="table table-striped table-sm table-bordered table-hover clickable"
                >
                  <thead>
                    <tr>
                      <th class="text-center">Code</th>
                      <th class="text-center">Name</th>
                      <th class="text-center">Employee Number</th>
                      <th class="text-center">Email</th>
                      <th class="text-center">Organization</th>
                      <th class="text-center">Business Unit</th>
                      <th class="text-center">Subunit</th>
                      <th class="text-center">Action</th>
                    </tr>
                  </thead>
                  <template v-if="loading_data">
                    <Shimmer :row="5" :column="8" />
                  </template>
                  <template v-else>
                    <tbody v-if="items.length > 0">
                      <tr
                        v-for="item in items"
                        :key="item.id"
                        @click="OnClickItemUserList(item.id)"
                      >
                        <td class="text-center">{{ item.id }}</td>
                        <td>{{ item.name ? item.name : 'N/A' }}</td>
                        <td>{{ item.employee_number ? item.employee_number : 'N/A' }}</td>
                        <td>{{ item.email ? item.email : 'N/A' }}</td>
                        <td>{{ item.organization_name ? item.organization_name : 'N/A' }}</td>
                        <td>{{ item.business_unit_name ? item.business_unit_name : 'N/A' }}</td>
                        <td>{{ item.subunit_name ? item.subunit_name : 'N/A' }}</td>
                        <td class="text-center">
                          <a
                            href="javascript:void(0)"
                            title="Delete"
                            @click="
                              (e) => {
                                e.stopPropagation();
                                DeleteUser(item.id);
                              }
                            "
                            ><i class="fas fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr>
                        <td class="text-center" colspan="8">
                          <span class="text-muted">
                            {{ this.MessageNoData() }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </table>
              </div>
              <div class="card-footer">
                <paging
                  :total_rows="total_data"
                  :offset="offset"
                  :limit="limit"
                  @go_to_page="GoToPage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <b-sidebar
      v-model="filter.show"
      title="Filter"
      bg-variant="white"
      width="400px"
      right
      no-header
      backdrop
      shadow
    >
      <div class="px-3 py-3">
        <div class="d-flex justify-content-between">
          <h5 class="text-primary">Filter</h5>
          <a
            class="text-primary mt-0"
            title="Close"
            style="font-size: 1.5em; cursor: pointer"
            @click="filter.show = false"
          >
            <i class="fa fa-times"></i>
          </a>
        </div>
        <br />
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
              <label>Employee Number</label>
              <input
                type="text"
                class="form-control"
                v-model="filter.employee_number"
                @keyup="Search()"
              />
              <label
                class="text-danger mt-1 mb-0 small"
                v-if="filter_error['Employee Number']"
                >{{ filter_error["Employee Number"] }}</label
              >
            </div>
            <div class="form-group">
              <label>Email</label>
              <input
                type="Email"
                class="form-control"
                v-model="filter.email"
                @keyup="Search()"
              />
              <label
                class="text-danger mt-1 mb-0 small"
                v-if="filter_error['Email']"
                >{{ filter_error["Email"] }}</label
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
                @input="
                  () => {
                    GetDDLBusinessUnit();
                    Search();
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
                @input="
                  () => {
                    GetDDLSubunit();
                    Search();
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
                v-if="filter_error['Business Unit']"
                >{{ filter_error["Business Unit"] }}</label
              >
            </div>
            <div class="form-group">
              <label>Subunit</label>
              <v-select
                :loading="loading_ddl.subunit"
                v-model="filter.subunit"
                :options="options.subunit"
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
                v-if="filter_error['Subunit']"
                >{{ filter_error["Subunit"] }}</label
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
      </div>
    </b-sidebar>
    <modal-loader :show="loader" />
    <modal-confirm
      :message="modals.confirm.message"
      @ok="modals.confirm.callback"
    />
    <modal-success :message="modals.success.message" @hidden="modals.success.callback"/>
    <modal-error
      :warning="modals.error.warning"
      :message="modals.error.message"
      @ok="modals.error.callback"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Paging from "@/components/pagination/paging";
import Shimmer from "@/components/basics/shimmer";
import ModalLoader from "@/components/modals/loader";
import ModalConfirm from "@/components/modals/confirm";
import ModalError from "@/components/modals/error";
import ModalSuccess from "@/components/modals/success";
import HelperMessage from "@/helpers/messages";
import FV from '@/helpers/form_validation';
export default {
  head() {
    return {
      title: "Members",
    };
  },
  components: {
    Shimmer,
    paging: Paging,
    "modal-loader": ModalLoader,
    "modal-error": ModalError,
    "modal-success": ModalSuccess,
    "modal-confirm": ModalConfirm,
  },
  data() {
    return {
      loading_data: false,
      items: [],
      limit: 10,
      offset: 0,
      total_data: 0,
      filter: {
        show: false,
        name: "",
        employee_number: "",
        email: "",
        organization: "",
        business_unit: "",
        subunit: "",
      },
      options: {
        organization: [],
        business_unit: [],
        subunit: [],
      },
      loading_ddl: {
        organization: false,
        business_unit: false,
        subunit: false,
      },
      modals: {
        confirm: {
          message: "",
          callback: () => {},
        },
        success: {
          message: "",
          callback: () => {},
        },
        error: {
          warning: "",
          message: "",
          callback: () => {},
        },
      },
      loader: false,
      typing_interval: null,
      additional_query: {},
      filter_error: {},
      is_use_template: false,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
    }),
  },
  async mounted() {
    await this.$store.dispatch('accessPage', {
      page: 'members',
    })

    this.GetAll(this.limit, 0, {});
  },
  methods: {
    ...mapActions('library', ['Delete']),
    GoToPage(limit, offset) {
      this.limit = limit;
      this.offset = offset;
      this.GetAll(limit, offset, this.additional_query)
    },
    async GetAll(limit, offset, additional_query = {}) {
      try{
        let params = {
          limit: limit,
          offset: offset,
          ...additional_query
        }
        
        this.loading_data = true
        let get_data = await this.$store.dispatch(
          'library/GetAll',
          { url: `/tenants/${this.user.tenant_id}/users`, params }
        )
        this.items = get_data.data.length > 0 ? get_data.data : []
        this.total_data = get_data.dataCount ? get_data.dataCount : []
        this.loading_data = false
      }catch(ex){
        this.items = []
        this.total_data = 0
        this.loading_data = false
        this.ShowModalError(ex.message, false, this.RedirectHome)
      }
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

          this.additional_query = {};
          this.offset = 0;

          this.additional_query = {
            name: this.filter.name,
            employee_number: this.filter.employee_number,
            email: this.filter.email,
            organization_id: this.filter.organization
          };

          if(this.is_use_template){
            this.additional_query.business_unit_template_id = this.filter.business_unit
            this.additional_query.subunit_template_id = this.filter.subunit
          }else{
            this.additional_query.business_unit_id = this.filter.business_unit
            this.additional_query.subunit_id = this.filter.subunit
          }

          this.GetAll(this.limit, this.offset, this.additional_query);
        }
      }, 500);
    },
    ValidationSearch() {
      let schema = {}
      if(this.filter.name){
        schema["Name"] = {
          data: this.filter.name,
          minlength: 3,
          maxlength: 150,
        }
      }
      if(this.filter.employee_number){
        schema["Employee Number"] = {
          data: this.filter.employee_number,
          minlength: 3,
          maxlength: 15,
        }
      }
      if(this.filter.email){
        schema["Email"] =  {
          data: this.filter.email,
          type: 'email',
          minlength: 6,
          maxlength: 100,
        }
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
      if(this.filter.subunit){
        schema["Subunit"] = {
          data: this.filter.subunit,
          valid: this.options.subunit,
          valid_key: 'id'
        }
      }
      return FV.validation(schema, 'multiple')
    },
    async GetDDLOrganization() {
      try{
        let params = {}
        this.loading_ddl.organization = true
        let get_data = await this.$store.dispatch(
          'library/GetAll',
          { url: `/tenants/${this.user.tenant_id}/organizations`, params }
        )
        this.options.organization = get_data.data.length > 0 ? get_data.data : []
        this.loading_ddl.organization = false
      }catch(ex){
        this.options.organization = []
        this.loading_ddl.organization = false
      }
    },
    async GetDDLBusinessUnit() {
      try{
        let organization_id = this.filter.organization;
        
        this.filter.business_unit = ""
        this.filter.subunit = ""
        this.options.business_unit = []
        this.options.subunit = []

        if(organization_id){
          this.is_use_template = false

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
        this.filter.business_unit = ""
        this.filter.subunit = ""
        this.options.business_unit = []
        this.options.subunit = []
        this.loading_ddl.business_unit = false
      }
    },
    async GetDDLSubunit() {
      try{
        let unit_id = this.filter.business_unit;
        let organization_id = this.filter.organization;
        
        this.filter.subunit = ""
        this.options.subunit = []

        if(unit_id && organization_id){
          this.options.subunit = []
          let params = {
            business_unit_id: unit_id
          }
          this.loading_ddl.subunit = true
          let get_data = await this.$store.dispatch(
            'library/GetAll',
            { url: `/tenants/${this.user.tenant_id}/subunits`, params }
          )
          this.options.subunit = get_data.data.length > 0 ? get_data.data : []
          this.loading_ddl.subunit = false
        }
        else {
          this.GetDDLBusinessSubUnitTemplate(unit_id)
        }
      }catch(ex){
        this.filter.subunit = ""
        this.options.subunit = []
        this.loading_ddl.subunit = false
      }
    },
    async GetDDLBusinessUnitTemplate() {
      try{
        this.is_use_template = true
        let params = {}
        this.loading_ddl.business_unit = true
        let get_data = await this.$store.dispatch(
          'library/GetAll',
          { url: `/tenants/${this.user.tenant_id}/business-unit-templates`, params }
        )
        this.options.business_unit = get_data.data.length > 0 ? get_data.data : []
        this.loading_ddl.business_unit = false
      }catch(ex){
        this.filter.business_unit = ""
        this.options.business_unit = []
        this.loading_ddl.business_unit = false
      }
    },
    async GetDDLBusinessSubUnitTemplate(unit_template_id) {
      try{
        this.filter.subunit = ""
        this.options.subunit = []

        let params = {
          business_unit_template_id: unit_template_id
        }
        this.loading_ddl.subunit = true
        let get_data = await this.$store.dispatch(
          'library/GetAll',
          { url: `/tenants/${this.user.tenant_id}/subunit-templates`, params }
        )
        this.options.subunit = get_data.data.length > 0 ? get_data.data : []
        this.loading_ddl.subunit = false
      }catch(ex){
        this.filter.subunit = ""
        this.options.subunit = []
        this.loading_ddl.subunit = false
      }
    },
    OnClickItemUserList(id) {
      this.$router.push({ path: `/members/edit/${id}` });
    },
    DeleteUser(item) {
      this.ShowModalConfirm(
        HelperMessage.getMessage("message.modal.dialog.confirm", {
          name: "delete this Member",
        }),
        () => {
          this.loader = true
          this.Delete({ url: `/tenants/${this.user.tenant_id}/users/${item}`})
          .then(() => {
            this.loader = false
            this.ShowModalSuccess(
              HelperMessage.getMessage("message.modal.success.action", {
                name: "Data",
                action: "deleted"
              }),
              this.ClearFilter
            )
          })
          .catch((err) => {
            this.loader = false
            let error_code = err.error_code
            let message = err.message

            if(error_code && message){
              if(error_code === 10){
                this.ShowModalError(message, true)
              }else{
                this.ShowModalError(message, false, this.RedirectHome)
              }
            }else{
              this.ShowModalError(message, false, this.RedirectHome)
            }
          })
        }
      );
    },
    ShowModalConfirm(message, callback = () => {}) {
      this.modals.confirm.message = message;
      this.modals.confirm.callback = callback;
      this.$bvModal.show("modal-confirm");
    },
    ShowModalSuccess(message, callback = () => {}) {
      this.modals.success.message = message;
      this.modals.success.callback = callback;
      this.$bvModal.show("modal-success");
    },
    ShowModalError(message, warning = false, callback = () => {}) {
      this.modals.error.warning = warning;
      this.modals.error.message = message;
      this.modals.error.callback = callback;
      this.$bvModal.show("modal-error");
    },
    MessageNoData() {
      return HelperMessage.getMessage("message.modal.error.no_data");
    },
    ClearFilter() {
      this.filter = {
        show: this.filter.show,
        name: "",
        employee_number: "",
        email: "",
        organization: "",
        business_unit: "",
        subunit: "",
      }
      this.filter_error = {}
      this.additional_query = {}
      this.RefreshData()
    },
    OpenFilter() {
      this.filter.show = true
      this.GetDDLOrganization()
      if(!this.filter.organization){
        this.GetDDLBusinessUnitTemplate()
      }
    },
    HaveFilters() {
      let count = 0
      for (const [key, value] of Object.entries(this.additional_query)) {
        if(value){
          count += 1
        }
      }

      if(count > 0){
        return true
      }

      return false;
    },
    RefreshData() {
      this.offset = 0
      this.GetAll(this.limit, this.offset, this.additional_query)
    },
    RedirectHome() {
      this.$router.push('/')
    }
  },
};
</script>
