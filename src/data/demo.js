// Demo content shown ONLY when Supabase is not configured, so the site can be
// previewed before the database is connected. Once VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY are set, the site reads everything from Supabase and
// this file is ignored. Prices and details here are placeholders.

export const demoLocations = [
  {
    id: 'loc-lahore',
    slug: 'lahore',
    name: 'Lahore',
    tagline: 'Zameen Opal, Raiwind Road',
    description:
      'Furnished apartments inside Zameen Opal in Land Breeze Housing Society, with a rooftop garden, swimming pool, gym and mini cinema.',
    image_url: null,
    sort_order: 1,
  },
  {
    id: 'loc-murree',
    slug: 'murree',
    name: 'Murree',
    tagline: 'Hill-station escapes',
    description: 'Cool mountain air and a private apartment base for your family getaway.',
    image_url: null,
    sort_order: 2,
  },
  {
    id: 'loc-islamabad',
    slug: 'islamabad',
    name: 'Islamabad',
    tagline: 'Coming soon',
    description: 'Furnished stays in the capital are on the way. Contact us to be notified.',
    image_url: null,
    sort_order: 3,
  },
]

export const demoTypes = [
  { id: 'type-studio', slug: 'studio', name: 'Studio Apartment', bedrooms: 0, sort_order: 1 },
  { id: 'type-1', slug: '1-bhk', name: '1 BHK Apartment', bedrooms: 1, sort_order: 2 },
  { id: 'type-2', slug: '2-bhk', name: '2 BHK Apartment', bedrooms: 2, sort_order: 3 },
  { id: 'type-3', slug: '3-bhk', name: '3 BHK Apartment', bedrooms: 3, sort_order: 4 },
]

const amenities = [
  'Fully furnished',
  'Air conditioning',
  'High-speed Wi-Fi',
  'Equipped kitchen',
  'Smart TV',
  'Swimming pool access',
  'Gym access',
  'Rooftop garden',
  'Secure parking',
]

const base = (id, slug, title, locId, typeId, bedrooms, guests, price, area, description) => ({
  id,
  slug,
  title,
  description,
  price,
  image_url: null,
  gallery: [],
  bedrooms,
  bathrooms: Math.max(1, bedrooms),
  guests,
  area_sqft: area,
  amenities,
  whatsapp_number: null,
  featured: true,
  is_published: true,
  location_id: locId,
  type_id: typeId,
})

const rawListings = [
  base(
    'l1',
    'studio-apartment-zameen-opal',
    'Studio Apartment at Zameen Opal',
    'loc-lahore',
    'type-studio',
    0,
    2,
    9000,
    450,
    'A bright, efficient studio for solo travellers and couples, with a comfortable bed, kitchenette and access to the building facilities.\n\nIdeal for business trips and short city breaks.',
  ),
  base(
    'l2',
    '1-bhk-apartment-zameen-opal',
    '1 BHK Apartment at Zameen Opal',
    'loc-lahore',
    'type-1',
    1,
    3,
    13000,
    650,
    'A calm one-bedroom apartment with a separate living area and a fully equipped kitchen, set within the Zameen Opal community.\n\nA comfortable base for couples or a small family.',
  ),
  base(
    'l3',
    '2-bhk-apartment-zameen-opal',
    '2 BHK Apartment at Zameen Opal',
    'loc-lahore',
    'type-2',
    2,
    5,
    18000,
    950,
    'Two well-appointed bedrooms, a generous lounge and a full kitchen. Perfect for family getaways or colleagues travelling together.',
  ),
  base(
    'l4',
    '3-bhk-apartment-zameen-opal',
    '3 BHK Apartment at Zameen Opal',
    'loc-lahore',
    'type-3',
    3,
    7,
    24000,
    1300,
    'Our most spacious apartment, with three bedrooms and ample living space for larger families and extended stays.',
  ),
  base(
    'l5',
    '2-bhk-apartment-murree',
    '2 BHK Apartment in Murree',
    'loc-murree',
    'type-2',
    2,
    5,
    20000,
    900,
    'A cosy two-bedroom apartment in Murree for a cool-weather retreat, with a comfortable lounge and a full kitchen.',
  ),
]

export const demoListings = rawListings.map((l) => ({
  ...l,
  location: demoLocations.find((x) => x.id === l.location_id),
  type: demoTypes.find((x) => x.id === l.type_id),
}))