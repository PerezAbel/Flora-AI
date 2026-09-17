# AGRO AI interface photos

Bundled stock imagery for the UI preview. These images represent sample profiles, farms and products.

- farm.jpg: https://images.unsplash.com/photo-1500382017468-9049fed747ef
- maize.jpg: https://images.unsplash.com/photo-1551754655-cd27e38d2076
- tools.jpg: https://images.unsplash.com/photo-1416879595882-3373a0480b5b
- vegetables.jpg: https://images.unsplash.com/photo-1540420773420-3366772f4999
- avatar-*.jpg: https://i.pravatar.cc/100?img=12 (image IDs match filenames)

UI data lives in `contexts/agro-context.tsx`. Posts, listings, cart, profile edits and notification preferences currently last for the mounted app session. No data is published to other users, no payment is taken, and device telemetry is simulated. The scanner uses the existing demo inference service.
