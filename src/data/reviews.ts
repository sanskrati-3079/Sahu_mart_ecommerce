import type { Review } from '@/types'

/**
 * Sample reviews for demonstration only. These are illustrative and are always
 * shown with a "Sample reviews (demo)" label in the UI.
 */
type R = [author: string, city: string, rating: number, title: string, body: string, date: string]

const raw: Record<string, R[]> = {
  'sm-sar-001': [
    [
      'Ananya',
      'Varanasi',
      5,
      'Exactly like the photos',
      'The zari is soft and does not scratch, and the pink is a lovely muted shade. Wore it to my cousin’s engagement and received many compliments.',
      '2026-09-12',
    ],
    [
      'Meera',
      'Pune',
      5,
      'Beautiful drape',
      'Drapes easily and the pleats stay in place. The blouse piece is a rich blue that matches the border perfectly.',
      '2026-08-03',
    ],
    [
      'Kavita',
      'Lucknow',
      4,
      'Lovely, slightly heavy',
      'Very elegant saree. It is a little heavier than I expected, so plan for a long day. Packaging was neat.',
      '2026-07-21',
    ],
    [
      'Ritu',
      'Delhi',
      5,
      'Gifted to my mother',
      'She loved it. The pallu work is detailed and the colours are true to the pictures.',
      '2026-06-30',
    ],
  ],
  'sm-sar-003': [
    [
      'Shreya',
      'Kolkata',
      4,
      'Great for the price',
      'Lightweight and easy to manage for a full day of festivities. The pallu colours are lovely.',
      '2026-09-02',
    ],
    [
      'Pooja',
      'Indore',
      4,
      'Good everyday festive saree',
      'Not pure silk of course, but it looks festive and is easy to wash after dry cleaning once.',
      '2026-08-15',
    ],
    ['Nandini', 'Hyderabad', 5, 'Bought two colours', 'Ordered blue first and liked it so much I ordered teal too.', '2026-07-09'],
  ],
  'sm-sar-008': [
    [
      'Lakshmi',
      'Chennai',
      5,
      'Classic temple border',
      'The red and gold combination is traditional and graceful. Comfortable even in the heat.',
      '2026-09-18',
    ],
    [
      'Divya',
      'Bengaluru',
      4,
      'Soft fabric',
      'Soft cotton silk, good fall. Colour bled slightly on first hand wash, so dry clean first as advised.',
      '2026-08-26',
    ],
    ['Aarti', 'Nagpur', 4, 'Worth it', 'Perfect for poojas and office functions.', '2026-07-14'],
  ],
  'sm-sar-006': [
    [
      'Sowmya',
      'Coimbatore',
      4,
      'Rich colour',
      'The purple is deep and the border looks lovely. Good alternative to a heavier silk.',
      '2026-08-08',
    ],
    ['Priya', 'Mumbai', 5, 'Looks premium', 'People asked if it was a pure Kanjeevaram. Holds pleats well.', '2026-07-02'],
    ['Geeta', 'Jaipur', 4, 'Nice saree', 'Nice saree, the blouse piece could be a little longer.', '2026-06-11'],
  ],
  'sm-jew-001': [
    [
      'Isha',
      'Ahmedabad',
      5,
      'My everyday jhumkas',
      'Lightweight enough to wear all day. Go with everything from kurtas to jeans.',
      '2026-09-20',
    ],
    ['Tanvi', 'Bhopal', 4, 'Pretty and light', 'Pretty finish. Keep them in the pouch so the oxidised colour stays even.', '2026-08-11'],
    ['Neha', 'Chandigarh', 5, 'Great gift', 'Bought three pairs for friends. Everyone loved them.', '2026-07-27'],
    ['Sana', 'Lucknow', 4, 'Good value', 'Good quality for imitation jewellery at this price.', '2026-06-19'],
  ],
  'sm-jew-003': [
    ['Riya', 'Surat', 5, 'Stunning choker', 'Looked lovely with my lehenga. The dori makes it easy to adjust.', '2026-09-06'],
    [
      'Simran',
      'Amritsar',
      4,
      'Beautiful, store carefully',
      'Gorgeous set. Store it flat in the box to keep the pearls neat.',
      '2026-08-01',
    ],
    ['Pallavi', 'Pune', 5, 'Better than expected', 'The finish looks rich and the earrings are not too heavy.', '2026-07-05'],
  ],
  'sm-jew-006': [
    [
      'Komal',
      'Jaipur',
      4,
      'Cheerful colours',
      'Lovely pastel shades. One bangle arrived cracked, but it is a set of 24 so it was fine.',
      '2026-08-29',
    ],
    ['Bhavna', 'Vadodara', 5, 'Perfect for Teej', 'Exactly the festive look I wanted.', '2026-07-30'],
    ['Mansi', 'Kanpur', 4, 'Check your size', 'Measure your size first — 2.6 was right for me.', '2026-06-22'],
  ],
  'sm-kur-001': [
    ['Aditi', 'Bengaluru', 5, 'So comfortable', 'Breathable cotton and a lovely print. My favourite office kurta set now.', '2026-09-14'],
    ['Swati', 'Noida', 5, 'Fits well', 'True to size, and the pants have pockets!', '2026-08-18'],
    ['Rashmi', 'Mysuru', 4, 'Pretty print', 'Lovely print. Slightly see-through in bright sun, so I wear a slip.', '2026-07-24'],
    ['Juhi', 'Patna', 5, 'Washes well', 'Washed it several times and the colours are still bright.', '2026-06-29'],
  ],
  'sm-kur-007': [
    [
      'Rahul',
      'Delhi',
      5,
      'Wore it to a wedding',
      'The colour is rich and the fabric has a subtle sheen. Comfortable all evening.',
      '2026-09-03',
    ],
    ['Arjun', 'Kochi', 4, 'Good fit', 'Regular fit, slightly loose around the waist. Pyjama is comfortable.', '2026-08-09'],
    ['Vikram', 'Jaipur', 5, 'Great value', 'Looks much more expensive than it is.', '2026-07-16'],
  ],
  'sm-kur-008': [
    ['Siddharth', 'Lucknow', 5, 'Clean and classic', 'The embroidery is subtle and neat. A perfect white kurta.', '2026-09-22'],
    ['Imran', 'Hyderabad', 5, 'Wore it for Eid', 'Comfortable cotton and a good length.', '2026-08-24'],
    ['Karan', 'Mumbai', 4, 'Order your usual size', 'Fits true to size. Needs a good iron after washing.', '2026-07-12'],
  ],
  'sm-fab-005': [
    [
      'Prakash',
      'Surat',
      5,
      'Tailor approved',
      'My tailor said it is very good quality cotton. 1.6 m was enough for a full-sleeve shirt.',
      '2026-09-10',
    ],
    [
      'Manoj',
      'Indore',
      4,
      'Nice colour',
      'Soft blue, exactly like the picture. Slight shrinkage after the first wash, so pre-wash it.',
      '2026-08-04',
    ],
    ['Deepak', 'Kolkata', 5, 'Ordering more', 'Smooth and breathable. Will order the white next.', '2026-07-18'],
  ],
  'sm-fab-002': [
    [
      'Rohit',
      'Ludhiana',
      5,
      'Excellent suiting',
      'Lovely drape and the houndstooth looks sharp. Made a two-piece suit with 3.2 m.',
      '2026-09-01',
    ],
    ['Abhishek', 'Pune', 4, 'Good for winter', 'Warm enough for Delhi winters. Dry clean only.', '2026-08-06'],
    ['Nikhil', 'Chandigarh', 5, 'Premium feel', 'Feels much more expensive than the price.', '2026-07-03'],
  ],
  'sm-shi-001': [
    ['Aman', 'Gurugram', 5, 'Perfect office shirt', 'Breathable and looks crisp all day. The tailored fit is spot on.', '2026-09-16'],
    ['Varun', 'Bengaluru', 4, 'Wrinkles a little', 'It is linen, so some creasing is expected. Still my favourite shirt.', '2026-08-20'],
    ['Saurabh', 'Mumbai', 5, 'Great colour', 'The sky blue is lovely and looks great with navy trousers.', '2026-07-28'],
    ['Harsh', 'Ahmedabad', 4, 'Good quality', 'Stitching is neat and buttons are firmly sewn.', '2026-06-25'],
  ],
  'sm-shi-002': [
    ['Ankit', 'Delhi', 5, 'The perfect white shirt', 'Thick enough to not be see-through. Collar holds shape after washes.', '2026-09-08'],
    ['Pranav', 'Nashik', 5, 'Slim fit is great', 'Slim but not tight. Ordered a second one.', '2026-08-13'],
    ['Gaurav', 'Jaipur', 4, 'Iron needed', 'Great shirt, needs a hot iron to look its best.', '2026-07-06'],
  ],
  'sm-tro-001': [
    ['Sahil', 'Pune', 5, 'Sharp and comfortable', 'The stretch makes it comfortable for long workdays. Fits well.', '2026-09-11'],
    ['Ravi', 'Hyderabad', 4, 'Good formal trousers', 'Nice fabric and good finishing. Length needed a small alteration.', '2026-08-17'],
    ['Tushar', 'Nagpur', 5, 'Value for money', 'Bought black and charcoal. Both excellent.', '2026-07-23'],
  ],
  'sm-tro-002': [
    ['Kunal', 'Mumbai', 4, 'Everyday chinos', 'Comfortable and versatile. The beige is a nice warm tone.', '2026-09-04'],
    ['Yash', 'Indore', 5, 'Great fit', 'Fits perfectly at the waist and the slim cut is modern.', '2026-08-10'],
    ['Akash', 'Bhubaneswar', 4, 'Good quality', 'Soft cotton, colour stays after washes.', '2026-07-15'],
  ],
  'sm-lug-001': [
    [
      'Neeraj',
      'Bengaluru',
      5,
      'Fits overhead bins',
      'Used it on three domestic flights — fits easily and the wheels are smooth.',
      '2026-09-19',
    ],
    ['Shalini', 'Delhi', 5, 'Light and sturdy', 'Very light, yet the shell feels strong. Lock is easy to set.', '2026-08-27'],
    ['Mohit', 'Kolkata', 4, 'Minor scuffs', 'Shell picked up a couple of scuffs at the airport but nothing major.', '2026-07-31'],
    ['Farah', 'Mumbai', 5, 'Great buy', 'Great value for a polycarbonate trolley.', '2026-07-01'],
  ],
  'sm-lug-003': [
    [
      'Ajay',
      'Chennai',
      5,
      'Huge capacity',
      'Packed for a three-week trip with room to spare. Compression straps help a lot.',
      '2026-09-07',
    ],
    ['Preeti', 'Lucknow', 4, 'Smooth wheels', 'Wheels glide nicely. A bit heavy when fully packed, as expected.', '2026-08-14'],
    ['Sunil', 'Pune', 5, 'Solid build', 'Survived two international trips without trouble.', '2026-07-19'],
  ],
  'sm-hom-001': [
    ['Ishita', 'Gurugram', 5, 'Rich colour', 'The rust velvet looks gorgeous on my beige sofa. Hidden zip is neat.', '2026-09-09'],
    ['Nidhi', 'Bengaluru', 4, 'Soft and plush', 'Lovely texture. Fillers are not included, so order separately.', '2026-08-19'],
    ['Payal', 'Mumbai', 5, 'Instant upgrade', 'Changed the whole look of my living room.', '2026-07-20'],
  ],
  'sm-hom-007': [
    ['Anjali', 'Pune', 5, 'Lovely fragrance', 'The sandalwood is warm and not overpowering. Burns evenly.', '2026-09-15'],
    ['Zoya', 'Delhi', 5, 'Perfect gift', 'Gifted it for Diwali and they loved it. The amber jar is beautiful.', '2026-08-23'],
    ['Charu', 'Jaipur', 4, 'Good throw', 'Scent fills a medium room. Trim the wick as advised.', '2026-07-25'],
  ],
  'sm-ess-003': [
    ['Rohan', 'Bengaluru', 5, 'Keeps water cold', 'Ice still there after a full day out. No leaks in my bag.', '2026-09-21'],
    ['Megha', 'Hyderabad', 5, 'Lovely colours', 'The peach is beautiful. Grip is comfortable.', '2026-08-28'],
    ['Vivek', 'Kochi', 4, 'Good bottle', 'Works great. Hand wash only, which is fine.', '2026-07-29'],
  ],
  'sm-ess-001': [
    ['Kriti', 'Mumbai', 5, 'So soft', 'Really soft and absorbent. Dries quickly even in monsoon.', '2026-09-13'],
    ['Alok', 'Patna', 4, 'Good towels', 'Thick and fluffy. Slight lint on the first wash.', '2026-08-16'],
    ['Rekha', 'Chennai', 5, 'Great value', 'Excellent quality for a set of two.', '2026-07-11'],
  ],
}

export const reviews: Review[] = Object.entries(raw).flatMap(([productId, list]) =>
  list.map(([author, city, rating, title, body, date], i) => ({
    id: `${productId}-r${i + 1}`,
    productId,
    author,
    city,
    rating,
    title,
    body,
    date,
  })),
)
