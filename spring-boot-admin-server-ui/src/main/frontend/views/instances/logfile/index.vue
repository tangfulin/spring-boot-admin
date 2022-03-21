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
  <sba-instance-section :loading="!hasLoaded" :error="error">
    <template v-slot:before>
      <sba-sticky-subnav>
        <div class="mx-6 flex items-center justify-end">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="wraplines" name="wraplines" v-model="wrapLines" type="checkbox"
                     class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              >
            </div>
            <div class="ml-3 text-sm">
              <label for="wraplines" class="font-medium text-gray-700" v-text="$t('instances.logfile.wrap_lines')" />
            </div>
          </div>

          <div class="mx-3">
            <sba-button size="sm" @click="scrollToTop" :disabled="atTop">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </sba-button>
            <sba-button size="sm" @click="scrollToBottom" :disabled="atBottom">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </sba-button>
          </div>

          <sba-button size="sm" @click="downloadLogfile()">
            <font-awesome-icon icon="download" />&nbsp;
            <span v-text="$t('instances.logfile.download')" />
          </sba-button>
        </div>
      </sba-sticky-subnav>
    </template>

    <template>
      <sba-panel :title="$t('instances.logfile.label')" :subtitle="skippedBytesString">
        <div :class="{'wrap-lines': wrapLines}" class="log-viewer overflow-x-auto text-sm">
          <table />
        </div>
      </sba-panel>
    </template>
  </sba-instance-section>
</template>

<script>
import Instance from '@/services/instance';
import autolink from '@/utils/autolink';
import {animationFrameScheduler, concatAll, concatMap, map, of, tap} from '@/utils/rxjs';
import AnsiUp from 'ansi_up';
import chunk from 'lodash/chunk';
import prettyBytes from 'pretty-bytes';
import {VIEW_GROUP} from '../../index';
import SbaInstanceSection from '@/views/instances/shell/sba-instance-section';
import SbaPanel from '@/components/sba-panel';
import SbaStickySubnav from '@/components/sba-sticky-subnav';
import SbaButton from '@/components/sba-button';
import subscribing from '@/mixins/subscribing';
import {debounceTime, fromEvent} from 'rxjs';

export default {
  components: {SbaButton, SbaStickySubnav, SbaPanel, SbaInstanceSection},
  props: {
    instance: {
      type: Instance,
      required: true
    }
  },
  mixins: [subscribing],
  data: () => ({
    hasLoaded: false,
    error: null,
    atBottom: false,
    atTop: true,
    skippedBytes: null,
    wrapLines: true,
    scrollSubcription: null
  }),
  created() {
    this.ansiUp = new AnsiUp();
    const scrollcontainer = document.querySelector('main');
    this.scrollSubcription = fromEvent(scrollcontainer, 'scroll')
      .pipe(
        debounceTime(25),
        map(v => v.target.scrollTop)
      )
      .subscribe(v => {
        this.atTop = v === 0;
        this.atBottom = scrollcontainer.firstChild.clientHeight === scrollcontainer.scrollHeight - scrollcontainer.scrollTop
      })
  },
  beforeDestroy() {
    if (this.scrollSubcription) {
      try {
        !this.scrollSubcription.closed && this.scrollSubcription.unsubscribe();
      } finally {
        this.scrollSubcription = null;
      }
    }

  },
  computed: {
    skippedBytesString() {
      if (this.skippedBytes != null) {
        return `skipped ${prettyBytes(this.skippedBytes)}`;
      }
      return '';
    }
  },
  methods: {
    prettyBytes,
    createSubscription() {
      const vm = this;
      vm.error = null;
      return this.instance.streamLogfile(1000)
        .pipe(
          tap(part => vm.skippedBytes = vm.skippedBytes || part.skipped),
          concatMap(part => chunk(part.addendum.split(/\r?\n/), 250)),
          map(lines => of(lines, animationFrameScheduler)),
          concatAll()
        )
        .subscribe({
          next: lines => {
            vm.hasLoaded = true;
            lines.forEach(line => {
              const row = document.createElement('tr')
              const col = document.createElement('td');
              const pre = document.createElement('pre');
              pre.innerHTML = autolink(this.ansiUp.ansi_to_html(line));
              col.appendChild(pre)
              row.appendChild(col)
              document.querySelector('.log-viewer > table')?.appendChild(row);
            });

            if (!vm.atBottom) {
              vm.scrollToBottom();
            }
          },
          error: error => {
            vm.hasLoaded = true;
            console.warn('Fetching logfile failed:', error);
            vm.error = error;
          }
        });
    },
    scrollToTop() {
      document.querySelector('main').scrollTop = 0;
    },
    scrollToBottom() {
      document.querySelector('main').scrollTop = document.querySelector('main').scrollHeight;
    },
    downloadLogfile() {
      window.open(`instances/${this.instance.id}/actuator/logfile`, '_blank');
    }
  },
  install({viewRegistry}) {
    viewRegistry.addView({
      name: 'instances/logfile',
      parent: 'instances',
      path: 'logfile',
      component: this,
      label: 'instances.logfile.label',
      group: VIEW_GROUP.LOGGING,
      order: 300,
      isEnabled: ({instance}) => instance.hasEndpoint('logfile')
    });
  }
}
</script>

<style lang="css">
.log-viewer pre {
  padding: 0 0.5em;
  margin-bottom: 1px;
}

.log-viewer pre:hover {
  background: #dbdbdb;
}

.log-viewer.wrap-lines pre {
  @apply whitespace-pre-wrap;
}

.log-viewer {
  padding: 9.5px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: auto;
}
</style>
