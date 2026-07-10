<template>
    <CusNav :title="$t('订单列表')"></CusNav>
    <div class="gap130"></div>

    <div class="flex jb pl30 pr30 mb30 rel">
        <div class="tab mr30" :class="current == 0 ? 'tabAct' : 'tabDef'" @click="tabsClick(0)">
            <span>{{ $t('进行中') }}</span>
        </div>
        <div class="tab" :class="current == 1 ? 'tabAct' : 'tabDef'" @click="tabsClick(1)">
            <span>{{ $t('已完成') }}</span>
        </div>
    </div>

    <van-pull-refresh v-bind="props">
        <div class="pl30 pr30 rel">
            <van-list class="fullPage" v-bind="listProps">
                <div class="mb20" v-for="(item, index) in list" :key="index">
                    <CusCard :type="1">
                        <div class="flex jb ac">
                            <div class="size28">{{ $t('总收益') }}</div>
                            <div class="size24">
                                <span v-init="computedAdd(item.extract_amount, item.surplus_amount)"></span>
                                /
                                <span v-init="item.total_amount"></span>
                                USDT
                            </div>
                        </div>
                        <div class="flex jb mt20">
                            <div class="size40 bold linearTxt" v-init="item.total_amount"></div>
                            <div class="progress flex ac">
                                <div class="progressline" :style="{ width: `${getprogress(item)}%` }"></div>
                            </div>
                        </div>
                        <div class="flex jb ac mt40 size24">
                            <div>{{ $t('已领取') }}</div>
                            <div class="bold">
                                <span v-init="computedAdd(item.extract_amount, item.surplus_amount)"></span>
                                <span> USDT</span>
                            </div>
                        </div>
                        <div class="flex jb ac mt24 size24">
                            <div>{{ $t('入单金额') }}</div>
                            <div class="bold">
                                <span v-init="item.amount"></span>
                                <span> USDT</span>
                            </div>
                        </div>
                        <div class="flex jb ac mt24 size24">
                            <div>{{ $t('入单时间') }}</div>
                            <div>{{ item.created_at }}</div>
                        </div>
                    </CusCard>
                </div>
                <CusEmpty v-if="list?.length == 0"></CusEmpty>
            </van-list>
        </div>
    </van-pull-refresh>
</template>

<script setup lang="ts">
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue';
import CusCard from '@/components/CusCard/index.vue';
import CusNav from '@/components/CusNav/Nav.vue'
import { computed, ref } from 'vue';
import { computedAdd, computedDiv } from '@/utils';

const current = ref(0)
const tabsClick = (index: number) => {
    if (current.value == index) return
    current.value = index
    loadList()
}

const params = computed(() => ({
    status: current.value + 2
}))
const { list, props: listProps, loadList } = useLoadList('/api/orders', 'orders', params)
const { props } = usePullRefresh(loadList)
loadList()

const getprogress = (data: any) => {
    if (current.value == 1) return 100
    else {
        const a = computedAdd(data.extract_amount, data.surplus_amount)
        return Math.floor(computedDiv(a, data.total_amount) * 10000) / 100
    }
}
</script>

<style lang="scss" scoped>
.bg {
    width: 100vw;
    height: 537px;
    position: fixed;
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
    height: 367px;
    background-image: url("@/assets/home/11.png");
    background-size: 100% 100%;
    padding: 0 40px;
}

.fullPage {
    width: 100%;
    min-height: calc(100vh - 130px);
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