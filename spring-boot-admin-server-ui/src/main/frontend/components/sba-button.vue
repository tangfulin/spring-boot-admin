<template>
  <button @click="$emit('click', $event)"
          class="focus:ring-4 font-medium text-sm text-center"
          :class="classNames"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'SbaButton',
  props: {
    type: {
      type: String,
      default: ''
    },
    flat: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    classNames() {
      const classNames = [];

      if (!this.flat) {
        classNames.push('rounded')
      }

      switch (this.size) {
        case 'sm':
          classNames.push('px-3 py-1')
          break;
        case '':
        default:
          classNames.push('px-5 py-2.5')
      }

      switch (this.type) {
        case 'primary':
          classNames.push('text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300');
          break;
        case 'danger':
          classNames.push('text-white bg-red-600 hover:bg-red-700 focus:ring-red-300');
          break;
        case '':
        default:
          classNames.push('text-gray-900 border-gray-300 border bg-white hover:bg-gray-100 focus:ring-blue-300');
          break;
      }

      return classNames.join(' ');
    }
  }
}
</script>
