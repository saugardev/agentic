import { PrivyClient } from '@privy-io/server-auth';
import { NextResponse } from 'next/server';

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function POST() {
  try {
    const { id, address, chainType } = await privy.walletApi.create({
      chainType: 'ethereum',
    });
    return NextResponse.json({ id, address, chainType });
  } catch (error) {
    console.error('Failed to create wallet:', error);
    return NextResponse.json({ error: 'Failed to create wallet' }, { status: 500 });
  }
} 