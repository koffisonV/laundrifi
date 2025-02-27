import { createClient } from '@/lib/supabase/server'
import WeeklySchedule from '@/components/WeeklySchedule'

export default async function SchedulePage() {
  const supabase = await createClient()

  // Get current user's active slot
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userSlot } = await supabase
    .from('laundry_slots')
    .select('slot_time')
    .eq('user_id', user?.id)
    .eq('status', 'active')
    .single()

  // Get all booked slots for this week
  const startOfWeek = new Date()
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 7)

  const { data: bookedSlots } = await supabase
    .from('laundry_slots')
    .select('slot_time')
    .gte('slot_time', startOfWeek.toISOString())
    .lt('slot_time', endOfWeek.toISOString())
    .eq('status', 'active')

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Laundry Schedule</h1>
      <WeeklySchedule 
        userSlot={userSlot?.slot_time} 
        bookedSlots={bookedSlots?.map(slot => slot.slot_time) || []} 
      />
    </main>
  )
} 