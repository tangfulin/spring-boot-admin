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
  <div class="mem-chart">
    <canvas
      id="chart"
      ref="chart"
    />
    <svg class="mem-chart__svg hidden" />
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import 'chartjs-adapter-moment';
import prettyBytes from "pretty-bytes";
import moment from "moment";
import {useI18n} from "vue-i18n";
import {shallowRef} from "vue";

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const {t} = useI18n();

    return {...props, t};
  },
  data() {
    return {
      chart: undefined
    }
  },
  watch: {
    data: {
      handler(newData) {
        if (this.chart) {
          const data = newData[newData.length - 1];
          const chartData = this.chart.data;
          const datasets = chartData.datasets;


          datasets.find(ds => ds.id === "used").data.push(data.used);
          datasets.find(ds => ds.id === "metaspace").data.push(data.metaspace);
          datasets.find(ds => ds.id === "committed").data.push(data.committed);

          chartData.labels.push(data.timestamp);

          this.chart.update()
        }
      },
      deep: true
    }
  },
  mounted() {
    const _data = this.data;
    const labels = _data.map(d => d.timestamp);
    const minTimestamp = Math.min(...labels);

    const config = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            id: 'used',
            borderColor: "#629655",
            backgroundColor: "rgba(176,202,169,0.6)",
            pointHoverRadius: 5,
            label: this.t('instances.details.memory.used'),
            data: [..._data.map(d => d.used)]
          },
          {
            id: 'metaspace',
            borderColor: "#e12828",
            backgroundColor: "rgb(211,141,141)",
            pointHoverRadius: 5,
            label: this.t('instances.details.memory.metaspace'),
            data: [..._data.map(d => d.metaspace)]
          },
          {
            id: 'committed',
            borderColor: "#599DF6",
            backgroundColor: "rgba(171,205,250,0.6)",
            pointHoverRadius: 5,
            label: this.t('instances.details.memory.committed'),
            data: [..._data.map(d => d.committed)]
          }
        ]
      },
      options: {
        animation: {
          duration: 0
        },
        fill: true,
        plugins: {
          filler: {
            propagate: true
          },
          tooltip: {
            callbacks: {
              title: function(ctx) {
                return prettyBytes(ctx[0].parsed.y);
              },
              label: function(ctx) {
                return ctx.dataset.label;
              }
            }
          }
        },
        elements: {
          line: {
            tension: 0,
            borderWidth: 2
          },
          point: {
            radius: 0,
            hitRadius: 30,
          }
        },
        scales: {
          y: {
            min: 0,
            ticks: {
              callback: (label) => prettyBytes(label),
            },
          },
          x: {
            type: 'linear',
            min: minTimestamp,
            time: {
              displayFormats: {
                quarter: 'HH:mm:ss'
              }
            },
            ticks: {
              callback: (label) => {
                return moment(label).format("HH:mm:ss");
              },
              autoSkip: false,
              minRotation: 45
            },
          }
        }
      }
    };
    this.chart = shallowRef(new Chart(this.$refs.chart, config));
  },
  beforeUnmount() {
    this.chart.destroy();
  },
}
</script>

<style lang="css">
.mem-chart__svg {
  height: 159px;
  width: 100%;
}

.mem-chart__area--committed {
  fill: #ffe08a;
  opacity: 0.8;
}

.mem-chart__area--used {
  fill: #3e8ed0;
  opacity: 0.8;
}

.mem-chart__area--metaspace {
  fill: #00d1b2;
  opacity: 0.8;
}

.mem-chart__line--max {
  stroke: #3e8ed0;
}

</style>
