<template>
    <div class="head flex jb ac">
        <img src="@/assets/common/logo.png" class="logo" @click="onLogoClick">
        <div class="flex ac bold">
            <div class="connect flex ac linear mr20 size24" v-if="address" v-init:address="address"></div>
            <div class="connect flex ac linear mr20 size24" v-else>{{ $t('链接钱包') }}</div>
            <CusLang></CusLang>
            <Menu></Menu>
        </div>
    </div>

    <RouterView></RouterView>
</template>

<script setup lang="ts">
import CusLang from '@/components/CusLang/index.vue';
import { storeToRefs } from 'pinia';
import { useDappStore } from '@/store';
import Menu from './Menu.vue'

const dappStore = useDappStore()
const { address } = storeToRefs(dappStore)

const onLogoClick = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
</script>

<style lang="scss" scoped>
.head {
    width: 100vw;
    height: 100px;
    background-color: #0000001A;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    padding: 0 30px;

    .connect{
        height: 52px;
        padding: 0 20px;
        @include colorfulCard(26px);
    }
    .logo{
        width: 66px;
        height: 44px;
    }
}

.pop {
    width: 520px;
    height: 100vh;
    padding-top: 100px;

    .menu {
        width: 520px;
        height: calc(100vh - 100px);
        padding: 40px 30px;
        background-color: #191B1A;
        position: relative;
        .item{
            height: 76px;
            border-radius: 38px;
            padding: 0 30px;
            margin-bottom: 25px;
        }
        .border{
            width: 460px;
            height: 76px;
            position: absolute;
        }
        .border-1{
            top: 40px;
        }
        .border-2{
            top: 141px;
        }
        .border-3{
            top: 242px;
        }
        .border-4{
            top: 343px;
        }
        .border-5{
            top: 444px;
        }
        .border-6{
            top: 545px;
        }
        .border-7{
            top: 646px;
        }
    }
}
</style>
