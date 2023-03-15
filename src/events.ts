import dotenv from "dotenv";
import { google, calendar_v3 } from "googleapis";

import { DateTimeEvent, PeriodEvent } from "./utils";

dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: "./secret-key.json",
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ],
});

const calendar = google.calendar({
  version: "v3",
  auth,
});

// * Insert a calendar event
// ? Calendar ID is in the environement variables
export async function insertEvent(event: calendar_v3.Schema$Event) {
  const res = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    requestBody: event,
  });

  return res.data;
}

export function transformDateTimeEventToCalendarEvent(
  dateTimeEvent: DateTimeEvent
) {
  const { summary, dateTime } = dateTimeEvent;

  return {
    summary,
    start: {
      dateTime,
      timeZone: "Europe/Paris",
    },
    end: {
      dateTime,
      timeZone: "Europe/Paris",
    },
  };
}

export function transformPeriodEventToCalendarEvent(periodEvent: PeriodEvent) {
  const { summary, startDate, endDate } = periodEvent;

  return {
    summary,
    start: {
      date: startDate,
    },
    end: {
      date: endDate,
    },
  };
}
