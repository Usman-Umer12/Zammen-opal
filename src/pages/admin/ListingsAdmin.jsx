
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Trash2,
  RefreshCw,
  Building2,
  MapPin,
  AlertCircle,
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { formatPrice } from '../../lib/utils'
import Photo from '../../components/Photo'

export default function ListingsAdmin() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [actionId, setActionId] = useState(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured. Please check your environment variables.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const { data, error: fetchError } = await supabase
      .from('listings')
      .select('*, location:locations(name), type:apartment_types(name)')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setRows([])
    } else {
      setRows(data || [])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function togglePublished(row) {
    if (!supabase || actionId) return

    setActionId(row.id)
    setError('')

    const { error } = await supabase
      .from('listings')
      .update({ is_published: !row.is_published })
      .eq('id', row.id)

    if (error) {
      setError(error.message)
    } else {
      setRows((current) =>
        current.map((item) =>
          item.id === row.id
            ? { ...item, is_published: !row.is_published }
            : item
        )
      )
    }

    setActionId(null)
  }

  async function remove(row) {
    if (!supabase || actionId) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${row.title}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setActionId(row.id)
    setError('')

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', row.id)

    if (error) {
      setError(error.message)
    } else {
      setRows((current) => current.filter((item) => item.id !== row.id))
    }

    setActionId(null)
  }

  const filteredRows = rows.filter((row) => {
    const term = search.trim().toLowerCase()

    const matchesSearch =
      !term ||
      row.title?.toLowerCase().includes(term) ||
      row.location?.name?.toLowerCase().includes(term) ||
      row.type?.name?.toLowerCase().includes(term)

    const matchesFilter =
      filter === 'all' ||
      (filter === 'published' && row.is_published) ||
      (filter === 'hidden' && !row.is_published)

    return matchesSearch && matchesFilter
  })

  const publishedCount = rows.filter((row) => row.is_published).length
  const hiddenCount = rows.length - publishedCount

  return (
    <div className="min-w-0 space-y-7 text-black">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Property management
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Apartments
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            Manage your apartments, prices, images and website visibility.
          </p>
        </div>

        <Link
          to="/admin/listings/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          <Plus size={17} />
          Add apartment
        </Link>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Total apartments"
          value={rows.length}
          icon={<Building2 size={19} />}
        />
        <StatCard
          label="Published"
          value={publishedCount}
          icon={<Eye size={19} />}
        />
        <StatCard
          label="Hidden"
          value={hiddenCount}
          icon={<EyeOff size={19} />}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apartments, cities..."
              className="h-11 w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-11 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-black sm:flex-none"
            >
              <option value="all">All apartments</option>
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
            </select>

            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 transition hover:bg-neutral-100 disabled:opacity-50"
              aria-label="Refresh apartments"
            >
              <RefreshCw
                size={16}
                className={loading ? 'animate-spin' : ''}
              />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-neutral-500">
            <RefreshCw size={22} className="animate-spin" />
            <p className="text-sm">Loading apartments...</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
              <Building2 size={23} className="text-neutral-500" />
            </div>
            <h3 className="mt-4 text-base font-semibold">
              {rows.length === 0 ? 'No apartments added yet' : 'No results found'}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">
              {rows.length === 0
                ? 'Add your first apartment to start managing your properties.'
                : 'Try changing your search or filter.'}
            </p>

            {rows.length === 0 && (
              <Link
                to="/admin/listings/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                <Plus size={16} />
                Add apartment
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[minmax(0,1.8fr)_minmax(120px,0.8fr)_minmax(120px,0.8fr)_110px_120px] gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 lg:grid">
              <span>Apartment</span>
              <span>Location</span>
              <span>Type / Price</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {filteredRows.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-col gap-4 p-4 transition hover:bg-neutral-50/70 sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="h-[76px] w-[104px] shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      <Photo src={row.image_url} alt={row.title} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-black">
                        {row.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                        <MapPin size={13} />
                        {row.location?.name || 'No location'}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500 sm:hidden">
                        {row.type?.name || 'No type'} ·{' '}
                        {row.price != null ? formatPrice(row.price) : 'Price on request'}
                      </p>
                    </div>
                  </div>

                  <div className="hidden min-w-0 text-sm text-neutral-600 lg:block">
                    {row.location?.name || '—'}
                  </div>

                  <div className="hidden min-w-0 text-sm lg:block">
                    <p className="font-medium text-neutral-800">
                      {row.type?.name || '—'}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {row.price != null
                        ? formatPrice(row.price)
                        : 'Price on request'}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        row.is_published
                          ? 'bg-black text-white'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {row.is_published ? 'Published' : 'Hidden'}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-1 border-t border-neutral-100 pt-3 sm:border-0 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => togglePublished(row)}
                      disabled={actionId === row.id}
                      title={row.is_published ? 'Hide apartment' : 'Publish apartment'}
                      aria-label={row.is_published ? 'Hide apartment' : 'Publish apartment'}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100 hover:text-black disabled:opacity-40"
                    >
                      {row.is_published ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>

                    <Link
                      to={`/admin/listings/${row.id}`}
                      title="Edit apartment"
                      aria-label="Edit apartment"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100 hover:text-black"
                    >
                      <Pencil size={17} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => remove(row)}
                      disabled={actionId === row.id}
                      title="Delete apartment"
                      aria-label="Delete apartment"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && filteredRows.length > 0 && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-5 py-3">
            <p className="text-xs text-neutral-500">
              Showing {filteredRows.length} of {rows.length} apartments
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}
