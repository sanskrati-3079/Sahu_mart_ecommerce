import { usePageTitle } from '@/components/PageMeta'
import { CuratedCollections } from '@/components/home/CuratedCollections'
import { Hero } from '@/components/home/Hero'
import { NewArrivals } from '@/components/home/NewArrivals'
import { Newsletter } from '@/components/home/Newsletter'
import { Offers } from '@/components/home/Offers'
import { SahuEdit } from '@/components/home/SahuEdit'
import { ShopByBudget } from '@/components/home/ShopByBudget'
import { ShopByCategory } from '@/components/home/ShopByCategory'
import { TrendingNow } from '@/components/home/TrendingNow'
import { WhyShop } from '@/components/home/WhyShop'

export default function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
      <ShopByCategory />
      <ShopByBudget />
      <CuratedCollections />
      <TrendingNow />
      <NewArrivals />
      <SahuEdit />
      <Offers />
      <WhyShop />
      <Newsletter />
    </>
  )
}
