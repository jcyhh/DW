<template>
    <van-popup v-model:show="show" style="background-color: transparent !important;" overlay-class="cusMask">
        <div class="pop">
            <img src="@/assets/home/close.png" class="close ani6 animate__animated animate__bounceIn" @click="show = false">
            <div class="popContent pt60">
                <div class="pl50 pr50 mb30">
                    <div class="title flex jc ac pb10 animate__animated animate__flipInX">
                        <span class="font2 size32 bold">{{ type==1 ? 'DN' : $t('DN') }} {{ $t('兑换') }} {{ type==1 ? $t('DN') : 'DN' }}</span>
                    </div>
                </div>
                
                <div class="pl50 pr50">
                    <div class="flex jb ac size24">
                        <div>{{ type == 1 ? $t('兑换数量') : $t('消耗数量') }}</div>
                        <div class="gray flex ac">
                            <div class="mr10">{{ $t('可用') }}</div>
                            <div>
                                <span v-init="balance_bean"></span> {{ $t('DN') }}
                            </div>
                        </div>
                    </div>
                    <div class="flex jb ac withdrawInp mt28">
                        <input type="number" v-model="inputAmount" :placeholder="type==1? $t('请输入兑换DN数量') : $t('请输入消耗DN数量')" class="flex1 size28">
                    </div>
                    <div class="flex jc mt30 main" :class="{down:type==2}">
                        <van-icon name="upgrade" :size="30" />
                    </div>
                    <div class="flex jb ac size24 mt20">
                        <div>{{ type == 1 ? $t('消耗数量') : $t('兑换数量') }}</div>
                        <div class="gray flex ac">
                            <div class="mr10">{{ $t('可用') }}</div>
                            <div>
                                <span v-init="balance_ecc"></span> DN
                            </div>
                        </div>
                    </div>
                    <div class="flex jb ac withdrawInp mt28">
                        <div>DN</div>
                        <div v-init="realEcc"></div>
                    </div>
                    <div class="tr size24 mt20 main opc5" v-if="type==2">
                        <span>{{ $t('手续费') }}</span>
                        <span class="ml5">{{ fee_rate }}%</span>    
                    </div>
                </div>
                
                <div class="mt50">
                    <div class="btn" @click="submit">
                        <span class="font2">{{ $t('确认') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script setup lang="ts">
import { useEthers } from '@/dapp';
import { t } from '@/locale';
import { computedDiv, computedMul, computedSub } from '@/utils';
import { apiGet, apiPost } from '@/utils/request';
import { showSuccessToast, showToast } from 'vant';
import { computed, ref } from 'vue';

const emits = defineEmits(['success'])

const { getSign } = useEthers()

const show = ref(false)

const balance_ecc = ref(0)
const balance_bean = ref(0)
const ecc_price = ref(1)
const fee_rate = ref(0)
const bean_per_usdt = ref(1)
const loadConfig = () => {
    apiGet('/api/beans/config').then((res:any) => {
        balance_ecc.value = res.balance_ecc
        balance_bean.value = res.balance_bean
        ecc_price.value = res.ecc_price
        fee_rate.value = res.fee_rate
        bean_per_usdt.value = res.bean_per_usdt
    })
}

const inputAmount = ref()
const type = ref(1) // 1换DN 2换DN
const open = (num:number) => {
    type.value = num
    loadConfig()
    inputAmount.value = ''
    show.value = true
}
// 当前输入DN价值多少 U
const beanPrice = computed(()=>inputAmount.value ? computedDiv(inputAmount.value, bean_per_usdt.value) : 0)
// 当前输入DN能(兑换/消耗)多少DN
const totalEcc = computed(()=> {
    if(!beanPrice.value)return 0
    if(type.value==1)return computedDiv(beanPrice.value, ecc_price.value)
    else return computedDiv(beanPrice.value, ecc_price.value)
})
// DN兑换DN时收取手续费后的最终数量
const realEcc = computed(()=>{
    if(type.value==1)return totalEcc.value
    else {
        const realRate = computedDiv(computedSub(100, fee_rate.value), 100)
        return computedMul(realRate, totalEcc.value)
    }
})

const submit = async () => {
    if(!inputAmount.value)return showToast(t('请输入DN数量'))

    const signInfo = await getSign(type.value==1 ? 'BeanExchange' : 'BeanRedeem')

    await apiPost(type.value==1 ? '/api/beans/exchange' : '/api/beans/redeem', {
        bean_amount: inputAmount.value,
        ...signInfo
    })

    showSuccessToast(t('操作成功'))

    show.value = false

    emits('success')
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.down{
    transform: rotate(180deg);
}
.pop{
    width: 690px;
    height: 912px;
    position: relative;
    padding-top: 60px;
    .close{
        width: 80px;
        height: 80px;
        position: absolute;
        top: 0;
        right: 10px;
        z-index: 1;
    }
    .popContent{
        width: 100%;
        height: 852px;
        background-image: url("@/assets/home/12.png");
        background-size: 100% 100%;
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
            margin-left: auto;
            margin-right: auto;
            width: 282px;
            height: 80px;
            background-image: url("@/assets/home/6.png");
            background-size: 100% 100%;
            text-align: center;
            line-height: 90px;
            span{
                text-shadow: 0 4px 0 #000000;
                font-size: 32px;
                font-weight: bold;
            }
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
    .withdrawInp{
        border: 1px solid rgba($color: #FFFFFF, $alpha: 0.5);
        height: 88px;
        padding: 0 30px;
    }
}
</style>
