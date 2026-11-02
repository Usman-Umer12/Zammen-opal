import { useCallback, useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatDateTime, whatsappLink } from '../../lib/utils'

const STATUSES = ['new', 'contacted', 'confirmed', 'closed']

export default function InquiriesAdmin() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setRows(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function setStatus(id, status) {
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id)
    if (error) setError(error.message)
    else setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)))
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">Inquiries</h1>
      <p className="mt-1 text-sm text-pine-600">Booking requests submitted through the website.</p>
      {error && <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-sm text-pine-500">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-pine-200 bg-white p-12 text-center text-sm text-pine-600">
            No inquiries yet.
          </div>
        ) : (
          rows.map((r) => (
            <article key={r.id} className="rounded-2xl border border-pine-100 bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-sans text-base font-semibold">{r.full_name}</h2>
                  <p className="text-sm text-pine-600">{r.phone}</p>
                </div>
                <select
                  value={r.status}
                  onChange={(e) => setStatus(r.id, e.target.value)}
                  className="rounded-lg border border-pine-200 bg-white px-3 py-1.5 text-sm capitalize"
                  aria-label="Inquiry status"
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <Row k="Apartment" v={r.listing_title || '—'} />
                <Row k="Type" v={r.apartment_type} />
                <Row k="City" v={r.city || '—'} />
                <Row k="Guests" v={r.guests} />
                <Row k="Check-in" v={formatDateTime(r.check_in)} />
                <Row k="Check-out" v={formatDateTime(r.check_out)} />
              </dl>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-pine-400">Received {formatDateTime(r.created_at)}</p>
                <a
                  href={whatsappLink(`Hello ${r.full_name}, thank you for your inquiry with Zameen Opal.`, r.phone)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp !px-4 !py-2"
                >
                  <MessageCircle size={15} /> Reply
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 text-pine-500">{k}</dt>
      <dd className="font-medium text-pine-900">{v}</dd>
    </div>
  )
}
