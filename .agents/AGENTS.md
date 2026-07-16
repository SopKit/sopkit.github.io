# Project Rules & Customizations for SopKit

Welcome, Agent! Follow these project-specific style guidelines, architecture constraints, and behavioral rules.

---

## 🛠️ codebase-manager Skill
We have created a dedicated codebase manager skill at **[.agents/skills/codebase-manager/SKILL.md](/sopkit.github.io/.agents/skills/codebase-manager/SKILL.md)**.
If you are asked to register new tools, update routing structures, deduplicate registry lists, or add new tools to the app, you **MUST** read and follow the instructions in that skill first.

---

## 🚨 CRITICAL SEO & CONTENT RULES — MUST FOLLOW FOR ALL TOOLS

These rules exist to make every tool page rank, feel genuine, and avoid spammy templated content.

### 1. Separate Manual Content Source of Truth
- **DO NOT** put on-page text inside `tools.json` or per-page `page.tsx` metadata strings.
- **ALL** tool page text MUST come from `src/data/generated-manual-content.ts` via the `MANUAL_TOOL_CONTENT` map.
- `ToolLayout.tsx` must render `whatItIs`, `features`, `howToUse`, and `faqs` from that map only.
- If a tool has no entry, add one before considering the page complete.

### 2. No Generic Templates or Placeholders
- **BANNED**: runtime `${name}` replacement, generic feature lists, copy-pasted article sections, identical FAQ blocks across tools.
- Every tool must have unique `whatItIs`, `features`, `howToUse.steps`, and `faqs` written for that specific tool.
- Privacy/sandbox messaging may appear once in article context and once in FAQ context per tool, not in every bullet and paragraph.

### 3. Manual Research Required
- Research the tool's actual purpose, real use cases, and common user questions before writing content.
- Content must match what the tool actually does; do not invent capabilities not present in the implementation.

### 4. Genuine, Non-Spammy Tone
- Write for humans first, crawlers second.
- Vary sentence length and structure across tools.
- Avoid keyword stuffing, excessive bolding, and repetitive phrasing.
- FAQ answers must actually answer the question, not rephrase it with inserted keywords.

### 5. SEO Technical Standards
- Title pattern: `Free [Tool Name] Online — [Action] [Subject]`
- Meta description: 150-160 chars, include primary keyword naturally, mention client-side/privacy naturally.
- H1 must be unique across the site and descriptive.
- Canonical URL must be set explicitly on every tool page.
- Every tool page needs: `SoftwareApplication`, `FAQPage`, `HowTo`, `BreadcrumbList`, `Article` JSON-LD.
- Minimum 10 related tools per page via `getRelatedTools()`.

### 6. Anti-Spam Quality Checks
Before marking any tool content complete, verify:
- [ ] No two tools share identical feature lists or FAQ answers
- [ ] Content sounds like a real person wrote it
- [ ] Keywords appear naturally — no stuffing
- [ ] The tool page is genuinely useful and accurate
- [ ] No excessive bolding of every keyword phrase
- [ ] FAQ answers vary in structure between tools in the same category
- [ ] H1 tags are unique across the entire site

### 7. Adding or Updating Tools
When adding a new tool:
1. Append entry to `src/constants/tools.json`.
2. Add unique manual content entry to `src/data/generated-manual-content.ts`.
3. Create the tool page under the correct route group and use `ToolLayout`.
4. Map interactive tools in `IntentToolDispatcher.tsx`.
5. Verify sitemap, robots.txt, and LLM index are updated.

## ⚠️ Key Engineering Rules & Constraints

1.  **No Build Commands**: Do NOT run production build commands (`bun run build`, `npm run build`) in the terminal. Verify all TypeScript compile checks by running `bun run typecheck` instead.
2.  **Central Dispatcher Registry**: All interactive tools must be mapped inside **[IntentToolDispatcher.tsx](/sopkit.github.io/src/components/tools/shared/IntentToolDispatcher.tsx)** to keep client-side bundles lightweight and support the ad-free iframe embeds route (`/embed-tool/?id=...`).
3.  **Deduplicated Registry**: Keep **[tools.json](/sopkit.github.io/src/constants/tools.json)** clean. Run `node scripts/deduplicate-tools.mjs` if you introduce or update tool metadata.
4.  **Disabled Ads Configuration**: Keep `SHOW_SCRIPTLY_ADS = false` inside `src/constants/config.ts` globally disabled unless explicitly requested by the user.
5.  **Always Push to Git**: Once typechecks pass and sitemap/LLM indices are regenerated (`node scripts/generate-llms.mjs`), commit and git push directly to the `main` branch.
6.  **PDF Tools Privacy & Keyword Targets**: Target long-tail, privacy-centric keyword search queries (e.g. "privacy-friendly", "no upload", "100% client-side", "secure local", "fast", "free forever") for all PDF-related tools. Ensure that both page metadata and tool interfaces clearly convey local-only browser execution.
