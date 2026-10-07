import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";
import { DashboardData } from "../models/telemetry.model";
@Injectable({ providedIn: "root" })
export class ExportService {
  private rows(data: DashboardData | null) {
    if (!data) return [];
    const max = Math.max(
      data.velocity.history.length,
      data.pressure.history.length,
      data.temperature.history.length,
    );
    return Array.from({ length: max }, (_, i) => ({
      Timestamp:
        data.velocity.history[i]?.time ??
        data.pressure.history[i]?.time ??
        data.temperature.history[i]?.time ??
        "",
      Velocity: data.velocity.history[i]?.value ?? "",
      VelocityUnit: data.velocity.unit,
      Pressure: data.pressure.history[i]?.value ?? "",
      PressureUnit: data.pressure.unit,
      Temperature: data.temperature.history[i]?.value ?? "",
      TemperatureUnit: data.temperature.unit,
    }));
  }
  csv(data: DashboardData | null) {
    const rows = this.rows(data);
    if (!rows.length) return;
    const keys = Object.keys(rows[0]);
    const body = [
      keys.join(","),
      ...rows.map((r) =>
        keys.map((k) => JSON.stringify((r as any)[k] ?? "")).join(","),
      ),
    ].join("\\n");
    this.download(new Blob([body], { type: "text/csv" }), "telemetry.csv");
  }
  excel(data: DashboardData | null) {
    const ws = XLSX.utils.json_to_sheet(this.rows(data));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Telemetry");
    XLSX.writeFile(wb, "telemetry.xlsx");
  }
  private download(blob: Blob, name: string) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
