# Project Rules & Customizations for SopKit

Welcome, Agent! Follow these project-specific style guidelines, architecture constraints, and behavioral rules.

---

## 🛠️ codebase-manager Skill
We have created a dedicated codebase manager skill at **[.agents/skills/codebase-manager/SKILL.md](file:///Users/shaswatraj/Desktop/earn/sopkit.github.io/.agents/skills/codebase-manager/SKILL.md)**.
If you are asked to register new tools, update routing structures, deduplicate registry lists, or add new tools to the app, you **MUST** read and follow the instructions in that skill first.

---

## ⚠️ Key Engineering Rules & Constraints

1.  **No Build Commands**: Do NOT run production build commands (`bun run build`, `npm run build`) in the terminal. Verify all TypeScript compile checks by running `bun run typecheck` instead.
2.  **Central Dispatcher Registry**: All interactive tools must be mapped inside **[IntentToolDispatcher.tsx](file:///Users/shaswatraj/Desktop/earn/sopkit.github.io/src/components/tools/shared/IntentToolDispatcher.tsx)** to keep client-side bundles lightweight and support the ad-free iframe embeds route (`/embed-tool/?id=...`).
3.  **Deduplicated Registry**: Keep **[tools.json](file:///Users/shaswatraj/Desktop/earn/sopkit.github.io/src/constants/tools.json)** clean. Run `node scripts/deduplicate-tools.mjs` if you introduce or update tool metadata.
4.  **Disabled Ads Configuration**: Keep `SHOW_SCRIPTLY_ADS = false` inside `src/constants/config.ts` globally disabled unless explicitly requested by the user.
5.  **Always Push to Git**: Once typechecks pass and sitemap/LLM indices are regenerated (`node scripts/generate-llms.mjs`), commit and git push directly to the `main` branch.
