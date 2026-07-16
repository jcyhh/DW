import { ethers } from 'ethers'

type EthereumProvider = {
    request(args: { method: string; params?: unknown[] }): Promise<unknown>
}

export const loginWithWallet = async (ethereum: EthereumProvider) => {
    await ethereum.request({ method: 'eth_requestAccounts' })

    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = await signer.signMessage(`Login-${timestamp}`)

    return { address, signature, timestamp }
}
