import {
  movementMagnitudeAndDuration,
  cycleThroughArray,
  noRush,
  outputToData,
} from "./utils";

export type Magnitude = [summary: string, dateTime: string];

const magnitudesummarys = [
  ["🤝 Équinoxe", "de Printemps"],
  ["🙌 Solstice", "d'Été"],
  ["🤝 Équinoxe", "d'Automne"],
  ["🤲 Solstice", "d'Hiver"],
];

function getMagnitudes(): Magnitude[] {
  return Object.values(movementMagnitudeAndDuration).map((movement, index) => {
    const [date] = movement;
    const dateTime = date.toISOString();

    const [summary /*, season*/] = cycleThroughArray(magnitudesummarys, index);

    return [summary, dateTime];
  });
}

(async () => {
  await noRush();

  const magnitudes = getMagnitudes();
  console.log(magnitudes);

  await outputToData("magnitudes", magnitudes);
})();
