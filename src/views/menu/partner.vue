<template>
    <CusNav :title="$t('合伙人')"></CusNav>
    <div class="gap100"></div>
    <div class="gap200"></div>
    <div class="gap200"></div>
    <img src="@/assets/home/31.png" class="bg">
    <div class="rel pl30 pr30 mt46" style="z-index: 2;">

        <div class="content pt60">
            <div class="pl50 pr50">
                <div class="title flex jc ac pb10 animate__animated animate__flipInX">
                    <span class="font2 size32 bold">{{ $t('生态合伙人') }}</span>
                </div>
                <div class="size24 mt30">{{ $t('支付方式') }}</div>
                
                <div class="btn mt50">
                    <span class="font2">{{ $t('确认') }}</span>
                </div>
            </div>
        </div>
 
    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/Nav.vue'
</script>

<style lang="scss" scoped>
.bg{
    width: 100vw;
    height: 500px;
    position: fixed;
    top: 100px;
    left: 0;
}
.content{
    width: 690px;
    height: 868px;
    background-image: url("@/assets/home/32.png");
    background-size: 100% 100%;
}
.disable{
    background-image: url("@/assets/home/disable.png") !important;
}
.title{
    width: 590px;
    height: 128px;
    background-image: url("@/assets/home/3.png");
    background-size: 100% 100%;
    span{
        background: linear-gradient(#F2F2F0, #FFFFC0);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        text-shadow: 0 0 20px #FFF07B80;
    }
}
.btn{
    margin-left: auto;
    margin-right: auto;
    width: 282px;
    height: 80px;
    line-height: 80px;
    background-image: url("@/assets/home/6.png");
    background-size: 100% 100%;
    text-align: center;
    span{
        text-shadow: 0 4px 0 #000000;
        font-size: 32px;
        font-weight: bold;
    }
}
</style>