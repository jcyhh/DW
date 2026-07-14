<template>
    <div class="icon flex jc ac ml20" @click="show=true">
        <img src="@/assets/common/menu.png">
    </div>

    <van-popup v-model:show="show" position="top" style="background-color: transparent !important;" teleport="#app" overlay-class="cusMask">
        <div class="menupop">
            <div class="flex jb ac">
                <img src="@/assets/common/logo.png" alt="Logo" class="logo">
                <img src="@/assets/common/close.png" class="img52" @click="show=false">
            </div>

            <div class="flex col ac mt100">

                <div class="menuitem" @click="jump('/home')">{{ $t('首页') }}</div>

                <div class="menuitem mt80" @click="jump('/asset')">{{ $t('我的资产') }}</div>

                <div class="menuitem mt80" @click="jump('/hashrate')">{{ $t('兑换算力') }}</div>

                <div class="menuitem mt80" @click="jump('/log')">{{ $t('订单列表') }}</div>

                <div class="menuitem mt80" @click="jump('/team')">{{ $t('我的团队') }}</div>

                <div class="menuitem mt80" @click="jump('/partner')">{{ $t('生态合伙人') }}</div>

                <div class="menuitem mt80" @click="jump('/game')">{{ $t('游戏') }}</div>
                
            </div>
        </div>
    </van-popup>
</template>

<script setup lang="ts">
import { routerReplace } from '@/router';
import { ref } from 'vue';

const show = ref(false)

const jump = (path: string) => {
    routerReplace(path)
    show.value = false
}
</script>

<style lang="scss" scoped>
.menupop{
    width: 100vw;
    height: 100vh;
    padding: 30px 30px;
    .menuitem{
        text-shadow: 0px 0px 20px #E1CC99;
        font-size: 48px;
    }
}
.icon{
    width: 52px;
    height: 52px;
    @include colorfulCard(26px);
    img{
        width: 27px;
        height: auto;
    }
}
.logo{
    width: 66px;
    height: 44px;
}
</style>