import type { Collection } from '@/types'
import { editorial } from './images'

export const collections: Collection[] = [
  {
    slug: 'the-saree-edit',
    title: 'The Saree Edit',
    subtitle: 'Six yards, endless stories',
    description:
      'From whisper-light organzas to heirloom Banarasis, our saree edit celebrates the weaves of India — chosen for drape, colour and craft.',
    image: editorial.sareeEdit,
    productIds: ['sm-sar-001', 'sm-sar-006', 'sm-sar-003', 'sm-sar-008', 'sm-sar-010', 'sm-sar-009'],
    href: '/category/sarees',
  },
  {
    slug: 'everyday-essentials',
    title: 'Everyday Essentials',
    subtitle: 'Small things, done well',
    description:
      'Soft towels, a bottle that keeps chai hot, a tote that goes everywhere. The useful, good-looking pieces that make ordinary days easier.',
    image: editorial.essentialsEdit,
    productIds: ['sm-ess-001', 'sm-ess-003', 'sm-ess-004', 'sm-ess-005', 'sm-hom-007', 'sm-ess-002'],
    href: '/category/everyday-essentials',
  },
  {
    slug: 'the-modern-gentleman',
    title: 'The Modern Gentleman',
    subtitle: 'Tailored, relaxed, ready',
    description:
      'Linen-blend shirts, sharp trousers, fine suiting by the metre and a kurta for every celebration. A wardrobe that moves from Monday meetings to Saturday sangeets.',
    image: editorial.gentlemanEdit,
    productIds: ['sm-shi-001', 'sm-tro-001', 'sm-shi-002', 'sm-tro-002', 'sm-fab-002', 'sm-kur-008'],
    href: '/category/mens-clothing',
  },
  {
    slug: 'wedding-festive-edit',
    title: 'Wedding & Festive Edit',
    subtitle: 'Dressed for the celebration',
    description:
      'Bridal Banarasis, velvet lehengas, ivory sherwanis and Kundan-style sets — everything for the shaadi season, from haldi to reception.',
    image: editorial.weddingEdit,
    productIds: ['sm-sar-004', 'sm-kur-006', 'sm-kur-010', 'sm-jew-010', 'sm-sar-002', 'sm-jew-003'],
    href: '/shop?occasion=Wedding',
  },
  {
    slug: 'travel-beautifully-done',
    title: 'Travel Beautifully Done',
    subtitle: 'Pack light, arrive well',
    description: 'Featherlight trolleys, a weekender that ages beautifully and the small essentials that make every journey smoother.',
    image: editorial.travelEdit,
    productIds: ['sm-lug-001', 'sm-lug-007', 'sm-lug-003', 'sm-lug-008', 'sm-ess-003', 'sm-ess-005'],
    href: '/category/luggage',
  },
]
