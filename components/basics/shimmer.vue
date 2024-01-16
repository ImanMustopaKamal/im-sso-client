<template>
  <tbody>
    <tr v-for="index_row in row" :key="index_row">
      <td v-for="index_column in column" :key="index_column" class="comment-center">
        <div class="comment animate br"></div>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  props: {
    row: {
      type: Number,
      default: 3,
    },
    column: {
      type: Number,
      default: 5,
    },
  }
}
</script>