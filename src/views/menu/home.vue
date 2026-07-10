<template>
    <img src="@/assets/home/0.png" class="bg animate__animated animate__fadeInDown ani6">
    <img src="@/assets/imgs/1.png" class="bg1 animate__animated animate__fadeInDown ani6">

    <div class="gap200"></div>
    <div class="gap200"></div>
    <div class="gap200"></div>
    <div class="gap150"></div>
    <div class="rel pl30 pr30" style="z-index: 2;">

        <CusCard :title="`${$t('添加')} LP`">
            <div class="flex jb ac mt40">
                <div class="size26">{{ $t('入单金额') }}</div>
                <div class="gray flex ac size24">
                    <div class="mr10">{{ $t('可用') }}</div>
                    <div v-if="payType == 0">
                        <span v-init="balanceUsdt"></span>
                        USDT
                    </div>
                    <div v-else-if="payType == 1">
                        <span v-init="balance_token"></span>
                        DW
                    </div>
                    <div v-else>
                        <span v-init="balance_usdt"></span>
                        USDT
                    </div>
                </div>
            </div>
            <div class="inpbox mt24 flex jb ac">
                <input type="number" v-model="inputAmount" :placeholder="$t('请输入金额')" class="flex1">
                <div class="size24 main bold" @click="inputAll">{{ $t('全部') }}</div>
            </div>
            <div class="flex jb ac inpbox mt24" v-if="payType == 1">
                <div v-init="total"></div>
                <div class="main size28" @click="inputAll">USDT</div>
            </div>
            <div class="size24 mt30">{{ $t('支付方式') }}</div>
            <div class="inpbox mt24 flex jb ac" @click="paytypeRef.open(payType)">
                <div>{{ payTypes[payType].name }}</div>
                <img src="@/assets/home/24.png" class="img40">
            </div>
            <div class="btn mt70" @click="submit">
                <span class="font2">{{ $t('确认') }}</span>
            </div>
        </CusCard>

        <div class="gap40"></div>

        <CusCard :title="$t('分享链接')">
            <div class="flex ac">
                <img src="@/assets/imgs/2.png" class="pic2 flex0">
                <div class="flex1 ml18">
                    <div class="br size24 lh40 tc">{{ inviteLink }}</div>
                    <div class="copybtn flex jc ac size26 bold mt24" v-copy="inviteLink">{{ $t('复制') }}</div>
                </div>
            </div>
        </CusCard>
    </div>

    <div class="flex rel jc mt80">
        <img src="@/assets/home/15.png" class="img68" @click="goHref('https://x.com/EA_Web3')">
        <img src="@/assets/home/16.png" class="img68 ml60" @click="goHref('https://t.me/EAChian')">
        <img src="@/assets/home/17.png" class="img68 ml60">
        <img src="@/assets/home/18.png" class="img68 ml60">
    </div>

    <div class="mt60 flex jc ac pb30">
        <div class="size20 opc5">©2026 DW All Rights Reserved.</div>
    </div>

    <CusPicker ref="paytypeRef" :title="$t('支付方式')" :list="payTypes" :default-index="payType"
        @change="$event => payType = $event"></CusPicker>
</template>

