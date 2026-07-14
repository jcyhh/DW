<template>
    <CusNav :title="$t('生态合伙人')"></CusNav>
    <div class="gap200"></div>
    <div class="gap200"></div>
    <div class="gap200"></div>
    <div class="gap30"></div>
    <img src="@/assets/home/31.png" class="bg">
    <div class="rel pl30 pr30" style="z-index: 2;">

        <CusCard :title="$t('生态合伙人')">
            <div class="flex jc">
                <div class="size60 linearTxt bold" v-init="unit_price"></div>
            </div>
            <div class="tc size24 opc5 mt10">{{ $t('购买价格') }}(USDT)</div>
            <div class="size24 mt36">{{ $t('购买数量') }}</div>
            <div class="flex jb ac popinp mt28">
                <input type="number" v-model="inputAmount" :placeholder="$t('请输入购买数量')" class="flex1 size28">
            </div>
            <div class="btn mt50" @click="submit">
                <span class="font2">{{ $t('确认') }}</span>
            </div>
        </CusCard>

    </div>

    <div class="flex jb pl30 pr30 mb30 rel mt40">
        <div class="tab mr30" :class="current == 0 ? 'tabAct' : 'tabDef'" @click="tabsClick(0)">
            <span>{{ $t('进行中') }}</span>
        </div>
        <div class="tab" :class="current == 1 ? 'tabAct' : 'tabDef'" @click="tabsClick(1)">
            <span>{{ $t('已完成') }}</span>
        </div>
    </div>

    <div class="pl30 pr30 rel">
        <van-pull-refresh v-bind="props">
            <van-list class="fullPage" v-bind="listProps">
                <div class="mb20" v-for="(item, index) in list" :key="index">
                    <CusCard :type="1">
                        <div class="flex jb">
                            <div>
                                <div class="size32 bold" v-init="item.released_dn"></div>
                                <div class="size24 opc5 mt10">{{ $t('已释放') }}</div>
                            </div>
                            <div>
                                <div class="progress flex ac">
                                    <div class="progressline" :style="{ width: `${getprogress(item)}%` }"></div>
                                </div>
                                <div class="size24 tr opc6 mt10">
                                    <span>{{ item.released_days || 0 }}</span>
                                    /
                                    <span>{{ item.release_days || 0 }}</span>
                                    {{ $t('天') }}
                                </div>
                            </div>
                        </div>
                        <div class="line mt16"></div>
                        <div class="flex jb ac mt30 size24">
                            <div class="opc6">{{ $t('总释放') }}</div>
                            <div class="bold">
                                <span v-init="item.gift_dn_total"></span>
                                <span> DN</span>
                            </div>
                        </div>
                        <div class="flex jb ac mt24 size24">
                            <div class="opc6">{{ $t('购买总金额') }}</div>
                            <div class="bold">
                                <span v-init="item.amount"></span>
                                <span> USDT</span>
                            </div>
                        </div>
                        <div class="flex jb ac mt24 size24">
                            <div class="opc6">{{ $t('购买数量') }}</div>
                            <div class="bold">x{{ item.quantity || 0 }}</div>
                        </div>
                    </CusCard>
                </div>
                <CusEmpty v-if="list?.length == 0"></CusEmpty>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import CusCard from '@/components/CusCard/index.vue';
import CusNav from '@/components/CusNav/Nav.vue'
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue';
import { computedDiv, computedMul } from '@/utils';
import { apiGet, apiPost } from '@/utils/request';
import { showToast } from 'vant';
import { t } from '@/locale';
import { useEthers } from '@/dapp';
import { useErc20 } from '@/dapp/contract/erc20/useErc20';
import { useDappStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, ref, onMounted, watch } from 'vue';
import { useProject } from '@/dapp/contract/project';

const current = ref(0)
const tabsClick = (index: number) => {
    if (current.value == index) return
    current.value = index
    loadList()
}

const params = computed(() => ({
    status: current.value + 2
}))
const { list, props: listProps, loadList } = useLoadList('/api/partner_orders', 'list', params)
const { props } = usePullRefresh(loadList)
loadList()

const inputAmount = ref()

const getprogress = (data: any) => {
    if (current.value == 1) return 100

    const totalDays = Number(data.release_days || 0)
    if (!totalDays) return 0

    const releasedDays = Number(data.released_days || 0)
    const progress = Math.floor(computedDiv(releasedDays, totalDays) * 10000) / 100
    return Math.min(progress, 100)
}

const unit_price = ref()
const loadData = () => {
    apiGet('/api/partner_orders/config').then((res:any)=>{
        unit_price.value = res.unit_price
    })
}

/**
 * 引入合约
 */
const { checkGas, getSign } = useEthers()

const { approve: approveUsdt, init: initErc20 } = useErc20(import.meta.env.VITE_PROJECT)

const { writeBuyNode, init: initProject } = useProject()

const dappStore = useDappStore()
const { address } = storeToRefs(dappStore)
const zeroAddress = '0x0000000000000000000000000000000000000000'

// 初始化
watch(address, async (val) => {
    if (val) {
        initErc20()
        initProject()
    }
}, { immediate: true })

const submit = async () => {
    if(!inputAmount.value)return showToast(t('请输入购买数量'))
    if(!unit_price.value)return showToast(t('加载中'))

    const gasEnough = await checkGas(); // 检测ETH
    if (!gasEnough) return;

    const signInfo = await getSign('PartnerOrder')

    await approveUsdt(computedMul(inputAmount.value, unit_price.value))

    apiPost('/api/partner_orders', {
        quantity: inputAmount.value,
        ...signInfo
    }).then(async (res: any) => {
        const { id, amount, recipient, weight, quantity, referrer, referralReward, referral_reward, deadline, sign, signature } = res
        await writeBuyNode({
            id,
            amount,
            recipient: recipient || address.value,
            weight: weight ?? quantity,
            referrer: referrer || zeroAddress,
            referralReward: referralReward ?? referral_reward ?? 0,
            deadline,
            signature: sign || signature
        })
        inputAmount.value = ''
        setTimeout(() => {
            loadList()
        }, 3000);
    })
}

onMounted(()=>{
    loadData()
})
</script>

<style lang="scss" scoped>
.bg {
    width: 100vw;
    height: 792px;
    position: absolute;
    top: 0;
    left: 0;
}

.content {
    width: 690px;
    height: 868px;
    background-image: url("@/assets/home/32.png");
    background-size: 100% 100%;
}

.disable {
    background-image: url("@/assets/home/disable.png") !important;
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
    width: 100%;
    height: 88px;
    line-height: 88px;
    background-image: url("@/assets/home/btn1.png");
    background-size: 100% 100%;
    text-align: center;
}

.popinp {
    padding: 24px 30px;
    border-radius: 20px;
    color: #333333;
    background-color: #FFFFFF;
}

.tab {
    padding: 0 30px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    font-weight: bold;
    flex: 1
}

.line{
    width: 100%;
    height: 1px;
    background-color: #FFFFFF33
}

.tabAct {
    @include colorfulCard(40px);
}

.tabDef {
    color: #FFFFFF80;
    background-color: #FFFFFF1A;
    border-radius: 40px;
}

.progress {
    border: 1px solid #1D3097;
    height: 22px;
    border-radius: 11px;
    width: 180px;
    padding: 0 1px;

    .progressline {
        height: 14px;
        border-radius: 7px;
        background: linear-gradient(to right, #CB78FD, #B1E7FE, #2F6CFE);
    }
}
</style>
