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
import { delAddress, delToken, setAddress } from './config/storage';

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
    ethereum.on('accountsChanged', handlerAccountsChanged); // 账户切换或断开钱包链接
    ethereum.on('chainChanged',  handlerChainChanged); // 网络切换
}
// 移除监听
const removeListener = () => {
    ethereum.off('accountsChanged', handlerAccountsChanged);
    ethereum.off('chainChanged',  handlerChainChanged);
}

// 回调：账户切换或断开钱包链接
const handlerAccountsChanged = (accounts: string[]) => {
    const walletAddress = accounts?.[0] || ''

    delToken()
    routerReplace(startPath)

    if(walletAddress){
        setAddress(walletAddress)
    }else{
        delAddress()
    }
    address.value = walletAddress
}

// 回调：网络切换
const handlerChainChanged = async () => {    
    address.value = ''
    delToken()
    removeListener();
    routerReplace(startPath)
    await init();
}

init()
</script>

<style scoped></style>
