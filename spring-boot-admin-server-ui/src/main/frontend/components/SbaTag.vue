<template>
  <span class="p-1">
    <div class="inline-flex items-center bg-white leading-none rounded p-1 shadow text-teal text-sm">
      <span class="inline-flex bg-green-200 rounded text-gray-600 h-6 px-3 justify-center items-center" v-if="label"
            v-text="label"
      />
      <span class="inline-flex px-2 pl-2" v-text="value" />
    </div>
  </span>
</template>
<script>
export default {
  name: 'SbaTag',
  props: {
    label: {
      type: String,
      default: null
    },
    value: {
      type: String,
      required: true
    }
  }
}
</script>
