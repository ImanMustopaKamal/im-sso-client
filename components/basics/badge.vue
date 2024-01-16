<template>
  <span :class="'badge custom-' + id + (fullwidth ? ' w-100' : '')" :style="Style()">{{
    name
  }}</span>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    fullwidth: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: "",
    },
  },
  methods: {
    Style() {
      if (this.color) {
        return `background-color: ${this.color}`
      }
    }
  }
};
</script>
