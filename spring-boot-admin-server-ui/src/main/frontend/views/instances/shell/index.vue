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
  <div class="h-full">
    <div class="bg-wave" v-html="WaveBackground" />
    <div class="h-full">
      <instance-sidebar
        v-if="instance"
        :views="views"
        :instance="instance"
        :application="application"
      />
      <div class="h-full overflow-y-auto relative z-0 ml-60">
        <div class="mb-8">
          <router-view v-if="instance" :instance="instance" :application="application" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import InstanceSidebar from './sidebar';
  import WaveBackground from '!raw-loader!../../../assets/img/wave.svg'

  export default {
    components: {InstanceSidebar},
    props: {
      instanceId: {
        type: String,
        required: true
      },
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
    data() {
      return {
        WaveBackground,
      }
    },
    computed: {
      instance() {
        return this.applications.findInstance(this.instanceId);
      },
      application() {
        return this.applications.findApplicationForInstance(this.instanceId);
      }
    },
    install({viewRegistry}) {
      viewRegistry.addView({
        name: 'instances',
        path: '/instances/:instanceId',
        component: this,
        props: true,
        isEnabled() {
          return false;
        }
      });
    }
  }
</script>

<style lang="css">
.instances {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}
.instances__body {
  display: flex;
  flex-grow: 1;
}
.instances__view, .instances__sidebar {
  position: relative;
}
.instances__sidebar {
  z-index: 20;
  position: fixed;
  top: 52px;
  bottom: 0;
  left: 0;
  width: 220px;
}
.instances__view {
  flex-grow: 1;
  flex-shrink: 1;
  z-index: 10;
  max-width: 100%;
  padding-left: 220px;
}
</style>
