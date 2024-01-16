<template>
  <b-modal
    id="modal-loader"
    v-model="show"
    :no-close-on-backdrop="true"
    :hide-header="true"
    :hide-footer="true"
    :centered="true"
  >
    <div class="loader"></div>
  </b-modal>
</template>

<script>
export default {
  props: {
    show: Boolean,
  },
};
</script>
