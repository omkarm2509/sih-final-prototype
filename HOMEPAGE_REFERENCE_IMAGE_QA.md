# SahyogSetu — Reference Image Correction QA

## Reference asset

The supplied SahyogSetu homepage reference image was used as the source visual.
The final project contains local assets derived directly from that supplied image:

- `public/assets/sahyogsetu-logo-reference.png`
- `public/assets/worker-reference-full.jpg`

The worker hero asset contains the five-worker composition and the service-category cards visible in the supplied reference. No stock/remote/generated replacement was used.

## Homepage checks

- Reference worker image is referenced from `/assets/worker-reference-full.jpg`.
- Reference logo is referenced from `/assets/sahyogsetu-logo-reference.png`.
- Worker image is large and visible in the desktop hero.
- Worker image remains visible on mobile.
- Hero text remains on the left on desktop.
- Worker group remains on the right on desktop.
- Statistics remain directly below the hero.
- Service-category cards are part of the supplied reference visual.
- No external hero image URL is used.
- No placeholder hero image is used.
- No `prohibited role term` occurrence exists in application source.

## Environment limitation

A full Next.js production build could not be executed because dependency installation (`npm install`) timed out in the execution environment. Source/asset path checks were completed directly against the extracted project.
