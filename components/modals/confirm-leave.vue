<template>
  <b-modal
    id="modal-confirm-leave"
    :centered="true"
    ok-variant="info"
    title="Confirm"
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
    ok() {
      this.$emit("ok");
    },
  },
};
</script>
