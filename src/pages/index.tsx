import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from "next/link"
import { VStack, Heading, Box, LinkOverlay, LinkBox} from "@chakra-ui/layout"
import { Text, Button } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { BrowserProvider } from 'ethers'
import ReadERC20 from "../components/ReadERC20"
import TransferERC20 from "../components/TransferERC20"

declare let window:any

const Home: NextPage = () => {
  const [ balance, setBalance ] = useState<string | undefined>()
  const [ currentAccount, setCurrentAccount] = useState<string | undefined>()
  const [ chainId, setChainId ] = useState<number | undefined>()
  const [ chainname, setChainName ] = useState<string | undefined>()

  useEffect(()=> {
    if(!currentAccount || !ethers.isAddress(currentAccount)) return
    //client side code
    if(!window.ethereum) return
    const provider = new ethers.BrowserProvider(window.ethereum)
    
    provider.getBalance(currentAccount).then((result)=>{
      setBalance(ethers.formatEther(result))
    })

    provider.getNetwork().then((result) => {
      setChainId(result.chainId)
      setChainName(result.name)
    })

  }, [currentAccount])

  const onClickConnect = () => {

    if (!window.ethereum) {
      console.log("Please install metamask")
      return
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    provider.send("eth_requestAccounts", [])
    .then((accounts) => {
      if (accounts.length>0) setCurrentAccount(accounts[0])

    })
    .catch((e) => {
      console.log(e)
    })
  }

  const onClickDisconnect = () => {
    console.log("onClickDisConnect")
    setBalance(undefined)
    setCurrentAccount(undefined)
  }

  return ( 
    <>
      <Head>
        <title>My DAPP</title>
      </Head>

      <Heading as="h3"  my={4}>Explore Web3</Heading>          
      <VStack>
        <Box w='100%' my={4}>
        {currentAccount  
          ? <Button type="button" w='100%' onClick={onClickDisconnect}>
                Account:{currentAccount}
            </Button>
          : <Button type="button" w='100%' onClick={onClickConnect}>
                  Connect MetaMask
              </Button>
        }
        </Box>
        {currentAccount  
          ?<Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Account info</Heading>
          <Text>ETH Balance of current account: {balance}</Text>
          <Text>Chain Info: ChainId {chainId} name {chainname}</Text>
        </Box>
        :<></>
        }
...

        <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Read ClassToken info</Heading>
          <ReadERC20 
            addressContract='0x5FbDB2315678afecb367f032d93F642f64180aa3'
            currentAccount={currentAccount}
            />
        </Box>

        <Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Transfer ClassToken</Heading>
          <TransferERC20 
            addressContract='0x5FbDB2315678afecb367f032d93F642f64180aa3'
            currentAccount={currentAccount}
            />
        </Box>

      </VStack>
    </>
  )
}

export default Home