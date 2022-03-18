<!--
  - Copyright 2014-2019 the original author or authors.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg break-inside-avoid mb-6 backdrop-filter backdrop-blur-lg bg-opacity-80">
    <header
      v-if="title"
      class="flex justify-between px-4 py-5 sm:px-6"
      :class="{'sticky': headerSticksBelow}"
    >
      <h3 class="text-lg leading-6 font-medium text-gray-900" v-text="title" />

      <div>
        <slot v-if="$slots['actions']" name="actions" />
        <sba-icon-button v-if="closeable" :icon="['far', 'times-circle']" @click.stop="$emit('close', $event)" />
      </div>
    </header>
    <div v-if="$slots['default']" class="border-t border-gray-200 bg-white px-4 py-3">
      <slot />
    </div>
  </div>
</template>

<script>
  import sticksBelow from '@/directives/sticks-below';
  import SbaIconButton from './sba-icon-button';

  export default {
    components: {SbaIconButton},
    directives: {sticksBelow},
    props: {
      title: {
        type: String,
        required: true
      },
      closeable: {
        type: Boolean,
        default: false
      },
      headerSticksBelow: {
        type: Array,
        default: undefined
      }
    }
  }
</script>
