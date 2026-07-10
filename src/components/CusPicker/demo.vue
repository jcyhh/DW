<template>
    <button @click="picker.open">打开Picker</button>

    <CusPicker ref="picker" :list="list" :default-index="current" @change="$event=>current=$event"></CusPicker>
</template>

<script setup lang="ts">
import CusPicker from '@/components/CusPicker/index.vue';
import { ref } from 'vue';

const picker = ref()
const current = ref(0)
const list = [
    {name:'选项1', value: 1},
    {name:'选项2', value: 2},
    {name:'选项3', value: 3},
    {name:'选项4', value: 4},
    {name:'选项5', value: 5},
    {name:'选项6', value: 6},
    {name:'选项7', value: 7},
    {name:'选项8', value: 8},
    {name:'选项9', value: 9},
    {name:'选项10', value: 10}
]
</script>

<style lang="scss" scoped>

</style>