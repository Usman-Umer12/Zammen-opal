import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { demoListings, demoLocations, demoTypes } from '../data/demo'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [state, setState] = useState({
    locations: [],
    types: [],
    listings: [],
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setState({
        locations: demoLocations,
        types: demoTypes,
        listings: demoListings,
        loading: false,
        error: null,
      })
      return
    }
    try {
      const [loc, typ, lst] = await Promise.all([
        supabase.from('locations').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('apartment_types').select('*').order('sort_order'),
        supabase
          .from('listings')
          .select('*, location:locations(*), type:apartment_types(*)')
          .eq('is_published', true)
          .order('created_at', { ascending: false }),
      ])
      const error = loc.error || typ.error || lst.error
      if (error) throw error
      setState({
        locations: loc.data,
        types: typ.data,
        listings: lst.data,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error(error)
      setState((s) => ({ ...s, loading: false, error }))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const value = useMemo(() => ({ ...state, reload: load }), [state, load])
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider')
  return ctx
}
