<template>
  <span :class="classNames('status-badge', status)" v-text="status" />
</template>

<script>
import classNames from 'classnames';

export default {
  name: 'SbaStatusBadge',
  props: {
    /*
     * Possible values are: unknown, outofservice, up, down, offline, restricted
     */
    status: {
      type: String,
      required: true
    }
  },
  methods: {
    classNames
  },
}
</script>

<style scoped>
.status-badge {
  @apply bg-gray-200 text-black text-xs inline-flex items-center uppercase  rounded overflow-hidden px-3 py-1;
}
.up {
  @apply bg-green-200 text-green-700 ;
}
.down {
  @apply bg-red-200 text-red-700 ;
}
.restricted {
  @apply bg-yellow-200 text-yellow-700 ;
}
</style>
