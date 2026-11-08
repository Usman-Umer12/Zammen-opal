import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'

import { supabase } from '../../lib/supabase'

const BUCKET = 'hero-images'
const MAX_SIZE_MB = 6
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

const uid = () => Math.random().toString(36).slice(2, 10)

const fromRow = (row) => ({
  uid: row.id,
  id: row.id,
  image_url: row.image_url || '',
  original_image_url: row.image_url || '',
  title: row.title || '',
  subtitle: row.subtitle || '',
  description: row.description || '',
  is_active: row.is_active,
  isNew: false,
  dirty: false,
})

const blankSlide = () => ({
  uid: `new-${uid()}`,
  id: null,
  image_url: '',
  original_image_url: '',
  title: '',
  subtitle: '',
  description: '',
  is_active: true,
  isNew: true,
  dirty: true,
})

/* Storage path from a public URL (null if the file is not in our bucket) */
const pathFromUrl = (url) => {
  if (!url || !url.includes(`/${BUCKET}/`)) return null
  return decodeURIComponent(url.split(`/${BUCKET}/`)[1].split('?')[0])
}

const removeFile = async (url) => {
  const path = pathFromUrl(url)
  if (path) await supabase.storage.from(BUCKET).remove([path])
}

const inputClass =
  'mt-2 w-full border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black'
const labelClass = 'block text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500'

