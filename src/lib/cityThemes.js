/* City themes for the Locations pages.
   Each city has its own landmark, story, culture highlights and photos.
   Photos come from Wikimedia Commons (free licence). For best speed and
   reliability on the live site, download them into src/assets and replace
   the `commonsFile(...)` calls with imports. */

const COMMONS = 'https://commons.wikimedia.org'

/* Direct link to a Commons file at a given width */
export const commonsFile = (name, width = 1920) =>
  `${COMMONS}/wiki/Special:FilePath/${encodeURIComponent(name)}?width=${width}`

/* Link to the Commons description page (used for photo credit) */
export const commonsPage = (name) =>
  `${COMMONS}/wiki/File:${encodeURIComponent(name.replace(/ /g, '_'))}`

/* The city names here must match the city names used in the booking form
   and in your `locations` table. */
export const CITY_ORDER = ['Lahore', 'Islamabad', 'Murree']

/* `focus` is the object-position used for the photos, so the landmark
   stays in view when the image is cropped to cover its frame. */
export const CITY_THEMES = {
  Lahore: {
    name: 'Lahore',
    eyebrow: 'Lahore · Heart of Punjab',
    title: 'Stay in the city of Mughal heritage',
    short:
      'Furnished apartments near Minar-e-Pakistan, close to gardens, old bazaars and the best of Lahori food.',
    landmark: 'Minar-e-Pakistan',
    landmarkNote: 'Greater Iqbal Park',
    lines: [
      'Lahore is where history, food and hospitality meet. Wake up near the monument that marks the 1940 Lahore Resolution, then spend the day in gardens, old bazaars and Mughal-era landmarks.',
      'Our Lahore apartments keep you close to the city\u2019s best, so every evening can end with a proper Lahori dinner.',
    ],
    highlights: [
      { title: 'Mughal heritage', text: 'Walled City, Badshahi Mosque and Lahore Fort' },
      { title: 'Lahori cuisine', text: 'Food Street, traditional breakfasts and late-night karahi' },
      { title: 'Iqbal Park', text: 'Minar-e-Pakistan and open green evenings' },
    ],
    images: [
      'Minar e Pakistan 2021.jpg',
      'Minar-e-Pakistan Damn cruze DSC 0127a.jpg',
      'The Minar-e-Pakistan.jpg',
    ],
    focus: 'center 35%',
    alt: 'Minar-e-Pakistan in Lahore',
  },

  Islamabad: {
    name: 'Islamabad',
    eyebrow: 'Islamabad · The Capital',
    title: 'Stay in the calm green capital',
    short:
      'Peaceful furnished apartments in the capital, close to the Margalla Hills, Faisal Mosque and Daman-e-Koh.',
    landmark: 'Faisal Mosque',
    landmarkNote: 'Foot of the Margalla Hills',
    lines: [
      'Islamabad is Pakistan\u2019s quiet, orderly capital, set against the Margalla Hills. Its landmark, the Faisal Mosque, is known for a tent-inspired design with no traditional dome.',
      'Stay in a peaceful, tree-lined city with easy access to hiking trails, viewpoints and the Murree road.',
    ],
    highlights: [
      { title: 'Faisal Mosque', text: 'The national mosque, modern in design and open to visitors' },
      { title: 'Margalla Hills', text: 'Hiking trails and calm mountain views' },
      { title: 'Daman-e-Koh', text: 'A viewpoint over the whole city at sunset' },
    ],
    images: [
      'Faisal Masjid From Damn e koh.jpg',
      'Faisal Mosque islamabad 17.jpg',
      'Snow-capped Margalla Hills, Islamabad, Pakistan.jpg',
    ],
    focus: 'center 45%',
    alt: 'Faisal Mosque in Islamabad',
  },

  Murree: {
    name: 'Murree',
    eyebrow: 'Murree · The Queen of Hills',
    title: 'Stay in the cool pine-covered hills',
    short:
      'Cozy furnished apartments in the hills, a short walk from the Mall Road, with cool air and winter snow.',
    landmark: 'The Mall Road',
    landmarkNote: 'Murree hill station',
    lines: [
      'Murree is the classic Pakistani hill station, about an hour from Islamabad. Cool air, misty ridges and, in winter, snowfall bring families here all year.',
      'Walk the Mall Road, warm up with hot tea and chapli kabab, and enjoy views from Pindi Point and Kashmir Point.',
    ],
    highlights: [
      { title: 'The Mall Road', text: 'Shops, cafes and the evening stroll Murree is known for' },
      { title: 'Winter snow', text: 'Snowfall season in the Pir Panjal hills' },
      { title: 'Pindi & Kashmir Point', text: 'Popular viewpoints over the valleys' },
    ],
    images: [
      'Murree City Pakistan Maal Road 02.jpg',
      'Murree Hill View.jpg',
      'Murree hills road.jpg',
    ],
    focus: 'center 50%',
    alt: 'Murree hill station and Mall Road',
  },
}