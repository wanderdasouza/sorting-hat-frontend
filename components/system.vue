<template>
  <div class="quadro"></div>
</template>

<script>
export default {
  async fetch() {
    this.systems = await fetch('http://localhost:8000/sistema').then((res) =>
      res.json()
    )
  },
  data() {
    return {
      systems: [],
    }
  },
}
</script>

<style scoped>
.quadro {
  display: flex;
  flex-direction: column;
  background-color: olivedrab;
  width: 100%;
  height: 700px;
  padding: 20px;
}
.quadradinho {
  background-color: red;
  width: 50px;
  height: 50px;
  margin-right: 50px;
}
.gridSystem {
  background-color: chocolate;
  height: 100%;
  width: 100%;
}
</style>
