<template>
    <div class="cuscard" :class="{logcard:type==1}">
        <img src="./1.png" class="pic1">
        <img src="./2.png" class="pic2">
        <img src="./3.png" class="pic3" v-if="type==0">
        <img src="./4.png" class="pic4" v-if="type==0">
        <img src="./6.png" class="pic6" v-if="type==0">
        <div class="flex jc ac" v-if="type==0">
            <img src="./5.png" class="img100">
            <div class="size32 bold">{{ title }}</div>
            <img src="./5.png" class="img100">
        </div>
        <div class="flex jc mb30" v-if="type==0">
            <div class="cuscardline"></div>
        </div>
        <slot></slot>
        <div class="gap40" v-if="type==0"></div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    title: {
        type: String,
        default: ''
    },
    type: {
        type: Number,
        default: 0
    }
})
</script>

<style lang="scss" scoped>
.cuscard{
    width: 100%;
    padding: 30px;
    position: relative;
    @include colorfulCard(
        30px,
        #000689CC,
        linear-gradient(180deg, #2F6CFE 0%, #B1E7FE 50%, #CB78FD 100%)
    );
    .pic1{
        width: 60px;
        height: 62px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
    .pic2{
        width: 60px;
        height: 62px;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
    }
    .pic3{
        width: 60px;
        height: 62px;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
    }
    .pic4{
        width: 60px;
        height: 62px;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 1;
    }
    .pic6{
        width: 194px;
        height: 10px;
        position: absolute;
        bottom: 0;
        left: calc(50% - 97px);
        z-index: 1;
    }
    .cuscardline{
        width: 320px;
        height: 1px;
        background: linear-gradient(90deg, rgba(139, 114, 254, 0) 0%, #8B72FE 50%, rgba(139, 114, 254, 0) 100%);
    }
}
.logcard{
    @include colorfulCard(
        30px,
        #040742CC,
        linear-gradient(180deg, #2F6CFE 0%, #B1E7FE 50%, #CB78FD 100%)
    );
}
</style>