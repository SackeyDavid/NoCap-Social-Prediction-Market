import { getMarketBySlug } from '@/app/actions/markets'
import { notFound } from 'next/navigation'
import { MarketDetailClient } from '@/components/market-detail-client'
import { createClient } from '@/lib/supabase/server'

export default async function MarketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const market = await getMarketBySlug(slug)
  if (!market) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <MarketDetailClient market={market} user={user} />
}
