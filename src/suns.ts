import axios from "axios";
import moment from "moment";
import glob from "glob";
import fs from "fs-extra";

import { createDatableArray, months, noRush, hop, outputToData } from "./utils";

const ji = [43.8589744, 4.4206824];

type ApiSunData = {
  sunrise: string;
  sunset: string;
};

export type Sun = [summary: string, dateTime: string];

const actionTosummaryHashtable = {
  sunrise: "🌅 ⬆️ 🧘‍♂️",
  sunset: "🌇 ⬇️ 🧘‍♀️",
} as const;

async function getSunPhases(year: string, month: string) {
  const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();

  const days = createDatableArray(daysInMonth);

  const suns: { [day: string]: ApiSunData } = {};

  for (const day of days) {
    const [lat, lng] = ji;

    const date = `${year}-${month}-${day}`;
    console.log(`// ${date}`);

    const apiUrl = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&timezone=Europe/Paris&date=${date}`;

    await hop();

    const response = await axios(apiUrl);

    const { sunrise, sunset } = response.data.results;

    suns[day] = { sunrise, sunset };
  }

  await outputToData(`suns-${year}-${month}`, suns);
}

// (async () => {
//   for (const month of months) {
//     await noRush();

//     // await getSunPhases("2023", month);
//     // await getSunPhases("2024", month);
//     await getSunPhases("2025", month);
//   }
// })();

async function mergeSuns() {
  await noRush();

  const sunFiles = await glob("data/suns-*.json");

  const suns = sunFiles
    .map((file) => {
      const [, year, month] = file.match(/suns-(\d{4})-(\d{2}).json/)!;
      const monthlyData: { [day: string]: ApiSunData } = fs.readJsonSync(file);

      return Object.entries(monthlyData)
        .map(([day, actions]) => {
          return Object.entries(actions).map(([action, amPmTime]) => {
            const typedAction = action as keyof ApiSunData;

            return {
              summary: actionTosummaryHashtable[typedAction],
              dateTime: new Date(`${month}/${day}/${year} ${amPmTime}`),
            };
          });
        })
        .flat();
    })
    .flat();

  await outputToData(`suns`, suns);
}

mergeSuns();
