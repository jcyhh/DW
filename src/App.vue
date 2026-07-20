<template>
    <RouterView v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" />
    </RouterView>
</template>

<script setup lang="ts">
import { startPath } from '@/config/index';
import { useEthers } from '@/dapp';
import { routerReplace } from './router';
import { useDappStore } from './store';
import { storeToRefs } from 'pinia';
import { delToken } from './config/storage';

const dappStore = useDappStore()
const { hasMetaMask, address } = storeToRefs(dappStore)

const getEthereum = () => (window as any).ethereum
const walletInitEvent = 'wallet:init'

/**
 * 钱包处理
 */
const { checkMetaMask, connectWallet, checkChain } = useEthers()

let initPromise: Promise<void> | null = null

const init = async () => {
    if(initPromise)return initPromise
    initPromise = initWallet().finally(() => {
        initPromise = null
    })
    return initPromise
}

const initWallet = async () => {
    hasMetaMask.value = await checkMetaMask()
    if(hasMetaMask.value==1){
        const { address:walletAddress } = await connectWallet() // 连接钱包
        await checkChain() // 检查网络
        removeListener()
        createListener() // 创建监听
        address.value = walletAddress
    }else{
        removeListener()
        address.value = ''
    }
}

// 创建监听
const createListener = () => {
    const ethereum = getEthereum()
    if(!ethereum)return
    ethereum.on('accountsChanged', handlerChanged); // 账户切换或断开钱包链接
    ethereum.on('chainChanged',  handlerChanged); // 网络切换
}
// 移除监听
const removeListener = () => {
    const ethereum = getEthereum()
    if(!ethereum)return
    ethereum.off('accountsChanged', handlerChanged);
    ethereum.off('chainChanged',  handlerChanged);
}
// 回调：账户切换、断开钱包链接、网络切换
const handlerChanged = async () => {    
    address.value = ''
    delToken()
    removeListener();
    routerReplace(startPath)
    await init();
}

window.addEventListener(walletInitEvent, () => {
    init()
})

init()
</script>

<style scoped></style>
