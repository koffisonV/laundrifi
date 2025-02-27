'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function bookSlot(formData: FormData) {
  const supabase = await createClient()
  
  const slotTime = formData.get('slot') as string
  if (!slotTime) {
    throw new Error('No slot selected')
  }

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/auth/signin')
  }

  // Calculate expiry (end of the week)
  const slotDate = new Date(slotTime)
  const expiryDate = new Date(slotTime)
  expiryDate.setDate(slotDate.getDate() + (7 - slotDate.getDay()))
  expiryDate.setHours(23, 59, 59, 999)

  // Check if user already has a slot this week
  const { data: existingSlot } = await supabase
    .from('laundry_slots')
    .select()
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (existingSlot) {
    throw new Error('You already have a slot booked for this week')
  }

  // Insert the new slot
  const { error: insertError } = await supabase
    .from('laundry_slots')
    .insert({
      user_id: user.id,
      slot_time: slotTime,
      expires_at: expiryDate.toISOString(),
    })

  if (insertError) {
    throw new Error('Failed to book slot')
  }

  revalidatePath('/schedule')
  redirect('/schedule/confirm?slot=' + encodeURIComponent(slotTime))
} 