import React, { useEffect,useState } from 'react';
import { Text, Button, Input , NumberInput,  NumberInputField,  FormControl,  FormLabel } from '@chakra-ui/react'
import { BrowserProvider, ethers } from 'ethers';
import {ERC20ABI as abi} from '../abi/ERC20ABI'
import { Contract } from "ethers"
import { TransactionResponse, TransactionReceipt } from 'ethers';


interface Props {
    addressContract: string,
    currentAccount: string | undefined
}

declare let window:any

export default function ReadERC20(props:Props){
  const addressContract = props.addressContract
  const currentAccount = props.currentAccount
  const [amount,setAmount]=useState<string>('100')
  const [toAddress, setToAddress]=useState<string>("")

  async function transfer(event:React.FormEvent) {
    event.preventDefault()
    console.log("transfer clicked")
    if (!window.ethereum) return

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const erc20:Contract = new ethers.Contract(addressContract, abi, signer)

    erc20.transfer(toAddress, ethers.parseEther(amount))
    .then((tr: TransactionResponse) => {
        console.log(`TransactionResponse TX hash: ${tr.hash}`)
        tr.wait().then((receipt:TransactionReceipt)=>{
            console.log("transfer receipt",receipt)
        })
      })
      .catch((e:Error)=>console.log(e))

 }

  const handleChange = (value:string) => setAmount(value)

  return (
    <form onSubmit={transfer}>
    <FormControl>
    <FormLabel htmlFor='amount'>Amount: </FormLabel>
      <NumberInput defaultValue={amount} min={10} max={1000} onChange={handleChange}>
        <NumberInputField />
      </NumberInput>
      <FormLabel htmlFor='toaddress'>To address: </FormLabel>
      <Input id="toaddress" type="text" required  onChange={(e) => setToAddress(e.target.value)} my={3}/>
      <Button type="submit" isDisabled={!currentAccount}>Transfer</Button>
    </FormControl>
    </form>
  )
}