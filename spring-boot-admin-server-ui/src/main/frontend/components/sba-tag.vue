<template>
  <span class="p-1">
    <span class="inline-flex items-center bg-white leading-none rounded p-1 shadow text-teal text-sm">
      <span class="inline-flex bg-green-200 rounded text-gray-600 h-6 px-3 justify-center items-center" v-if="label"
            v-text="label"
      />
      <span class="inline-flex px-2" v-text="value" :class="{'pl-2': !!label}" />
    </span>
  </span>
</template>
<script>
export default {
  name: 'SbaTag',
  props: {
    label: {
      type: [String, Number],
      default: null
    },
    value: {
      type: [String, Number],
      required: true
    }
  }
}
</script>
