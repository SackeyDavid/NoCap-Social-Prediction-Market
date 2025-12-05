import { getMarkets } from '@/app/actions/markets'
import { HomeClient } from '@/components/home-client'

// This page is dynamic because it fetches data from the DB that changes often
export const dynamic = 'force-dynamic';

export default async function Home() {
  const markets = await getMarkets()

  return <HomeClient initialMarkets={markets} />
}
