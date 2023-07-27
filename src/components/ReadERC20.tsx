import React, { useEffect,useState } from 'react'
import { Text} from '@chakra-ui/react'
import { ethers, BrowserProvider } from 'ethers'
import { ERC20ABI as abi} from "../abi/ERC20ABI";

interface Props {
    addressContract: string,
    currentAccount: string | undefined
}

declare let window:any

export default function ReadERC20(props:Props){

    const addressContract = props.addressContract
    const currentAccount = props.currentAccount
    const [ totalSupply, setTotalSupply ] = useState<string>()
    const [ symbol, setSymbol ] = useState<string>("")
    
    const [ balance, setBalance ] = useState<number|undefined>(undefined)

    useEffect( () => {
        if (!window.ethereum) return

        const provider = new BrowserProvider(window.ethereum)
        const erc20 = new ethers.Contract(addressContract, abi, provider)

        erc20.symbol().then((result:string) => {
            setSymbol(result)
        }).catch(error => console.error(error))

        erc20.totalSupply().then((result:string) => {
            setTotalSupply(ethers.formatEther(result))
        }).catch(error => console.error(error))

    }, [])

    useEffect(() => {
        if(!window.ethereum) return
        if(!currentAccount) return

        queryTokenBalance(window)

    }, [currentAccount])

    async function queryTokenBalance (window:any) {

        const provider = new BrowserProvider(window.ethereum)
        const erc20 = new ethers.Contract(addressContract, abi, provider)

        erc20.balanceOf(currentAccount)
        .then((result:string) => {
            setBalance(Number(ethers.formatEther(result)))
        })
        .catch(error => console.error(error))
    }


    return (
        <div>
            <Text >ERC20 Contract: {addressContract}</Text>
            <Text><b>token totalSupply</b>: {totalSupply} {symbol}</Text>
            <Text my={4}><b>ClassToken in current account</b>: {balance}</Text>
        </div>
    )
}
