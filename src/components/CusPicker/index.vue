<template>
    <VanPopup v-model:show="show" position="bottom" style="background: transparent;" :destroy-on-close="true" overlay-class="cusMask" teleport="#app">
        <div class="picker">
            <div class="pickerContent pt30">
                <div class="flex jb ac pl10 pr10">
                    <div class="img80"></div>
                    <div class="size38 bold">{{ title }}</div>
                    <div class="img80 flex jc ac" @click="close">
                        <van-icon name="cross" :size="30" />
                    </div>
                </div>
                
                <CusEmpty v-if="list.length==0"></CusEmpty>
                <div class="pl60 pr60" v-else>
                    <swiper slidesPerView="auto" :centeredSlides="true" direction="vertical" space-between="10" @swiper="onSwiper" @slide-change="slideChange">
                        <swiper-slide v-for="(item, index) in list" :key="index" @click="slideClick(index)">
                            <div>{{ item[name] }}</div>
                        </swiper-slide>
                    </swiper>
                </div>
                <div class="mt100 pl30 pr30">
                    <div class="btn flex jc ac size28 bold" @click="submit">
                        <span class="font2">{{ submitTxt }}</span>
                    </div>
                </div>

                <div class="gap40"></div>
            </div>
        </div>
    </VanPopup>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import CusEmpty from '@/components/CusEmpty/index.vue';
import { t } from '@/locale';
import { Swiper, SwiperSlide } from 'swiper/vue';
// @ts-ignore
// https://swiperjs.com/demos
import 'swiper/css';

const emit = defineEmits(['change', 'title'])
const props = defineProps({
    list: { // 列表
        type: Array as PropType<any[]>,
        default: ():any[] => []
    },
    defaultIndex: { // 默认选中
        type: Number,
        default: 0
    },
    title: { // 标题
        type: String,
        default: t('请选择')
    },
    name: { // 显示字段
        type: String,
        default: 'name'
    },
    submitTxt: { // 确认按钮文字
        type: String,
        default: t('确定')
    }
})

const show = ref(false)
const open = async (index:number) => {
    show.value = true
    current.value = index
}
const close = () => show.value = false

const current = ref(props.defaultIndex)
const mySwiper = ref()
const onSwiper = (swiper: any) => {
    mySwiper.value = swiper
    mySwiper.value.slideTo(current.value)
}
const slideChange = (data: any) => current.value = data.activeIndex
const slideClick = (index:number) => mySwiper.value.slideTo(index)

const submit = ()=> {
    close()
    emit('change', current.value)
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.picker{
    width: 750px;
    padding: 1px;
    overflow-y: hidden;
    .pickerContent{
        width: 100%;
        @include colorfulCard(30px);
        border-radius: 30px 30px 0 0;
        .title{
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
            width: 100%;
            height: 88px;
            line-height: 88px;
            background-image: url("@/assets/home/btn1.png");
            background-size: 100% 100%;
        }
    }
    .submit{
        height: 80px;
        line-height: 80px;
        border-radius: 10px;
        background-color: $main-color;
        color: $black;
        text-align: center;
        font-size: 28px;
    }
    .swiper {
        width: 100%;
        height: 464px;
    }

    .swiper-slide {
        width: 100%;
        height: 88px;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        opacity: 0.5;
    }

    .swiper-slide-active {
        background: #FFFFFF;
        color: #004BFF;
        font-weight: bold;
        opacity: 1;
    }
}
</style>