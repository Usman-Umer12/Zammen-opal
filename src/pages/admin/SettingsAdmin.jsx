import { useCallback, useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../lib/utils'

export default function SettingsAdmin() {
  const [locations, setLocations] = useState([])
  const [types, setTypes] = useState([])
  const [error, setError] = useState('')
  const [loc, setLoc] = useState({ name: '', tagline: '', description: '' })
  const [typ, setTyp] = useState({ name: '', bedrooms: 1 })

  const load = useCallback(async () => {
    const [l, t] = await Promise.all([
      supabase.from('locations').select('*').order('sort_order'),
      supabase.from('apartment_types').select('*').order('sort_order'),
    ])
    if (l.error || t.error) setError((l.error || t.error).message)
    setLocations(l.data || [])
    setTypes(t.data || [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function addLocation(e) {
    e.preventDefault()
    if (!loc.name.trim()) return
    const { error } = await supabase.from('locations').insert({
      name: loc.name.trim(),
      slug: slugify(loc.name),
      tagline: loc.tagline.trim() || null,
      description: loc.description.trim() || null,
      sort_order: locations.length + 1,
    })
    if (error) setError(error.message)
    else {
      setLoc({ name: '', tagline: '', description: '' })
      setError('')
      load()
    }
  }

  async function addType(e) {
    e.preventDefault()
    if (!typ.name.trim()) return
    const { error } = await supabase.from('apartment_types').insert({
      name: typ.name.trim(),
      slug: slugify(typ.name),
      bedrooms: Number(typ.bedrooms),
      sort_order: types.length + 1,
    })
    if (error) setError(error.message)
    else {
      setTyp({ name: '', bedrooms: 1 })
      setError('')
      load()
    }
  }

  async function toggleLocation(row) {
    const { error } = await supabase.from('locations').update({ is_active: !row.is_active }).eq('id', row.id)
    if (error) setError(error.message)
    else load()
  }

  async function remove(table, row) {
    if (!window.confirm(`Delete "${row.name}"?`)) return
    const { error } = await supabase.from(table).delete().eq('id', row.id)
    if (error)
      setError(
        error.code === '23503'
          ? `"${row.name}" is used by existing apartments. Remove or reassign those first.`
          : error.message,
      )
    else {
      setError('')
      load()
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold">Locations &amp; types</h1>
        <p className="mt-1 text-sm text-pine-600">
          Add new cities or apartment types here and they become available when creating listings.
        </p>
      </div>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
        <h2 className="font-sans text-sm font-bold uppercase tracking-wide">Locations</h2>
        <ul className="mt-4 divide-y divide-pine-100">
          {locations.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-semibold">{l.name}</p>
                <p className="text-pine-500">{l.tagline}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleLocation(l)} className="text-xs font-semibold text-pine-700 hover:text-brass-600">
                  {l.is_active ? 'Visible' : 'Hidden'}
                </button>
                <button onClick={() => remove('locations', l)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${l.name}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={addLocation} className="mt-5 grid gap-3 border-t border-pine-100 pt-5 sm:grid-cols-2">
          <input className="field" placeholder="City name" value={loc.name} onChange={(e) => setLoc({ ...loc, name: e.target.value })} />
          <input className="field" placeholder="Short tagline" value={loc.tagline} onChange={(e) => setLoc({ ...loc, tagline: e.target.value })} />
          <textarea className="field sm:col-span-2" rows={2} placeholder="Description" value={loc.description} onChange={(e) => setLoc({ ...loc, description: e.target.value })} />
          <button className="btn-primary sm:col-span-2 sm:w-fit">Add location</button>
        </form>
      </section>

      <section className="rounded-2xl border border-pine-100 bg-white p-6 shadow-card">
        <h2 className="font-sans text-sm font-bold uppercase tracking-wide">Apartment types</h2>
        <ul className="mt-4 divide-y divide-pine-100">
          {types.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-3 text-sm">
              <p className="font-semibold">{t.name}</p>
              <button onClick={() => remove('apartment_types', t)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${t.name}`}>
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addType} className="mt-5 grid gap-3 border-t border-pine-100 pt-5 sm:grid-cols-[1fr_140px_auto]">
          <input className="field" placeholder="e.g. 4 BHK Apartment" value={typ.name} onChange={(e) => setTyp({ ...typ, name: e.target.value })} />
          <input type="number" min="0" className="field" aria-label="Bedrooms" value={typ.bedrooms} onChange={(e) => setTyp({ ...typ, bedrooms: e.target.value })} />
          <button className="btn-primary">Add type</button>
        </form>
      </section>
    </div>
  )
}
