<template>
    <CusNav :title="$t('我的社区')"></CusNav>
    <div class="gap150"></div>

    <div class="pl30 pr30 rel">
        <div class="topcard">
            <div class="size24">{{ $t('团队业绩') }}(USDT)</div>
            <div class="flex mt20">
                <span class="linearTxt size48 bold" v-init="info?.team_kpi"></span>
            </div>
            <div class="size28 mt20">
                <span class="opc6 mr10">{{ $t('小区业绩') }}</span>
                <span v-init="info?.xq_kpi"></span>
                <span class="ml5">USDT</span>
            </div>
            <div class="box mt40">
                <div class="flex jb ac">
                    <div class="opc6">{{ $t('团队人数') }}</div>
                    <div class="bold">{{ info?.team_count || 0 }}</div>
                </div>
                <div class="flex jb ac mt36">
                    <div class="opc6">{{ $t('有效直推') }}</div>
                    <div class="bold">{{ info?.valid_referral_count || 0 }}</div>
                </div>
            </div>
            <div class="level flex col ac">
                <img :src="info?.level?.icon" class="levelicon">
                <div class="leveltag flex ac">{{ $t('当前等级') }} : {{ info?.level?.name }}</div>
            </div>
        </div>
    </div>

    <div class="flex jc ac">
        <img src="@/components/CusCard/5.png" class="img100">
        <div class="size32 bold">{{ $t('分享列表') }}</div>
        <img src="@/components/CusCard/5.png" class="img100">
    </div>
    <div class="flex jc mb30">
        <div class="cuscardline"></div>
    </div>

    <van-pull-refresh class="fullPage" v-bind="props">
        <div class="pl30 pr30">
            <van-list v-bind="listProps">
                <div class="mb20" v-for="(item, index) in list" :key="index">
                    <CusCard :type="1">
                        <div class="flex jb ac">
                            <div class="size28">{{ item.nickname }}</div>
                            <div class="green size24" v-if="item.kpi > 0">{{ $t('有效用户') }}</div>
                        </div>
                        <div class="gray size24 mt10">{{ item.created_at }}</div>
                        <div class="flex jb mt30">
                            <div class="size24">{{ $t('团队业绩') }}</div>
                            <div class="sze28">
                                <span v-init="item.team_kpi"></span>
                                USDT
                            </div>
                        </div>
                        <div class="flex jb mt20">
                            <div class="size24">{{ $t('个人业绩') }}</div>
                            <div class="sze28">
                                <span v-init="item.kpi"></span>
                                USDT
                            </div>
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
import { apiGet } from '@/utils/request';
import { ref } from 'vue';
import CusNav from '@/components/CusNav/Nav.vue'
import CusCard from '@/components/CusCard/index.vue';

const { list, props: listProps, loadList } = useLoadList('/api/users/my/referrals', 'referrals')
const { props } = usePullRefresh(loadList)
loadList()

const info = ref()
apiGet('/api/users/my').then(res => info.value = res)
</script>

<style lang="scss" scoped>
.topcard {
    padding: 40px 30px;
    position: relative;
    @include colorfulCard(30px,
        #000689CC,
        linear-gradient(133.86deg, #00FFE6 1%, rgba(100, 168, 243, 0) 50%, #C850FF 99%));

    .box {
        background-color: #1D3097;
        border-radius: 20px;
        padding: 30px;
    }

    .level {
        position: absolute;
        right: 30px;
        top: -20px;
        z-index: 1;

        .levelicon {
            width: 200px;
            height: auto;
            margin-bottom: -18px;
        }

        .leveltag {
            @include colorfulCard(26px, #001069CC);
            padding: 0 20px;
            height: 52px;
            color: #B1CBFE;
            font-size: 24px;
            position: relative;
            z-index: 1;
        }
    }
}

.cuscardline {
    width: 320px;
    height: 1px;
    background: linear-gradient(90deg, rgba(139, 114, 254, 0) 0%, #8B72FE 50%, rgba(139, 114, 254, 0) 100%);
}

.boxitem {
    border: 1px solid rgba($color: #FFFFFF, $alpha: 0.5);
    border-radius: 10px;
    padding: 30px 24px;
}

@keyframes bgAni {

    0%,
    100% {
        transform: scaleX(1);
        transform: scaleY(1);
    }

    50% {
        transform: scaleX(1.05);
        transform: scaleY(1.01);
    }
}

.bgAni {
    transform-origin: center bottom;
    animation: bgAni 2s ease-in-out infinite;
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

.bg {
    width: 100vw;
    height: 436px;
    position: absolute;
    top: 140px;
    left: 0;
}

.count {
    background: linear-gradient(#F2F2F0, #FFFFC0);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}

.cell {
    height: 110px;
    background-image: url("@/assets/home/21.png");
    background-size: 100% 100%;
    position: relative;
    z-index: 1;
    padding: 0 30px;

    .address {
        width: 400px;
    }
}

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

.card {
    width: 690px;
    height: 316px;
    background-image: url("@/assets/home/11.png");
    background-size: 100% 100%;
    padding: 0 40px;
}

.fullPage {
    width: 100%;
    min-height: 100vh;
}

.statCard {
    width: 658px;
    height: 420px;
    background-image: url("@/assets/home/7.png");
    background-size: 100% 100%;
    position: relative;
    margin: 0 auto;
    padding: 186px 50px 54px 50px;

    .box {
        width: 558px;
        height: 180px;
        background-color: #171306;
        border-radius: 19px;
    }

    .levelbox {
        position: absolute;
        top: -5px;
        right: 100px;

        .level {
            width: 120px;
            height: auto;
        }
    }

    .role {
        width: 400px;
        height: 412px;
        position: absolute;
        top: 0;
        left: -46px;
    }
}
</style>