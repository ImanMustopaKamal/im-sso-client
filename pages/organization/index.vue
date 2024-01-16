<template>
  <div class="m-5">
    <section class="section">
      <div class="section-body">
        <div class="row">
          <div class="col-2">
            <ul class="nav flex-column nav-pills">
              <li class="nav-item">
                <a class="nav-link" 
                :class="active_menu == 'organization' ? 'active' : ''" 
                @click="ActiveMenu('organization')"
                >Organization</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" 
                :class="active_menu == 'unit' ? 'active' : ''" 
                @click="ActiveMenu('unit')"
                >Business Unit</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" 
                :class="active_menu == 'subunit' ? 'active' : ''" 
                @click="ActiveMenu('subunit')"
                >Business Subunit</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" 
                :class="active_menu == 'unit_template' ? 'active' : ''" 
                @click="ActiveMenu('unit_template')"
                >Business Unit Template</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" 
                :class="active_menu == 'subunit_template' ? 'active' : ''" 
                @click="ActiveMenu('subunit_template')"
                >Business Subunit Template</a>
              </li>
            </ul>
          </div>
          <div class="col-10">
            <OrganizationView 
            ref="organization_view"
            v-if="active_menu == 'organization'"
            :additional_query="additional_query"
            @OpenFilter="OpenFilter"
            @ClearFilter="ClearFilter"
            @Confirm="ShowModalConfirm"
            @Success="ShowModalSuccess"
            @Error="ShowModalError"
            @ShowLoader="ShowLoader"
            @Modal="ShowModal"/>
            <UnitView 
            ref="unit_view"
            v-if="active_menu == 'unit'"
            :additional_query="additional_query"
            @OpenFilter="OpenFilter"
            @ClearFilter="ClearFilter"
            @Confirm="ShowModalConfirm"
            @Success="ShowModalSuccess"
            @Error="ShowModalError"
            @ShowLoader="ShowLoader"
            @Modal="ShowModal"/>
            <SubunitView 
            ref="subunit_view"
            v-if="active_menu == 'subunit'"
            :additional_query="additional_query"
            @OpenFilter="OpenFilter"
            @ClearFilter="ClearFilter"
            @Confirm="ShowModalConfirm"
            @Success="ShowModalSuccess"
            @Error="ShowModalError"
            @ShowLoader="ShowLoader"
            @Modal="ShowModal"/>
            <UnitTemplateView 
            ref="unit_template_view"
            v-if="active_menu == 'unit_template'"
            :additional_query="additional_query"
            @OpenFilter="OpenFilter"
            @ClearFilter="ClearFilter"
            @Confirm="ShowModalConfirm"
            @Success="ShowModalSuccess"
            @Error="ShowModalError"
            @ShowLoader="ShowLoader"
            @Modal="ShowModal"/>
            <SubunitTemplateView 
            ref="subunit_template_view"
            v-if="active_menu == 'subunit_template'"
            :additional_query="additional_query"
            @OpenFilter="OpenFilter"
            @ClearFilter="ClearFilter"
            @Confirm="ShowModalConfirm"
            @Success="ShowModalSuccess"
            @Error="ShowModalError"
            @ShowLoader="ShowLoader"
            @Modal="ShowModal"/>
          </div>
        </div>
      </div>
    </section>
    <b-sidebar
      v-model="show_filter"
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
            @click="show_filter = false"
          >
            <i class="fa fa-times"></i>
          </a>
        </div>
        <br />
        <OrganizationFilter 
        v-if="active_menu == 'organization' && show_filter == true" 
        :additional_query="additional_query"
        @SetFilter="SetFilter"
        />
        <UnitFilter 
        v-if="active_menu == 'unit' && show_filter == true" 
        :additional_query="additional_query"
        @SetFilter="SetFilter"
        />
        <SubunitFilter 
        v-if="active_menu == 'subunit' && show_filter == true" 
        :additional_query="additional_query"
        @SetFilter="SetFilter"
        />
        <UnitTemplateFilter 
        v-if="active_menu == 'unit_template' && show_filter == true" 
        :additional_query="additional_query"
        @SetFilter="SetFilter"
        />
        <SubunitTemplateFilter 
        v-if="active_menu == 'subunit_template' && show_filter == true" 
        :additional_query="additional_query"
        @SetFilter="SetFilter"
        />
      </div>
    </b-sidebar>
    <OrganizationModal 
    v-if="active_menu == 'organization'" 
    ref="organization_modal"
    @Confirm="ShowModalConfirm"
    @Success="ShowModalSuccess"
    @Error="ShowModalError"
    @ShowLoader="ShowLoader"
    @SetFilter="SetFilter"
    />
    <UnitModal 
    v-if="active_menu == 'unit'" 
    ref="unit_modal"
    @Confirm="ShowModalConfirm"
    @Success="ShowModalSuccess"
    @Error="ShowModalError"
    @ShowLoader="ShowLoader"
    @SetFilter="SetFilter"
    />
    <SubunitModal 
    v-if="active_menu == 'subunit'" 
    ref="subunit_modal"
    @Confirm="ShowModalConfirm"
    @Success="ShowModalSuccess"
    @Error="ShowModalError"
    @ShowLoader="ShowLoader"
    @SetFilter="SetFilter"
    />
    <UnitTemplateModal 
    v-if="active_menu == 'unit_template'" 
    ref="unit_template_modal"
    @Confirm="ShowModalConfirm"
    @Success="ShowModalSuccess"
    @Error="ShowModalError"
    @ShowLoader="ShowLoader"
    @SetFilter="SetFilter"
    />
    <SubunitTemplateModal 
    v-if="active_menu == 'subunit_template'" 
    ref="subunit_template_modal"
    @Confirm="ShowModalConfirm"
    @Success="ShowModalSuccess"
    @Error="ShowModalError"
    @ShowLoader="ShowLoader"
    @SetFilter="SetFilter"
    />
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
import { mapState } from "vuex";
import OrganizationView from "@/components/view/organization/index.vue";
import OrganizationFilter from "@/components/view/organization/filter.vue";
import OrganizationModal from "@/components/view/organization/modal.vue";
import UnitView from "@/components/view/unit/index.vue";
import UnitFilter from "@/components/view/unit/filter.vue";
import UnitModal from "@/components/view/unit/modal.vue";
import SubunitView from "@/components/view/subunit/index.vue";
import SubunitFilter from "@/components/view/subunit/filter.vue";
import SubunitModal from "@/components/view/subunit/modal.vue";
import UnitTemplateView from "@/components/view/unit_template/index.vue";
import UnitTemplateFilter from "@/components/view/unit_template/filter.vue";
import UnitTemplateModal from "@/components/view/unit_template/modal.vue";
import SubunitTemplateView from "@/components/view/subunit_template/index.vue";
import SubunitTemplateFilter from "@/components/view/subunit_template/filter.vue";
import SubunitTemplateModal from "@/components/view/subunit_template/modal.vue";
import ModalLoader from "@/components/modals/loader";
import ModalConfirm from "@/components/modals/confirm";
import ModalError from "@/components/modals/error";
import ModalSuccess from "@/components/modals/success";
export default {
  head() {
    return {
      title: "Organization",
    };
  },
  components: {
    OrganizationView,
    OrganizationFilter,
    OrganizationModal,
    UnitView,
    UnitFilter,
    UnitModal,
    SubunitView,
    SubunitFilter,
    SubunitModal,
    UnitTemplateView,
    UnitTemplateFilter,
    UnitTemplateModal,
    SubunitTemplateView,
    SubunitTemplateFilter,
    SubunitTemplateModal,
    "modal-loader": ModalLoader,
    "modal-error": ModalError,
    "modal-success": ModalSuccess,
    "modal-confirm": ModalConfirm,
  },
  data() {
    return {
      active_menu: 'organization',
      show_filter: false,
      additional_query: {},
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
      loader: false
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth,
    }),
  },
  async mounted() {
    await this.$store.dispatch('accessPage', {
      page: 'organization',
    })

    this.ActiveMenu('organization')
  },
  methods: {
    ActiveMenu(menu){
      this.active_menu = menu
      this.ClearFilter()
    },
    SetFilter(ref, data){
      this.additional_query = data
      let limit = this.$refs[ref].limit
      this.$refs[ref].GetAll(limit, 0, data)
    },
    OpenFilter(state) {
      this.show_filter = state
    },
    ClearFilter() {
      this.additional_query = {}
    },
    ShowModal(ref, state, id = null){
      this.$refs[ref].ShowModal(state, id)
    },
    ShowLoader(state) {
      this.loader = state
    },
    HideLoader() {
      this.loader = false
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
  },
};
</script>
