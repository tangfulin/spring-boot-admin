<template>
  <section :class="{'loading': loading}">
    <slot name="before" />

    <div class="px-6 py-6">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  name: 'SbaInstanceSection',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>
