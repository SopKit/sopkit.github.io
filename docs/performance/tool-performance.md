# Tool Page Performance Governance

Interactive tool pages are the heart of SopKit. They must feel instantaneous upon initial navigation while providing heavy compute capabilities in the browser.

## Architectural Requirements
1. **Initial Paint in <1.5s**: The initial tool shell, title, description, privacy badge, dropzone, and controls are rendered with minimal DOM and zero heavy dependencies.
2. **On-Demand Engine Loading**:
   - PDF processing engines (e.g. `pdf-lib`, `pdfjs-dist`) are only dynamically imported when a user drags in a PDF or clicks "Select PDF".
   - Image canvas manipulators load only after an image is selected.
   - Code beautifiers/formatters load syntax engines on-demand.
3. **Web Worker Offloading**: File transformations exceeding 5MB must be offloaded to Web Workers to keep the browser main thread responsive (INP < 150ms).
4. **Zero Layout Shifts**: The tool dropzone and preview panels must have predefined CSS minimum heights (`min-h-[400px] contain-layout`) so that state transitions from "empty" to "loaded" do not cause jarring page jumps.
