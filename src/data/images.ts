/** Builds an Unsplash CDN URL for a photo id. */
export function unsplash(id: string, width = 900): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`
}

/** Returns the same Unsplash image at a different width (for thumbnails / srcset). */
export function resizeImage(url: string, width: number): string {
  if (!url.includes('images.unsplash.com')) return url
  return url.replace(/([?&])w=\d+/, `$1w=${width}`)
}

/** Lifestyle and editorial imagery used outside product cards. */
export const editorial = {
  heroFashion: unsplash('1617627143750-d86bc21e42bb', 1200),
  heroTravel: unsplash('1714235058817-af16a662fe1d', 900),
  sareeEdit: unsplash('1610189013429-a703f4b245cf', 1400),
  essentialsEdit: unsplash('1574421233376-06f2ccf017f7', 1400),
  gentlemanEdit: unsplash('1624835567150-0c530a20d8cc', 1400),
  weddingEdit: unsplash('1735052711950-c31c729c2a4e', 1400),
  travelEdit: unsplash('1502301197179-65228ab57f78', 1400),
  festive: unsplash('1594140700783-f9e70c7abc25', 1200),
  wedding: unsplash('1630526720753-aa4e71acf67d', 1200),
  travel: unsplash('1708403120467-1715bb6840df', 1200),
  everyday: unsplash('1484632152040-840235adc262', 1200),
  fabricsStore: unsplash('1771098403201-8d0d32e2a062', 1400),
  tailoring: unsplash('1718184021018-d2158af6b321', 1200),
  homeLiving: unsplash('1583847268964-b28dc8f51f92', 1400),
  authSignIn: unsplash('1732381917604-bc8f046965ee', 1200),
  authSignUp: unsplash('1770359993283-a2c2f386584e', 1200),
  authForgot: unsplash('1597696929736-6d13bed8e6a8', 1200),
  about: unsplash('1776539788649-365595327e68', 1400),
  aboutCraft: unsplash('1633655442356-ab2dbc69c772', 1200),
  notFound: unsplash('1534534573898-db5148bc8b0c', 1200),
}
