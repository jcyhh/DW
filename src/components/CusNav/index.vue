<template>
    <div class="head flex jb ac">
        <div class="img60 flex ac" @click="routerReplace('/home/index')">
            <van-icon name="arrow-left" />
        </div>
        <div class="size32 bold">{{ title }}</div>
        <div class="img60"></div>
    </div>
</template>

<script setup lang="ts">
import { routerReplace } from '@/router';

defineProps(['title'])
</script>

<style lang="scss" scoped>
.head{
    width: 100vw;
    padding: 0 30px;
    height: 100px;
    background-color: #1A1A1A;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
}
</style>