export default function HeroAdmin() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState({}) // { [uid]: 'saving' | 'uploading' | 'deleting' }
  const fileInputs = useRef({})

  const setBusyFor = (key, value) =>
    setBusy((prev) => {
      const next = { ...prev }
      if (value) next[key] = value
      else delete next[key]
      return next
    })

  const flash = (message) => {
    setNotice(message)
    setTimeout(() => setNotice(''), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error: err } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (err) setError(err.message)
    else setSlides((data || []).map(fromRow))

    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const patch = (key, changes) =>
    setSlides((prev) =>
      prev.map((s) => (s.uid === key ? { ...s, ...changes, dirty: true } : s))
    )

  /* ───────── Upload image ───────── */
  const handleFile = async (key, file) => {
    if (!file) return
    setError('')

    if (!ALLOWED.includes(file.type)) {
      setError('Please upload a JPG, PNG or WebP image.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image is too large. Maximum size is ${MAX_SIZE_MB} MB.`)
      return
    }

    setBusyFor(key, 'uploading')

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `slides/${Date.now()}-${uid()}.${ext}`

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: '31536000', upsert: false })

    if (upErr) {
      setError(upErr.message)
      setBusyFor(key, null)
      return
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    patch(key, { image_url: data.publicUrl })
    setBusyFor(key, null)
  }

  /* ───────── Save one slide ───────── */
  const save = async (slide, index) => {
    setError('')

    if (!slide.image_url) {
      setError('Please upload a background image first.')
      return
    }
    if (!slide.title.trim()) {
      setError('Please enter a title for the slide.')
      return
    }

    setBusyFor(slide.uid, 'saving')

    const payload = {
      image_url: slide.image_url,
      title: slide.title.trim(),
      subtitle: slide.subtitle.trim() || null,
      description: slide.description.trim() || null,
      is_active: slide.is_active,
      sort_order: index,
    }

    let result
    if (slide.isNew) {
      result = await supabase.from('hero_slides').insert(payload).select().single()
    } else {
      result = await supabase
        .from('hero_slides')
        .update(payload)
        .eq('id', slide.id)
        .select()
        .single()
    }

    if (result.error) {
      setError(result.error.message)
      setBusyFor(slide.uid, null)
      return
    }

    /* The image was replaced: remove the old file from storage */
    if (!slide.isNew && slide.original_image_url && slide.original_image_url !== slide.image_url) {
      removeFile(slide.original_image_url)
    }

    const saved = fromRow(result.data)
    setSlides((prev) => prev.map((s) => (s.uid === slide.uid ? saved : s)))
    setBusyFor(slide.uid, null)
    flash('Slide saved')
  }

  /* ───────── Delete ───────── */
  const remove = async (slide) => {
    if (!window.confirm('Delete this slide? This cannot be undone.')) return

    if (slide.isNew) {
      if (slide.image_url) removeFile(slide.image_url)
      setSlides((prev) => prev.filter((s) => s.uid !== slide.uid))
      return
    }

    setBusyFor(slide.uid, 'deleting')
    const { error: err } = await supabase.from('hero_slides').delete().eq('id', slide.id)

    if (err) {
      setError(err.message)
      setBusyFor(slide.uid, null)
      return
    }

    removeFile(slide.original_image_url)
    setSlides((prev) => prev.filter((s) => s.uid !== slide.uid))
    setBusyFor(slide.uid, null)
    flash('Slide deleted')
  }

  /* ───────── Reorder ───────── */
  const move = async (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= slides.length) return

    const next = [...slides]
    ;[next[index], next[target]] = [next[target], next[index]]
    setSlides(next)

    const saved = next
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => !s.isNew)

    const results = await Promise.all(
      saved.map(({ s, i }) =>
        supabase.from('hero_slides').update({ sort_order: i }).eq('id', s.id)
      )
    )

    const failed = results.find((r) => r.error)
    if (failed) setError(failed.error.message)
    else flash('Order updated')
  }

  const addSlide = () => setSlides((prev) => [...prev, blankSlide()])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">Hero Slider</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500">
            Manage the background images on the home page. Each slide has its own title and
            description. Slides change automatically every 6 seconds on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={addSlide}
          className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-gray-800"
        >
          <Plus size={16} />
          Add Slide
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {notice && (
        <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {notice}
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 border border-gray-200 bg-white px-5 py-4 text-xs leading-6 text-gray-500">
        Tip: use wide landscape images (about 1920 × 1080), JPG or WebP, under {MAX_SIZE_MB} MB.
        A dark overlay is added automatically so the white text stays readable.
      </div>

      {/* List */}
      {loading ? (
        <div className="mt-10 flex items-center gap-3 text-sm text-gray-500">
          <Loader2 size={18} className="animate-spin" /> Loading slides...
        </div>
      ) : slides.length === 0 ? (
        <div className="mt-8 border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <p className="text-sm text-gray-500">No slides yet. The website shows the default slides.</p>
          <button
            type="button"
            onClick={addSlide}
            className="mt-5 inline-flex items-center gap-2 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-gray-800"
          >
            <Plus size={16} /> Add your first slide
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {slides.map((slide, index) => {
            const state = busy[slide.uid]
            const working = Boolean(state)

            return (
              <div key={slide.uid} className="border border-gray-200 bg-white">
                {/* Card header */}
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center bg-black text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-black">
                      Slide {index + 1}
                    </span>
                    {slide.dirty && (
                      <span className="bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                        Unsaved
                      </span>
                    )}
                    {!slide.is_active && (
                      <span className="bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Move up"
                      disabled={index === 0 || working}
                      onClick={() => move(index, -1)}
                      className="p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      disabled={index === slides.length - 1 || working}
                      onClick={() => move(index, 1)}
                      className="p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete slide"
                      disabled={working}
                      onClick={() => remove(slide)}
                      className="p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-8">
                  {/* Image + live preview */}
                  <div>
                    <div className="relative aspect-video overflow-hidden bg-neutral-900">
                      {slide.image_url ? (
                        <>
                          <img
                            src={slide.image_url}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50" />
                          <div className="absolute inset-0 flex flex-col justify-center p-5 text-white">
                            <p className="text-lg font-medium leading-tight">
                              {slide.title || 'Slide title'}
                            </p>
                            {slide.subtitle && (
                              <p className="text-lg font-normal italic leading-tight">
                                {slide.subtitle}
                              </p>
                            )}
                            {slide.description && (
                              <p className="mt-2 line-clamp-2 whitespace-pre-line text-[11px] leading-4 text-white/80">
                                {slide.description}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-neutral-400">
                          <ImagePlus size={28} strokeWidth={1.4} />
                          <span className="text-xs">No image yet</span>
                        </div>
                      )}

                      {state === 'uploading' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                          <Loader2 size={22} className="animate-spin" />
                        </div>
                      )}
                    </div>

                    <input
                      ref={(el) => {
                        fileInputs.current[slide.uid] = el
                      }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        handleFile(slide.uid, e.target.files?.[0])
                        e.target.value = ''
                      }}
                    />

                    <button
                      type="button"
                      disabled={working}
                      onClick={() => fileInputs.current[slide.uid]?.click()}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-gray-300 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-black transition hover:border-black hover:bg-black hover:text-white disabled:opacity-50"
                    >
                      <ImagePlus size={16} />
                      {slide.image_url ? 'Replace Image' : 'Upload Image'}
                    </button>
                  </div>

                  {/* Fields */}
                  <div className="space-y-5">
                    <div>
                      <label className={labelClass} htmlFor={`title-${slide.uid}`}>
                        Title *
                      </label>
                      <input
                        id={`title-${slide.uid}`}
                        type="text"
                        value={slide.title}
                        maxLength={90}
                        placeholder="A home away from home,"
                        onChange={(e) => patch(slide.uid, { title: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass} htmlFor={`subtitle-${slide.uid}`}>
                        Second title line (shown in italic, optional)
                      </label>
                      <input
                        id={`subtitle-${slide.uid}`}
                        type="text"
                        value={slide.subtitle}
                        maxLength={90}
                        placeholder="with room to breathe."
                        onChange={(e) => patch(slide.uid, { subtitle: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass} htmlFor={`desc-${slide.uid}`}>
                        Description
                      </label>
                      <textarea
                        id={`desc-${slide.uid}`}
                        rows={4}
                        value={slide.description}
                        maxLength={320}
                        placeholder="Short text under the title. Press Enter for a new line."
                        onChange={(e) => patch(slide.uid, { description: e.target.value })}
                        className={`${inputClass} resize-y leading-7`}
                      />
                      <p className="mt-1.5 text-right text-[11px] text-gray-400">
                        {slide.description.length}/320
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={() => patch(slide.uid, { is_active: !slide.is_active })}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
                      >
                        {slide.is_active ? <Eye size={17} /> : <EyeOff size={17} />}
                        {slide.is_active ? 'Visible on website' : 'Hidden from website'}
                      </button>

                      <button
                        type="button"
                        disabled={working || !slide.dirty}
                        onClick={() => save(slide, index)}
                        className="inline-flex items-center justify-center gap-2 bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {state === 'saving' ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                        {slide.isNew ? 'Add Slide' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}