import { describe, expect, it } from "bun:test";
import fs from "node:fs";
import ts from "typescript";
import { constructPageMetadata } from "../../src/seo/metadata";

const pages = [
  ["(company)/editorial-policy", "/editorial-policy/"],
  ["(developer)/architecture-canvas", "/architecture-canvas/"],
  ["(developer)/dev-speed", "/dev-speed/"],
  ["(money)/advertise", "/advertise/"],
  ["(money)/services", "/services/"],
  ...["exam-image-tools", "qr-tools", "student-calculators", "student-tools", "business-tools", "social-media-tools", "converter-tools", "finance-tools", "ai-writing-tools"].map((slug) => [`(seo-hubs)/${slug}`, `/${slug}/`]),
];

describe("page-specific social metadata", () => {
  for (const [directory, pathname] of pages) {
    it(`${pathname} has its own canonical, social copy and image`, () => {
      const filename = `src/app/${directory}/page.tsx`;
      const source = fs.readFileSync(filename, "utf8");
      const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const statement = ast.statements.find((node) =>
        ts.isVariableStatement(node) && node.declarationList.declarations.some((d) => d.name.getText(ast) === "metadata"),
      ) as ts.VariableStatement;
      const declaration = statement.declarationList.declarations.find((d) => d.name.getText(ast) === "metadata")!;
      const call = declaration.initializer as ts.CallExpression;
      expect(ts.isCallExpression(call)).toBe(true);
      expect(call.expression.getText(ast)).toBe("constructPageMetadata");
      const input = Object.fromEntries((call.arguments[0] as ts.ObjectLiteralExpression).properties.map((property) => {
        const entry = property as ts.PropertyAssignment;
        expect(ts.isStringLiteral(entry.initializer)).toBe(true);
        return [entry.name.getText(ast), (entry.initializer as ts.StringLiteral).text];
      }));
      const metadata = constructPageMetadata(input as Parameters<typeof constructPageMetadata>[0]);
      expect(metadata.alternates?.canonical).toBe(`https://sopkit.space${pathname}`);
      expect(metadata.openGraph?.url).toBe(metadata.alternates?.canonical);
      expect(metadata.openGraph?.title).toBe(metadata.title);
      expect(metadata.openGraph?.description).toBe(metadata.description);
      expect(String(metadata.title)).toContain(input.title);
      expect(metadata.description).toContain(input.description);
      const images = metadata.openGraph?.images as { url: string; width: number; height: number }[];
      expect(images[0].url).toBe("https://sopkit.space/og-image.png");
      expect(fs.existsSync(`public${new URL(images[0].url).pathname}`)).toBe(true);
      expect(images[0].width).toBe(1200);
      expect(images[0].height).toBe(630);
      expect(metadata.twitter?.title).toBe(metadata.title);
      expect(metadata.twitter?.description).toBe(metadata.description);
      expect(metadata.twitter?.images).toEqual([images[0].url]);
    });
  }

  it("keeps intent-page indexing decisions and normalizes URLs", () => {
    const source = fs.readFileSync("src/app/(intent)/[slug]/page.tsx", "utf8");
    expect(source.match(/return constructPageMetadata\(/g)).toHaveLength(2);
    expect(source.match(/noindex: !getMonetizationDecision\(\{ slug \}\).indexable/g)).toHaveLength(2);
    for (const noindex of [true, false]) {
      const metadata = constructPageMetadata({
        title: "Compress Image to 20KB | SopKit",
        description: "Compress an image to a 20KB target for online forms using adjustable quality, dimensions, and a local browser preview.",
        pathname: "/compress-image-to-20kb",
        noindex,
      });
      expect(metadata.alternates?.canonical).toBe("https://sopkit.space/compress-image-to-20kb/");
      expect(metadata.openGraph?.url).toBe(metadata.alternates?.canonical);
      expect(metadata.robots).toMatchObject({ index: !noindex, follow: true });
    }
  });
});
