import dotenv from "dotenv";
import { google, calendar_v3 } from "googleapis";
import fs from "fs-extra";
import moment, { Moment } from "moment";

import { DateTimeEvent, hop, noRush, PeriodEvent } from "./utils";

dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: "./secret-key.json",
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ],
});

const eventTypeToColorIdHashtable = {
  seasons: "2", // #7ae7bf
  magnitudes: "4", // #ff887c
  suns: "5", // #fbd75b
  moons: "9", // #5484ed
} as const;

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

async function letTheMagicHappen(
  eventType: keyof typeof eventTypeToColorIdHashtable,
  after?: Moment,
  before?: Moment
) {
  await noRush();

  const colorId = eventTypeToColorIdHashtable[eventType];

  const events = await fs.readJson(`data/${eventType}.json`);

  let filteredEvents = events;
  if (after || before) {
    filteredEvents = events.filter(
      (event: DateTimeEvent) =>
        (after ? moment(event.dateTime).isAfter(after) : true) &&
        (before ? moment(event.dateTime).isBefore(before) : true)
    );
  }

  console.log({ total: events.length, filtered: filteredEvents.length });

  for (const event of filteredEvents) {
    const { summary, start, end } =
      eventType === "seasons"
        ? transformPeriodEventToCalendarEvent(event as PeriodEvent)
        : transformDateTimeEventToCalendarEvent(event as DateTimeEvent);

    const res = await insertEvent({
      summary,
      colorId,
      start,
      end,
    });

    console.log(res);

    await hop();
  }
}

// (async () => {
//   for (const waow of ["seasons", "magnitudes", "moons", "suns"]) {
//     await letTheMagicHappen("seasons");
//     await letTheMagicHappen("magnitudes");
//     await letTheMagicHappen("moons");
//     await letTheMagicHappen("suns");
//   }

//   console.log("Et voilà ! 😊");
// })();
