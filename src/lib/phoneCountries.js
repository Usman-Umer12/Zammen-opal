/* ───────── PHONE COUNTRIES & VALIDATION ─────────
   Place this file at: src/lib/phoneCountries.js

   Each country has:
     iso     – 2-letter country code
     name    – display name
     dial    – international dialling code (without +)
     min/max – allowed length of the national number, WITHOUT the leading
               trunk zero (e.g. Pakistan 0300 1234567 -> 3001234567 = 10 digits)
     trunk   – true if the country dials a leading 0 domestically
               (Pakistan: 11 digits with the 0, 10 without)
     start   – optional RegExp the national number must start with
     example – optional example shown in the error message (domestic format)

   To add or fix a country later, edit only the list below. */

const c = (iso, name, dial, min, max, opts = {}) => ({
  iso,
  name,
  dial,
  min,
  max,
  trunk: false,
  ...opts,
})

const RAW_COUNTRIES = [
  c('AF', 'Afghanistan', '93', 9, 9, { trunk: true, start: /^7/ }),
  c('AR', 'Argentina', '54', 10, 11),
  c('AU', 'Australia', '61', 9, 9, { trunk: true, start: /^4/, example: '0412 345 678' }),
  c('AT', 'Austria', '43', 10, 13, { trunk: true }),
  c('AZ', 'Azerbaijan', '994', 9, 9, { trunk: true }),
  c('BH', 'Bahrain', '973', 8, 8),
  c('BD', 'Bangladesh', '880', 10, 10, { trunk: true, start: /^1/, example: '01712 345678' }),
  c('BE', 'Belgium', '32', 8, 9, { trunk: true }),
  c('BR', 'Brazil', '55', 10, 11, { trunk: true }),
  c('CA', 'Canada', '1', 10, 10, { example: '416 555 0123' }),
  c('CN', 'China', '86', 11, 11, { start: /^1/ }),
  c('DK', 'Denmark', '45', 8, 8),
  c('EG', 'Egypt', '20', 10, 10, { trunk: true, start: /^1/ }),
  c('FI', 'Finland', '358', 8, 10, { trunk: true }),
  c('FR', 'France', '33', 9, 9, { trunk: true, start: /^[67]/ }),
  c('DE', 'Germany', '49', 10, 11, { trunk: true, start: /^1/ }),
  c('GR', 'Greece', '30', 10, 10),
  c('HK', 'Hong Kong', '852', 8, 8),
  c('IN', 'India', '91', 10, 10, { trunk: true, start: /^[6-9]/, example: '98765 43210' }),
  c('ID', 'Indonesia', '62', 9, 12, { trunk: true, start: /^8/ }),
  c('IR', 'Iran', '98', 10, 10, { trunk: true, start: /^9/ }),
  c('IQ', 'Iraq', '964', 10, 10, { trunk: true, start: /^7/ }),
  c('IE', 'Ireland', '353', 8, 9, { trunk: true, start: /^8/ }),
  c('IT', 'Italy', '39', 9, 10, { start: /^3/ }),
  c('JP', 'Japan', '81', 10, 10, { trunk: true }),
  c('JO', 'Jordan', '962', 9, 9, { trunk: true, start: /^7/ }),
  c('KZ', 'Kazakhstan', '7', 10, 10, { start: /^7/ }),
  c('KE', 'Kenya', '254', 9, 9, { trunk: true }),
  c('KW', 'Kuwait', '965', 8, 8),
  c('LB', 'Lebanon', '961', 7, 8, { trunk: true }),
  c('MY', 'Malaysia', '60', 9, 10, { trunk: true, start: /^1/ }),
  c('MV', 'Maldives', '960', 7, 7),
  c('MX', 'Mexico', '52', 10, 10),
  c('NP', 'Nepal', '977', 10, 10, { start: /^9/ }),
  c('NL', 'Netherlands', '31', 9, 9, { trunk: true, start: /^6/ }),
  c('NZ', 'New Zealand', '64', 8, 10, { trunk: true }),
  c('NG', 'Nigeria', '234', 10, 10, { trunk: true }),
  c('NO', 'Norway', '47', 8, 8),
  c('OM', 'Oman', '968', 8, 8),
  c('PK', 'Pakistan', '92', 10, 10, {
    trunk: true,
    start: /^3/,
    example: '0300 1234567',
  }),
  c('PH', 'Philippines', '63', 10, 10, { trunk: true, start: /^9/ }),
  c('PL', 'Poland', '48', 9, 9),
  c('PT', 'Portugal', '351', 9, 9),
  c('QA', 'Qatar', '974', 8, 8),
  c('RU', 'Russia', '7', 10, 10, { start: /^9/ }),
  c('SA', 'Saudi Arabia', '966', 9, 9, { trunk: true, start: /^5/, example: '05X XXX XXXX' }),
  c('SG', 'Singapore', '65', 8, 8),
  c('ZA', 'South Africa', '27', 9, 9, { trunk: true }),
  c('KR', 'South Korea', '82', 9, 10, { trunk: true, start: /^1/ }),
  c('ES', 'Spain', '34', 9, 9, { start: /^[67]/ }),
  c('LK', 'Sri Lanka', '94', 9, 9, { trunk: true, start: /^7/ }),
  c('SE', 'Sweden', '46', 7, 9, { trunk: true }),
  c('CH', 'Switzerland', '41', 9, 9, { trunk: true, start: /^7/ }),
  c('TH', 'Thailand', '66', 9, 9, { trunk: true }),
  c('TR', 'Turkey', '90', 10, 10, { trunk: true, start: /^5/ }),
  c('AE', 'United Arab Emirates', '971', 9, 9, { trunk: true, start: /^5/, example: '050 123 4567' }),
  c('GB', 'United Kingdom', '44', 10, 10, { trunk: true, start: /^7/, example: '07123 456789' }),
  c('US', 'United States', '1', 10, 10, { example: '212 555 0123' }),
  c('UZ', 'Uzbekistan', '998', 9, 9),
]

