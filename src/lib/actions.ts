"use server";

import { fetchSchedule } from "./api";

// Server Action murni untuk membypass CORS dari komponen Client
export async function getScheduleAction(date: string, tzOffset: number) {
  return await fetchSchedule(date, tzOffset);
}