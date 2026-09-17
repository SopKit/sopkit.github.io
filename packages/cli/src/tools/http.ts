/**
 * @file packages/cli/src/tools/http.ts
 * @description HTTP status code reference and lookup utility.
 */

export interface HttpStatus {
  code: number;
  phrase: string;
  category: "1xx Informational" | "2xx Success" | "3xx Redirection" | "4xx Client Error" | "5xx Server Error";
  description: string;
}

const HTTP_CODES: Record<number, { phrase: string; description: string }> = {
  100: { phrase: "Continue", description: "Server received request headers, client should proceed to send the body." },
  101: { phrase: "Switching Protocols", description: "Requester has asked server to switch protocols (e.g. WebSocket)." },
  200: { phrase: "OK", description: "Standard successful HTTP response." },
  201: { phrase: "Created", description: "Request fulfilled and new resource created." },
  202: { phrase: "Accepted", description: "Request accepted for processing, but processing is incomplete." },
  204: { phrase: "No Content", description: "Request processed successfully, but returns no content." },
  206: { phrase: "Partial Content", description: "Delivering part of the resource due to a Range header." },
  301: { phrase: "Moved Permanently", description: "Permanent redirect. All future requests should use the new URI." },
  302: { phrase: "Found", description: "Temporary redirect to a different URI." },
  304: { phrase: "Not Modified", description: "Resource has not been modified since the version specified in request." },
  307: { phrase: "Temporary Redirect", description: "Temporary redirect preserving original HTTP method." },
  308: { phrase: "Permanent Redirect", description: "Permanent redirect preserving original HTTP method." },
  400: { phrase: "Bad Request", description: "Server cannot process request due to client error (malformed syntax)." },
  401: { phrase: "Unauthorized", description: "Authentication required and either missing or failed." },
  403: { phrase: "Forbidden", description: "Authenticated client does not have access permissions." },
  404: { phrase: "Not Found", description: "Requested resource could not be found on the server." },
  405: { phrase: "Method Not Allowed", description: "Request method (POST, GET, etc.) not supported for resource." },
  408: { phrase: "Request Timeout", description: "Server timed out waiting for the request from the client." },
  409: { phrase: "Conflict", description: "Request could not be processed because of conflict in request state." },
  413: { phrase: "Payload Too Large", description: "Request entity is larger than limits defined by server." },
  415: { phrase: "Unsupported Media Type", description: "Payload format is in an unsupported format." },
  422: { phrase: "Unprocessable Entity", description: "Syntax is correct but semantic instructions are unprocessable." },
  429: { phrase: "Too Many Requests", description: "User has sent too many requests in a given amount of time (rate limited)." },
  500: { phrase: "Internal Server Error", description: "Generic error message when server encounters an unexpected condition." },
  501: { phrase: "Not Implemented", description: "Server either does not recognize request method or lacks ability to fulfill." },
  502: { phrase: "Bad Gateway", description: "Server acting as gateway/proxy received invalid response from upstream." },
  503: { phrase: "Service Unavailable", description: "Server is currently unavailable (overloaded or down for maintenance)." },
  504: { phrase: "Gateway Timeout", description: "Gateway/proxy server did not receive timely response from upstream." },
};

export function lookupStatus(code: number | string): HttpStatus | null {
  const num = typeof code === "string" ? parseInt(code.trim(), 10) : code;
  const item = HTTP_CODES[num];
  if (!item) return null;

  let category: HttpStatus["category"] = "2xx Success";
  if (num < 200) category = "1xx Informational";
  else if (num < 300) category = "2xx Success";
  else if (num < 400) category = "3xx Redirection";
  else if (num < 500) category = "4xx Client Error";
  else category = "5xx Server Error";

  return {
    code: num,
    phrase: item.phrase,
    category,
    description: item.description,
  };
}

export function searchStatus(query: string): HttpStatus[] {
  const q = query.toLowerCase().trim();
  const results: HttpStatus[] = [];
  for (const [codeStr, info] of Object.entries(HTTP_CODES)) {
    const code = Number(codeStr);
    if (
      codeStr.includes(q) ||
      info.phrase.toLowerCase().includes(q) ||
      info.description.toLowerCase().includes(q)
    ) {
      const res = lookupStatus(code);
      if (res) results.push(res);
    }
  }
  return results;
}
