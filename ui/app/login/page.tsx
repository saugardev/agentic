'use client';

import { useState } from 'react';

export default function Home() {
  const [walletId, setWalletId] = useState('');
  
  const createNewWallet = async () => {
    const res = await fetch('/api/wallet/create', {
      method: 'POST',
    });
    const data = await res.json();
    setWalletId(data.id);
  };

  const sign = async (message: string) => {
    const res = await fetch('/api/wallet/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletId, message }),
    });
    return await res.json();
  };

  const sendTx = async (to: string, value: number, chainId?: number) => {
    const res = await fetch('/api/wallet/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletId, to, value, chainId }),
    });
    return await res.json();
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <button 
          onClick={createNewWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Wallet
        </button>
        {walletId && (
          <p className="text-sm font-mono">Wallet ID: {walletId}</p>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Sign Message</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const message = (form.elements.namedItem('message') as HTMLInputElement).value;
          const result = await sign(message);
          alert(`Signature: ${result.signature}`);
        }} className="space-y-2">
          <input
            type="text"
            name="message"
            placeholder="Enter message to sign"
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button 
            type="submit"
            disabled={!walletId}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Sign Message
          </button>
        </form>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Send Transaction</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const to = (form.elements.namedItem('to') as HTMLInputElement).value;
          const value = Number((form.elements.namedItem('value') as HTMLInputElement).value);
          const chainId = Number((form.elements.namedItem('chainId') as HTMLInputElement).value);
          const result = await sendTx(to, value, chainId);
          alert(`Transaction hash: ${result.hash}`);
        }} className="space-y-2">
          <input
            type="text"
            name="to"
            placeholder="To address"
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="value"
            placeholder="Value (in wei)"
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="chainId"
            placeholder="Chain ID (default: 11155111)"
            defaultValue="11155111"
            className="w-full px-3 py-2 border rounded"
          />
          <button 
            type="submit"
            disabled={!walletId}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Send Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
