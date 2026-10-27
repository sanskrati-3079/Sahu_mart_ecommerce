import type { Category } from '@/types'
import { unsplash } from './images'

export const categories: Category[] = [
  {
    slug: 'sarees',
    name: 'Sarees',
    description: 'Banarasi silks, handloom cottons and airy organzas — six yards of craft for every celebration and every day.',
    image: unsplash('1732381917604-bc8f046965ee', 1000),
    subcategories: ['Banarasi Sarees', 'Silk Sarees', 'Cotton & Handloom', 'Organza & Georgette', 'Bridal Sarees'],
  },
  {
    slug: 'jewellery',
    name: 'Jewellery',
    description:
      'Imitation jewellery in gold-tone and oxidised finishes: jhumkas, chokers, bangles and bridal sets made to complete the look.',
    image: unsplash('1714733831162-0a6e849141be', 1000),
    subcategories: ['Earrings', 'Necklace Sets', 'Bangles & Bracelets', 'Pendants & Chains', 'Rings'],
  },
  {
    slug: 'ethnic-wear',
    name: 'Ethnic Wear',
    description: 'Sarees, kurta sets, lehengas and sherwanis — Indian wear for festivals, weddings and easy everyday elegance.',
    image: unsplash('1665960213508-48f07086d49c', 1000),
    subcategories: [
      "Women's Kurta Sets",
      "Women's Kurtas",
      'Co-ord Sets',
      "Men's Kurta Sets",
      "Men's Kurtas",
      'Festive Wear',
      'Banarasi Sarees',
      'Silk Sarees',
    ],
  },
  {
    slug: 'suits-suiting',
    name: 'Suits & Suiting',
    shortName: 'Suiting',
    description:
      'Suiting fabrics sold by the metre — wool blends, linens and classic poly-viscose for suits, blazers and trousers tailored your way.',
    image: unsplash('1705493253575-e911888621ff', 1000),
    subcategories: ['Suiting Fabric'],
  },
  {
    slug: 'shirting-fabrics',
    name: 'Shirting & Fabrics',
    shortName: 'Fabrics',
    description:
      'Cotton, linen and blended fabrics by the metre, with width and composition clearly listed so your tailor knows exactly what to expect.',
    image: unsplash('1771098403201-8d0d32e2a062', 1000),
    subcategories: ['Shirting Fabric', 'Suiting Fabric'],
  },
  {
    slug: 'kurtas',
    name: 'Kurtas & Kurta Sets',
    shortName: 'Kurtas',
    description: 'Block prints, chikankari and festive silks — kurtas and kurta sets for women and men.',
    image: unsplash('1745313452052-0e4e341f326c', 1000),
    subcategories: ["Women's Kurta Sets", "Women's Kurtas", 'Co-ord Sets', "Men's Kurta Sets", "Men's Kurtas", 'Festive Wear'],
  },
  {
    slug: 'mens-clothing',
    name: "Men's Clothing",
    shortName: 'Men',
    description: 'Shirts, trousers, kurtas and sherwanis for the modern Indian man — from the boardroom to the baraat.',
    image: unsplash('1624835567150-0c530a20d8cc', 1000),
    subcategories: ['Formal Shirts', 'Casual Shirts', 'Formal Trousers', 'Chinos', 'Jeans', "Men's Kurtas", 'Festive Wear'],
  },
  {
    slug: 'trousers',
    name: 'Trousers & Pants',
    shortName: 'Trousers',
    description: 'Formal trousers, chinos and denim in considered fits, with clear waist sizing and stretch where it counts.',
    image: unsplash('1584865288642-42078afe6942', 1000),
    subcategories: ['Formal Trousers', 'Chinos', 'Jeans'],
  },
  {
    slug: 'shirts',
    name: 'Shirts',
    description: 'Crisp formal shirts, relaxed casual shirts and statement prints — in cotton, linen and soft viscose.',
    image: unsplash('1602810316498-ab67cf68c8e1', 1000),
    subcategories: ['Formal Shirts', 'Casual Shirts', 'Party Shirts'],
  },
  {
    slug: 'luggage',
    name: 'Luggage & Trolley Bags',
    shortName: 'Luggage',
    description: 'Cabin trolleys, check-in suitcases and weekenders from Voyager by Sahu — light, tough and made for the long haul.',
    image: unsplash('1670888664952-efff442ec0d2', 1000),
    subcategories: ['Cabin Trolleys', 'Check-in Trolleys', 'Luggage Sets', 'Duffels & Weekenders'],
  },
  {
    slug: 'home-living',
    name: 'Home & Living',
    shortName: 'Home',
    description: 'Cushions, bed linen, ceramics and candles that make a home feel warm, layered and lived in.',
    image: unsplash('1781888693414-ab97da521f2c', 1000),
    subcategories: ['Cushions & Throws', 'Bed Linen', 'Decor & Vases', 'Kitchen & Dining', 'Candles & Fragrance'],
  },
  {
    slug: 'everyday-essentials',
    name: 'Everyday Essentials',
    shortName: 'Essentials',
    description: 'Towels, bottles, totes and the small, useful things you reach for every single day.',
    image: unsplash('1523471826770-c437b4636fe6', 1000),
    subcategories: ['Bath & Towels', 'Bottles & Drinkware', 'Bags & Accessories'],
  },
]

/** Special links that appear alongside categories in navigation. */
export const specialLinks = [
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Sale & Offers', href: '/shop?discount=10' },
]

/** Categories in the order they appear in the desktop mega menu. */
export const menuCategorySlugs = [
  'sarees',
  'jewellery',
  'ethnic-wear',
  'kurtas',
  'mens-clothing',
  'shirts',
  'trousers',
  'suits-suiting',
  'shirting-fabrics',
  'luggage',
  'home-living',
  'everyday-essentials',
]
