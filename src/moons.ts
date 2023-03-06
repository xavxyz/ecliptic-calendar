import axios from "axios";

import { months, outputToData, noRush } from "./utils";

type ApiMoonPhase = {
  phaseName: string;
  isPhaseLimit: 1 | 2 | 3 | 4;
  timeEvent?: string;
};

type MoonPhase = {
  day: number;
  name: string;
  time: string;
  emoji: string;
};

const phaseLimitEmojiHashTable: { [phaseLimit: number]: string } = {
  1: "🌚",
  2: "🌛",
  3: "🌝",
  4: "🌜",
} as const;

async function getMoonPhases(year: number) {
  const moons: { [month: string]: MoonPhase[] } = {};

  for (const month of months) {
    await noRush();

    const response = await axios(
      `https://www.icalendar37.net/lunar/api/?lang=fr&month=${month}&year=${year}`
    );

    const apiPhases: { [day: number]: ApiMoonPhase } = response.data.phase;

    const phases: MoonPhase[] = Object.entries(apiPhases)
      .filter(([day, moonData]) => moonData.isPhaseLimit)
      .map(([day, moonData]) => {
        // WHY U NO SIMPLE THIS TS ?
        return {
          day: Number(day),
          name: moonData.phaseName,
          time: String(moonData.timeEvent),
          emoji: String(phaseLimitEmojiHashTable[moonData.isPhaseLimit]),
        };
      });

    console.log(phases);

    moons[month] = phases;
  }

  await outputToData(`moons-${year}`, moons);
}

// getMoonPhases(2023);
// getMoonPhases(2024);
// getMoonPhases(2025);
