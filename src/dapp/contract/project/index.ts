import abi from './abi.json'
import { useEthers } from '@/dapp'
import { ethers } from 'ethers'
import { showLoading } from '@/utils'
import { getGasLimit } from '@/config/dapp'
import { closeToast, showFailToast, showSuccessToast } from 'vant'
import { t } from '@/locale'

export function useProject (contractAddress: string = import.meta.env.VITE_PROJECT) {
    let contract:any = null // 合约

    const { connectWallet } = useEthers()

    // 初始化合约
    const init = async () => {
        const { provider, signer } = await connectWallet()
        contract = new ethers.Contract(contractAddress, abi, provider).connect(signer)
    }

    const writeContract = async (method: 'deposit' | 'withdraw', params: any) => {
        console.log(params);
        try {
            showLoading()
            const estimatedGas = await contract[method].estimateGas(params);
            const result = await contract[method](params, { gasLimit: getGasLimit(estimatedGas)})
            await result.wait();
            closeToast()
            showSuccessToast(t('操作成功'))
        } catch (error) {
            console.log(error);
            closeToast()
            showFailToast(t('操作失败'))
            throw new Error('操作失败')
        }
    }

    const writeDeposit = async (params: any) => writeContract('deposit', params)

    const writeWithdraw = async (params: any) => writeContract('withdraw', params)

    return {
        init,
        writeDeposit,
        writeWithdraw
    }
}
