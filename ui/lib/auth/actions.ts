'use server'

import { cookies } from 'next/headers'

export async function getUserAddress(): Promise<string | null> {
  const cookieStore = await cookies();
  const userAddress = cookieStore.get('user_address')?.value
  return userAddress || null
} 