const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const original = { velocity: 185.4, pressure: 1012, temperature: 36.8 };
let current = { ...original };
let history = { velocity: [], pressure: [], temperature: [] };
let cycles = 0;
function tick() {
  cycles++;
  for (const k of Object.keys(current)) {
    if (cycles % 5 === 0) current[k] += (original[k] - current[k]) * 0.35;
    else current[k] *= 1 + (Math.random() * 0.2 - 0.1);
    let unit = k === "velocity" ? "cm/s" : k === "pressure" ? "mbar" : "°C";
    history[k].push({
      time: new Date().toISOString(),
      value: +current[k].toFixed(2),
    });
    history[k] = history[k].slice(-100);
  }
}
setInterval(tick, 1000);
tick();
app.get("/api/dashboard", (req, res) =>
  res.json({
    timestamp: new Date().toISOString(),
    velocity: {
      value: current.velocity,
      unit: "cm/s",
      history: history.velocity,
    },
    pressure: {
      value: current.pressure,
      unit: "mbar",
      history: history.pressure,
    },
    temperature: {
      value: current.temperature,
      unit: "°C",
      history: history.temperature,
    },
  }),
);
app.listen(3000, () =>
  console.log("Telemetry API running at http://localhost:3000"),
);
