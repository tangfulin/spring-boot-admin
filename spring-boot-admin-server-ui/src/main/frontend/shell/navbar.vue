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
  <nav class="bg-black fixed top-0 w-full h-14 z-50">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14">
        <div class="flex items-center">
          <div class="flex items-center flex-shrink-0 text-white mr-6">
            <router-link class="brand" to="/" v-html="brand" />
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <template v-for="view in enabledViews">
                <a
                  v-if="view.href"
                  :key="view.name"
                  :href="view.href"
                  class="navbar-item"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <component :is="view.handle" />
                </a>
                <router-link
                  v-else
                  :key="view.name"
                  :to="{name: view.name}"
                  class="navbar-item"
                >
                  <component :is="view.handle" :applications="applications" :error="error" />
                </router-link>
              </template>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <navbar-item-language-selector v-if="availableLocales.length > 1" :current-locale="$i18n.locale"
                                           :available-locales="availableLocales"
                                           @localeChanged="changeLocale"
            />

            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div>
                <button type="button"
                        class="h-8 w-8 max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        id="user-menu-button" aria-expanded="false" aria-haspopup="true"
                >
                  <span class="sr-only">Open user menu</span>
                  <img class="rounded-full"
                       src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                       alt=""
                  >
                </button>
              </div>

              <!--
                Dropdown menu, show/hide based on menu state.

                Entering: "transition ease-out duration-100"
                  From: "transform opacity-0 scale-95"
                  To: "transform opacity-100 scale-100"
                Leaving: "transition ease-in duration-75"
                  From: "transform opacity-100 scale-100"
                  To: "transform opacity-0 scale-95"
              -->
            </div>
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <button type="button"
                  class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  aria-controls="mobile-menu" aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <!--
              Heroicon name: outline/menu

              Menu open: "hidden", Menu closed: "block"
            -->
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!--
              Heroicon name: outline/x

              Menu open: "block", Menu closed: "hidden"
            -->
            <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div class="md:hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <a href="#" class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
           aria-current="page"
        >Dashboard</a>

        <a href="#"
           class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >Team</a>

        <a href="#"
           class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >Projects</a>

        <a href="#"
           class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >Calendar</a>

        <a href="#"
           class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >Reports</a>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-700">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <img class="h-10 w-10 rounded-full"
                 src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                 alt=""
            >
          </div>
          <div class="ml-3">
            <div class="text-base font-medium leading-none text-white">
              Tom Cook
            </div>
            <div class="text-sm font-medium leading-none text-gray-400">
              tom@example.com
            </div>
          </div>
          <button type="button"
                  class="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            <span class="sr-only">View notifications</span>
            <!-- Heroicon name: outline/bell -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
        <div class="mt-3 px-2 space-y-1 is-hidden bg-gray-100">
          <a href="#"
             class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
          >Your
            Profile</a>

          <a href="#"
             class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
          >Settings</a>

          <a href="#"
             class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
          >Sign
            out</a>
        </div>
      </div>
    </div>
  </nav>
  <!--
  <nav id="navigation" class="navbar is-fixed-top">
    <div class="container">
      <div class="navbar-brand">
        <router-link class="navbar-item logo" to="/" v-html="brand" />

        <div class="navbar-burger burger" @click.stop="showMenu = !showMenu">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div class="navbar-menu" :class="{'is-active' : showMenu}">
        <div class="navbar-end">
          <template v-for="view in enabledViews">
            <a
              v-if="view.href"
              :key="view.name"
              :href="view.href"
              class="navbar-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <component :is="view.handle" />
            </a>
            <router-link
              v-else
              :key="view.name"
              :to="{name: view.name}"
              class="navbar-item"
            >
              <component :is="view.handle" :applications="applications" :error="error" />
            </router-link>
          </template>
          <div class="navbar-item has-dropdown is-hoverable" v-if="userName">
            <a class="navbar-link">
              <font-awesome-icon icon="user-circle" size="lg" />&nbsp;<span v-text="userName" />
            </a>
            <div class="navbar-dropdown">
              <a class="navbar-item">
                <form action="logout" method="post">
                  <input v-if="csrfToken" type="hidden" :name="csrfParameterName" :value="csrfToken">
                  <button class="button is-icon" type="submit" value="logout">
                    <font-awesome-icon icon="sign-out-alt" />&nbsp;<span v-text="$t('navbar.logout')" />
                  </button>
                </form>
              </a>
            </div>
          </div>
          <navbar-item-language-selector v-if="availableLocales.length > 1" :current-locale="$i18n.locale"
                                         :available-locales="availableLocales"
                                         @localeChanged="changeLocale"
          />
        </div>
      </div>
    </div>
  </nav>
  -->
</template>

<script>
import sbaConfig from '@/sba-config'
import {compareBy} from '@/utils/collections';
import {getAvailableLocales} from '@/i18n';
import moment from 'moment';
import NavbarItemLanguageSelector from '@/shell/navbar-item-language-selector';

const readCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return (match ? decodeURIComponent(match[3]) : null);
};

export default {
  name: 'SbaNavbar',
  components: {NavbarItemLanguageSelector},
  data: () => ({
    showMenu: false,
    brand: '<img src="assets/img/icon-spring-boot-admin.svg"><span>Spring Boot Admin</span>',
    userName: 'Stephan Köninger',
    csrfToken: null,
    csrfParameterName: null,
    currentLanguage: null
  }),
  props: {
    views: {
      type: Array,
      default: () => []
    },
    applications: {
      type: Array,
      default: () => [],
    },
    error: {
      type: Error,
      default: null
    }
  },
  computed: {
    enabledViews() {
      return this.views.filter(
        view => view.handle && (typeof view.isEnabled === 'undefined' || view.isEnabled())
      ).sort(compareBy(v => v.order));
    },
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
      moment.locale(this.$i18n.locale);
    }
  },
  created() {
    this.brand = sbaConfig.uiSettings.brand;
    this.userName = sbaConfig.user ? sbaConfig.user.name : null;
    this.availableLocales = getAvailableLocales();
    this.csrfToken = readCookie('XSRF-TOKEN');
    this.csrfParameterName = sbaConfig.csrf.parameterName;
  },
  mounted() {
    document.documentElement.classList.add('has-navbar-fixed-top');
  },
  beforeDestroy() {
    document.documentElement.classList.remove('has-navbar-fixed-top')
  }
}
</script>

<style>
.brand {
  @apply inline-flex items-center;
}
.brand img {
  @apply h-8 w-8 mr-2;
}
.brand span {
  @apply font-semibold text-xl;
}
.navbar-item {
  @apply text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md;
}
.navbar-item.is-active {
  @apply bg-gray-600 text-gray-50;
}
</style>