<script setup lang="ts">
import { useEthers } from '@/dapp';
import { useErc20 } from '@/dapp/contract/erc20/useErc20';
import { useDappStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import CusPicker from '@/components/CusPicker/index.vue';
import { apiGet, apiPost } from '@/utils/request';
import { showToast } from 'vant';
import { t } from '@/locale';
import { useProject } from '@/dapp/contract/project';
import { computedMul } from '@/utils';
import CusCard from '@/components/CusCard/index.vue';

const goHref = (src: string) => location.href = src

/**
 * 质押方式
 */
const paytypeRef = ref()
const payType = ref(0)
const payTypes = computed(() => ([
    { name: `${t('钱包')} USDT`, value: 1 },
    // { name: `DW ${t('余额')}`, value: 2 },
    // { name: `USDT ${t('余额')}`, value: 3 }
]))

const inputAmount = ref()
const inputAll = () => {
    let amount: any = 0
    if (payType.value == 0) amount = `${balanceUsdt.value}`
    else if (payType.value == 1) amount = `${balance_token.value}`
    else amount = `${balance_usdt.value}`
    inputAmount.value = amount
}

const price = ref(0)
apiGet('/api/token_price').then((res: any) => price.value = res.token_price)

const total = computed(() => {
    if (payType.value != 1) return 0
    if (inputAmount.value && price.value) {
        return computedMul(inputAmount.value, price.value)
    } else {
        return 0
    }
})

const dappStore = useDappStore()
const { address } = storeToRefs(dappStore)

const balance_usdt = ref(0)
const balance_token = ref(0)
const referral_code = ref()
const loadBalance = () => {
    apiGet('/api/users/my').then((res: any) => {
        balance_usdt.value = res.balance_usdt
        balance_token.value = res.balance_token
        referral_code.value = res.referral_code
    })
}
loadBalance()

const inviteLink = computed(() => `${window.origin}/ref/${referral_code.value}`)

/**
 * 引入合约
 */
const { checkGas, getSign } = useEthers()

const { balance: balanceUsdt, readBalance, approve: approveUsdt, init: initErc20 } = useErc20(import.meta.env.VITE_PROJECT)

const { writeDeposit, init: initProject } = useProject()

// 初始化
watch(address, async (val) => {
    if (val) {
        initErc20()
        initProject()
    }
}, { immediate: true })

const submit = async () => {

    if (!inputAmount.value) return showToast(t('请输入金额'))

    const gasEnough = await checkGas(); // 检测ETH
    if (!gasEnough) return;

    const signInfo = await getSign('Order')

    await approveUsdt(inputAmount.value)

    apiPost('/api/orders', {
        amount: payType.value == 1 ? total.value : inputAmount.value,
        pay_type: payTypes.value[payType.value].value,
        ...signInfo
    }).then(async (res: any) => {
        const { id, amount, addresses, rates, deadline, sign } = res
        await writeDeposit({
            id,
            amount,
            addresses,
            rates,
            deadline,
            signature: sign
        })
        inputAmount.value = ''
        setTimeout(() => {
            loadBalance()
            readBalance()
        }, 1000);
    })
}

</script>

<style lang="scss" scoped>
.inpbox {
    background-color: #FFFFFF;
    border-radius: 20px;
    height: 88px;
    padding: 0 30px;
    color: #333333;
}

.bg {
    width: 750px;
    height: 942px;
    position: absolute;
    top: 0;
    left: 0;
}
.bg1{
    width: 750px;
    height: 298px;
    position: fixed;
    bottom: 0;
    left: 0;
}

.assetBox {
    width: 558px;
    height: 390px;
    background: linear-gradient(#3F3718, #3F371800);
    position: relative;
    top: -25px;
    left: 16px;
}

.light {
    width: 222px;
    height: 222px;
    position: absolute;
    top: 484px;
    right: 250px;
    z-index: 1;
}

.pic2 {
    width: 212px;
    height: 160px;
}
.copybtn{
    width: 100%;
    height: 64px;
    background-image: url("@/assets/imgs/3.png");
    background-size: 100% 100%;
}

.title {
    width: 590px;
    height: 128px;
    background-image: url("@/assets/home/3.png");
    background-size: 100% 100%;

    span {
        background: linear-gradient(#F2F2F0, #FFFFC0);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        text-shadow: 0 0 20px #FFF07B80;
    }
}

.btn {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    height: 88px;
    line-height: 88px;
    background-image: url("@/assets/home/btn1.png");
    background-size: 100% 100%;
    text-align: center;

    span {
        text-shadow: 0 4px 0 #000000;
        font-size: 32px;
        font-weight: bold;
    }
}

.content {
    width: 690px;
    height: 734px;
    background-image: url("@/assets/home/25.png");
    background-size: 100% 100%;
}

.disable {
    background-image: url("@/assets/home/disable.png") !important;
}

.bot {
    width: 100vw;
    height: 889px;
    background-image: url("@/assets/home/bot.png");
    background-size: 100% 100%;
    position: relative;

    .pic26 {
        width: 100vw;
        height: 562px;
        position: absolute;
        top: 111px;
        left: 0;
    }

    .pic14 {
        width: 750px;
        height: 634px;
        position: relative;
        z-index: 1;
    }

    .bg {
        width: 750px;
        height: 690px;
        position: absolute;
        bottom: 0;
        left: 0;
    }
}

.pop {
    width: 690px;
    height: 912px;
    position: relative;
    padding-top: 60px;

    .close {
        width: 80px;
        height: 80px;
        position: absolute;
        top: 0;
        right: 10px;
        z-index: 1;
    }

    .popContent {
        width: 100%;
        height: 555px;
        background-image: url("@/assets/home/13.png");
        background-size: 100% 100%;

        .title {
            height: 128px;
            background-image: url("@/assets/home/3.png");
            background-size: 100% 100%;

            span {
                background: linear-gradient(#F2F2F0, #FFFFC0);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                color: transparent;
                text-shadow: 0 0 20px #FFF07B80;
            }
        }

        .btn {
            margin-left: auto;
            margin-right: auto;
            width: 282px;
            height: 80px;
            background-image: url("@/assets/home/6.png");
            background-size: 100% 100%;
            text-align: center;
            line-height: 90px;

            span {
                text-shadow: 0 4px 0 #000000;
                font-size: 32px;
                font-weight: bold;
            }
        }
    }

    .submit {
        height: 80px;
        line-height: 80px;
        border-radius: 10px;
        background-color: $main-color;
        color: $black;
        text-align: center;
        font-size: 28px;
    }

    .withdrawInp {
        border: 1px solid #FFFFFF;
        height: 88px;
        padding: 0 30px;
    }
}
</style>
