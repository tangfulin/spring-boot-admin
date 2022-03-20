<template>
  <span class="text-xs inline-flex items-center leading-sm uppercase bg-green-200 text-green-700 rounded overflow-hidden px-3 py-1">{{ status }}</span>
</template>

<script>
export default {
  name: 'SbaStatusBadge',
  props: {
    status: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
