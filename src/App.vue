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
      <filters :initial="filterGroups" @update="f => filterGroups = f"/>
      <chart :filters="filterGroups"/>
    </div>
    </div>
</template>

<script>
import TitleComp from '@/components/Title';
import Filters from '@/components/Filters';
import Chart from '@/components/Chart';

export default {
  components: { TitleComp, Filters, Chart },
  data() {
    return {
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
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}
#app {
  background-color: var(--white);
  width: 100vw;
  /* max-width: 414px; */
  height: 100vh;
  overflow-x: hidden;
  padding: 2rem;
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
