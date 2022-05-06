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

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: undefined
    }
  },
  watch: {
    data: function () {
      this.chart.update()
    }
  },
  mounted() {
    const _data = this.data;
    const labels = _data.map(d => d.timestamp);
    const max = _data.map(d => d.max).pop();

    const config = {
      type: 'line',
      data: {
        labels,
        max,
        datasets: [
          {
            label: 'used',
            data: [..._data.map(d => d.used)]
          },
          {
            label: 'committed',
            data: [..._data.map(d => d.committed)]
          },
          {
            label: 'metaspace',
            data: [..._data.map(d => d.metaspace)]
          }
        ]
      },
      options: {
        plugins: {
          filler: {
            propagate: true
          },
        },
        elements: {
          line: {
            tension: 0.5
          }
        },
        scales: {
          y: {
            stacked: true,
            ticks: {
              callback: (label) => prettyBytes(label),
            },
          },
          x: {
            type: 'linear',
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
    this.chart = new Chart(this.$refs.chart, config)
  },
  beforeUnmount() {
    this.chart.destroy();
  },
  methods: {
    drawChart(_data) {
      console.log(_data);

    },
  }
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
