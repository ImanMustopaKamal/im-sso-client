<template>
  <div v-if="warning">
    <b-modal
      :id="id ? id : 'modal-error'"
      :centered="true"
      title="Warning"
      title-class="text-warning"
      :ok-only="true"
      ok-title="Close"
      ok-variant="info"
    >
      <p v-html="message"></p>
    </b-modal>
  </div>
  <div v-else>
    <b-modal
      :id="id ? id : 'modal-error'"
      :centered="true"
      title="Error"
      title-class="text-danger"
      :ok-only="true"
      ok-title="Close"
      ok-variant="danger"
      @ok="ok"
    >
      <p v-html="message"></p>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
    warning: Boolean,
    message: String,
  },
  methods: {
    ok() {
      this.$emit("ok");
    },
  },
};
</script>
