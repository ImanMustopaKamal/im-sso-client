<template>
  <div class="card">
    <div class="card-header justify-content-between">
      <div class="card-header-action">
        <button
        class="btn btn-primary"
        @click="()=>{
          this.$emit('Modal', 'subunit_modal', true)
        }">
        Add New Business Subunit
        </button>
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
            <th class="text-center">Organization</th>
            <th class="text-center">Business Unit</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <template v-if="loading_data">
          <Shimmer :row="5" :column="5" />
        </template>
        <template v-else>
          <tbody v-if="items.length > 0">
            <tr
              v-for="item in items"
              :key="item.id"
              @click="OnClickItemSubunitList(item.id)"
            >
              <td class="text-center">{{ item.id }}</td>
              <td>{{ item.name ? item.name : "N/A" }}</td>
              <td>{{ item.organization_name ? item.organization_name : "N/A" }}</td>
              <td>{{ item.business_unit_name ? item.business_unit_name : "N/A" }}</td>
              <td class="text-center">
                <a
                  href="javascript:void(0)"
                  title="Delete"
                  @click="
                    (e) => {
                      e.stopPropagation();
                      DeleteUnit(item.id);
                    }
                  "
                  ><i class="fas fa-trash"></i>
                </a>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td class="text-center" colspan="5">
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
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Paging from "@/components/pagination/paging";
import Shimmer from "@/components/basics/shimmer";
import HelperMessage from "@/helpers/messages";
export default {
  props: {
    additional_query: Object,
  },
  components: {
    Shimmer,
    paging: Paging,
  },
  data() {
    return {
      loading_data: false,
      items: [],
      limit: 10,
      offset: 0,
      total_data: 0,
      loader: false
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
    }),
  },
  mounted(){
    this.GetAll(this.limit, 0, this.additional_query);
  },
  methods: {
    ...mapActions('library', ['Delete']),
    GoToPage(limit, offset) {
      this.limit = limit;
      this.offset = offset;
      this.GetAll(limit, offset, this.additional_query);
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
          { url: `/tenants/${this.user.tenant_id}/subunits`, params }
        )
        this.items = get_data.data.length > 0 ? get_data.data : []
        this.total_data = get_data.dataCount ? get_data.dataCount : []
        this.loading_data = false
      }catch(ex){
        this.items = []
        this.total_data = 0
        this.loading_data = false
        this.$emit('Error', ex.message, false, this.RedirectHome)
      }
    },
    OnClickItemSubunitList(id){
      this.$emit('Modal', 'subunit_modal', true, id)
    },
    DeleteUnit(item) {
      this.$emit(
        'Confirm', 
        HelperMessage.getMessage("message.modal.dialog.confirm", {
          name: "delete this Business Subunit",
        }),
        () => {
          this.$emit('ShowLoader', true)
          this.Delete({ url: `/tenants/${this.user.tenant_id}/subunits/${item}`})
          .then(() => {
            this.$emit('ShowLoader', false)
            this.$emit(
              'Success',
              HelperMessage.getMessage("message.modal.success.action", {
                name: "Data",
                action: "deleted"
              }),
              this.ClearFilter
            )
          })
          .catch((err) => {
            this.$emit('ShowLoader', false)
            let error_code = err.error_code
            let message = err.message

            if(error_code && message){
              if(error_code === 10){
                this.$emit('Error', message, true)
              }else{
                this.$emit('Error', message, false, this.RedirectHome)
              }
            }else{
              this.$emit('Error', message, false, this.RedirectHome)
            }
          })
        }
      )
    },
    MessageNoData() {
      return HelperMessage.getMessage("message.modal.error.no_data");
    },
    OpenFilter() {
      this.$emit('OpenFilter', true)
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
    ClearFilter() {
      this.$emit('ClearFilter')
      this.GetAll(this.limit, 0, {});
    },
    RedirectHome() {
      this.$router.push('/')
    }
  },
};
</script>
