import WeeklySchedule from '@/components/WeeklySchedule';

export default function SchedulePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Laundry Schedule</h1>
      <WeeklySchedule />
    </main>
  );
} 