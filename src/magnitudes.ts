import {
  movementMagnitudeAndDuration,
  cycleThroughArray,
  noRush,
  outputToData,
} from "./utils";

const magnitudeLabels = [
  ["🤝 Équinoxe", "de Printemps"],
  ["🙌 Solstice", "d'Été"],
  ["🤝 Équinoxe", "d'Automne"],
  ["🤲 Solstice", "d'Hiver"],
];

function getMagnitudes() {
  return Object.values(movementMagnitudeAndDuration).map((movement, index) => {
    const [date] = movement;
    const [label /*season*/] = cycleThroughArray(magnitudeLabels, index);
    return [label, date];
  });
}

(async () => {
  await noRush();

  const magnitudes = getMagnitudes();
  console.log(magnitudes);

  await outputToData("magnitudes", magnitudes);
})();
