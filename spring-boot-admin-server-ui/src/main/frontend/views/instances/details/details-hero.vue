<template>
  <div class=" px-6 py-10">
    <div class="m-auto text-center">
      <div>
        <h1 class="text-4xl text-center font-bold text-gray-900 tracking-tight" v-text="instance.registration.name" />
        <small><em v-text="instance.id" /></small>
      </div>
    </div>
    <sba-tags v-if="instance" :tags="instance.tags" />
  </div>
</template>

<script>
import Instance from '@/services/instance';

export default {
  name: 'DetailsHero',
  props: {
    instance: {
      type: Instance,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
