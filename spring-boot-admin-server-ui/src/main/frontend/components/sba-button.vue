<template>
  <button @click="$emit('click', $event)"
          class="font-medium text-sm text-center focus:outline-none "
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
        classNames.push('rounded-md shadow-sm')
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
          classNames.push('text-gray-900 border-gray-300 border border-gray-300 bg-white focus:ring-indigo-500 focus:border-indigo-500');
          break;
      }

      return classNames.join(' ');
    }
  }
}
</script>
