import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { TelemetryService } from "./services/telemetry.service";
import { ExportService } from "./services/export.service";
import { UnitService, UnitKey } from "./services/unit.service";
import {
  DashboardData,
  MetricConfig,
  MetricKey,
} from "./models/telemetry.model";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit, OnDestroy {
  dark = signal(true);
  chartZoom: Record<MetricKey, number> = {
    velocity: 1,
    pressure: 1,
    temperature: 1,
  };
  chartOffset: Record<MetricKey, number> = {
    velocity: 0,
    pressure: 0,
    temperature: 0,
  };
  selectedUnits: Record<MetricKey, string> = {
    velocity: "cm/s",
    pressure: "mbar",
    temperature: "°C",
  };
  configs: MetricConfig[] = [
    {
      key: "velocity",
      label: "Velocity",
      icon: "↗",
      baseUnit: "cm/s",
      min: 0,
      max: 300,
      warningLow: 0,
      warningHigh: 240,
      criticalLow: 0,
      criticalHigh: 280,
    },
    {
      key: "pressure",
      label: "Pressure",
      icon: "◉",
      baseUnit: "mbar",
      min: 900,
      max: 1100,
      warningLow: 930,
      warningHigh: 1080,
      criticalLow: 910,
      criticalHigh: 1095,
    },
    {
      key: "temperature",
      label: "Temperature",
      icon: "♨",
      baseUnit: "°C",
      min: -20,
      max: 100,
      warningLow: 0,
      warningHigh: 70,
      criticalLow: -10,
      criticalHigh: 85,
    },
  ];
  unitOptions: Record<MetricKey, string[]> = {
    velocity: ["mm/s", "cm/s", "m/s", "km/h", "ft/s"],
    pressure: ["Pa", "kPa", "mbar", "bar", "psi", "atm"],
    temperature: ["°C", "°F", "K"],
  };
  constructor(
    public telemetry: TelemetryService,
    private units: UnitService,
    private exporter: ExportService,
  ) {}
  ngOnInit() {
    this.telemetry.start();
  }
  ngOnDestroy() {
    this.telemetry.stop();
  }
  metric(c: MetricConfig) {
    return this.telemetry.data()?.[c.key];
  }
  converted(c: MetricConfig) {
    const m = this.metric(c);
    return m
      ? this.units.convert(m.value, c.key, m.unit, this.selectedUnits[c.key])
      : 0;
  }
  history(c: MetricConfig) {
    const m = this.metric(c);
    return (m?.history ?? [])
      .slice(-100)
      .map((s) => ({
        time: new Date(s.time).toLocaleTimeString(),
        value: this.units.convert(
          s.value,
          c.key,
          m!.unit,
          this.selectedUnits[c.key],
        ),
      }));
  }
  status(c: MetricConfig) {
    const v = this.converted(c);
    const base = this.units.convert(
      v,
      c.key,
      this.selectedUnits[c.key],
      c.baseUnit,
    );
    if (base >= c.criticalHigh || base <= c.criticalLow) return "Critical";
    if (base >= c.warningHigh || base <= c.warningLow) return "Warning";
    return "Normal";
  }
  gauge(c: MetricConfig) {
    const pct = Math.max(
      0,
      Math.min(
        100,
        ((this.converted(c) -
          this.units.convert(
            c.min,
            c.key,
            c.baseUnit,
            this.selectedUnits[c.key],
          )) /
          (this.units.convert(
            c.max,
            c.key,
            c.baseUnit,
            this.selectedUnits[c.key],
          ) -
            this.units.convert(
              c.min,
              c.key,
              c.baseUnit,
              this.selectedUnits[c.key],
            ))) *
          100,
      ),
    );
    return `conic-gradient(var(--accent) ${pct}%, var(--track) ${pct}% 100%)`;
  }
  trackBy(_: number, x: any) {
    return x.time;
  }
  chartPoints(c: MetricConfig) {
    const all = this.history(c);
    if (!all.length) return "";
    const visible = Math.max(5, Math.floor(all.length / this.chartZoom[c.key]));
    const maxStart = Math.max(0, all.length - visible);
    const start = Math.max(0, Math.min(maxStart, this.chartOffset[c.key]));
    const arr = all.slice(start, start + visible);
    const min = Math.min(...arr.map((x) => x.value)),
      max = Math.max(...arr.map((x) => x.value)),
      range = Math.max(max - min, 0.0001);
    return arr
      .map(
        (p, i) =>
          `${((i / Math.max(arr.length - 1, 1)) * 590 + 5).toFixed(1)},${(170 - ((p.value - min) / range) * 145).toFixed(1)}`,
      )
      .join(" ");
  }
  zoomIn(c: MetricConfig) {
    this.chartZoom[c.key] = Math.min(5, this.chartZoom[c.key] + 0.5);
    this.chartOffset[c.key] = 0;
  }
  zoomOut(c: MetricConfig) {
    this.chartZoom[c.key] = Math.max(1, this.chartZoom[c.key] - 0.5);
    this.chartOffset[c.key] = 0;
  }
  pan(c: MetricConfig, dir: number) {
    const all = this.history(c),
      visible = Math.max(5, Math.floor(all.length / this.chartZoom[c.key])),
      maxStart = Math.max(0, all.length - visible);
    this.chartOffset[c.key] = Math.max(
      0,
      Math.min(maxStart, this.chartOffset[c.key] + dir * 2),
    );
  }
  toggleTheme() {
    this.dark.update((v) => !v);
    document.documentElement.classList.toggle("light", !this.dark());
  }
  setUnit(k: MetricKey, e: Event) {
    this.selectedUnits[k] = (e.target as HTMLSelectElement).value;
  }
  exportCsv() {
    this.exporter.csv(this.telemetry.data());
  }
  exportExcel() {
    this.exporter.excel(this.telemetry.data());
  }
}
