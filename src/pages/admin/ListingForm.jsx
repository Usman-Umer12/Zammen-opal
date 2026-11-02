
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ImagePlus,
  X,
  Upload,
  Save,
  AlertCircle,
  LoaderCircle,
} from 'lucide-react'
import { supabase, IMAGE_BUCKET, isSupabaseConfigured } from '../../lib/supabase'
import { slugify } from '../../lib/utils'

const empty = {
  title: '',
  slug: '',
  description: '',
  price: '',
  location_id: '',
  type_id: '',
  image_url: '',
  gallery: [],
  bedrooms: 1,
  bathrooms: 1,
  guests: 2,
  area_sqft: '',
  amenities: '',
  whatsapp_number: '',
  featured: false,
  is_published: true,
}

async function uploadImage(file) {
  if (!supabase) throw new Error('Supabase is not configured.')

  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file.')
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size must be less than 10 MB.')
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type,
    })

  if (error) throw error

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)

  if (!data?.publicUrl) {
    throw new Error('Unable to generate image URL.')
  }

  return data.publicUrl
}

export default function ListingForm() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()

  const [form, setForm] = useState(empty)
  const [locations, setLocations] = useState([])
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function init() {
      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase is not configured. Check your environment variables.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      const [loc, typ] = await Promise.all([
        supabase.from('locations').select('id,name').order('sort_order'),
        supabase.from('apartment_types').select('id,name,bedrooms').order('sort_order'),
      ])

      if (!active) return

      if (loc.error || typ.error) {
        setError(loc.error?.message || typ.error?.message || 'Unable to load locations and apartment types.')
        setLoading(false)
        return
      }

      setLocations(loc.data || [])
      setTypes(typ.data || [])

      if (!isNew) {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single()

        if (!active) return

        if (error) {
          setError(error.message)
        } else {
          setForm({
            ...empty,
            ...data,
            price: data.price ?? '',
            area_sqft: data.area_sqft ?? '',
            image_url: data.image_url ?? '',
            whatsapp_number: data.whatsapp_number ?? '',
            gallery: Array.isArray(data.gallery) ? data.gallery : [],
            amenities: Array.isArray(data.amenities)
              ? data.amenities.join('\n')
              : '',
          })
        }
      }

      if (active) setLoading(false)
    }

    init()

    return () => {
      active = false
    }
  }, [id, isNew])

  const set = (key) => (e) => {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value

    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function onTypeChange(e) {
    const typeId = e.target.value
    const selectedType = types.find(
      (item) => String(item.id) === String(typeId)
    )

    setForm((current) => ({
      ...current,
      type_id: typeId,
      bedrooms:
        selectedType?.bedrooms !== null &&
        selectedType?.bedrooms !== undefined
          ? selectedType.bedrooms
          : current.bedrooms,
    }))
  }

  async function onMainImage(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const url = await uploadImage(file)

      setForm((current) => ({
        ...current,
        image_url: url,
      }))
    } catch (err) {
      setError(err.message || 'Image upload failed.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function onGallery(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    setError('')

    try {
      const urls = []

      for (const file of files) {
        urls.push(await uploadImage(file))
      }

      setForm((current) => ({
        ...current,
        gallery: [...current.gallery, ...urls],
      }))
    } catch (err) {
      setError(err.message || 'Gallery upload failed.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function removeGalleryImage(url) {
    setForm((current) => ({
      ...current,
      gallery: current.gallery.filter((image) => image !== url),
    }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }

    if (!form.title.trim()) {
      setError('Please enter the apartment title.')
      return
    }

    if (!form.location_id) {
      setError('Please select a city.')
      return
    }

    if (!form.type_id) {
      setError('Please select an apartment type.')
      return
    }

    if (uploading) {
      setError('Please wait until all images finish uploading.')
      return
    }

    const price = form.price === '' ? null : Number(form.price)
    const area = form.area_sqft === '' ? null : Number(form.area_sqft)

    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      setError('Please enter a valid apartment price.')
      return
    }

    if (area !== null && (!Number.isFinite(area) || area < 0)) {
      setError('Please enter a valid area.')
      return
    }

    setSaving(true)

    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug.trim() || form.title),
      description: form.description.trim(),
      price,
      location_id: form.location_id,
      type_id: form.type_id,
      image_url: form.image_url || null,
      gallery: form.gallery,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      guests: Number(form.guests),
      area_sqft: area,
      amenities: form.amenities
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      whatsapp_number: form.whatsapp_number.replace(/\D/g, '') || null,
      featured: form.featured,
      is_published: form.is_published,
    }

    try {
      const query = isNew
        ? supabase.from('listings').insert(payload)
        : supabase.from('listings').update(payload).eq('id', id)

      const { error } = await query

      if (error) {
        setError(
          error.code === '23505'
            ? 'This URL slug is already being used. Please choose another.'
            : error.message
        )
        return
      }

      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Something went wrong while saving.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-neutral-500">
        <LoaderCircle size={24} className="animate-spin" />
        <p className="text-sm">Loading apartment details...</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-7 text-black">
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to apartments
        </Link>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Property management
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {isNew ? 'Add new apartment' : 'Edit apartment'}
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            Add property information, photos, pricing and availability.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Section
        title="Basic information"
        description="Enter the main details of your apartment."
      >
        <Field label="Apartment title" className="sm:col-span-2">
          <input
            required
            className="admin-field"
            value={form.title}
            onChange={set('title')}
            placeholder="2 BHK Apartment at Zameen Opal"
          />
        </Field>

        <Field label="City / location">
          <select
            required
            className="admin-field"
            value={form.location_id}
            onChange={set('location_id')}
          >
            <option value="">Select city</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          {locations.length === 0 && (
            <p className="mt-1.5 text-xs text-neutral-500">
              No cities found. Add locations to your database first.
            </p>
          )}
        </Field>

        <Field label="Apartment category">
          <select
            required
            className="admin-field"
            value={form.type_id}
            onChange={onTypeChange}
          >
            <option value="">Select apartment type</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {types.length === 0 && (
            <p className="mt-1.5 text-xs text-neutral-500">
              No apartment types found. Add categories to your database first.
            </p>
          )}
        </Field>

        <Field label="Price per night (PKR)">
          <input
            type="number"
            min="0"
            className="admin-field"
            value={form.price}
            onChange={set('price')}
            placeholder="e.g. 15000"
          />
          <p className="mt-1.5 text-xs text-neutral-500">
            Leave empty if the price is available on request.
          </p>
        </Field>

        <Field label="URL slug (optional)">
          <input
            className="admin-field"
            value={form.slug}
            onChange={set('slug')}
            placeholder="Auto-generated from title"
          />
        </Field>

        <Field label="Description" className="sm:col-span-2">
          <textarea
            rows={6}
            className="admin-field resize-y"
            value={form.description}
            onChange={set('description')}
            placeholder="Write a detailed description of this apartment..."
          />
        </Field>
      </Section>

      <Section
        title="Apartment photos"
        description="Upload a main image and additional gallery photos."
      >
        <div className="sm:col-span-2">
          <Field label="Main apartment image">
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {form.image_url && (
                <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                  <img
                    src={form.image_url}
                    alt="Apartment main"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        image_url: '',
                      }))
                    }
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow"
                    aria-label="Remove main image"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:border-black hover:bg-neutral-50">
                <Upload size={17} />
                {form.image_url ? 'Replace main image' : 'Upload main image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onMainImage}
                  disabled={uploading}
                />
              </label>
            </div>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Gallery images">
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {form.gallery.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
                >
                  <img
                    src={src}
                    alt={`Apartment gallery ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(src)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-black opacity-100 shadow transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Remove gallery image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-neutral-600 transition hover:border-black hover:bg-neutral-100">
                <ImagePlus size={23} />
                <span className="text-xs font-medium">Add gallery photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onGallery}
                  disabled={uploading}
                />
              </label>
            </div>

            {uploading && (
              <p className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
                <LoaderCircle size={15} className="animate-spin" />
                Uploading images...
              </p>
            )}

            <p className="mt-2 text-xs text-neutral-500">
              Maximum image size: 10 MB per image.
            </p>
          </Field>
        </div>
      </Section>

      <Section
        title="Apartment details"
        description="Provide accommodation information for visitors."
      >
        <Field label="Bedrooms (0 = Studio)">
          <input
            type="number"
            min="0"
            className="admin-field"
            value={form.bedrooms}
            onChange={set('bedrooms')}
          />
        </Field>

        <Field label="Bathrooms">
          <input
            type="number"
            min="1"
            className="admin-field"
            value={form.bathrooms}
            onChange={set('bathrooms')}
          />
        </Field>

        <Field label="Maximum guests">
          <input
            type="number"
            min="1"
            className="admin-field"
            value={form.guests}
            onChange={set('guests')}
          />
        </Field>

        <Field label="Area (sq. ft.)">
          <input
            type="number"
            min="0"
            className="admin-field"
            value={form.area_sqft}
            onChange={set('area_sqft')}
            placeholder="e.g. 1200"
          />
        </Field>

        <Field label="Amenities (one per line)" className="sm:col-span-2">
          <textarea
            rows={5}
            className="admin-field resize-y"
            value={form.amenities}
            onChange={set('amenities')}
            placeholder={'Air conditioning\nHigh-speed Wi-Fi\nEquipped kitchen\nFree parking'}
          />
        </Field>
      </Section>

      <Section
        title="Inquiry and visibility"
        description="Control how customers contact you and where the apartment appears."
      >
        <Field label="WhatsApp number" className="sm:col-span-2">
          <input
            className="admin-field"
            value={form.whatsapp_number}
            onChange={set('whatsapp_number')}
            placeholder="923282626261"
          />
          <p className="mt-1.5 text-xs text-neutral-500">
            Leave empty to use your website's default WhatsApp number.
          </p>
        </Field>

        <div className="space-y-4 sm:col-span-2">
          <Toggle
            checked={form.is_published}
            onChange={set('is_published')}
            title="Publish apartment"
            description="When enabled, this apartment can appear on your website."
          />

          <Toggle
            checked={form.featured}
            onChange={set('featured')}
            title="Featured apartment"
            description="Mark this apartment as featured for your website."
          />
        </div>
      </Section>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-col gap-3 border-t border-neutral-200 bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:border sm:px-5">
        <p className="hidden text-xs text-neutral-500 sm:block">
          Review your information before saving.
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Link
            to="/admin"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                {isNew ? 'Create apartment' : 'Save changes'}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .admin-field {
          display: block;
          width: 100%;
          min-height: 44px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: #fff;
          padding: 10px 12px;
          color: #171717;
          font-size: 14px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .admin-field:focus {
          border-color: #171717;
          box-shadow: 0 0 0 2px rgba(0,0,0,.06);
        }
        .admin-field::placeholder {
          color: #a3a3a3;
        }
      `}</style>
    </form>
  )
}

function Section({ title, description, children }) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6">
      <div className="border-b border-neutral-100 pb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {children}
      </div>
    </section>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, title, description }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-neutral-200 p-4 transition hover:bg-neutral-50">
      <div>
        <p className="text-sm font-semibold text-neutral-900">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-black"
      />
    </label>
  )
}
