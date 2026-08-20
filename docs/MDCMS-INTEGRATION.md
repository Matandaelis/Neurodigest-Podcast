### Added features in this update

- Audio proxy endpoint: `GET /api/proxy-audio?url=...` to proxy audio files through your server. Use with caution — proxying audio increases bandwidth and may have cost implications. This is useful when source audio lacks permissive CORS headers and you need a waveform for it.

  Example: `<audio src="/api/proxy-audio?url=${encodeURIComponent(audioUrl)}" controls />` or pass the proxied URL to the waveform player.

- Comments API: `GET /api/comments?slug=...` and `POST /api/comments` (protected). Stores comments in Firestore under `comments` collection. Requires authentication to post.

- Favorite UI: `components/FavoriteButton.tsx` added and wired into `EpisodeCard`. This calls your existing `/api/favorites` endpoint.

Notes & usage

- The proxy endpoint does not currently enforce auth or rate-limiting. For production, add authentication, domain whitelisting, or signed URLs and consider using a CDN.
- Waveform generation still requires the proxied response to have correct CORS behavior when using direct sources; using the proxy route should allow waveform generation because the request will be same-origin.

