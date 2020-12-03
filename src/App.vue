<template>
  <div id="app">
    <div class="wrap">
      <title-comp title="Welke mondkapjes worden gedragen op het Amstelstation?"/>
      <p>
        Mondkapjes zijn er in verschillende soorten en maten.
        Vanaf 1 december 2020 zijn mondkapjes verplicht in publieke binnenruimten.
        Zo ook in het openbaar vervoer en in de stations zelf.
      </p>
      <p>
        Op woensdag 2 december hebben wij geobserveerd welke mondkapjes gedragen
        worden door welk geslacht en welke leeftijdsgroepen.
      </p>
      <h2>Ontdek de data</h2>
      <p>Klik op welke data je wel of niet wilt weergeven</p>
      <filters :initial="filterGroups" @update="f => updateFilters(f)"/>
      <chart :filters="filterGroups" :results="results" :totalPersons="totalPersons"/>
      <p style="margin-top: 1.5rem; margin-left: 1rem; font-size: 11px; font-style: italic;">Gebaseerd op {{ allPersons.female }} getelde vrouwen en {{ allPersons.male }} getelde mannen</p>
    </div>
  </div>
</template>

<script>
import TitleComp from '@/components/Title';
import Filters from '@/components/Filters';
import Chart from '@/components/Chart';

export default {
  components: { TitleComp, Filters, Chart },
  computed: {
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
    allPersons() {
      return {
        male: Object.values(this.totalPersons.male).reduce((acc, curr) => acc + curr, 0),
        female: Object.values(this.totalPersons.female).reduce((acc, curr) => acc + curr, 0)
      }
    }
  },
  data() {
    return {
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
      ],
      filterGroups: {
        type: [
          {
            name: 'Wegwerp',
            active: true
          },
          {
            name: 'Zelf gemaakt',
            active: true
          },
          {
            name: 'Textiel',
            active: true
          },
          {
            name: 'Stof masker',
            active: true
          },
          {
            name: 'Geen',
            active: true
          }
        ],
        gender: [
          {
            name: 'Man',
            active: true
          },
          {
            name: 'Vrouw',
            active: true
          }
        ],
        age: [
          {
            name: '0-30 jaar',
            active: true
          },
          {
            name: '31-60 jaar',
            active: true
          },
          {
            name: '60+ jaar',
            active: true
          }
        ]
      }
    }
  },
  mounted() {
    const filters = window.localStorage.getItem('filters');
    if(filters) this.filterGroups = JSON.parse(filters);
  },
  methods: {
    updateFilters(filters) {
      this.filterGroups = filters;
      window.localStorage.setItem('filters', JSON.stringify(filters));
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'M PLUS Rounded 1c', sans-serif;
}
#app {
  background-color: var(--white);
  width: 100vw;
  /* max-width: 414px; */
  height: 100vh;
  overflow-x: hidden;
  padding: 2rem;
  @media(max-width: 540px) {
    padding: 1rem;
  }
  > .wrap {
    margin: 0 auto;
    max-width: 40rem;
  }
}
p {
  margin-bottom: 1rem;
  font-size: 14px;
  line-height: 20px;
  color: var(--darken);
  max-width: 40rem;
}
h2 {
  color: var(--darkest);
  font-size: 17px;
}
</style>
