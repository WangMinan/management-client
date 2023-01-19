<script setup>
import {ref} from 'vue'

const name = ref('')
</script>

<template>
  <h1>{{name}}</h1>
  <el-input v-model="name"></el-input>
</template>

<style scoped>
</style>
