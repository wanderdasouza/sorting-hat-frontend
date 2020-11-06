<template>
  <p>{{ id }}</p>
</template>

<script>
export default {
  created() {
    console.log('your id is: ' + this.$route.params.id)
  },
  data() {
    return {
      id: 'eae',
    }
  },
}
</script>

<style></style>
