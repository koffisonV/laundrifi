import { createClient } from '@/lib/supabase/server'
import WeeklySchedule from '@/components/WeeklySchedule'

export default async function SchedulePage() {
  const supabase = await createClient()

  // Get current user's active slot
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get all booked slots
  const { data: bookedSlots } = await supabase
    .from('reservations')
    .select('reserved_timeslot')
    .neq('id', user?.id)

  // Get user's current slot
  const { data: userSlot } = await supabase
    .from('reservations')
    .select('reserved_timeslot')
    .eq('id', user?.id)
    .single()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Laundry Schedule</h1>
      <WeeklySchedule 
        userSlot={userSlot?.reserved_timeslot} 
        bookedSlots={bookedSlots?.map(slot => slot.reserved_timeslot) || []} 
      />
    </main>
  )
} 