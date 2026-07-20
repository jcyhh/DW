import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import BigNumber from "bignumber.js";
import { bscMainnet, type SignMessage, testNet, minGas, numRule } from '@/config/dapp';
import { showToast } from "vant";
import { t } from "@/locale";
import { getAddress, setAddress } from "@/config/storage";

export function useEthers() {

    let provider: any = null; // 提供者
    let signer: any = null; // 签名器
    const getEthereum = () => (window as any).ethereum

    // 是否有MetaMask环境
    const checkMetaMask = async () => {
        try {
            const metamask = await detectEthereumProvider({ timeout: 15000 });
            return metamask && metamask === getEthereum() ? 1 : 2;
        } catch (error) {
            return 2;
        }
    }

    // 链接钱包
    const connectWallet = async () => {
        await detectEthereumProvider({ timeout: 15000 });
        const ethereum = getEthereum();
        if(!ethereum)throw new Error('Wallet provider not found');
        provider = new ethers.BrowserProvider(ethereum);
        signer = await provider.getSigner();
        const address = signer.address
        setAddress(signer.address)
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
        const ethereum = getEthereum()
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
        const ethereum = getEthereum()
        const _provider = new ethers.BrowserProvider(ethereum);
        const _signer = await _provider.getSigner();
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = await _signer.signMessage([message, timestamp].join('-'));
        return { signature, timestamp }
    }

    // 检查Gas是否足够
    const checkGas = async () => {
        const ethereum = getEthereum()
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
