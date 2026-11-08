import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Check,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react'

import {
  DEFAULT_PAGE,
  createInquiry,
  deleteInquiry,
  getInvestorPage,
  listInquiries,
  saveInvestorPage,
  updateInquiry,
} from '../../lib/investor'

const INPUT =
  'block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-black'
const LABEL = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600'

const STATUSES = [
  { value: 'new', label: 'New', cls: 'bg-blue-50 text-blue-700' },
  { value: 'contacted', label: 'Contacted', cls: 'bg-amber-50 text-amber-700' },
  { value: 'closed', label: 'Closed', cls: 'bg-green-50 text-green-700' },
]

const EMPTY_CLIENT = {
  full_name: '',
  phone: '',
  title: '',
  message: '',
  status: 'new',
  notes: '',
  source: 'manual',
}

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : ''

/* ───────── PAGE CONTENT EDITOR ───────── */

function PageContentEditor() {
  const [form, setForm] = useState(DEFAULT_PAGE)
  const [newProperty, setNewProperty] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    let active = true
    getInvestorPage()
      .then((data) => active && setForm({ ...DEFAULT_PAGE, ...data }))
      .catch((err) => active && setMessage({ type: 'error', text: err.message }))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const set = (key) => (e) => setForm((c) => ({ ...c, [key]: e.target.value }))

  function addProperty() {
    const value = newProperty.trim()
    if (!value) return
    if (form.properties.some((p) => p.toLowerCase() === value.toLowerCase())) {
      setNewProperty('')
      return
    }
    setForm((c) => ({ ...c, properties: [...c.properties, value] }))
    setNewProperty('')
  }

  function removeProperty(name) {
    setForm((c) => ({ ...c, properties: c.properties.filter((p) => p !== name) }))
  }

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const saved = await saveInvestorPage(form)
      setForm({ ...DEFAULT_PAGE, ...saved })
      setMessage({ type: 'success', text: 'Page content updated successfully.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not save.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 size={16} className="animate-spin" /> Loading...
      </div>
    )
  }

  return (
    <form onSubmit={onSave} className="max-w-3xl space-y-5 border border-gray-200 bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Small heading (eyebrow)</label>
          <input className={INPUT} value={form.eyebrow} onChange={set('eyebrow')} />
        </div>
        <div>
          <label className={LABEL}>Form title</label>
          <input className={INPUT} value={form.form_title} onChange={set('form_title')} />
        </div>
      </div>

      <div>
        <label className={LABEL}>Title</label>
        <input className={INPUT} value={form.title} onChange={set('title')} />
      </div>

      <div>
        <label className={LABEL}>Description</label>
        <textarea
          rows={5}
          className={`${INPUT} resize-y`}
          value={form.description}
          onChange={set('description')}
        />
      </div>

      <div>
        <label className={LABEL}>Our properties</label>
        <div className="flex flex-wrap gap-2">
          {form.properties.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-2 border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
            >
              {p}
              <button
                type="button"
                aria-label={`Remove ${p}`}
                onClick={() => removeProperty(p)}
                className="text-gray-400 hover:text-red-600"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            className={INPUT}
            placeholder="Add property / city"
            value={newProperty}
            onChange={(e) => setNewProperty(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addProperty()
              }
            }}
          />
          <button
            type="button"
            onClick={addProperty}
            className="inline-flex items-center gap-1.5 rounded-lg border border-black px-4 text-sm font-medium hover:bg-black hover:text-white"
          >
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {message.text && (
        <p
          className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-700'}`}
          role="status"
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Save changes
      </button>
    </form>
  )
}

/* ───────── CLIENT FORM (ADD / EDIT) ───────── */

function ClientForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY_CLIENT, ...initial })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  const isEdit = Boolean(initial?.id)
  const set = (key) => (e) => {
    setForm((c) => ({ ...c, [key]: e.target.value }))
    if (errors[key]) setErrors((c) => ({ ...c, [key]: '' }))
  }

  async function onSubmit(e) {
    e.preventDefault()

    const next = {}
    if (form.full_name.trim().length < 2) next.full_name = 'Client name is required.'
    if (form.phone.trim().length < 5) next.phone = 'Phone number is required.'
    if (form.message.trim().length < 2) next.message = 'Description is required.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    setServerError('')
    try {
      const payload = {
        ...form,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        title: form.title.trim(),
        message: form.message.trim(),
        notes: form.notes.trim(),
      }
      const saved = isEdit
        ? await updateInquiry(initial.id, payload)
        : await createInquiry(payload)
      onSaved(saved, isEdit)
    } catch (err) {
      setServerError(err.message || 'Could not save client.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
      <form
        onSubmit={onSubmit}
        noValidate
        className="w-full max-w-2xl space-y-5 bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit client' : 'Add new client'}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Client name</label>
            <input className={INPUT} value={form.full_name} onChange={set('full_name')} />
            {errors.full_name && <p className="mt-1.5 text-xs text-red-600">{errors.full_name}</p>}
          </div>
          <div>
            <label className={LABEL}>Phone</label>
            <input className={INPUT} value={form.phone} onChange={set('phone')} placeholder="+92 300 1234567" />
            {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className={LABEL}>Title</label>
          <input
            className={INPUT}
            value={form.title}
            onChange={set('title')}
            placeholder="e.g. Interested in Murree project"
          />
        </div>

        <div>
          <label className={LABEL}>Description</label>
          <textarea
            rows={4}
            className={`${INPUT} resize-y`}
            value={form.message}
            onChange={set('message')}
          />
          {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Status</label>
            <select className={INPUT} value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Source</label>
            <input className={`${INPUT} bg-gray-50`} value={form.source} readOnly />
          </div>
        </div>

        <div>
          <label className={LABEL}>Internal notes</label>
          <textarea
            rows={3}
            className={`${INPUT} resize-y`}
            value={form.notes || ''}
            onChange={set('notes')}
            placeholder="Only visible to admins"
          />
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {isEdit ? 'Update client' : 'Add client'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ───────── CLIENTS LIST ───────── */

function ClientsManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editing, setEditing] = useState(null) // null | {} (new) | client
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await listInquiries())
    } catch (err) {
      setError(err.message || 'Could not load clients.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((i) => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false
      if (!q) return true
      return [i.full_name, i.phone, i.title, i.message]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    })
  }, [items, query, statusFilter])

  function onSaved(saved, isEdit) {
    setItems((current) =>
      isEdit ? current.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...current]
    )
    setEditing(null)
  }

  async function onStatusChange(item, status) {
    setBusyId(item.id)
    try {
      const saved = await updateInquiry(item.id, { ...item, status })
      setItems((current) => current.map((i) => (i.id === saved.id ? saved : i)))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function onDelete(item) {
    if (!window.confirm(`Delete ${item.full_name}? This cannot be undone.`)) return
    setBusyId(item.id)
    try {
      await deleteInquiry(item.id)
      setItems((current) => current.filter((i) => i.id !== item.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className={`${INPUT} pl-9`}
              placeholder="Search name, phone, title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className={`${INPUT} sm:w-44`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={16} /> Add client
        </button>
      </div>

      {error && (
        <p className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
          No clients found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <article key={item.id} className="border border-gray-200 bg-white p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-base font-semibold">{item.full_name}</h3>
                    <a href={`tel:${item.phone}`} className="text-sm text-gray-600 hover:text-black">
                      {item.phone}
                    </a>
                    <span className="text-xs text-gray-400">
                      {formatDate(item.created_at)} · {item.source}
                    </span>
                  </div>

                  {item.title && <p className="mt-2 text-sm font-medium">{item.title}</p>}
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-600">
                    {item.message}
                  </p>
                  {item.notes && (
                    <p className="mt-3 border-l-2 border-gray-300 pl-3 text-xs leading-5 text-gray-500">
                      Note: {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <select
                    aria-label="Status"
                    disabled={busyId === item.id}
                    value={item.status}
                    onChange={(e) => onStatusChange(item, e.target.value)}
                    className={`rounded-lg border-0 px-3 py-2 text-xs font-semibold outline-none ${
                      STATUSES.find((s) => s.value === item.status)?.cls || ''
                    }`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                  <button
                    aria-label="Edit"
                    onClick={() => setEditing(item)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    aria-label="Delete"
                    disabled={busyId === item.id}
                    onClick={() => onDelete(item)}
                    className="rounded-lg border border-gray-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <ClientForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </div>
  )
}

/* ───────── PAGE ───────── */

export default function InvestorAdmin() {
  const [tab, setTab] = useState('clients')

  const tabs = [
    { id: 'clients', label: 'Clients / Inquiries' },
    { id: 'content', label: 'Page Content' },
  ]

  return (
    <div>
      <div className="mb-7 flex gap-2 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition ${
              tab === t.id
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'clients' ? <ClientsManager /> : <PageContentEditor />}
    </div>
  )
}