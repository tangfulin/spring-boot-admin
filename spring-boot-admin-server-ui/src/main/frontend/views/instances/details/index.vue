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
  <section>
    <div class="sticky shadow-sm top-0 w-full bg-white py-1 px-2 backdrop-filter backdrop-blur-lg bg-opacity-20 flex z-50">
      <div class="flex-1" />
      <div class="flex-1 text-center" />
      <div class="flex-1 text-right">
        <a :href="instance.registration.serviceUrl" :title="instance.registration.serviceUrl" class="text-xs inline-flex items-center leading-sm border border-gray-400 bg-white text-gray-700 rounded overflow-hidden px-3 py-1 hover:bg-gray-200 ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </a>
        <a :href="instance.registration.managementUrl" :title="instance.registration.managementUrl" class="text-xs inline-flex items-center leading-sm border border-gray-400 bg-white text-gray-700 rounded overflow-hidden px-3 py-1 hover:bg-gray-200 ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </a>
        <a :href="instance.registration.healthUrl" :title="instance.registration.healthUrl" class="text-xs inline-flex items-center leading-sm border border-gray-400 bg-white text-gray-700 rounded overflow-hidden px-3 py-1 hover:bg-gray-200 ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </a>
      </div>
    </div>

    <details-hero :instance="instance" />

    <sba-alert v-if="error" :error="error" :title="$t('instances.details.fetch_failed')" />

    <div class="columns-2 mx-6 my-6 gap-6">
      <details-info v-if="hasInfo" :instance="instance" />
      <details-metadata v-if="hasMetadata" :instance="instance" />
      <details-health :instance="instance" />
    </div>

    <div class="columns-2 mx-6 my-6 gap-6">
      <details-process v-if="hasProcess" :instance="instance" />
      <details-gc v-if="hasGc" :instance="instance" />
      <details-threads v-if="hasThreads" :instance="instance" />
      <details-memory v-if="hasMemory" :instance="instance" type="heap" />
      <details-memory v-if="hasMemory" :instance="instance" type="nonheap" />
      <details-datasources v-if="hasDatasources" :instance="instance" />
      <details-caches v-if="hasCaches" :instance="instance" />
    </div>
  </section>
</template>

<script>

import Instance from '@/services/instance';
import detailsCaches from './details-caches';
import detailsDatasources from './details-datasources';
import detailsGc from './details-gc';
import detailsHealth from './details-health';
import detailsInfo from './details-info';
import detailsMemory from './details-memory';
import detailsMetadata from './details-metadata';
import detailsProcess from './details-process';
import detailsThreads from './details-threads';
import {VIEW_GROUP} from '../../index';
import DetailsHero from './details-hero';

export default {
  /* eslint-disable vue/no-unused-components */
  components: {
    DetailsHero,
    detailsHealth,
    detailsInfo,
    detailsProcess,
    detailsThreads,
    detailsDatasources,
    detailsMemory,
    detailsGc,
    detailsCaches,
    detailsMetadata
  },
  props: {
    instance: {
      type: Instance,
      required: true
    }
  },
  data: () => ({
    hasLoaded: false,
    error: null,
    metrics: []
  }),
  computed: {
    hasCaches() {
      return this.hasMetric('cache.gets');
    },
    hasDatasources() {
      return this.hasMetric('data.source.active.connections');
    },
    hasGc() {
      return this.hasMetric('jvm.gc.pause');
    },
    hasInfo() {
      return this.instance.hasEndpoint('info');
    },
    hasMemory() {
      return this.hasMetric('jvm.memory.max');
    },
    hasProcess() {
      return this.hasMetric('process.uptime');
    },
    hasThreads() {
      return this.hasMetric('jvm.threads.live');
    },
    hasMetadata() {
      return this.instance.registration && this.instance.registration.metadata;
    }
  },
  created() {
    this.fetchMetricIndex();
  },
  methods: {
    hasMetric(metric) {
      return this.metrics && this.metrics.includes(metric);
    },
    async fetchMetricIndex() {
      if (this.instance.hasEndpoint('metrics')) {
        this.error = null;
        try {
          const res = await this.instance.fetchMetrics();
          this.metrics = res.data.names;
        } catch (error) {
          console.warn('Fetching metric index failed:', error);
          this.error = error;
        }
        this.hasLoaded = true;
      }
    }
  },
  install({viewRegistry}) {
    viewRegistry.addView({
      name: 'instances/details',
      parent: 'instances',
      path: 'details',
      component: this,
      label: 'instances.details.label',
      group: VIEW_GROUP.INSIGHTS,
      order: 0
    });
  }
}
</script>
