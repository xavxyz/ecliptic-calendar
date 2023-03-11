import dotenv from "dotenv";
import { google, calendar_v3 } from "googleapis";

import { Magnitude } from "./magnitudes";
import { ReadableSeason } from "./seasons";

dotenv.config();

const calendar = google.calendar({
  version: "v3",
  key: process.env.GOOGLE_API_KEY,
});

// * Insert a calendar event
// ? Calendar ID is in the environement variables
export async function insertEvent(event: calendar_v3.Schema$Event) {
  const res = await calendar.events.insert({
    calendarId: process.env.CALENDAR_ID,
    requestBody: event,
  });

  return res.data;
}

export function transformMagnitudeToEvent(magnitude: Magnitude) {
  const [label, dateTime] = magnitude;

  return {
    summary: label,
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

export function transformReadableSeasonToEvent(readableSeason: ReadableSeason) {
  const [label, start, end] = readableSeason;

  const [startDate] = start.toString().split("T");
  const [endDate] = end.toString().split("T");

  return {
    summary: label,
    start: {
      date: startDate,
    },
    end: {
      date: endDate,
    },
  };
}
