<template>
    <CusNav :title="$t('我的资产')"></CusNav>
    <div class="gap200"></div>
    <div class="gap200"></div>
    <img src="@/assets/home/28.png" class="bg">

    <div class="pl30 pr30 rel mt80">
        <CusCard :title="$t('资产')">
            <div class="flex jc">
                <div class="size60 linearTxt bold" v-init="balance_usdt"></div>
            </div>
            <div class="tc size24 opc5 mt10">USDT {{ $t('余额') }}</div>
            <div class="box mt30">
                <div class="flex jb ac">
                    <div class="size28">DW {{ $t('余额') }}</div>
                    <div class="tr">
                        <div class="size28" v-init="balance_token"></div>
                        <div class="purple size20 mt10">
                            ≈<span v-init="token_total_usdt"></span>USDT
                        </div>
                    </div>
                </div>
                <div class="flex jb ac mt36">
                    <div class="size28">DN {{ $t('余额') }}</div>
                    <div>
                        <div class="flex ac je">
                            <div class="size28" v-init="balance_ecc"></div>
                            <!-- <img src="@/assets/home/30.png" class="img40 ml10" @click="swapRef?.open(2)"> -->
                        </div>
                        <div class="purple size20 mt10">
                            ≈<span v-init="edd_total_usdt"></span>USDT
                        </div>
                    </div>
                </div>
                <!-- <div class="flex jb ac mt36">
                    <div class="size28">{{ $t('DN余额') }}</div>
                    <div>
                        <div class="flex ac je">
                            <div class="size28" v-init="balance_bean"></div>
                            <img src="@/assets/home/30.png" class="img40 ml10" @click="swapRef?.open(1)">
                        </div>
                    </div>
                </div> -->
                <div class="flex jb ac mt36">
                    <div class="size28">{{ $t('权益值') }}</div>
                    <div class="flex ac">
                        <div class="size28" v-init="equity"></div>
                    </div>
                </div>
                <div class="flex jb ac mt36">
                    <div class="size28">{{ $t('红包') }}</div>
                    <div class="flex ac">
                        <div class="size28" v-init="balance_partner_usdt"></div>
                    </div>
                </div>
            </div>
            <div class="flex jb ac mt40">
                <div class="btn btn1" @click="open">
                    <span>{{ $t('提取') }}</span>
                </div>
                <div class="btn btn2" @click="transferRef?.open()">
                    <span>{{ $t('转账') }}</span>
                </div>
            </div>
        </CusCard>
    </div>

    <div class="flex mt50 mb30 pl30 pr30 font1 rel scrolltab tc">
        <div class="tab flex0 delay3 mr20" :class="current == 0 ? 'tabAct' : 'tabDef'" @click="tabsClick(0)"
            v-on-show="'animate__flipInY'">
            <span>DW {{ $t('明细') }}</span>
        </div>
        <div class="tab flex0 delay3 mr20" :class="current == 2 ? 'tabAct' : 'tabDef'" @click="tabsClick(2)"
            v-on-show="'animate__flipInY'">
            <span>DN {{ $t('明细') }}</span>
        </div>
        <div class="tab flex0 delay3 mr20" :class="current == 1 ? 'tabAct' : 'tabDef'" @click="tabsClick(1)"
            v-on-show="'animate__flipInY'">
            <span>USDT {{ $t('明细') }}</span>
        </div>
        <div class="tab flex0 delay3" :class="current == 3 ? 'tabAct' : 'tabDef'" @click="tabsClick(3)"
            v-on-show="'animate__flipInY'">
            <span>{{ $t('红包') }}</span>
        </div>
    </div>

    <van-pull-refresh v-bind="props">
        <div class="pl30 pr30 rel">
            <van-list v-bind="listProps">
                <div class="mb20" v-for="(item, index) in list" :key="index">
                    <CusCard :type="1">
                        <div class="flex jb ac size28">
                            <div>{{ item.content }}</div>
                            <div class="bold" v-if="item.is_inc">
                                +
                                <span v-init="item.amount"></span>
                            </div>
                            <div class="red bold" v-else>
                                -
                                <span v-init="item.amount"></span>
                            </div>
                        </div>
                        <div class="flex jb ac mt20 size24 gray">
                            <div>{{ item.created_at }}</div>
                            <div v-if="current == 0">DW</div>
                            <div v-else-if="current == 1">USDT</div>
                            <div v-else-if="current == 2">DN</div>
                            <div v-else>{{ $t('红包') }}</div>
                        </div>
                    </CusCard>
                </div>
                <CusEmpty v-if="list?.length == 0"></CusEmpty>
            </van-list>
        </div>
    </van-pull-refresh>

    <van-popup v-model:show="show" style="background-color: transparent !important;" overlay-class="cusMask">
        <div class="popup">
            <div class="flex jb ac">
                <div class="img60"></div>
                <div class="size32 bold">{{ $t('提取') }}</div>
                <div class="img60 flex jc ac" @click="show = false">
                    <van-icon name="cross" :size="30" />
                </div>
            </div>

            <div class="flex jb ac size24 mt40">
                <div>{{ $t('提取金额') }}</div>
                <div class="opc6 flex ac">
                    <div class="mr10">{{ $t('可用') }}</div>
                    <div v-if="cur == 0">
                        <span v-init="balance_token"></span> DW
                    </div>
                    <div v-else-if="cur == 1">
                        <span v-init="balance_usdt"></span> USDT
                    </div>
                    <div v-else-if="cur == 2">
                        <span v-init="balance_ecc"></span> DN
                    </div>
                    <div v-else-if="cur == 3">
                        <span v-init="balance_partner_usdt"></span> {{ $t('红包') }}
                    </div>
                </div>
            </div>
            <div class="flex jb ac popinp mt28">
                <input type="number" v-model="inputAmount" :placeholder="$t('请输入金额')" class="flex1 size28">
                <div class="main size28 bold" @click="inputAll">{{ $t('全部') }}</div>
            </div>
            <div class="flex jb ac popinp mt28" v-if="cur == 0 || cur == 2">
                <div v-init="total"></div>
                <div class="main size28" @click="inputAll">USDT</div>
            </div>

            <div class="flex jb ac size24 mt30">
                <div>{{ $t('币种') }}</div>
                <div class="opc6">
                    <span>{{ $t('手续费') }}</span>
                    <span v-if="cur == 2">{{ ecc_fee_rate }}</span>
                    <span v-else-if="cur == 3">{{ partner_fee_rate }}</span>
                    <span v-else>{{ fee }}</span>
                    %
                </div>
            </div>
            <div class="flex jb ac popinp mt28" @click="pickerRef.open(cur)">
                <div>{{ types[cur].name }}</div>
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

    <CusPicker ref="pickerRef" :list="types" :default-index="cur" @change="$event => cur = $event"></CusPicker>

    <Transfer ref="transferRef" @success="onSuccess"></Transfer>

    <Swap ref="swapRef" @success="onSuccess"></Swap>
