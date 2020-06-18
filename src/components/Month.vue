<template>
  <div class="text-center mb-2">{{ year + ' / ' + month }}</div>
</template>

<script>
export default {
  props: {
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    }
  }
}
</script>

<style>
</style>
