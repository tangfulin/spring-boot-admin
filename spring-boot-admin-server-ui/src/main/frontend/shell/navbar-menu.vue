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
  <Menu
    as="div"
    class="relative"
  >
    <MenuButton
      :as="buttonType"
      class="inline-flex items-center rounded-md text-gray-300 hover:bg-gray-700 hover:text-white rounded-md text-sm font-medium px-2"
      :class="{'py-2': !$slots.default, '': menuItems.length <= 0}"
      :open="open"
    >
      <slot>
        {{ label }}
      </slot>
      <svg
        v-if="menuItems.length > 0"
        class="h-5 w-5 cursor-pointer"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        />
      </svg>
    </MenuButton>

    <transition
      v-if="menuItems.length > 0"
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <MenuItems
        class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="px-1 py-1">
          <slot name="menuItems">
            <MenuItem
              v-for="menuItem in menuItems"
              :key="menuItem.label"
            >
              <button
                class="flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                @click="$emit('click', menuItem)"
                v-text="menuItem.label"
              />
            </MenuItem>
          </slot>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script>
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'

export default {
  components: {Menu, MenuButton, MenuItem, MenuItems},
  props: {
    label: {type: String, default: ""},
    buttonType: {type: String, default: "button"},
    menuItems: {type: Array, default: () => []}
  },
  emits: ['click'],
  data() {
    return {
      open: false
    }
  },
  methods: {
    mouseover(e) {
      console.log(e);
    }
  }
}
</script>
