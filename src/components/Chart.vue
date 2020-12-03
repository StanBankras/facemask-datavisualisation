<template>
  <div>
    <svg :width="width" :height="height" ref="chart">
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
            :y="height - yAxis(bar)"
            :x="xSubgroup(bars.age) + barWidth * i"
            :fill="filteredGender ? filteredGender.name === 'Man' ? 'pink' : 'blue' : i === 0 ? 'blue' : 'pink'"
          />
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
      const data = this.filteredResults.map(r => r.data[0].data);
      return Math.max(...data.flat());
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
        .range([0, this.height]);
    },
    barWidth() {
      const data = this.filteredResults.map(r => r.data[0].data).flat();
      return this.width / (data.length * 2 * 3);
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
        console.log(this.filteredGender);
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
      width: 1000,
      height: 200,
      xPadding: 5,
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