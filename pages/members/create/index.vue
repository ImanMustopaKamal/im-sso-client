<template>
  <div class="container mt-5">
    <section class="section">
      <div class="section-body">
        <div class="layout-title">
          <h2 class="section-title">Add Member</h2>
          <div class="breadcrumb-custom">
            <div class="breadcrumb-item active">
              <nuxt-link :to="{ name: 'index' }">Home</nuxt-link>
            </div>
            <div class="breadcrumb-item">
              <nuxt-link :to="{ name: 'members' }">Members</nuxt-link>
            </div>
            <div class="breadcrumb-item">Add Member</div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card">
              <form @submit.prevent="OnSubmit" method="POST">
              <div class="card-body">
                <div class="form-row">
                  <div class="col">
                    <div class="form-group">
                      <label>Name
                        <span class="text-danger">*</span>
                      </label>
                      <input type="text" class="form-control" v-model="form.name" required/>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label>Email
                        <span class="text-danger">*</span>
                      </label>
                      <input type="Email" class="form-control" v-model="form.email" required/>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="col">
                    <div class="form-group">
                      <label>Employee Number</label>
                      <input type="text" class="form-control" v-model="form.employee_number"/>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label>Phone number</label>
                      <input type="text" class="form-control" v-model="form.phone_number"/>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="col">
                    <div class="form-group">
                      <label>Organization
                        <span class="text-danger">*</span>
                      </label>
                      <v-select
                        :loading="loading_ddl.organization"
                        v-model="form.organization"
                        :options="options.organization"
                        label="name"
                        placeholder="--Select--"
                        :reduce="(key) => key.id"
                        @input="GetDDLBusinessUnit()"
                        :required="true"
                      >
                        <template #spinner="{ loading }">
                          <div
                            v-if="loading"
                            style="border-left-color: rgba(88, 151, 251, 0.71)"
                            class="vs__spinner"
                          ></div>
                        </template>
                        <template #search="{ attributes, events }">
                          <input
                            class="vs__search"
                            :required="!form.organization"
                            v-bind="attributes"
                            v-on="events"
                          />
                        </template>
                      </v-select>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label>Business Unit</label>
                      <v-select
                        :loading="loading_ddl.business_unit"
                        v-model="form.business_unit"
                        :options="options.business_unit"
                        label="name"
                        placeholder="--Select--"
                        :reduce="(key) => key.id"
                        @input="GetDDLSubunit()"
                      >
                        <template #spinner="{ loading }">
                          <div
                            v-if="loading"
                            style="border-left-color: rgba(88, 151, 251, 0.71)"
                            class="vs__spinner"
                          ></div>
                        </template>
                      </v-select>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="col">
                    <div class="form-group">
                      <label>Subunit</label>
                      <v-select
                        :loading="loading_ddl.subunit"
                        v-model="form.subunit"
                        :options="options.subunit"
                        label="name"
                        placeholder="--Select--"
                        :reduce="(key) => key.id"
                      >
                        <template #spinner="{ loading }">
                          <div
                            v-if="loading"
                            style="border-left-color: rgba(88, 151, 251, 0.71)"
                            class="vs__spinner"
                          ></div>
                        </template>
                      </v-select>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label>Status
                        <span class="text-danger">*</span>
                      </label>
                      <v-select
                        :loading="loading_ddl.status"
                        v-model="form.status"
                        :options="options.status"
                        label="name"
                        placeholder="--Select--"
                        :reduce="(key) => key.id"
                        :required="true"
                      >
                        <template #spinner="{ loading }">
                          <div
                            v-if="loading"
                            style="border-left-color: rgba(88, 151, 251, 0.71)"
                            class="vs__spinner"
                          ></div>
                        </template>
                        <template #search="{ attributes, events }">
                          <input
                            class="vs__search"
                            :required="!form.status"
                            v-bind="attributes"
                            v-on="events"
                          />
                        </template>
                      </v-select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer text-right">
                <button
                class="btn btn-primary"
                type="submit"
                >
                  Submit
                </button>
              </div>
              </form>
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="ConfirmLeave()"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </section>
    <modal-loader :show="loader" />
    <modal-confirm
      :message="modals.confirm.message"
      @ok="modals.confirm.callback"
    />
    <modal-confirm-leave
      :message="modals.confirm_leave.message"
      @ok="OkLeave()"
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
import { VueSelect } from "vue-select";
import { mapActions, mapState } from 'vuex';
import ModalLoader from "@/components/modals/loader";
import ModalConfirm from "@/components/modals/confirm";
import ModalConfirmLeave from "@/components/modals/confirm-leave";
import ModalError from "@/components/modals/error";
import ModalSuccess from "@/components/modals/success";
import HelperMessage from "@/helpers/messages";
import FV from '@/helpers/form_validation';
export default {
  components: {
    "v-select": VueSelect,
    "modal-confirm": ModalConfirm,
    "modal-confirm-leave": ModalConfirmLeave,
    "modal-loader": ModalLoader,
    "modal-error": ModalError,
    "modal-success": ModalSuccess,
  },
  head() {
    return {
      title: "Add Member",
    };
  },
  data() {
    return {
      loading_ddl: {
        organization: false,
        business_unit: false,
        subunit: false,
        status: false
      },
      options: {
        organization: [],
        business_unit: [],
        subunit: [],
        status: []
      },
      form: {
        name: "",
        employee_number: "",
        phone_number: "",
        email: "",
        organization: "",
        business_unit: "",
        subunit: "",
        status: ""
      },
      modals: {
        confirm: {
          message: "",
          callback: () => {},
        },
        confirm_leave: {
          message: HelperMessage.getMessage("message.modal.dialog.leave"),
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
    
    this.GetDDLOrganization();
    this.GetDDLStatus();
  },
  methods: {
    ...mapActions('library', ['Insert']),
    async GetDDLStatus() {
      try{
        let params = {}
        this.loading_ddl.status = true
        let get_data = await this.$store.dispatch(
          'library/GetAll',
          { url: '/user-status', params }
        )
        this.options.status = get_data.data.length > 0 ? get_data.data : []
        this.loading_ddl.status = false
      }catch(ex){
        this.options.status = []
        this.loading_ddl.status = false
      }
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
        let organization_id = this.form.organization;
        
        this.form.business_unit = ""
        this.form.subunit = ""
        this.options.business_unit = []
        this.options.subunit = []

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
        this.form.business_unit = ""
        this.form.subunit = ""
        this.options.business_unit = []
        this.options.subunit = []
        this.loading_ddl.business_unit = false
      }
    },
    async GetDDLSubunit() {
      try{
        let unit_id = this.form.business_unit;
        
        this.form.subunit = ""
        this.options.subunit = []

        if(unit_id){
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
      }catch(ex){
        this.form.subunit = ""
        this.options.subunit = []
        this.loading_ddl.subunit = false
      }
    },
    validation(){
      let schema = {
        "Name": {
          data: this.form.name,
          minlength: 3,
          maxlength: 150,
          required: true,
        },
        'Email': {
          data: this.form.email,
          type: 'email',
          minlength: 6,
          maxlength: 100,
          required: true,
        },
        'Employee Number': {
          data: this.form.employee_number,
          type: 'alphanum_no_space',
          minlength: 3,
          maxlength: 15
        },
        'Phone Number': {
          data: this.form.phone_number,
          type: 'phone',
          minlength: 3,
          maxlength: 15
        },
        'Organization': {
          data: this.form.organization,
          required: true,
          valid: this.options.organization,
          valid_key: 'id'
        },
        'Business Unit': {
          data: this.form.business_unit,
          valid: this.options.business_unit,
          valid_key: 'id'
        },
        'Subunit': {
          data: this.form.subunit,
          valid: this.options.subunit,
          valid_key: 'id'
        },
        'Status': {
          data: this.form.status,
          required: true,
          valid: this.options.status,
          valid_key: 'id'
        },
      }

      return FV.validation(schema, 'single')
    },
    OnSubmit(){
      let do_validation = this.validation()
      if (do_validation) {
        this.ShowModalError(do_validation, true)
      } else {
        this.ShowModalConfirm(
          HelperMessage.getMessage("message.modal.dialog.add", {
            name: "Member",
          }),
          this.PostData
        );
      }
    },
    PostData(){
      this.loader = true

      let phone = this.form.phone_number ? Number(this.form.phone_number) : ''
      if(phone) {
        phone = phone.toString()

        if(phone[0] == 6 && phone[1] == 2){
          phone = '+' + phone
        }
        if(phone[0] == 8){
          phone = '+62' + phone
        }
      }

      let data = {
        name: this.form.name,
        employee_number: this.form.employee_number,
        phone: phone,
        email: this.form.email,
        organization_id: this.form.organization,
        business_unit_id: this.form.business_unit,
        subunit_id: this.form.subunit,
        user_status_id: this.form.status
      }
      this.Insert({ url: `/tenants/${this.user.tenant_id}/users`, request_body: data })
      .then(() => {
        this.loader = false
        this.ShowModalSuccess(
          HelperMessage.getMessage("message.modal.success.action", {
            name: "Data",
            action: "added"
          }),
          this.OkLeave
        )
      })
      .catch((err) => {
        this.loader = false
        let error_code = err.error_code
        let message = err.message

        if(error_code && message){
          if(error_code === 10 || error_code === 16){
            this.ShowModalError(message, true)
          }else{
            this.ShowModalError(message, false, this.RedirectHome)
          }
        }else{
          this.ShowModalError(message, false, this.RedirectHome)
        }
      })
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
    ConfirmLeave() {
      this.$bvModal.show("modal-confirm-leave");
    },
    OkLeave() {
      this.$router.push({ name: "members" });
    },
    RedirectHome() {
      this.$router.push('/')
    }
  },
};
</script>
