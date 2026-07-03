---
name: npm-publish-sync
description: Synchronize utility library updates across NPM registry, package READMEs, and website documentation pages.
---

# npm-publish-sync Skill

Use this skill whenever you are requested to modify, update, or create a package in the `@sopkit/*` NPM utility library ecosystem.

## Workflow Instructions

### 1. Research & Implementation
- Modify or implement the code inside `packages/<pkg-name>/src/index.ts`.
- Ensure strictly typed ESM/CJS exports and complete TSDoc function comments.

### 2. Version & Package Updates
- Increment the package version number in `packages/<pkg-name>/package.json` following semantic versioning rules (semver).
- Update the package's local `README.md` with new features or API examples.

### 3. Website Documentation Updates
- Update the static data array `PACKAGES_DATA` inside `src/app/(company)/packages/page.tsx` with the new version and API details.
- Update the static data array `PACKAGES_MAP` inside `src/app/(company)/packages/[slug]/page.tsx` to keep individual subpage documentation and competitor comparisons synchronized.

### 4. Build and Compilation
- Run `npm run build` inside `packages/<pkg-name>` to compile CJS, ESM, and `.d.ts` declaration maps.

### 5. Automated Publication
- Run `npm run publish-all` from the project root to authenticate (requesting 2FA from the user in their terminal if needed) and publish the new version.
