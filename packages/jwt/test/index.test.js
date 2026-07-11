import test from "node:test";
import assert from "node:assert";
import { decode, verifyFormat } from "../dist/index.js";

const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

test("JWT Utilities - verifyFormat", () => {
  assert.strictEqual(verifyFormat(SAMPLE_JWT), true);
  assert.strictEqual(verifyFormat("invalid.format"), false);
  assert.strictEqual(verifyFormat(""), false);
});

test("JWT Utilities - decode token", () => {
  const result = decode(SAMPLE_JWT);
  
  assert.deepStrictEqual(result.header, { alg: "HS256", typ: "JWT" });
  assert.strictEqual(result.payload.sub, "1234567890");
  assert.strictEqual(result.payload.name, "John Doe");
  assert.strictEqual(result.signature, "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");

  assert.throws(() => {
    decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ");
  });
});
