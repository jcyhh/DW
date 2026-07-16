<template>
    <div class="start flex jc ac">
        <img src="@/assets/common/logo.png" class="startImg animate__animated animate__flipInY" />
    </div>
    <div class="size28 mt30 grey tips animate__animated animate__fadeInUp" v-if="hasMetaMask==2">请安装 MateMask !</div>
</template>

<script setup lang="ts">
import { homePath } from '@/config/index';
import { getRef, getToken, setRef, setToken } from '@/config/storage';
import { loginWithWallet } from '@/dapp/walletLogin';
import { routerReplace } from '@/router';
import { useDappStore } from '@/store';
import { apiPost } from '@/utils/request';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const dappStore = useDappStore()
const { address, hasMetaMask } = storeToRefs(dappStore)

const { params } = useRoute()
if(params?.ref)setRef(params?.ref as any)

// 当钱包对象异步注入到浏览器后，钱包登录 或者 去首页
watch(address, async (val)=>{
    if(!val)return
    setTimeout(() => getToken() ? routerReplace(homePath) : loginIn(), 1500);
},{immediate:true})

// 钱包登录
const loginIn = async () => {
    const { ethereum } = window as any
    const loginInfo = await loginWithWallet(ethereum)
    apiPost('/api/auth/login', {
        ref: getRef(),
        ...loginInfo
    }).then((res:any)=>{
        setToken(res.token)
        routerReplace(homePath)
    })
}
</script>

<style lang="scss" scoped>
.start {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    padding-bottom: 200px;

    .startImg {
        width: 268px;
        height: auto;
    }
}
.tips{
    width: 100vw;
    height: 100px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
    text-align: center;
}
</style>
