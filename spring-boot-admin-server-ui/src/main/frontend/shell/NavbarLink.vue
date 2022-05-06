<template>
  <a
    v-if="view.href"
    :key="view.name"
    :href="view.href"
    target="_blank"
    class="flex w-full items-center rounded-md px-3 py-2 text-sm"
    rel="noopener noreferrer"
  >
    <component :is="view.handle" />
  </a>
  <router-link
    v-else
    :key="view.name"
    active-class="font-bold"
    class="flex w-full items-center rounded-md px-3 py-2 text-sm"
    :to="{name: view.name}"
  >
    <component
      :is="view.handle"
      :applications="applications"
      :error="error"
    />
  </router-link>
</template>

<script>
export default {
  name: 'NavbarLink',
  props: {
    applications: {
      type: Array,
      default: () => [],
    },
    error: {
      type: Error,
      default: null
    },
    view: {
      type: Object,
      required: true
    }
  }
}
</script>
