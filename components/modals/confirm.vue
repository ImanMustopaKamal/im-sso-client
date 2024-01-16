<template>
  <b-modal
    :id="id ? id : 'modal-confirm'"
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
    id: {
      type: String,
      default: "",
    },
    message: String,
  },
  methods: {
    ok() {
      this.$emit("ok");
    },
  },
};
</script>
