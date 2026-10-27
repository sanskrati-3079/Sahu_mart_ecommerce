import { useSearchParams } from 'react-router-dom'
import { ListingLayout } from '@/components/listing/ListingLayout'
import { usePageTitle } from '@/components/PageMeta'
import { getAllProducts } from '@/lib/catalog'

function headingFor(sp: URLSearchParams): { title: string; description: string } {
  const keys = [...sp.keys()].filter((k) => k !== 'sort')
  if (sp.get('discount') && keys.length === 1)
    return {
      title: 'Sale & Offers',
      description:
        'Special prices across selected collections — sarees, jewellery, menswear, luggage and more. Prices shown are final and inclusive of all taxes.',
    }
  if (sp.get('sort') === 'newest' && keys.length === 0)
    return {
      title: 'New Arrivals',
      description: 'The newest additions to Sahu Marts — fresh weaves, new silhouettes and travel companions, sorted newest first.',
    }
  if (sp.get('sort') === 'bestselling' && keys.length === 0)
    return { title: 'Bestsellers', description: 'The pieces our customers keep coming back for, across every category.' }
  const occasion = sp.getAll('occasion')
  if (occasion.length === 1 && keys.length === 1)
    return {
      title: `${occasion[0]} Edit`,
      description: `Everything for ${occasion[0].toLowerCase()} occasions — curated across sarees, ethnic wear, jewellery and more.`,
    }
  return {
    title: 'All Products',
    description: 'Sarees, jewellery, ethnic wear, menswear, fabrics, luggage and home essentials — everything you love, all in one place.',
  }
}

export default function Shop() {
  const [sp] = useSearchParams()
  const { title, description } = headingFor(sp)
  usePageTitle(title)
  return (
    <ListingLayout
      title={title}
      description={description}
      crumbs={[{ label: 'Shop', href: '/shop' }, ...(title !== 'All Products' ? [{ label: title }] : [])]}
      base={getAllProducts()}
    />
  )
}
