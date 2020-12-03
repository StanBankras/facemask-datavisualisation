<template>
  <div>
    <svg :width="width" :height="height" ref="chart">
      <g fill="none" id="x-axis" >
        <path stroke="black" :d="`M0.5,6V0.5H${ width - xPadding - 40 }.5V6`" :transform="`translate(${ yPadding },${ height - 40})`"/>
      </g>
      <g class="bars" :transform="`translate(${ yPadding + 20 }, 0)`">
        <g
          :transform="`translate(${ i * group.data.length * barWidth * 3 }, 0)`"
          v-for="(group, i) in filteredResults"
          :key="group.name">
          <g
            v-for="bars in group.data"
            :key="bars.age">
            <rect
              v-for="(bar, i) in bars.data"
              :key="bar.age"
              :height="yAxis(bar)"
              :width="barWidth"
              :y="height - yAxis(bar) - 40"
              :x="xSubgroup(bars.age) + barWidth * i"
              :fill="filteredGender ? filteredGender.name === 'Man' ? 'pink' : 'blue' : i === 0 ? 'blue' : 'pink'"
            />
            <text
              fill="currentColor"
              style="font-size: 10px;"
              :y="height - 30"
              dy="0.71em"
              :x="xSubgroup(bars.age)">
              {{ bars.age.split(' ')[0] }}
            </text>
          </g>
          <text
            fill="currentColor"
            style="font-size: 10px;"
            :y="height - 15"
            dy="0.71em"
            :x="0">
            {{ group.name }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import { scaleBand, scaleLinear } from 'd3';

export default {
  props: ['filters'],
  computed: {
    groups() {
      return this.filteredResults.map(r => r.name);
    },
    subgroups() {
      const data = this.filteredResults.map(r => r.data);
      return [...new Set(...data.map(d => d.map(x => x.age)))];
    },
    heighest() {
      const data = this.filteredResults.map(r => r.data.map(x => x.data));
      return Math.max(...data.flat().flat());
    },
    xAxis() {
      return scaleBand()
        .domain(this.groups)
        .range([0, this.width])
        .padding([0.2]);
    },
    xSubgroup() {
      return scaleBand()
        .domain(this.subgroups)
        .range([0, this.xAxis.bandwidth()])
        .padding([0.05]);
    },
    yAxis() {
      return scaleLinear()
        .domain([0, this.heighest])
        .range([0, this.height - 40]);
    },
    yTicks() {
      return this.yAxis.ticks(8);
    },
    barWidth() {
      const data = this.filteredResults.map(r => r.data[0].data).flat();
      return this.width / (data.length * (this.filteredGender ? 3 : 2) * this.filteredResults[0].data.length);
    },
    filteredGender() {
      return this.filters.gender.find(f => !f.active);
    },
    totalPersons() {
      return {
        male: {
          '0-30 jaar': this.results.reduce((acc, curr) => acc + curr.data.find(c => c.age === '0-30 jaar').data[0], 0),
          '31-60 jaar': this.results.reduce((acc, curr) => acc + curr.data.find(c => c.age === '31-60 jaar').data[0], 0),
          '60+ jaar': this.results.reduce((acc, curr) => acc + curr.data.find(c => c.age === '60+ jaar').data[0], 0)
        },
        female: {
          '0-30 jaar': this.results.reduce((acc, curr) => acc + curr.data.find(c => c.age === '0-30 jaar').data[1], 0),
          '31-60 jaar': this.results.reduce((acc, curr) => acc + curr.data.find(c => c.age === '31-60 jaar').data[1], 0),
          '60+ jaar': this.results.reduce((acc, curr) => acc + curr.data.find(c => c.age === '60+ jaar').data[1], 0)
        }
      }
    },
    relativeResults() {
      return this.results.map(entry => {
        return {
          name: entry.name,
          data: entry.data.map(d => {
            return {
              age: d.age,
              data: [d.data[0] / this.totalPersons.male[d.age] * 100, d.data[1] / this.totalPersons.female[d.age] * 100]
            }
          })
        }
      });
    },
    filteredResults() {
      let results = this.relativeResults;

      // Filter age groups
      results = results.map(d => {
        return {
          name: d.name,
          data: d.data.filter(x => this.filters.age.find(a => a.name === x.age).active)
        }
      });

      // Filter male/female
      results = results.map(d => {
        return {
          name: d.name,
          data: d.data.map(x => {
            return {
              age: x.age,
              data: !this.filteredGender ? x.data : this.filteredGender.name === 'Man' ? [x.data[1]] : [x.data[0]]
            }
          })
        }
      });

      return results.filter(entry => this.filters.type.find(t => t.name === entry.name).active);
    }
  },
  data() {
    return {
      width: 600,
      height: 300,
      xPadding: 5,
      yPadding: 40,
      results: [
        {
          name: 'Wegwerp',
          data: [{ age: '0-30 jaar', data: [82, 64] }, { age: '31-60 jaar', data: [34, 18] }, { age: '60+ jaar', data: [11, 8] }]
        },
        {
          name: 'Zelf gemaakt',
          data: [{ age: '0-30 jaar', data: [23, 32] }, { age: '31-60 jaar', data: [7, 11] }, { age: '60+ jaar', data: [1, 5] }]
        },
        {
          name: 'Textiel',
          data: [{ age: '0-30 jaar', data: [78, 68] }, { age: '31-60 jaar', data: [22, 18] }, { age: '60+ jaar', data: [3, 7] }]
        },
        {
          name: 'Stof masker',
          data: [{ age: '0-30 jaar', data: [1, 1] }, { age: '31-60 jaar', data: [3, 1] }, { age: '60+ jaar', data: [1, 1] }]
        },
        {
          name: 'Geen',
          data: [{ age: '0-30 jaar', data: [18, 16] }, { age: '31-60 jaar', data: [1, 2] }, { age: '60+ jaar', data: [2, 1] }]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
svg * {
  transition: .5s;
}
</style>