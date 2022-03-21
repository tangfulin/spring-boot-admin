<template>
  <div class="col-span-6">
    <label :for="id" class="block text-sm font-medium text-gray-700" v-if="hasLabel">{{ label }}</label>
    <div class="flex rounded-md shadow-sm" :class="{'mt-1': hasLabel}">
      <span v-if="$slots.prepend"
            class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
      >
        <slot name="prepend" />
      </span>

      <input type="text" :id="id"
             :value="value"
             :placeholder="placeholder"
             @input="$event => $emit('input', $event.target.value)"
             class="focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 relative flex-1 block w-full rounded-none sm:text-sm border-gray-300"
             :class="inputFieldClassNames"
      >
      <span v-if="$slots.append"
            class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
      >
        <slot name="append" />
      </span>
    </div>
    <span v-if="$slots.info" class="mt-2 text-sm text-gray-500">
      <slot name="info" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'SbaInput',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    hasLabel() {
      return this.label !== null && this.label.trim() !== '';
    },
    id() {
      return this.name.replace(/[^\w]/gi, '')
    },
    inputFieldClassNames() {
      const hasAppend = this.hasSlot('append');
      const hasPrepend = this.hasSlot('prepend');

      const classNames = [];

      if (!hasAppend) {
        classNames.push('rounded-r-md')
      }
      if (!hasPrepend) {
        classNames.push('rounded-l-md')
      }

      return classNames;
    }
  },
  methods: {
    hasSlot(slot) {
      return !!this.$slots[slot]
        && Object.keys(this.$slots[slot]).length > 0
    }
  }
}
</script>

