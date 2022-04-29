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
  <sba-modal v-model="isModalShutdownApplicationOpen">
    <template #header>
      <span>shutdown endpoint</span>
    </template>
    <template #body>
      <span v-html="$t('applications.shutdown', {name: application.name})" />
    </template>
    <template #footer>
      <button
        class="button is-success"
        @click="shutdownApplication(application)"
      >
        OK
      </button>
      <button
        class="button"
        @click="closeModal"
      >
        Cancel
      </button>
    </template>
  </sba-modal>

  <sba-modal v-model="isModalRestartApplicationOpen">
    <template #header>
      <span>restart endpoint</span>
    </template>
    <template #body>
      <span v-html="$t('applications.restart', {name: application.name})" />
    </template>
    <template #footer>
      <button
        class="button is-success"
        @click="restartApplication(application)"
      >
        OK
      </button>
      <button
        class="button"
        @click="closeModal"
      >
        Cancel
      </button>
    </template>
  </sba-modal>

  <sba-modal v-model="isApplicationRestarted">
    <template #header>
      <span>restart endpoint</span>
    </template>
    <template #body>
      <span v-html="$t('applications.restarted', {name: application.name})" />
    </template>
    <template #footer>
      <button
        class="button is-success"
        @click="closeModal"
      >
        OK
      </button>
    </template>
  </sba-modal>

  <sba-modal v-model="isModalShutdownInstanceOpen">
    <template #header>
      <span>shutdown endpoint</span>
    </template>
    <template #body>
      <span v-html="$t('instances.shutdown', {name: currentModalInstance.id})" />
    </template>
    <template #footer>
      <button
        class="button is-success"
        @click="shutdownInstance"
      >
        OK
      </button>
      <button
        class="button"
        @click="closeModal"
      >
        Cancel
      </button>
    </template>
  </sba-modal>

  <sba-modal v-model="isModalRestartInstanceOpen">
    <template #header>
      <span>restart endpoint</span>
    </template>
    <template #body>
      <span v-html="$t('instances.restart', {name: currentModalInstance.id})" />
    </template>
    <template #footer>
      <button
        class="button is-success"
        @click="restartInstance"
      >
        OK
      </button>
      <button
        class="button"
        @click="closeModal"
      >
        Cancel
      </button>
    </template>
  </sba-modal>

  <sba-modal v-model="isInstanceRestarted">
    <template #header>
      <span>restart endpoint</span>
    </template>
    <template #body>
      <span v-html="$t('instances.restarted')" />
    </template>
    <template #footer>
      <button
        class="button is-success"
        @click="closeModal"
      >
        OK
      </button>
    </template>
  </sba-modal>

  <div
    :id="application.name"
    v-on-clickaway="(event) => $emit('deselect', event, application.name)"
    class="application-list-item"
    :class="{'is-active': isExpanded}"
    @click="$emit('select', application.name)"
  >
    <header
      class="application-list-item__header"
      :class="headerClass"
      v-on="$attrs"
    >
      <ApplicationsListItemSummary
        v-if="!isExpanded"
        :application="application"
      />
      <h1
        v-else
        class="font-bold text-lg"
        v-text="application.name"
      />
      <ApplicationListItemActions
        :application="application"
        :has-active-notification-filter="hasActiveNotificationFilter(application)"
        :has-notification-filters-support="hasNotificationFiltersSupport"
        @restart="confirmRestartApplication"
        @shutdown="confirmShutdownApplication"
        @unregister="$emit('unregister', application)"
      />
    </header>
    <!-- EXPANDED -->
    <ul
      v-if="isExpanded"
      class="pt-2"
    >
      <instances-list :instances="application.instances">
        <template #actions="{instance}">
          <sba-button-group class="hidden md:flex">
            <sba-button
              v-if="hasNotificationFiltersSupport"
              :id="`nf-settings-${instance.id}`"
              size="xs"
              @click.stop="$emit('toggle-notification-filter-settings', instance)"
            >
              <font-awesome-icon
                :icon="hasActiveNotificationFilter(instance) ? 'bell-slash' : 'bell'"
                class="h-3"
              />
            </sba-button>
            <sba-button
              v-if="instance.isUnregisterable"
              title="unregister"
              size="xs"
              @click.stop="$emit('unregister', instance)"
            >
              <font-awesome-icon
                icon="trash"
                class="h-3"
              />
            </sba-button>
            <sba-button
              v-if="instance.hasEndpoint('shutdown')"
              title="shutdown"
              size="xs"

              @click.stop="confirmShutdownInstance(instance)"
            >
              <font-awesome-icon
                :icon="['far', 'stop-circle']"
                class="h-3"
              />
            </sba-button>
            <sba-button
              v-if="instance.hasEndpoint('restart')"
              title="restart"
              size="xs"
              @click.stop="confirmRestartInstance(instance)"
            >
              <font-awesome-icon
                icon="sync-alt"
                class="h-3"
              />
            </sba-button>
          </sba-button-group>
        </template>
      </instances-list>
    </ul>
  </div>
