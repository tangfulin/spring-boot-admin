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
  <div class="relative">
    <button
      @click="showLanguages = !showLanguages"
      class="inline-flex justify-center w-full rounded-md text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    >
      {{ selectedLanguage.label }}
      <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
           fill="currentColor" aria-hidden="true"
      >
        <path
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        />
      </svg>
    </button>

    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showLanguages"
        v-on-clickaway="() => showLanguages = false"
        class="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
      >
        <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
            <button class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                    v-for="language in languages"
                    :key="language.locale"
                    @click="localeChanged(language.locale)"
            >
              {{ language.label }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

import {directive as onClickaway} from 'vue-clickaway2';

export default {
  props: {
    availableLocales: {type: Array, required: true},
    currentLocale: {type: String, required: true}
  },
  data() {
    return {
      showLanguages: false
    }
  },
  directives: {onClickaway},
  computed: {
    selectedLanguage() {
      return this.mapLocale(this.currentLocale);
    },
    languages() {
      return this.availableLocales.map(this.mapLocale);
    }
  },
  methods: {
    localeChanged(selectedLocale) {
      if (selectedLocale !== this.currentLocale) {
        this.showLanguages = !this.showLanguages;
        this.$emit('localeChanged', selectedLocale)
      }
    },
    mapLocale(locale) {
      try {
        let languageTag = locale.split('-').reverse().pop();
        let regionTag = locale.split('-').length > 1 ? `-${locale.split('-').pop()}` : ''

        if (locale.toLowerCase().startsWith('zh')) {
          if (locale.endsWith('CN')) {
            regionTag = '-Hans'
          }
          if (locale.endsWith('TW')) {
            regionTag = '-Hant'
          }
        }

        let translatedLanguageNames = new Intl.DisplayNames([locale], {type: 'language'});
        let label = translatedLanguageNames.of(`${languageTag}${regionTag}`);

        if (label?.toUpperCase() === 'UNKNOWN REGION') {
          label = locale;
        }

        return {
          locale,
          label
        };
      } catch (e) {
        return {
          locale,
          label: locale
        };
      }
    }
  }
}
</script>

<style scoped>

</style>
