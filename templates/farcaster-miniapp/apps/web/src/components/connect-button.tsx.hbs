"use client"

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useMiniApp } from '@/contexts/miniapp-context'

export function WalletConnectButton() {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { context } = useMiniApp()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
        Connect Wallet
      </button>
    )
  }

  if (!isConnected) {
    const frameConnector = connectors.find(connector => connector.id === 'frameWallet')
    
    return (
      <button
        onClick={() => frameConnector && connect({ connector: frameConnector })}
        type="button"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3 py-2"
      >
        Celo
      </button>

      <button
        onClick={() => disconnect()}
        type="button"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
      </button>
    </div>
  )
}
