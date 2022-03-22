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
  <div class="tree">
    <div class="row row--head">
      <div class="inline-flex items-center">
        <div class="mx-3">
          <sba-button v-if="!isExpanded" @click="expandTree" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="h-4 w-4">
              <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z" />
            </svg>
          </sba-button>
          <sba-button v-if="isExpanded" @click="expandTree" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="h-4 w-4">
              <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z" />
            </svg>
          </sba-button>
        </div>

        <span v-text="$t('instances.startup.column.name')" />
      </div>
      <div class="text-right" v-text="$t('instances.startup.column.duration')" />
      <div class="break-all" v-text="$t('instances.startup.column.details')" />
    </div>
    <ul v-if="tree">
      <tree-item
        v-for="(eventNode, index) in tree.getRoots()"
        :key="index"
        :item="eventNode"
        :expand="expandedNodes"
        @toggle="onToggle"
      />
    </ul>
  </div>
</template>

<script>
import TreeItem from '@/views/instances/startup/tree-item';
import {StartupActuatorEventTree} from '@/services/startup-activator-tree';
import SbaButton from '@/components/sba-button';

export default {
  components: {SbaButton, TreeItem},
  props: {
    tree: {
      type: StartupActuatorEventTree,
      required: true
    },
    expand: {
      type: Set,
      required: false,
      default: null
    }
  },
  data: () => ({
    expandedNodes: new Set(),
    isExpanded: false
  }),
  created() {
    if (this.expand) {
      this.expandedNodes = this.expand;
    }
  },
  computed: {
    treeSize() {
      return new Set(this.tree.getEvents()).size
    }
  },
  watch: {
    expandedNodes() {
      this.$emit('change', {
        expandedNodes: this.expandedNodes
      });
    }
  },
  methods: {
    expandTree() {
      if (!this.isExpanded) {
        this.expandedNodes = new Set(this.tree.getEvents().map(e => e.startupStep.id));
        this.isExpanded = true;
      } else {
        this.expandedNodes = new Set();
        this.isExpanded = false;
      }
    },
    onToggle($event) {
      if ($event.isOpen === true) {
        this.expandedNodes.add($event.target.startupStep.id)
        this.expandedNodes = new Set(this.expandedNodes)
      } else {
        this.expandedNodes.delete($event.target.startupStep.id)
        this.expandedNodes = new Set(this.expandedNodes)
      }

      this.isExpanded = this.expandedNodes.size === this.treeSize
    }
  }
}
</script>

<style lang="css">
.text-right {
  @apply justify-end;
}
.text-center {
  @apply justify-center;
}
.enforce-word-wrap {
  @apply break-all;
}
.tree .checkbox-expand-all {
  margin-right: 5px;
}
.tree .row {
  display: grid;
  grid-template-columns: 1fr 140px 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0;
  grid-row-gap: 0;
  border-bottom: 1px solid #dbdbdb;
}
.tree .row--head {
  @apply bg-white sticky z-50 top-14;
  grid-template-rows: 1fr;
  color: #363636;
  border: none;
  border-bottom: 2px solid #dbdbdb;
  vertical-align: top;
  font-weight: 700;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
.tree .row .column {
  @apply truncate inline-flex items-center w-full;
  padding: 0.5em 0.75em;
}
.tree .row .column--details {
  grid-area: 0.0416666667;
  @apply break-all block;
}
.tree .row .column--duration {
  @apply text-sm font-mono text-right;
}
.tree-item {
  margin: 0;
  transition-property: transform;
  transition-duration: 125ms;
}
.tree-item .icon {
  @apply w-4 h-4 flex items-center;
  margin-right: 10px;
}
.tree-item .icon--open {
  transform: rotate(90deg);
}
.tree-item .icon.empty {
}
.tree-item[tree-item-depth="1"] {
  background-color: rgba(66, 211, 165, 0.2);
}
.tree-item[tree-item-depth="1"] .column--name {
  padding-left: 22px;
}
.tree-item[tree-item-depth="2"] {
  background-color: rgba(66, 211, 165, 0.2);
}
.tree-item[tree-item-depth="2"] .column--name {
  padding-left: 44px;
}
.tree-item[tree-item-depth="3"] {
  background-color: rgba(66, 211, 165, 0.2);
}
.tree-item[tree-item-depth="3"] .column--name {
  padding-left: 66px;
}
.tree-item[tree-item-depth="4"] {
  background-color: rgba(66, 211, 165, 0.2);
}
.tree-item[tree-item-depth="4"] .column--name {
  padding-left: 88px;
}
.tree-item[tree-item-depth="5"] {
  background-color: rgba(66, 211, 165, 0.2);
}
.tree-item[tree-item-depth="5"] .column--name {
  padding-left: 110px;
}

</style>
