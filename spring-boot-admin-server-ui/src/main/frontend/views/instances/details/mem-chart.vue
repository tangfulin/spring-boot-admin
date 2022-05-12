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
  <canvas
    id="chart"
    ref="chart"
  />
</template>

<script>
import Chart from "chart.js/auto";
import prettyBytes from "pretty-bytes";
import moment from "moment";
import {useI18n} from "vue-i18n";
import {shallowRef} from "vue";

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
  },
  setup(props) {
    const {t} = useI18n();
    return {...props, t};
  },
  data() {
    return {
      chart: undefined,
      label: "timestamp",
      datasets: {
        used: {
          label: this.t('instances.details.memory.used')
        },
        metaspace: {
          label: this.t('instances.details.memory.metaspace')
        },
        committed: {
          label: this.t('instances.details.memory.committed')
        }
      },
      colors: [
        {
          borderColor: "rgb(62, 142, 208)",
          backgroundColor: "rgba(62, 142, 208, 0.9)",
        },
        {
          borderColor: "rgb(0, 209, 178)",
          backgroundColor: "rgba(0, 209, 178, 0.5)",
        },
        {
          borderColor: "rgb(255, 224, 138)",
          backgroundColor: "rgba(255, 224, 138, 0.5)",
        },

      ]
    }
  },
  watch: {
    data: {
      handler(newData) {
        if (this.chart) {
          const data = newData[newData.length - 1];
          const chartData = this.chart.data;
          const datasets = chartData.datasets;

          Object.keys(this.datasets).forEach(id => {
            datasets.find(dataset => dataset.id === id).data.push(data[id]);
          })

          chartData.labels.push(data[this.label]);

          this.chart.update()
        }
      },
      deep: true
    }
  },
  mounted() {
    const _data = this.data;
    const labels = _data.map(d => d[this.label]);
    const minTimestamp = Math.min(...labels);

    const datasets = Object.keys(this.datasets).map((id, idx) => {
      const config = this.datasets[id];

      return {
        id,
        borderColor: config.borderColor ?? this.colors[idx].borderColor,
        backgroundColor: config.backgroundColor ?? this.colors[idx].backgroundColor,
        pointHoverRadius: 5,
        label: config.label,
        data: [..._data.map(d => d[id])]
      }
    })

    const config = {
      type: 'line',
      data: {
        labels,
        datasets
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
              title: function (ctx) {
                return prettyBytes(ctx[0].parsed.y);
              },
              label: function (ctx) {
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
            stacked: true,
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
