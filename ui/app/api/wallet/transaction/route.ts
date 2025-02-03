import { PrivyClient } from '@privy-io/server-auth';
import { NextResponse } from 'next/server';

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function POST(req: Request) {
  try {
    const { walletId, to, value, chainId = 11155111 } = await req.json();
    const data = await privy.walletApi.ethereum.sendTransaction({
      walletId,
      method: 'eth_sendTransaction',
      caip2: `eip155:${chainId}`,
      params: {
        transaction: { to, value, chainId },
      },
    });
    return NextResponse.json({ hash: data.hash });
  } catch (error) {
    console.error('Failed to send transaction:', error);
    return NextResponse.json({ error: 'Failed to send transaction' }, { status: 500 });
  }
} 