<template>
    <div class="nav flex jb ac">
        <div class="img60 flex ac" @click="routerReplace('/home/index')">
            <van-icon name="arrow-left" :size="20" />
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
.nav{
    width: 100vw;
    padding: 0 30px;
    height: 100px;
    background-color: #0000001A;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
}
</style>