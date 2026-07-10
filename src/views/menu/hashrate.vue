<template>
    <CusNav :title="$t('兑换算力')"></CusNav>
    <div class="gap200"></div>
    <div class="gap200"></div>
    <img src="@/assets/home/28.png" class="bg">
    <div class="pl30 pr30 pt30">
        
        <!-- <div class="card flex col jb">
            <div class="flex ac jb pl20">
                <div class="black">
                    <div class="size38 bold" v-init="ecc_hash"></div>
                    <div class="opc6 mt10 size24">{{ $t('我的算力') }}</div>
                </div>
                <div class="btn" @click="buyRef?.open()">
                    <span class="font2">{{ $t('兑换算力') }}</span>
                </div>
            </div>
            <div class="box flex jb ac pr30 pl30 mt30">
                <div class="size24 opc6">{{ $t('全网算力') }}</div>
                <div class="size38 bold" v-init="total_ecc_hash"></div>
            </div>
        </div> -->
        <CusCard :title="$t('算力')">
            <div class="flex jc">
                <div class="size60 linearTxt bold" v-init="ecc_hash"></div>
            </div>
            <div class="tc size24 opc5 mt10">{{ $t('我的算力') }}</div>
            <div class="btn mt70 flex jc ac" @click="buyRef?.open()">
                <span class="size32 bold">{{ $t('兑换算力') }}</span>
            </div>
        </CusCard>

        <div class="gap30"></div>

        <van-pull-refresh v-bind="props">
            <van-list v-bind="listProps">
                <div class="mb20" v-for="(item, index) in list" :key="index">
                    <CusCard :type="1">
                        <div class="flex jb size28">
                            <div>{{ $t('算力') }}</div>
                            <div class="bold">
                                <span v-init="item.amount"></span>
                            </div>
                        </div>
                        <div class="flex jb mt20 size24 gray">
                            <div>{{ item.created_at }}</div>
                        </div>
                    </CusCard>
                </div>
                <CusEmpty v-if="list?.length==0"></CusEmpty>
            </van-list>
        </van-pull-refresh>
    
    </div>

    <BuyHash :balanceUsdt="balanceUsdt" ref="buyRef" @submit="submitBuy"></BuyHash>

</template>

<script setup lang="ts">
import { useEthers } from '@/dapp';
import { useProject } from '@/dapp/contract/project';
import BuyHash from './BuyHash.vue';
import { useDappStore } from '@/store';
import { apiGet, apiPost } from '@/utils/request';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useErc20 } from '@/dapp/contract/erc20/useErc20';
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue';
import CusCard from '@/components/CusCard/index.vue';
import CusNav from '@/components/CusNav/Nav.vue'
import { showSuccessToast } from 'vant';
import { t } from '@/locale/index.ts';

const dappStore = useDappStore()
const { address } = storeToRefs(dappStore)

const { getSign } = useEthers()

const { balance:balanceUsdt, readBalance, init: initErc20 } = useErc20(import.meta.env.VITE_PROJECT)

const { init:initProject } = useProject()

const params = computed(()=>({status:2}))
const { list, props: listProps, loadList } = useLoadList('/api/ecc_orders', 'ecc_orders', params)
const { props } = usePullRefresh(loadList)
loadList()

const ecc_hash = ref()
const total_ecc_hash = ref()
const loadBalance = () => {
    apiGet('/api/users/my').then((res:any)=>{
        ecc_hash.value = res.ecc_hash
    })
    apiGet('/api/ecc_orders/index').then((res:any)=>{
        total_ecc_hash.value = res.total_ecc_hash
    })
}
loadBalance()


watch(address, async (val) => {
    if (val) {
        initErc20()
        initProject()
    }
}, { immediate: true })

// 购买算力
const buyRef = ref()

const submitBuy = async (data:any) => {

    // const gasEnough = await checkGas(); // 检测ETH
    // if (!gasEnough) return;

    const signInfo = await getSign('Power')

    apiPost('/api/ecc_orders',{
        amount: data.amount,
        pay_type: data.payType,
        ...signInfo
    }).then(()=>{
        // const { id, amount, addresses, rates, deadline, sign } = res
        // await writeDeposit({
        //     id,
        //     amount,
        //     addresses,
        //     rates,
        //     deadline,
        //     signature: sign
        // })
        showSuccessToast(t('操作成功'))
        setTimeout(() => {
            buyRef.value?.close()
            readBalance()
        }, 1000);
    })
}
</script>

<style lang="scss" scoped>
.bg {
    width: 100vw;
    height: 723px;
    position: fixed;
    top: 0;
    left: 0;
}
.btn {
    width: 100%;
    height: 88px;
    line-height: 88px;
    background-image: url("@/assets/home/btn1.png");
    background-size: 100% 100%;
}

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

.listcell{
    width: 690px;
    height: 187px;
    background-image: url("@/assets/home/22.png");
    background-size: 100% 100%;
    padding: 0 40px;
}

.pop{
    width: 690px;
    height: 712px;
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
        height: 555px;
        background-image: url("@/assets/home/13.png");
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
