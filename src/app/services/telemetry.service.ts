import { Injectable, signal } from '@angular/core';
import { DashboardData, MetricKey, Sample } from '../models/telemetry.model';

@Injectable({providedIn:'root'})
export class TelemetryService {
  readonly data = signal<DashboardData | null>(null);
  readonly connected = signal(true);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly lastSuccess = signal<Date | null>(null);
  private timer?: ReturnType<typeof setInterval>;
  private cycles = 0;
  private readonly originals = { velocity: 185.4, pressure: 1012, temperature: 36.8 };
  private current = {...this.originals};

  start(): void {
    if (this.timer) return;
    this.fetch();
    this.timer = setInterval(() => this.fetch(), 1000);
  }
  stop(): void { if(this.timer) clearInterval(this.timer); this.timer = undefined; }
  private fetch(): void {
    try {
      this.cycles++;
      (Object.keys(this.current) as MetricKey[]).forEach(k => {
        if (this.cycles % 5 === 0) this.current[k] += (this.originals[k] - this.current[k]) * 0.35;
        else this.current[k] *= 1 + ((Math.random() * 0.20) - 0.10);
      });
      const previous = this.data();
      const now = new Date();
      const make = (key: MetricKey, unit: string): any => {
        const value = Number(this.current[key].toFixed(2));
        const old = previous?.[key]?.history ?? [];
        const history: Sample[] = [...old, {time: now.toISOString(), value}].slice(-100);
        return {value, unit, history};
      };
      this.data.set({timestamp: now.toISOString(), velocity: make('velocity','cm/s'), pressure: make('pressure','mbar'), temperature: make('temperature','°C')});
      this.connected.set(true); this.error.set(null); this.loading.set(false); this.lastSuccess.set(now);
    } catch(e) { this.connected.set(false); this.error.set('Unable to read telemetry data.'); this.loading.set(false); }
  }
}