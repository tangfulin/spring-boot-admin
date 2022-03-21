<template>
  <section :class="{'loading': loading}">
    <slot name="before" />

    <div class="px-6 py-6">
      <sba-alert class="mb-6" v-if="error" :error="error" :title="$t('term.fetch_failed')" />

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
    },
    error: {
      type: Error,
      default: null
    }
  }
}
</script>

<style scoped>

</style>
