<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style lang="scss" scoped>
div {
  padding: 1rem;
  background-color: var(--green);
  margin-bottom: 2rem;
  max-width: 40rem;
  h1 {
    color: var(--darkest);
    font-size: 19px;
    line-height: 28px;
    text-align: center;
  }
}
</style>