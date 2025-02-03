'use server';

import { PrivyClient } from '@privy-io/server-auth';

if (!process.env.PRIVY_APP_ID || !process.env.PRIVY_APP_SECRET) {
  throw new Error('Missing Privy environment variables');
}

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET
);

export async function createWallet() {
  try {
    const { id, address, chainType } = await privy.walletApi.create({
      chainType: 'ethereum',
    });
    return { id, address, chainType };
  } catch (error) {
    console.error('Failed to create wallet:', error);
    throw error;
  }
}

export async function signMessage(walletId: string, message: string) {
  try {
    const data  = await privy.walletApi.ethereum.signMessage({
      walletId,
      method: 'personal_sign',
      params: {
        message,
      },
    });
    return data.signature;
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw error;
  }
}

export async function sendTransaction(
  walletId: string,
  to: string,
  value: number,
  chainId: number = 11155111
) {
  try {
    const data = await privy.walletApi.ethereum.sendTransaction({
      walletId,
      method: 'eth_sendTransaction',
      caip2: `eip155:${chainId}`,
      params: {
        transaction: {
          to,
          value,
          chainId,
        },
      },
    });
    return data.hash;
  } catch (error) {
    console.error('Failed to send transaction:', error);
    throw error;
  }
} 