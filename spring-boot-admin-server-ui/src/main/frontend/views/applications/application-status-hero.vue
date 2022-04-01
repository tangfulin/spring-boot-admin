<template>
  <sba-panel>
    <div class="flex flex-col items-center">
      <template v-if="downCount === 0">
        <font-awesome-icon icon="check-circle" class="text-green-500 text-9xl pb-4" />
        <h1 class="font-bold text-2xl" v-text="$t('applications.all_up')" />
      </template>
      <template v-else>
        <font-awesome-icon icon="minus-circle" class="text-red-500 text-9xl pb-4" />
        <h1 class="font-bold text-2xl" v-text="$t('applications.instances_down')" />
      </template>

      <p class="text-gray-400 pt-4" v-text="lastUpdate" />
    </div>
  </sba-panel>
</template>

<script>
import SbaPanel from '@/components/sba-panel';

const options = {
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric',
};

export default {
  name: 'ApplicationStatusHero',
  components: {SbaPanel},
  props: {
    applications: {
      type: Array,
      default: () => [],
    }
  },
  beforeMount() {
    this.updateLastUpdateTime();
  },
  data() {
    return {
      lastUpdate: new Date(),
      dateTimeFormat: new Intl.DateTimeFormat(this.$i18n.locale, options)
    }
  },
  watch: {
    downCount() {
      this.updateLastUpdateTime();
    }
  },
  computed: {
    downCount() {
      return this.applications.reduce((current, next) => {
        return current + (next.instances.filter(instance => instance.statusInfo.status !== 'UP').length);
      }, 0);
    }
  },
  methods: {
    updateLastUpdateTime() {
      this.lastUpdate = this.dateTimeFormat.format(new Date())
    }
  }
}
</script>

<style scoped>
.fill-green {
  fill: #22B061;
}
.fill-red {
  fill: #E03616;
}
.svg-shadow {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}
</style>