export const DEFAULT_COUNTRY = 'PK'

/* Pakistan first, everything else alphabetical */
export const PHONE_COUNTRIES = [
  ...RAW_COUNTRIES.filter((x) => x.iso === DEFAULT_COUNTRY),
  ...RAW_COUNTRIES.filter((x) => x.iso !== DEFAULT_COUNTRY).sort((a, b) =>
    a.name.localeCompare(b.name),
  ),
]

export const getCountry = (iso) =>
  PHONE_COUNTRIES.find((x) => x.iso === iso) ||
  PHONE_COUNTRIES.find((x) => x.iso === DEFAULT_COUNTRY)

/* Allow only digits, spaces, dashes, brackets and a leading + while typing */
export const sanitizePhoneInput = (value) => value.replace(/[^\d+\s\-()]/g, '')

/* "11" or "10 or 11" or "9 to 10" – digits as the customer types them */
function describeLength(country) {
  const extra = country.trunk ? 1 : 0
  const lo = country.min + extra
  const hi = country.max + extra
  if (country.trunk && country.min === country.max) {
    return `${lo} digits (or ${country.min} without the leading 0)`
  }
  if (lo === hi) return `${lo} digits`
  return `${lo} to ${hi} digits`
}

/**
 * Validate a phone number for a country.
 * Returns { ok: true, national, e164, display } or { ok: false, error }.
 */
export function validatePhone(countryIso, raw) {
  const country = getCountry(countryIso)
  const text = String(raw || '').trim()

  if (!text) return { ok: false, error: 'Please enter your mobile number.' }

  let digits = text.replace(/\D/g, '')
  const typedInternational = text.startsWith('+') || text.startsWith('00')

  /* Customer typed the country code themselves (+92… or 0092…) */
  if (typedInternational) {
    const withoutPrefix = text.startsWith('+') ? digits : digits.slice(2)
    if (!withoutPrefix.startsWith(country.dial)) {
      return {
        ok: false,
        error: `This number does not start with +${country.dial}. Select the correct country code.`,
      }
    }
    digits = withoutPrefix.slice(country.dial.length)
  }

  /* Remove ONE leading trunk zero (0300… -> 300…) */
  let national = digits
  if (country.trunk && national.startsWith('0')) national = national.slice(1)

  const example = country.example ? ` (e.g. ${country.example})` : ''

  if (national.length > country.max) {
    return {
      ok: false,
      error: `Too many digits. A ${country.name} number has ${describeLength(country)}${example}.`,
    }
  }
  if (national.length < country.min) {
    return {
      ok: false,
      error: `Too few digits. A ${country.name} number has ${describeLength(country)}${example}.`,
    }
  }
  if (country.start && !country.start.test(national)) {
    return {
      ok: false,
      error: `This is not a valid ${country.name} mobile number${example}.`,
    }
  }
  if (/^(\d)\1+$/.test(national)) {
    return { ok: false, error: 'Please enter a real mobile number.' }
  }

  return {
    ok: true,
    national,
    e164: `+${country.dial}${national}`,
    display: `+${country.dial} ${national}`,
  }
}