<template>
  <svg :width="width" :height="height" ref="chart">
    <g fill="none" id="x-axis" >
      <path stroke="black" :d="`M0.5,6V0.5H${ width - xPadding - 40 }.5V6`" :transform="`translate(${ yPadding },${ height - 40})`"/>
    </g>
    <g class="y-axis" fill="none">
      <path
        class="domain"
        stroke="currentColor"
        :d="`M0.5,${height - yPadding}.5H0.5V0.5H-6`"
        :transform="`translate(${ yPadding }, 0)`"
      ></path>
      <g
        v-for="tick in yTicks"
        :key="tick"
        class="tick"
        opacity="1"
        font-size="10"
        font-family="sans-serif"
        text-anchor="end"
        :transform="`translate(${ yPadding }, ${height - yAxis(tick) - yPadding})`"
      >
        <line stroke="currentColor" x2="-6"></line>
        <text fill="currentColor" x="-9" dy="0.32em">{{ tick }}</text>
      </g>
    </g>
    <g class="bars" :transform="`translate(${ width < 540 ? yPadding : yPadding + 20 }, 0)`">
      <g
        :transform="`translate(${ i * group.data.length * barWidth * 3 }, 0)`"
        v-for="(group, i) in filteredResults"
        :key="group.name">
        <g
          v-for="(bars, j) in group.data"
          :key="bars.age">
          <rect
            v-for="(bar, i) in bars.data"
            :key="bar"
            :height="yAxis(bar)"
            :width="barWidth"
            :y="height - yAxis(bar) - 40"
            :x="xSubgroup(bars.age) + barWidth * i"
            :fill="filteredGender ? filteredGender.name === 'Vrouw' ? femaleColor : maleColor : i === 0 ? maleColor : femaleColor"
            style="stroke: #55828B; stroke-width: 1px"
            v-tooltip="results.find(x => x.name === group.name).data.find(x => x.age === bars.age).data[(filteredGender && filteredGender.name === 'Man') ? 0 : (filteredGender && filteredGender.name === 'Vrouw') ? 1 : i] + ' personen'"
          />
          <text
            fill="currentColor"
            style="font-size: 10px;"
            :y="width < 540 ? j % 2 === 0 && filteredResults.length > 3 ? height - 35 : height - 25 : height - 25"
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
    <g>
      <text
        :transform="`translate(10, 200) rotate(270)`"
        style="font-size: 11px;">
        % personen per leeftijdscategorie
      </text>
    </g>
  </svg>
</template>

<script>
import { scaleBand, scaleLinear } from 'd3';

export default {
  props: ['filters', 'results', 'totalPersons'],
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
    width() {
      return Math.min(this.windowWidth - (this.windowWidth < 540 ? 32 : 64), 40 * 16);
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
    filteredGender() {
      if(this.filters.gender.filter(x => !x.active).length === 0 || this.filters.gender.filter(x => !x.active).length === 2) return undefined;
      return this.filters.gender.find(x => !x.active);
    },
    barWidth() {
      const data = this.filteredResults.map(r => r.data[0].data).flat();
      const width = (this.width + 100) / (data.length * (this.filteredGender ? 4 : 2) * this.filteredResults[0].data.length);
      if(this.windowWidth < 540) return width * 0.95;
      return width;
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
      if(this.filters.age.find(x => !x.active))
      results = results.map(d => {
        return {
          name: d.name,
          data: d.data.filter(x => !this.filters.age.find(a => a.name === x.age).active)
        }
      });

      // Filter male/female
      const gendersFiltered = this.filters.gender.filter(x => x.active);
      results = results.map(d => {
        return {
          name: d.name,
          data: d.data.map(x => {
            return {
              age: x.age,
              data: gendersFiltered.length === 0 || gendersFiltered.length === 2 ? x.data : gendersFiltered[0].name === 'Man' ? [x.data[1]] : [x.data[0]]
            }
          })
        }
      });

      if(!this.filters.type.find(x => !x.active)) return results;
      return results.filter(entry => !this.filters.type.find(t => t.name === entry.name).active);
    }
  },
  data() {
    return {
      height: 300,
      xPadding: 5,
      yPadding: 40,
      windowWidth: window.innerWidth,
      maleColor: '#C9DBFF',
      femaleColor: '#FFC9FD'
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
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