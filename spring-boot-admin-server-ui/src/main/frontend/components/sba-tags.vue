<!--
  - Copyright 2014-2018 the original author or authors.
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
  <div v-if="hasTags">
    <span v-for="(value, key) in tags" :key="key">
      <span class="p-1">
        <div class="inline-flex items-center bg-white leading-none rounded p-1 shadow text-teal text-sm">
          <span class="inline-flex bg-green-200 rounded text-gray-600 h-6 px-3 justify-center items-center" v-text="key" />
          <span class="inline-flex px-2 pl-2" v-text="value" />
        </div>
      </span>
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      tags: {
        type: Object,
        required: true
      }
    },
    computed: {
      hasTags() {
        return Object.keys(this.tags).length > 0;
      }
    }
  }
</script>
