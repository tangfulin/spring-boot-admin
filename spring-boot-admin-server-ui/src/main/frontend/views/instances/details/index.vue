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
  <section class="-mx-6 -my-6">
    <details-nav :instance="instance" />
    <details-hero :instance="instance" />

    <sba-alert v-if="error" :error="error" :title="$t('instances.details.fetch_failed')" />

    <div class="flex mx-6 my-6 gap-6">
      <div class="flex-1">
        <details-info v-if="hasInfo" :instance="instance" />
        <details-metadata v-if="hasMetadata" :instance="instance" />
      </div>
      <div class="flex-1">
        <details-health :instance="instance" />
      </div>
    </div>

    <div class="flex mx-6 my-6 gap-6">
      <div class="flex-1">
        <details-process v-if="hasProcess" :instance="instance" class="break-inside-avoid" />
        <details-gc v-if="hasGc" :instance="instance" />
      </div>
      <div class="flex-1">
        <details-threads v-if="hasThreads" :instance="instance" />
      </div>
    </div>

    <div class="flex mx-6 my-6 gap-6">
      <div class="flex-1">
        <details-memory v-if="hasMemory" :instance="instance" type="heap" />
      </div>
      <div class="flex-1">
        <details-memory v-if="hasMemory" :instance="instance" type="nonheap" />
      </div>
    </div>

    <div class="flex mx-6 my-6 gap-6">
      <div class="flex-1">
        <details-datasources v-if="hasDatasources" :instance="instance" />
      </div>
      <div class="flex-1">
        <details-caches v-if="hasCaches" :instance="instance" />
      </div>
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
import DetailsNav from '@/views/instances/details/details-nav';

export default {
  /* eslint-disable vue/no-unused-components */
  components: {
    DetailsNav,
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
