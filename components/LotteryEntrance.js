import { useState, useEffect } from 'react'
import { useWeb3Contract, useMoralis } from 'react-moralis'
import { ethers } from 'ethers';
import { useNotification } from 'web3uikit'

import { abi, contractAddresses } from '../constants'

export default function LottertEntracnce() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  console.log("chainId", chainId, { chainIdHex });
  const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0")
  const [numPlayers, setNumPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")

  const dispatch = useNotification(0)

  const { runContractFunction: enterRaffle, data: enterTxResponse, isLoading, isFetching } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress, // specify the network ID
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee
  })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress, // specify the network ID
    functionName: "getEntranceFee",
    params: {},

  })

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress, // specify the network ID
    functionName: "getNumberOfPlayers",
    params: {},

  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress, // specify the network ID
    functionName: "getRecentWinner",
    params: {},

  })

  const updateUI = async () => {
    let entranceFeeFromCall = (await getEntranceFee())?.toString()
    let numPlayersFromCall = (await getNumberOfPlayers())?.toString()
    let recentWinnerFromCall = await getRecentWinner()
    console.log("entranceFeeFromCall", { getEntranceFee });
    // entranceFeeFromCall = entranceFeeFromCall.toString();
    setEntranceFee(entranceFeeFromCall ? ethers.utils.formatUnits(entranceFeeFromCall, "ether") : null)
    setNumPlayers(numPlayersFromCall)
    setRecentWinner(recentWinnerFromCall)
  }

  useEffect(() => {
    if (isWeb3Enabled) {

      updateUI()
    }
  }, [isWeb3Enabled])

  const onEnterRaffleButton = async () => {
    await enterRaffle({
      onSuccess: handleSuccess
    });
  }

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
      handleNotification();
      updateUI();
    } catch (error) {
      console.log(error)
    }
  }

  const handleNotification = async () => {
    dispatch({
      type: "info",
      message: "Transaction Complete",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell"
    })
  }

  return (
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1>
      {raffleAddress ? (
        <>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={onEnterRaffleButton}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
          <div>The current number of players is: {numPlayers}</div>
          <div>The most previous winner was: {recentWinner}</div>
        </>
      ) : (
        <div>
          Please connect to a supported chain
        </div>
      )}
    </div >
  )
}
