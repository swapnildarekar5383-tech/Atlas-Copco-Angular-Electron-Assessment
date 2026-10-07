export interface Sample {
  time: string;
  value: number;
}
export interface TelemetryMetric {
  value: number;
  unit: string;
  history: Sample[];
}
export interface DashboardData {
  timestamp: string;
  velocity: TelemetryMetric;
  pressure: TelemetryMetric;
  temperature: TelemetryMetric;
}
export type MetricKey = "velocity" | "pressure" | "temperature";
export interface MetricConfig {
  key: MetricKey;
  label: string;
  icon: string;
  baseUnit: string;
  min: number;
  max: number;
  warningLow: number;
  warningHigh: number;
  criticalLow: number;
  criticalHigh: number;
}