</template>

<script>
import Application from '../../services/application';
import InstancesList from './instances-list.vue';
import {HealthStatus} from '../../HealthStatus.js';
import ApplicationListItemActions from "./ApplicationListItemActions.vue";
import ApplicationsListItemSummary from "./applications-list-item-summary.vue";
import {directive as onClickaway} from 'vue3-click-away';

export default {
  components: {ApplicationsListItemSummary, ApplicationListItemActions, InstancesList},
  directives: {onClickaway},
  props: {
    application: {
      type: Application,
      required: true
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    notificationFilters: {
      type: Array,
      default: () => []
    },
    hasNotificationFiltersSupport: {
      type: Boolean,
      default: false
    },
  },
  emits: ['unregister', 'toggle-notification-filter-settings', 'shutdown', 'restart', 'deselected', 'deselect', 'select'],
  data() {
    return {
      isModalShutdownApplicationOpen: false,
      isModalRestartApplicationOpen: false,
      isModalShutdownInstanceOpen: false,
      isModalRestartInstanceOpen: false,
      isApplicationRestarted: false,
      isInstanceRestarted: false,
      currentModalInstance: undefined
    }
  },
  computed: {
    headerClass() {
      if (!this.isExpanded) {
        return 'is-selectable';
      }
      if (this.application.status === HealthStatus.UP) {
        return 'is-primary';
      }
      if (this.application.status === HealthStatus.RESTRICTED) {
        return 'is-warning';
      }
      if (this.application.status === HealthStatus.DOWN) {
        return 'is-danger';
      }
      if (this.application.status === HealthStatus.OUT_OF_SERVICE) {
        return 'is-danger';
      }
      if (this.application.status === HealthStatus.OFFLINE) {
        return 'is-light';
      }
      return 'is-light';
    }
  },
  methods: {
    hasActiveNotificationFilter(object) {
      return this.notificationFilters.some(f => f.affects(object));
    },
    confirmShutdownApplication() {
      this.isModalShutdownApplicationOpen = true;
    },
    confirmShutdownInstance(instance) {
      this.isModalShutdownInstanceOpen = true;
      this.currentModalInstance = instance;
    },
    confirmRestartApplication() {
      this.isModalRestartApplicationOpen = true;
    },
    confirmRestartInstance(instance) {
      this.isModalRestartInstanceOpen = true;
      this.currentModalInstance = instance;
    },
    closeModal() {
      this.currentModalInstance = undefined;
      this.isModalShutdownApplicationOpen = false;
      this.isModalShutdownInstanceOpen = false;
      this.isModalRestartApplicationOpen = false;
      this.isModalRestartInstanceOpen = false;
      this.isApplicationRestarted = false;
      this.isInstanceRestarted = false;
    },
    shutdownApplication(application) {
      this.$emit('shutdown', application);
      this.closeModal();
    },
    shutdownInstance() {
      this.$emit('shutdown', this.currentModalInstance);
      this.closeModal();
    },
    restartApplication(application) {
      this.$emit('restart', application);
      this.closeModal();
      this.isApplicationRestarted = true;
    },
    restartInstance() {
      this.$emit('restart', this.currentModalInstance);
      this.closeModal();
      this.isInstanceRestarted = true;
    }
  }
}
</script>

<style>
.application-list-item {
  transition: all ease-out 250ms;
}
.application-list-item:not(.is-active) {
  @apply cursor-pointer;
}

.application-list-item.is-active {
  @apply border-t border-b bg-gray-50;
  max-width: unset;
}

.application-list-item.is-active:first-child {
  @apply border-t-0;
}

.application-list-item.is-active:last-child {
  @apply border-b-0;
}

.application-list-item.is-active li {
  @apply pl-4 pr-4 cursor-pointer;
}

.application-list-item.is-active .application-list-item__header {
  @apply pb-1;
}

.application-list-item__header {
  @apply px-4 py-3 flex justify-between items-center;
}

.application-list-item:not(.is-active):hover {
  @apply bg-gray-100 cursor-pointer;
}

.application-list-item__header .title {
  flex-grow: 1;
  flex-basis: 50%;
  margin: 0.75rem 0;
}
</style>
