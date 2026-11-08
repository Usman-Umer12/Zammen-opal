import { supabase } from './supabase'

export const DEFAULT_PAGE = {
  id: 1,
  eyebrow: 'Investment inquiries',
  title: 'Like what we have built? Let us talk.',
  description:
    'Glory Stays offers furnished apartments in Lahore, Murree and Islamabad. If you like our properties and would like to partner with us or invest in our future projects, send us your details and our team will contact you with further information.',
  properties: ['Lahore', 'Murree', 'Islamabad'],
  form_title: 'Share your details',
}

/* ───────── PAGE CONTENT ───────── */

export async function getInvestorPage() {
  const { data, error } = await supabase
    .from('investor_page')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (error) throw error
  return data || DEFAULT_PAGE
}

export async function saveInvestorPage(values) {
  const payload = {
    id: 1,
    eyebrow: values.eyebrow,
    title: values.title,
    description: values.description,
    form_title: values.form_title,
    properties: values.properties,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('investor_page')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single()

  if (error) throw error
  return data
}

/* ───────── INQUIRIES ───────── */

export async function listInquiries() {
  const { data, error } = await supabase
    .from('investor_inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Used by the public form (anon insert) and by the admin "Add client" form.
export async function createInquiry(values) {
  const { data, error } = await supabase
    .from('investor_inquiries')
    .insert({
      full_name: values.full_name,
      phone: values.phone,
      title: values.title || null,
      message: values.message,
      status: values.status || 'new',
      notes: values.notes || null,
      source: values.source || 'website',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateInquiry(id, values) {
  const { data, error } = await supabase
    .from('investor_inquiries')
    .update({
      full_name: values.full_name,
      phone: values.phone,
      title: values.title || null,
      message: values.message,
      status: values.status,
      notes: values.notes || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteInquiry(id) {
  const { error } = await supabase
    .from('investor_inquiries')
    .delete()
    .eq('id', id)

  if (error) throw error
}