# Electron Telemetry Monitor

This project is an Angular and Electron based telemetry monitoring application created for the given technical assessment.

## Tech Stack

* Angular with standalone components
* TypeScript
* Electron
* Node.js / Express for telemetry simulation
* RxJS / Signals
* Live chart for telemetry history
* SheetJS (`xlsx`) for Excel export

## Features Implemented

* Dashboard for Velocity, Pressure, and Temperature
* Circular gauges with current value, unit, status, and update time
* Telemetry data updates every 1 second
* Random value changes of around ±10%
* Values slowly recover after every 5 cycles
* Stores the latest 100 data samples
* Live trend chart for each metric
* Unit conversion on the frontend without calling the backend
* Light and Dark theme
* Loading, connection, and error states
* CSV and Excel export
* Responsive desktop UI

## Run Angular

Install the project dependencies:

```bash
npm install
```

Start the Angular application:

```bash
npm start
```

Open:

http://localhost:4200

## Run Electron

Install the project dependencies if not already installed:

```bash
npm install
```

Run the Electron application:

```bash
npm run electron
```

## Optional Backend

The Angular application has its own telemetry simulator, so the project can run with only one `npm install`.

There is also a separate Express backend inside the `backend` folder. It provides the following API:

```text
GET /api/dashboard
```

To run the backend:

```bash
cd backend
npm install
npm start
```

API:

http://localhost:3000/api/dashboard

## Production Build

To create the Angular production build:

```bash
npm run build
```

To build the Electron application:

```bash
npm run electron:build
```

## Project Structure

The main telemetry models are inside:

```text
src/app/models
```

The telemetry service handles the live data and keeps the latest 100 samples.

```text
services/telemetry.service.ts
```

The unit service is used for unit conversion:

```text
unit.service.ts
```

The export service handles CSV and Excel file exports:

```text
export.service.ts
```

The main Angular component contains the monitoring dashboard UI.

Electron is used to run the Angular application as a Windows desktop application.

## Assumptions

1. The assessment does not specify a particular backend technology, so an Express backend example is included.

2. The Angular application uses the local telemetry simulator by default. This makes it possible to run the project without starting another server.

3. The chart is created using SVG instead of an external chart library. It shows up to 100 data points and updates every second.

4. The assessment mentions zoom, pan, and tooltips for the chart. The current version keeps the chart simple and does not use an external chart library. Chart.js can be added later if these features are required.
