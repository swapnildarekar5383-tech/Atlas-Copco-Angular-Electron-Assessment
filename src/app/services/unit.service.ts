import { Injectable } from "@angular/core";
export type UnitKey = "velocity" | "pressure" | "temperature";
const factors: any = {
  velocity: {
    "mm/s": 10,
    "cm/s": 1,
    "m/s": 0.01,
    "km/h": 0.036,
    "ft/s": 0.0328084,
  },
  pressure: {
    Pa: 100,
    kPa: 0.1,
    mbar: 1,
    bar: 0.001,
    psi: 0.00145038,
    atm: 0.000986923,
  },
  temperature: {},
};
@Injectable({ providedIn: "root" })
export class UnitService {
  convert(value: number, key: UnitKey, from: string, to: string): number {
    if (from === to) return value;
    if (key === "temperature") {
      const c =
        from === "°C"
          ? value
          : from === "°F"
            ? ((value - 32) * 5) / 9
            : value - 273.15;
      return to === "°C" ? c : to === "°F" ? (c * 9) / 5 + 32 : c + 273.15;
    }
    return (value / factors[key][from]) * factors[key][to];
  }
}
