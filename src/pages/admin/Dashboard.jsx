
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Eye,
  EyeOff,
  Star,
  MapPin,
  RefreshCw,
  TrendingUp,
  BedDouble,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
  Activity,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
} from 'lucide-react'

import { supabase, isSupabaseConfigured } from '../../lib/supabase'

const money = (value) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const formatDate = (date) => {
  if (!date) return 'Date unavailable'

  return new Intl.DateTimeFormat('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function StatCard({ title, value, note, icon: Icon, percentage }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
            {value}
          </h3>

          <p className="mt-2 text-xs text-gray-400">{note}</p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
          <Icon size={21} strokeWidth={1.7} />
        </div>
      </div>

      {percentage !== undefined && (
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-[11px] text-gray-400">
            <span>Publishing rate</span>
            <span className="font-semibold text-gray-700">{percentage}%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-black transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function DistributionItem({ name, count, total }) {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="truncate text-sm font-medium text-gray-700">
          {name}
        </span>

        <span className="shrink-0 text-xs font-semibold text-gray-500">
          {count}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gray-900 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-1 text-right text-[10px] text-gray-400">
        {percentage.toFixed(0)}%
      </p>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="py-10 text-center">
      <Building2 size={30} className="mx-auto text-gray-300" />
      <p className="mt-3 text-sm text-gray-500">{message}</p>
    </div>
  )
}

export default function Dashboard() {
  const [listings, setListings] = useState([])
  const [locationsData, setLocationsData] = useState([])
  const [typesData, setTypesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const [listingsResult, locationsResult, typesResult] =
        await Promise.all([
          supabase
            .from('listings')
            .select(`
              id,
              title,
              slug,
              price,
              is_published,
              featured,
              created_at,
              location:locations(name),
              type:apartment_types(name)
            `)
            .order('created_at', { ascending: false }),

          supabase
            .from('locations')
            .select('id, name'),

          supabase
            .from('apartment_types')
            .select('id, name'),
        ])

      if (listingsResult.error) throw listingsResult.error

      if (locationsResult.error) throw locationsResult.error

      if (typesResult.error) throw typesResult.error

      setListings(listingsResult.data || [])
      setLocationsData(locationsResult.data || [])
      setTypesData(typesResult.data || [])
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const stats = useMemo(() => {
    const total = listings.length

    const published = listings.filter(
      (item) => item.is_published
    ).length

    const hidden = listings.filter(
      (item) => !item.is_published
    ).length

    const featured = listings.filter(
      (item) => item.featured
    ).length

    const totalPrice = listings.reduce(
      (sum, item) => sum + (Number(item.price) || 0),
      0
    )

    const averagePrice = total > 0 ? totalPrice / total : 0

    const publishingRate = total > 0
      ? Math.round((published / total) * 100)
      : 0

    return {
      total,
      published,
      hidden,
      featured,
      averagePrice,
      publishingRate,
      locations: locationsData.length,
      types: typesData.length,
    }
  }, [listings, locationsData, typesData])

  const locationStats = useMemo(() => {
    const counts = {}

    listings.forEach((item) => {
      const name = item.location?.name || 'Unassigned'
      counts[name] = (counts[name] || 0) + 1
    })

    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [listings])

  const typeStats = useMemo(() => {
    const counts = {}

    listings.forEach((item) => {
      const name = item.type?.name || 'Unassigned'
      counts[name] = (counts[name] || 0) + 1
    })

    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [listings])

  const recentListings = listings.slice(0, 6)

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-black" />

          <p className="mt-4 text-sm text-gray-500">
            Loading analytics...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7 sm:space-y-9">

      {/* Dashboard Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-gray-400">
            Management Overview
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
            Dashboard
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Overview of your property listings and performance.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={15} />
          Refresh Analytics
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Main Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Property Overview
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Current apartment statistics
            </p>
          </div>

          <Activity size={19} className="text-gray-400" />
        </div>

        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Apartments"
            value={stats.total}
            note="All registered properties"
            icon={Building2}
          />

          <StatCard
            title="Active Apartments"
            value={stats.published}
            note="Currently visible on website"
            icon={Eye}
            percentage={stats.publishingRate}
          />

          <StatCard
            title="Hidden Apartments"
            value={stats.hidden}
            note="Not published on website"
            icon={EyeOff}
          />

          <StatCard
            title="Featured Apartments"
            value={stats.featured}
            note="Highlighted properties"
            icon={Star}
          />
        </div>
      </section>

      {/* Secondary Statistics */}
      <section>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Additional Insights
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Property inventory and pricing overview
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Locations</span>
              <MapPin size={19} className="text-gray-400" />
            </div>

            <h3 className="mt-3 text-2xl font-semibold text-gray-950">
              {stats.locations}
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Registered cities
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Apartment Types</span>
              <BedDouble size={19} className="text-gray-400" />
            </div>

            <h3 className="mt-3 text-2xl font-semibold text-gray-950">
              {stats.types}
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Available categories
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Average Price</span>
              <CircleDollarSign size={19} className="text-gray-400" />
            </div>

            <h3 className="mt-3 break-words text-xl font-semibold text-gray-950 sm:text-2xl">
              {money(stats.averagePrice)}
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Across all apartments
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Publishing Rate</span>
              <TrendingUp size={19} className="text-gray-400" />
            </div>

            <h3 className="mt-3 text-2xl font-semibold text-gray-950">
              {stats.publishingRate}%
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Of total apartments active
            </p>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Inventory Analytics
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Distribution of apartments by location and type
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* Location Distribution */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-950">
                  Apartments by Location
                </h4>

                <p className="mt-1 text-xs text-gray-400">
                  City-wise property distribution
                </p>
              </div>

              <MapPin size={19} className="text-gray-400" />
            </div>

            {locationStats.length === 0 ? (
              <EmptyState message="No location data available." />
            ) : (
              <div className="mt-7 space-y-6">
                {locationStats.map(([name, count]) => (
                  <DistributionItem
                    key={name}
                    name={name}
                    count={count}
                    total={stats.total}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Apartment Type Distribution */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-950">
                  Apartments by Type
                </h4>

                <p className="mt-1 text-xs text-gray-400">
                  Category-wise property distribution
                </p>
              </div>

              <BarChart3 size={19} className="text-gray-400" />
            </div>

            {typeStats.length === 0 ? (
              <EmptyState message="No apartment type data available." />
            ) : (
              <div className="mt-7 space-y-6">
                {typeStats.map(([name, count]) => (
                  <DistributionItem
                    key={name}
                    name={name}
                    count={count}
                    total={stats.total}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Recent Apartments
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Latest properties added to your system
            </p>
          </div>

          <Link
            to="/admin/apartments"
            className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-gray-700 transition hover:text-black"
          >
            View Apartments <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentListings.length === 0 ? (
          <EmptyState message="No apartments have been added yet." />
        ) : (
          <div className="divide-y divide-gray-100">
            {recentListings.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 px-5 py-4 transition hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>

                    {item.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700">
                        <Star size={10} /> Featured
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} />
                      {item.location?.name || 'Location not set'}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Building2 size={12} />
                      {item.type?.name || 'Type not set'}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={12} />
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="text-sm font-semibold text-gray-800">
                    {money(item.price)}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      item.is_published
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {item.is_published ? (
                      <CheckCircle2 size={11} />
                    ) : (
                      <Clock3 size={11} />
                    )}

                    {item.is_published ? 'Active' : 'Hidden'}
                  </span>

                  <Link
                    to={`/admin/listings/${item.id}`}
                    aria-label={`Edit ${item.title}`}
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-white hover:text-black"
                  >
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dashboard Footer Info */}
      <div className="flex flex-col justify-between gap-2 border-t border-gray-200 pt-5 text-xs text-gray-400 sm:flex-row sm:items-center">
        <p>Zameen Opal · Property Management Analytics</p>

        <p className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Live database overview
        </p>
      </div>
    </div>
  )
}
