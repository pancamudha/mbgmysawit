import AnimeSchedule from "@/components/Schedule/AnimeSchedule";

export interface ScheduleItem {
  id: string;
  data_id: string;
  title: string;
  japanese_title?: string;
  releaseDate: string;
  time: string;
  episode_no: string;
  poster?: string;
}

export interface GroupedSchedule {
  [time: string]: ScheduleItem[];
}

export const metadata = {
  title: "Schedule - Animaple",
  description: "Check the estimated release schedule for your favorite anime subbed and dubbed.",
};

export default function SchedulePage() {
  return (
    // Padding top (pt) dikurangi drastis agar mepet ke navbar
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 md:px-8 pb-2 pt-[8px] md:pt-[12px] font-sans">
      <div className="max-w-[1600px] mx-auto">
        <AnimeSchedule />
      </div>
    </div>
  );
}