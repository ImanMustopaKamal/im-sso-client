<template>
  <input
    type="text"
    :class="classes"
    :value="formattedValue"
    @input="updateValue"
    @blur="updateFormattedValue"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
    classes: {
      type: String,
      default: 'form-control',
    },
  },
  computed: {
    formattedValue() {
      if (this.value) {
        return this.value.toLocaleString().replace(/,/g, ".");
      } else {
        return "";
      }
    },
  },
  methods: {
    updateValue(event) {
      const value = parseInt(event.target.value.replace(/\D/g, ""), 10);
      if (isNaN(value)) {
        this.$emit("input", null);
      } else {
        this.$emit("input", value);
      }
    },
    updateFormattedValue(event) {
      const value = parseInt(event.target.value.replace(/\D/g, ""), 10);
      if (isNaN(value)) {
        this.$emit("input", null);
      } else {
        this.$emit("input", value);
      }
      event.target.value = this.formattedValue;
    },
  },
};
</script>
