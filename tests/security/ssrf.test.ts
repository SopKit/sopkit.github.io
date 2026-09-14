import { describe, it, expect } from "bun:test";
import { safeFetch } from "../../src/server/security/ssrf";

describe("SSRF Protection Engine", () => {
  it("blocks localhost requests", async () => {
    expect(safeFetch("http://localhost:3000/api")).rejects.toThrow("Access to private or local network host is forbidden");
    expect(safeFetch("http://127.0.0.1:8080/")).rejects.toThrow("Access to private or local network host is forbidden");
  });

  it("blocks cloud metadata service endpoints (AWS/GCP)", async () => {
    expect(safeFetch("http://169.254.169.254/latest/meta-data/")).rejects.toThrow("Access to private or local network host is forbidden");
    expect(safeFetch("http://metadata.google.internal/computeMetadata/v1/")).rejects.toThrow("Access to private or local network host is forbidden");
  });

  it("blocks RFC 1918 private subnets", async () => {
    expect(safeFetch("http://10.0.0.1/admin")).rejects.toThrow("Access to private or local network host is forbidden");
    expect(safeFetch("http://192.168.1.1/router")).rejects.toThrow("Access to private or local network host is forbidden");
    expect(safeFetch("http://172.16.0.5/internal")).rejects.toThrow("Access to private or local network host is forbidden");
  });

  it("blocks non-HTTP protocols", async () => {
    expect(safeFetch("file:///etc/passwd")).rejects.toThrow("Forbidden protocol");
    expect(safeFetch("gopher://evil.com/")).rejects.toThrow("Forbidden protocol");
    expect(safeFetch("ftp://evil.com/")).rejects.toThrow("Forbidden protocol");
  });
});
