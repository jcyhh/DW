import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import BigNumber from "bignumber.js";
import { bscMainnet, type SignMessage, testNet, minGas, numRule } from '@/config/dapp';
import { showToast } from "vant";
import { t } from "@/locale";
import { getAddress, setAddress } from "@/config/storage";

export function useEthers() {

    const { ethereum } = window as any
    let provider: any = null; // 提供者
    let signer: any = null; // 签名器

    // 是否有MetaMask环境
    const checkMetaMask = async () => {
        const maxRetries = 3;
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                const metamask = await detectEthereumProvider();
                const result = metamask ? (metamask === ethereum ? 1 : 2) : 2;
                
                // 如果检测到 MetaMask (结果为1)，立即返回
                if (result === 1) {
                    return 1;
                }
                
                retryCount++;
                
                // 如果不是最后一次重试，等待一段时间再重试
                if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                retryCount++;
                
                // 如果不是最后一次重试，等待一段时间再重试
                if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        // 三次检测都失败，返回2
        return 2;
    }

    // 链接钱包
    const connectWallet = async () => {
        await detectEthereumProvider();
        provider = new ethers.BrowserProvider(ethereum);
        signer = await provider.getSigner();
        const address = await signer.getAddress()
        setAddress(address)
        return { provider, signer, address }
    }

    // 检查网络
    const checkChain = async () => {
        const network = await provider.getNetwork();
        const chainId: string = network.chainId.toString(); // 当前网络
        const chainInfo = import.meta.env.PROD ? bscMainnet : testNet; // 目标网络
        // const chainInfo = bscMainnet; // 目标网络
        if(chainId != parseInt(chainInfo.chainId).toFixed())await switchChain(chainInfo) // 切换至目标网络
    }

    // 切换网络
    const switchChain = async (chainInfo:any) => {
        if(!import.meta.env.PROD)return true
        try {
            // 切换至目标网络
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chainInfo.chainId }]
            })
        } catch (error:any) {
            if(error.code == 4902){
                // 目标网络未添加
                try {
                    // 添加目标网络
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [chainInfo]
                    })
                } catch (err) {}
            }
        }
    }

    // 获取签名
    const getSign = async (message: SignMessage) => {
        const _provider = new ethers.BrowserProvider(ethereum);
        const _signer = await _provider.getSigner();
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = await _signer.signMessage([message, timestamp].join('-'));
        return { signature, timestamp }
    }

    // 检查Gas是否足够
    const checkGas = async () => {
        const result = await ethereum.request({
            method: 'eth_getBalance',
            params: [getAddress(), "latest"]
        });
        let balanceInEth:any = parseInt(result, 16)
        balanceInEth = new BigNumber(balanceInEth)
        const min = new BigNumber(minGas).times(numRule)
        if(min.comparedTo(balanceInEth) == 1){
            showToast(t('Gas费不足'))
            return false
        }
        return true;
    }

    return {
        checkMetaMask,
        connectWallet, // 链接钱包
        checkChain, // 检查网络
        checkGas, // 检查Gas是否足够
        getSign // 获取签名
    }
}
