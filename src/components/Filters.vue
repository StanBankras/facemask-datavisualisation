<template>
  <div id="filters">
    <div class="type">
      <p>Type mondmasker</p>
      <div class="buttons">
        <div
          v-for="filter in filters.type"
          :key="filter.name">
          <img @click="toggle(filter.name, 'type')" :src="require(`@/assets/img/${ filter.name.toLowerCase().split(' ').join('') }.gif`)" alt="">
          <button
            @click="toggle(filter.name, 'type')"
            :class="{ active: !filter.active }"
            class="filter-btn">{{ filter.name }}</button>
        </div>
      </div>
    </div>
    <div class="wrap">
      <div class="gender">
        <p>Geslacht</p>
        <div class="buttons">
          <button
            v-for="filter in filters.gender"
            :key="filter.name"
             @click="toggle(filter.name, 'gender')"
             :class="{ active: !filter.active }"
            class="filter-btn">{{ filter.name }}</button>
        </div>
      </div>
      <div class="age">
        <p>Leeftijdscategorie</p>
        <div class="buttons">
          <button
            v-for="filter in filters.age"
            :key="filter.name"
             @click="toggle(filter.name, 'age')"
             :class="{ active: !filter.active }"
            class="filter-btn">{{ filter.name }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['initial'],
  data() {
    return {
      filters: {}
    }
  },
  mounted() {
    this.filters = this.initial;
  },
  methods: {
    toggle(name, category) {
      const found = this.filters[category].find(x => x.name === name);
      found.active = !found.active;
      this.$emit('update', this.filters);
    }
  },
  watch: {
    initial(val) {
      this.filters = val;
    }
  }
}
</script>

<style lang="scss" scoped>
#filters {
  margin-bottom: 1.5rem;
  max-width: 40rem;
}
.buttons {
  display: grid;
  gap: 0.5rem;
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    img {
      width: 80px;
      cursor: pointer;
      @media(max-width: 490px) {
        width: 60px; 
      }
    }
  }
  .filter-btn {
    user-select: none;
    padding: 0.3rem;
    border: 0px;
    outline: none;
    font-weight: bold;
    font-size: 12px;
    min-height: 37.5px;
    background-color: var(--red);
    color: var(--white);
    cursor: pointer;
    transition: .5s;
    &.active {
      background-color: var(--green);
      color: var(--darkest);
    }
  }
}
.type {
  .buttons {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
}
.gender {
  .buttons {
    grid-template-columns: 1fr 1fr;
  }
}
.age {
  .buttons {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
.wrap {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
p {
  margin-bottom: 0.3rem;
  font-weight: bold;
  color: var(--darken);
  font-size: 12px;
}
</style>