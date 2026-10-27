import { useParams } from 'react-router-dom'
import { ListingLayout } from '@/components/listing/ListingLayout'
import { usePageTitle } from '@/components/PageMeta'
import { resizeImage } from '@/data/images'
import { getByCategory, getCategory } from '@/lib/catalog'
import NotFound from './NotFound'

export default function Category() {
  const { slug = '' } = useParams()
  const category = getCategory(slug)
  usePageTitle(category?.name ?? 'Category not found')
  if (!category)
    return (
      <NotFound
        title="We couldn’t find that category"
        message="It may have been renamed. Browse all products or pick a popular category below."
      />
    )

  return (
    <ListingLayout
      title={category.name}
      description={category.description}
      crumbs={[{ label: 'Shop', href: '/shop' }, { label: category.name }]}
      base={getByCategory(category.slug)}
      aside={
        <div className="hidden overflow-hidden rounded-lg lg:block">
          <img src={resizeImage(category.image, 700)} alt="" className="aspect-[2/1] w-full object-cover" />
        </div>
      }
    />
  )
}
