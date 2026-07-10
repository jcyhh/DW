import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useDappStore = defineStore('dapp', () => {

    const hasMetaMask = ref(0) // 0异步等待钱包对象注入中 1有MetaMask环境 2无MetaMask环境

    const address = ref('') // 钱包地址

    const inviteLink = computed(()=>`${window.origin}/ref/${address.value}`)

    const phaseInfo = ref()

    const currentPhase = ref(0)

    return {
        address,
        phaseInfo,
        currentPhase,
        inviteLink,
        hasMetaMask
    }
})