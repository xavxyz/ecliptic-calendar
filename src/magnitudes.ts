import {
  movementMagnitudeAndDuration,
  cycleThroughArray,
  noRush,
  outputToData,
} from "./utils";

export type Magnitude = [label: string, dateTime: string];

const magnitudeLabels = [
  ["🤝 Équinoxe", "de Printemps"],
  ["🙌 Solstice", "d'Été"],
  ["🤝 Équinoxe", "d'Automne"],
  ["🤲 Solstice", "d'Hiver"],
];

function getMagnitudes(): Magnitude[] {
  return Object.values(movementMagnitudeAndDuration).map((movement, index) => {
    const [date] = movement;
    const dateTime = date.toISOString();

    const [label /*, season*/] = cycleThroughArray(magnitudeLabels, index);

    return [label, dateTime];
  });
}

(async () => {
  await noRush();

  const magnitudes = getMagnitudes();
  console.log(magnitudes);

  await outputToData("magnitudes", magnitudes);
})();
