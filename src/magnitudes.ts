import {
  movementMagnitudeAndDuration,
  cycleThroughArray,
  noRush,
  outputToData,
  DateTimeEvent,
} from "./utils";

const magnitudesummarys = [
  ["🤝 Équinoxe", "de Printemps"],
  ["🙌 Solstice", "d'Été"],
  ["🤝 Équinoxe", "d'Automne"],
  ["🤲 Solstice", "d'Hiver"],
];

function getMagnitudes(): DateTimeEvent[] {
  return Object.values(movementMagnitudeAndDuration).map((movement, index) => {
    const [date] = movement;
    const dateTime = date.toISOString();

    const [summary /*, season*/] = cycleThroughArray(magnitudesummarys, index);

    return { summary, dateTime };
  });
}

(async () => {
  await noRush();

  const magnitudes = getMagnitudes();
  console.log(magnitudes);

  await outputToData("magnitudes", magnitudes);
})();
