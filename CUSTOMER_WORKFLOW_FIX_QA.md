# Customer Workflow Fix QA

Base: SahyogSetu_REFERENCE_IMAGE_Correction.zip
Modification scope: Customer booking/payment/receipt/tracking/cancellation workflow only.

## Intended flow
Login -> Location + map -> Service type/requirement -> Date/time slot -> Worker -> Payment -> Receipt -> Tracking -> Cancellation when allowed.

## Targeted verification
- Changed files limited to the customer workflow/localization/notification/map files.
- Changed TS/TSX files transpile successfully with TypeScript: PASS.
- Shared booking state test: ASSIGNED -> ACCEPTED -> CANCELLED: PASS.
- Invalid transition CANCELLED -> SERVICE: rejected, PASS.
- Payment creation linked to booking and invoice: PASS.
- Cancellation notification generated for customer/worker/federation: PASS.
- Receipt download implemented as a local browser-generated text file.
- Cancelled tracking state no longer marks the entire lifecycle as completed.
- Payment page blocks new payment for cancelled bookings.
- No occurrence of the prohibited role term in source: PASS.
- No node_modules/.next/.git/build artifacts included.

## Build limitation
The environment does not have installed Next.js/React dependencies and npm dependency installation has previously timed out. Full `npm run build` could therefore not be truthfully certified in this environment.
