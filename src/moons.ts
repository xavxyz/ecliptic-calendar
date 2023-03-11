import axios from "axios";
import glob from "glob";
import fs from "fs-extra";

import {
  months,
  outputToData,
  noRush,
  addMissingZero,
  DateTimeEvent,
} from "./utils";

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
      .filter(([, moonData]) => moonData.isPhaseLimit)
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

async function mergeMoonPhases() {
  await noRush();

  const moonFiles = await glob("data/moons-*.json");

  const data = moonFiles
    .map((file) => {
      const year = Number(file.match(/moons-(\d{4})\.json/)![1]);

      const yearlyData = fs.readJsonSync(file);

      return Object.entries(yearlyData)
        .map(([month, phases]) => {
          return (phases as MoonPhase[]).map((phase) => {
            const day = addMissingZero(phase.day < 10, phase.day);
            const time = addMissingZero(
              Number(phase.time.split(":")[0]) < 10,
              phase.time
            );

            return {
              summary: `${phase.emoji} ${phase.name}`,
              dateTime: new Date(
                `${year}-${month}-${day}T${time}`
              ).toISOString(),
            };
          });
        })
        .flat();
    })
    .flat();

  await outputToData("moons", data as DateTimeEvent[]);
}

// getMoonPhases(2023);
// getMoonPhases(2024);
// getMoonPhases(2025);

mergeMoonPhases();