</template>

<script setup lang="ts">
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue';
import CusNav from '@/components/CusNav/Nav.vue'
import { computed, ref, watch } from 'vue';
import CusPicker from '@/components/CusPicker/index.vue';
import { apiGet, apiPost } from '@/utils/request';
import { useEthers } from '@/dapp';
import { useProject } from '@/dapp/contract/project';
import { useDappStore } from '@/store';
import { storeToRefs } from 'pinia';
import { showToast } from 'vant';
import { t } from '@/locale';
import { computedMul } from '@/utils';
import Transfer from './Transfer.vue';
import Swap from './Swap.vue';
import CusCard from '@/components/CusCard/index.vue';

const dappStore = useDappStore()
const { address } = storeToRefs(dappStore)

const { checkGas, getSign } = useEthers()

const { writeWithdraw, init: initProject } = useProject()

watch(address, async (val) => {
    if (val) {
        initProject()
    }
}, { immediate: true })

const transferRef = ref()

const fee = ref(0)
const ecc_fee_rate = ref(0)
const partner_fee_rate = ref(0)
apiGet('/api/withdraws/fee').then((res: any) => {
    fee.value = res.fee_rate
    ecc_fee_rate.value = res.ecc_fee_rate
    partner_fee_rate.value = res.partner_fee_rate
})

const price = ref(0)
const eccPrice = ref(0)
apiGet('/api/token_price').then((res: any) => {
    price.value = res.token_price
    eccPrice.value = res.ecc_price
})

const max_amount = ref(0)
apiPost('/api/withdraws/withdraw_max_amount').then((res: any) => max_amount.value = res.max_amount)

const balance_usdt = ref(0)
const balance_token = ref(0)
const balance_ecc = ref(0)
const balance_bean = ref(0)
const equity = ref(0)
const balance_partner_usdt = ref(0)
const token_total_usdt = computed(() => {
    if (balance_token.value && price.value) return computedMul(balance_token.value, price.value)
    else return 0
})
const edd_total_usdt = computed(() => {
    if (balance_ecc.value && eccPrice.value) return computedMul(balance_ecc.value, eccPrice.value)
    else return 0
})
const loadBalance = () => {
    apiGet('/api/users/my').then((res: any) => {
        balance_usdt.value = res.balance_usdt
        balance_token.value = res.balance_token
        balance_ecc.value = res.balance_ecc
        balance_bean.value = res.balance_bean
        equity.value = res.equity
        balance_partner_usdt.value = res.balance_partner_usdt
    })
}
loadBalance()

