<template>
    <van-popup v-model:show="show" style="background-color: transparent !important;" overlay-class="cusMask">
        <div class="popup">
            <div class="flex jb ac">
                <div class="img60"></div>
                <div class="size32 bold">{{ $t('转账') }}</div>
                <div class="img60 flex jc ac" @click="show = false">
                    <van-icon name="cross" :size="30" />
                </div>
            </div>
            <div class="flex jb ac size24 mt50">
                <div>{{ $t('接收地址') }}</div>
            </div>
            <div class="flex jb ac popinp mt28">
                <input type="text" v-model="inputAddress" :placeholder="$t('请输入接收地址')" class="flex1 size28">
                <van-icon name="scan" :size="22" class="scanIcon" @click="scanAddress" />
            </div>
            <div class="flex jb ac size24 mt30">
                <div>{{ $t('转账金额') }}</div>
                <div class="opc6 flex ac">
                    <div class="mr10">{{ $t('可用') }}</div>
                    <div>
                        <span v-init="balance_ecc"></span> DN
                    </div>
                </div>
            </div>
            <div class="flex jb ac popinp mt28">
                <input type="number" v-model="inputAmount" :placeholder="$t('请输入金额')" class="flex1 size28">
                <div class="main size28" @click="inputAll">{{ $t('全部') }}</div>
            </div>
            <div class="mt50 pl30 pr30">
                <div class="popbtn flex jc ac size28 bold" @click="submit">
                    <span class="font2">{{ $t('确认') }}</span>
                </div>
            </div>
            <div class="gap20"></div>
        </div>
    </van-popup>
</template>

<script setup lang="ts">
import { useEthers } from '@/dapp';
import { t } from '@/locale';
import { apiGet, apiPost } from '@/utils/request';
import { showSuccessToast, showToast } from 'vant';
import { ref } from 'vue';
// @ts-expect-error tp-js-sdk has no bundled type declarations.
import tp from 'tp-js-sdk';

const emits = defineEmits(['success'])

const { getSign } = useEthers()

const show = ref(false)

const balance_ecc = ref(0)
const loadBalance = () => {
    apiGet('/api/users/my').then((res:any)=>{
        balance_ecc.value = res.balance_ecc
    })
}

const inputAmount = ref()
const inputAll = () => {
    const amount = balance_ecc.value
    inputAmount.value = Number(amount)
}

const inputAddress = ref()

const evmAddressReg = /0x[a-fA-F0-9]{40}/

const getScanText = (data: unknown): string => {
    if(typeof data === 'string')return data
    if(data && typeof data === 'object'){
        const values = Object.values(data as Record<string, unknown>)
        const text = values.find(item => typeof item === 'string' && (item.includes('0x') || item.includes('address')))
        if(typeof text === 'string')return text
    }
    return ''
}

const parseScanAddress = (data: unknown): string => {
    const text = getScanText(data).trim()
    if(!text)return ''

    try {
        const decodedText = decodeURIComponent(text)
        const match = decodedText.match(evmAddressReg)
        if(match?.[0])return match[0]
    } catch (error) {}

    const match = text.match(evmAddressReg)
    return match?.[0] || ''
}

const scanAddress = async () => {
    try {
        const result = await tp.invokeQRScanner()
        const address = parseScanAddress(result)
        if(!address)return showToast('未识别到接收地址')
        inputAddress.value = address
    } catch (error) {
        console.log(error);
        showToast('扫码失败')
    }
}

const open = () => {
    loadBalance()
    inputAmount.value = ''
    inputAddress.value = ''
    show.value = true
}

const submit = async () => {
    if(!inputAmount.value)return showToast(t('请输入金额'))
    if(!inputAddress.value)return showToast(t('请输入接收地址'))

    const signInfo = await getSign('Transfer')

    await apiPost('/api/transfer', {
        amount: inputAmount.value,
        ccy: 'balance_ecc',
        address: inputAddress.value,
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
        .scanIcon{
            color: #FFFFFF;
            padding: 16px;
            margin-right: -16px;
        }
    }
}
</style>
