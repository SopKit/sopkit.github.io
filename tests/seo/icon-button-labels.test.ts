import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { findUnlabelledIconControls } from "../../scripts/validate-icon-button-labels";

// An icon-only button with no accessible name is announced by a screen
// reader as just "button": its purpose is invisible to keyboard and
// screen-reader users. Before this guard existed, 136 such controls
// shipped across the tool components (copy/download/remove/reset
// buttons, list reorder buttons, media transport buttons, password
// visibility toggles). The prebuild script
// scripts/validate-icon-button-labels.ts enforces the same invariant on
// the parsed AST; these tests pin it through that same function plus
// the specific repairs, so a future icon-only button cannot land
// without a name.

const rootDir = path.resolve(import.meta.dir, "../..");

function readSource(relative: string): string {
  return fs.readFileSync(path.join(rootDir, relative), "utf8");
}

describe("Icon-only controls carry an accessible name", () => {
  it("no icon-only Button/button/a in src/components or src/app lacks a label", () => {
    const result = findUnlabelledIconControls(rootDir);
    // Guard against a vacuous pass: the tree contains hundreds of
    // unlabelled-but-texted controls, so a zero here would mean the
    // walk itself broke, not that the tree is clean.
    expect(result.checked).toBeGreaterThan(100);
    expect(result.violations).toEqual([]);
  });

  it("the previously nameless controls now name their action", () => {
    const cases: Array<[string, string]> = [
      // QR scan result row: copy button and the asChild open-link control.
      ["src/components/tools/utilities/QrReaderPremium.tsx", 'aria-label="Copy scan result"'],
      ["src/components/tools/utilities/QrReaderPremium.tsx", 'aria-label="Open scanned link"'],
      // Video editor transport: skips name their distance, play/pause
      // names the state it will switch to.
      ["src/components/tools/video/VideoEditorTool.tsx", 'aria-label="Skip back 5 seconds"'],
      ["src/components/tools/video/VideoEditorTool.tsx", 'aria-label="Skip forward 5 seconds"'],
      ["src/components/tools/video/VideoEditorTool.tsx", 'aria-label={isPlaying ? "Pause video" : "Play video"}'],
      // Password visibility toggles name the state they will switch to.
      ["src/components/tools/pdf/PDFProtect.tsx", 'aria-label={showPassword ? "Hide password" : "Show password"}'],
      ["src/components/tools/security/PasswordCheckerTool.tsx", 'aria-label={showPassword ? "Hide password" : "Show password"}'],
      // Aspect-ratio lock toggle names the state it will switch to.
      [
        "src/components/tools/image/ImageResizerTool.tsx",
        'aria-label={resizeOptions.maintainAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}',
      ],
      // Logo undo/redo match their tooltip text (a tooltip alone does
      // not give a button an accessible name).
      ["src/components/tools/image/LogoGeneratorTool.tsx", 'aria-label="Undo"'],
      ["src/components/tools/image/LogoGeneratorTool.tsx", 'aria-label="Redo"'],
      // Shared code block copy button.
      ["src/components/ui/code-block.tsx", 'aria-label="Copy code"'],
    ];
    for (const [file, label] of cases) {
      expect(readSource(file)).toContain(label);
    }
  });

  it("print-preview document headings no longer duplicate the page H1", () => {
    // BioDataMaker and InvoiceGenerator render inside ToolLayout, which
    // already renders the page H1. Their paper-document headings were
    // <h1> elements, giving those tool pages two H1s; they are now <h2>
    // with identical styling, so the printed document looks the same.
    for (const file of [
      "src/components/tools/generators/BioDataMaker.tsx",
      "src/components/tools/generators/InvoiceGenerator.tsx",
    ]) {
      const source = readSource(file);
      expect(source).not.toContain("<h1");
      expect(source).toContain("<h2");
    }
  });
});
