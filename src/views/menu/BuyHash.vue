<template>
    <van-popup v-model:show="show" style="background-color: transparent !important;" overlay-class="cusMask">
        <div class="popup">
            <div class="flex jb ac">
                <div class="img60"></div>
                <div class="size32 bold">{{ $t('兑换算力') }}</div>
                <div class="img60 flex jc ac" @click="show = false">
                    <van-icon name="cross" :size="30" />
                </div>
            </div>
            <div class="flex jb ac mt40 size24">
                <div>{{ $t('兑换数量') }}</div>
                <div class="gray flex ac">
                    <div class="mr10">{{ $t('可用') }}</div>
                    <div v-if="payType==0">
                        <span v-init="balance_token"></span>
                        DW
                    </div>
                    <div v-else>
                        <span v-init="balance_usdt"></span>
                        USDT
                    </div>
                </div>
            </div>
            <div class="popinp mt24 flex jb ac">
                <input type="number" v-model="inputAmount" :placeholder="$t('请输入')" class="flex1">
                <div class="size24 main" @click="inputAll">{{ $t('全部') }}</div>
            </div>
            <div class="flex jb ac popinp mt24" v-if="payType==0">
                <div v-init="total"></div>
                <div class="main size28" @click="inputAll">USDT</div>
            </div>
            <div class="size24 mt30">{{ $t('支付方式') }}</div>
            <div class="popinp mt24 flex jb ac" @click="paytypeRef.open(payType)">
                <div>{{ payTypes[payType].name }}</div>
                <img src="@/assets/home/24.png" class="img40">
            </div>
            <div class="mt50 pl30 pr30">
                <div class="popbtn flex jc ac size28 bold" @click="submit">
                    <span class="font2">{{ $t('确认') }}</span>
                </div>
            </div>
            <div class="gap20"></div>
        </div>
    </van-popup>

    <CusPicker ref="paytypeRef" :title="$t('支付方式')" :list="payTypes" :default-index="payType" @change="$event=>payType=$event"></CusPicker>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import CusPicker from '@/components/CusPicker/index.vue';
import { t } from '@/locale';
import { apiGet } from '@/utils/request';
import { computedMul } from '@/utils';
import { showToast } from 'vant';

defineProps(['balanceUsdt'])

const emits = defineEmits(['submit'])

const show = ref(false)

const inputAmount = ref()

const open = () => {
    inputAmount.value = ''
    loadBalance()
    show.value = true
}
const close = () => {
    show.value = false
}

/**
 * 质押方式
 */
const paytypeRef = ref()
const payType = ref(0)
const payTypes = computed(()=>([
    {name:`DW ${t('余额')}`, value:1},
    {name:`USDT ${t('余额')}`, value:2}
]))

const balance_usdt = ref(0)
const balance_token = ref(0)
const loadBalance = () => {
    apiGet('/api/users/my').then((res:any)=>{
        balance_usdt.value = res.balance_usdt
        balance_token.value = res.balance_token
    })
}

const price = ref(0)
apiGet('/api/token_price').then((res:any)=>price.value=res.token_price)

const total = computed(()=>{
    if(payType.value==1)return 0
    if(inputAmount.value && price.value){
        return computedMul(inputAmount.value, price.value)
    }else{
        return 0
    }
})

const inputAll = () => {
    let amount:any = 0
    if(payType.value==0)amount = `${balance_token.value}`
    else amount = `${balance_usdt.value}`
    inputAmount.value = amount
}

const submit = async () => {
    
    if(!inputAmount.value)return showToast(t('请输入兑换数量'))

    emits('submit', {
        inputAmount: inputAmount.value,
        amount: payType.value == 0 ? total.value : inputAmount.value,
        payType: payTypes.value[payType.value].value
    })
}

defineExpose({
    open,
    close
})
</script>

<style lang="scss" scoped>
.pop{
    width: 690px;
    height: 889px;
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
        width: 690px;
        height: 734px;
        background-image: url("@/assets/home/25.png");
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
    .inpbox{
        border: 1px solid rgba($color: #FFFFFF, $alpha: 0.5);
        height: 88px;
        padding: 0 30px;
    }
}
</style>
