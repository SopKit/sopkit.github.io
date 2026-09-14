# Third-Party Governance

## The Problem
In the baseline audit, third parties accounted for approximately 330 KiB of payload and blocking execution time:
- Google Tag Manager / GA4: ~167 KiB
- Google AdSense / DoubleClick: ~163 KiB
- Layout shifts caused by unreserved dynamic ad frames.
- Console errors originating from ad-blocker interactions.

## Architectural Rules
1. **Never Block Rendering**: Third-party scripts are forbidden in the critical rendering path.
2. **Execution Priority**:
   - `critical`: Only self-hosted core runtime logic.
   - `deferred`: Loaded after `DOMContentLoaded`.
   - `idle`: Loaded via `requestIdleCallback` or network idle.
   - `interaction`: Loaded only upon explicit user trigger (click, file drop).
3. **Graceful Degradation**: Ad-blockers or failed third-party network requests must never throw uncaught exceptions or break the application UI.
4. **Consent-First**: Google Consent Mode v2 is strictly obeyed before firing tracking pixels.
5. **No Ads on Critical Tools / Embeds**: Monetization is disabled by default on utility tools and embeds (`SHOW_SCRIPTLY_ADS = false`).
