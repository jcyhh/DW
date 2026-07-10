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

const { ethereum } = window as any;

/**
 * 钱包处理
 */
const { checkMetaMask, connectWallet, checkChain } = useEthers()

const init = async () => {
    hasMetaMask.value = await checkMetaMask()
    if(hasMetaMask.value==1){
        const { address:walletAddress } = await connectWallet() // 连接钱包
        await checkChain() // 检查网络
        createListener() // 创建监听
        address.value = walletAddress
    }else{
        address.value = ''
    }
}

// 创建监听
const createListener = () => {
    ethereum.on('accountsChanged', handlerChanged); // 账户切换或断开钱包链接
    ethereum.on('chainChanged',  handlerChanged); // 网络切换
}
// 移除监听
const removeListener = () => {
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

init()
</script>

<style scoped></style>
