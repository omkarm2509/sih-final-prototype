# SahyogSetu — Final SIH Prototype

SahyogSetu is a **frontend-only cooperative regional services marketplace prototype** prepared for SIH demonstration. The final release preserves the existing customer, worker, trainee, and Cooperative Federation role architecture and the existing booking, estimate, simulated payment, invoice, review, analytics, accessibility, and low-connectivity flows.

## Technology stack

- Next.js / React / TypeScript
- Tailwind CSS
- Leaflet
- OpenStreetMap
- Browser APIs
- LocalStorage for prototype state
- Five languages: English, Hindi, Marathi, Tamil, Telugu

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Supported roles

- Customer
- Worker
- Trainee
- Cooperative Federation

Each role is protected by the existing frontend authentication/role guard. Trainee records remain separate from Worker records.

## Prototype limitations

This is a **frontend prototype**. LocalStorage is used for state persistence and is not secure server-side storage. The project does not provide a production backend, database server, real payment gateway, real SMS/IVR, WebSocket service, AI backend, real GPS tracking, or Google Maps integration.

Payments are simulated. Maps use Leaflet/OpenStreetMap and demonstrate service-area data; they do not provide live GPS tracking.

## Quality / release notes

- Complete source audit performed for the final release.
- Forbidden term search returned zero occurrences.
- Placeholder/debug-text audit returned no inappropriate placeholder content.
- Route/link audit found no missing static routes among the discovered internal links.
- Core booking state-machine regression tests passed.
- Demo workflow was executed three times in the local state simulation with deterministic reset behavior.
- A trainee-dashboard refresh notification side effect was removed so page refreshes do not create duplicate training notifications.
- No real credentials or secret environment files are included.

### Build verification limitation

`npm install --no-audit --no-fund` was attempted but timed out. A direct `npm run build` was then attempted and failed with `next: not found` because dependencies were not installed. Therefore the Next.js production build is NOT reported as successful. The available TypeScript compiler successfully compiled the core non-React application logic used by the regression tests. The release archive intentionally does not contain `node_modules`, `.next`, cache files, or build artifacts.
