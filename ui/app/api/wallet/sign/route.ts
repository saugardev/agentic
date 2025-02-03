import { PrivyClient } from '@privy-io/server-auth';
import { NextResponse } from 'next/server';

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function POST(req: Request) {
  try {
    const { walletId, message } = await req.json();

    const signature = await privy.walletApi.rpc({
      walletId,
      method: 'personal_sign',
      params: {
        message
      }
    });
    console.log(signature);

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Failed to sign message:', error);
    return NextResponse.json({ error: 'Failed to sign message' }, { status: 500 });
  }
} 