const current = ref(0)
const tabsClick = (index: number) => {
    if (current.value == index) return
    current.value = index
    loadList()
}

const params = computed(() => ({ ccy: current.value == 3 ? 'balance_partner_usdt' : types.value[current.value].value }))
const { list, props: listProps, loadList } = useLoadList('/api/users/my/balance_logs', 'balance_logs', params)
const { props } = usePullRefresh(loadList)
loadList()

const pickerRef = ref()
const cur = ref(0)
const types = computed(() => ([
    { name: 'DW', value: 'balance_token' },
    { name: 'USDT', value: 'balance_usdt' },
    { name: 'DN', value: 'balance_ecc' },
    { name: `${t('红包')}`, value: 'balance_partner_usdt' }
]))

const show = ref(false)
const inputAmount = ref()
const total = computed(() => {
    if (cur.value == 1) return 0
    const coinPice = cur.value == 0 ? price.value : eccPrice.value
    if (cur.value == 0) {
        if (inputAmount.value && coinPice) {
            const num = Number(computedMul(inputAmount.value, coinPice).toFixed(0))
            return Math.min(num, max_amount.value)
        } else {
            return 0
        }
    } else {
        if (inputAmount.value && coinPice) {
            return Number(computedMul(inputAmount.value, coinPice).toFixed(0))
        } else {
            return 0
        }
    }
})
const open = () => {
    inputAmount.value = ''
    show.value = true
}
const inputAll = () => {
    let amount;
    if (cur.value == 0) amount = balance_token.value
    else if (cur.value == 1) amount = balance_usdt.value
    else amount = balance_ecc.value
    inputAmount.value = amount
}
const submit = async () => {
    if (!inputAmount.value) return showToast(t('请输入金额'))

    const gasEnough = await checkGas(); // 检测ETH
    if (!gasEnough) return;

    const signInfo = await getSign('Claim')

    apiPost('/api/withdraws', {
        amount: cur.value == 0 || cur.value == 2 ? total.value : inputAmount.value,
        ccy: types.value[cur.value].value,
        ...signInfo
    }).then(async (res: any) => {
        const { id, token, feeAddresses, feeRates, amount, totalFeeRate, burnRate, minPoolUsdt, deadline, sign } = res.info
        await writeWithdraw({
            id,
            token,
            feeAddresses,
            feeRates,
            amount,
            totalFeeRate,
            burnRate,
            minPoolUsdt,
            deadline,
            signature: sign
        })

        show.value = false
        setTimeout(() => {
            loadBalance()
        }, 1000);
    }).catch((err) => {
        console.log(err);

    })
}

const onSuccess = () => {
    loadList()
    loadBalance()
}
</script>

<style lang="scss" scoped>
.bg {
    width: 100vw;
    height: 723px;
    position: absolute;
    top: 0;
    left: 0;
}

.head {
    width: 100vw;
    padding: 0 30px;
    height: 100px;
    background-color: #1A1A1A;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
}

.card {
    width: 690px;
    aspect-ratio: 610 / 166;
    background-image: url("@/assets/home/22.png");
    background-size: 100% 100%;
    padding: 0 40px;
}

.fullPage {
    width: 100%;
    min-height: calc(100vh - 130px);
}

.tab {
    padding: 0 30px;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    font-weight: bold;
}

.tabAct {
    @include colorfulCard(32px);
}

.tabDef {
    color: #FFFFFF80;
    background-color: #FFFFFF1A;
    border-radius: 32px;
}

.scrolltab {
    width: 100%;
    overflow-x: scroll;

    &::-webkit-scrollbar {
        display: none;
    }
}

.box {
    background-color: #1D3097;
    border-radius: 20px;
    padding: 30px;
}

.btn {
    width: 300px;
    height: 80px;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
}

.btn1 {
    background-image: url("@/assets/imgs/4.png");
}

.btn2 {
    background-image: url("@/assets/imgs/5.png");
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
        height: 852px;
        background-image: url("@/assets/home/12.png");
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
        border: 1px solid rgba($color: #FFFFFF, $alpha: 0.5);
        height: 88px;
        padding: 0 30px;
    }
}
</style>
