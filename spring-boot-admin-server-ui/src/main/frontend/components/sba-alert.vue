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
  <div class="border-t-4 rounded-b px-4 py-3 shadow-md" :class="alertClass" role="alert" v-if="hasError">
    <div class="flex">
      <div class="py-1">
        <svg class="fill-current h-6 w-6 mr-4" :class="textColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" /></svg>
      </div>
      <div>
        <p class="font-bold" v-text="title" />
        <p class="text-sm" v-text="error.message" />
      </div>
    </div>
  </div>
</template>

<script>
export const Severity = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
};

export default {
  name: 'SbaAlert',
  props: {
    title: {
      type: String,
      required: true
    },
    error: {
      type: Error,
      default: null
    },
    severity: {
      type: String,
      default: 'ERROR'
    }
  },
  data() {
    return {
      alertClass: {
        'bg-red-100 border-red-400 text-red-700': this.severity.toUpperCase() === Severity.ERROR,
        'bg-orange-100 border-orange-500 text-orange-700': this.severity.toUpperCase() === Severity.WARN,
        'bg-blue-100 border-blue-500 text-blue-900': this.severity.toUpperCase() === Severity.INFO,
        'bg-teal-100 border-teal-500 text-teal-900': this.severity.toUpperCase() === Severity.SUCCESS,
      },
      textColor: {
        'text-red-700': this.severity.toUpperCase() === Severity.ERROR,
        'text-orange-700': this.severity.toUpperCase() === Severity.WARN,
        'text-blue-900': this.severity.toUpperCase() === Severity.INFO,
        'text-teal-900': this.severity.toUpperCase() === Severity.SUCCESS,
      }
    }
  },
  computed: {
    hasError() {
      return this.error !== undefined && this.error !== null;
    }
  }
}
</script>
