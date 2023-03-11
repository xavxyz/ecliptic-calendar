import moment from "moment";

import {
  movementMagnitudeAndDuration,
  cycleThroughArray,
  outputToData,
  noRush,
} from "./utils";

type YYYYMMDD = string;

type MovementBoundaries = [start: YYYYMMDD, end: YYYYMMDD];
type ExtendedMovement = [
  prevInterStart: YYYYMMDD,
  transformationStart: YYYYMMDD,
  // ? Gestion du centre en génération externe
  // center: YYYYMMDD,
  transformationEnd: YYYYMMDD,
  nextInterEnd: YYYYMMDD
];

export type ReadableSeason = [label: YYYYMMDD, start: YYYYMMDD, end: YYYYMMDD];

const movementsLabelColorIdTuples = [
  ["🪴 INTERSAISON", "5"],
  ["🌬 PRINTEMPS", "2" /* 10 ? */],
  ["💐 INTERSAISON", "5"],
  ["🔥 ÉTÉ", "11" /* 3 ? */],
  ["🌾 INTERSAISON", "5"],
  ["⚙️ AUTOMNE", "" /* 8 ? */],
  ["🚰 INTERSAISON", "5"],
  ["🌊 HIVER", "8"],
];

function retrieveTransformationDatesFromStartAndDuration(
  transformationStart: YYYYMMDD,
  duration: number
) {
  const previousInterStart = moment(transformationStart)
    .subtract(18, "days")
    .format("YYYY-MM-DD");
  const transformationEnd = moment(transformationStart)
    .add(duration, "days")
    .format("YYYY-MM-DD");
  const nextInterEnd = moment(transformationEnd)
    .add(18, "days")
    .format("YYYY-MM-DD");

  return [
    previousInterStart,
    transformationStart,
    transformationEnd,
    nextInterEnd,
  ];
}

function groupExtendedMovementsFromSpringStart(springStart: YYYYMMDD) {
  return Object.values(movementMagnitudeAndDuration).reduce(
    (movements, movementMagnitudeAndDuration, index) => {
      const [, duration] = movementMagnitudeAndDuration;
      const seasonStart = index === 0 ? springStart : movements[index - 1][3];

      const [
        previousInterStart,
        transformationStart,
        transformationEnd,
        nextInterEnd,
      ] = retrieveTransformationDatesFromStartAndDuration(
        seasonStart,
        duration
      );

      return [
        ...movements,
        [
          previousInterStart,
          transformationStart,
          transformationEnd,
          nextInterEnd,
        ],
      ] as ExtendedMovement[];
    },
    [] as ExtendedMovement[]
  );
}

const extendedMovements = groupExtendedMovementsFromSpringStart("2023-02-13");

function makeSeasonsCycle(
  extendedMovements: ExtendedMovement[]
): ReadableSeason[] {
  return extendedMovements
    .reduce((movements, extendedMovement) => {
      const [prev, start, end /*, next*/] = extendedMovement;

      return [
        ...movements,
        [prev, start],
        [start, end],
      ] as MovementBoundaries[];
    }, [] as MovementBoundaries[])
    .map((movement, index) => {
      const [label] = cycleThroughArray(movementsLabelColorIdTuples, index);
      return [label, ...movement];
    });
}

(async () => {
  await noRush();

  const seasons = makeSeasonsCycle(extendedMovements);

  console.log(seasons);

  await outputToData("seasons", seasons);
})();
