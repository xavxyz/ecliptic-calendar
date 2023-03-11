import fs from "fs-extra";

interface Event {
  summary: string;
}

export interface DateTimeEvent extends Event {
  summary: string;
  dateTime: string;
}

export interface PeriodEvent extends Event {
  summary: string;
  startDate: string;
  endDate: string;
}

export type MovementMagnitudeAndDuration = [center: Date, duration: number];

export const movementMagnitudeAndDuration: {
  [name: string]: MovementMagnitudeAndDuration;
} = {
  spring23: [new Date("2023-03-20 22:24"), 73],
  summer23: [new Date("2023-06-21 16:57"), 76],
  autumn23: [new Date("2023-09-23 08:49"), 74],
  winter23: [new Date("2023-12-22 04:27"), 70],
  spring24: [new Date("2024-03-20 04:06"), 73],
  summer24: [new Date("2024-06-20 22:50"), 76],
  autumn24: [new Date("2024-09-22 14:43"), 74],
  winter24: [new Date("2024-12-21 10:20"), 70],
  spring25: [new Date("2025-03-20 10:01"), 73],
  summer25: [new Date("2025-06-21 04:42"), 76],
  autumn25: [new Date("2025-09-22 20:19"), 74],
  winter25: [new Date("2025-12-21 16:03"), 70],
};

export function cycleThroughArray<T>(array: T[], index: number) {
  return array[index % array.length];
}

export function addMissingZero(condition: boolean, unit: string | number) {
  return condition ? `0${unit}` : String(unit);
}

export function createDatableArray(length: number) {
  return Array.from({ length }, (_, index) =>
    addMissingZero(index < 9, index + 1)
  );
}

export const months = createDatableArray(12);

export async function wait(ms: number) {
  const timeoutPromise = new Promise((resolve: any) => setTimeout(resolve, ms));

  return timeoutPromise;
}

export async function noRush() {
  console.log("\n// Breathe in");
  await wait(5000);
  console.log("// Breathe out\n");
  await wait(5000);
}

export async function hop() {
  console.log("\n// hop\n");
  await wait(1000);
}

export async function outputToData(name: string, data: any) {
  const file = `./data/${name}.json`;

  await fs.outputFile(file, JSON.stringify(data, null, 2));
}
