<template>
  <b-modal
    id="modal-success"
    :ok-only="true"
    ok-title="Close"
    ok-variant="info"
    :centered="true"
    title="Success"
    title-class="text-success"
    @hidden="hidden"
    @ok="ok()"
  >
    <p v-html="message"></p>
  </b-modal>
</template>

<script>
export default {
  props: {
    message: String,
  },
  methods: {
    hidden() {
      this.$emit("hidden");
    },
    ok() {
      this.$emit("ok");
    },
  },
};
</script>
