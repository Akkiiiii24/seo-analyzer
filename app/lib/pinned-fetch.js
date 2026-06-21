import { fetch, Agent } from "undici";
import dns from "dns";
import { promisify } from "util";
import net from "net";

const lookupPromise = promisify(dns.lookup);

// Private/internal IP ranges that should never be contacted
function isPrivateIp(ip) {
  const privateRanges = [
    /^127\./,                          // Loopback
    /^10\./,                           // Private class A
    /^172\.(1[6-9]|2\d|3[01])\./,     // Private class B
    /^192\.168\./,                     // Private class C
    /^169\.254\./,                     // Link-local (AWS metadata)
    /^::1$/,                           // IPv6 loopback
    /^fc00:/,                          // IPv6 unique local
    /^fe80:/,                          // IPv6 link-local
    /^0\./,                            // This network
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // Shared address space
  ];
  return privateRanges.some((range) => range.test(ip));
}

// Resolve hostname to IP and validate it is safe
async function resolveAndValidate(hostname) {
  // Skip validation for raw IPs
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new Error(`Blocked: direct IP request to private range: ${hostname}`);
    }
    return hostname;
  }

  let resolvedIp;
  try {
    const res = await lookupPromise(hostname, { family: 4 });
    
    // Check if it's an object or a string
    const address = typeof res === 'object' ? res.address : res;
    if (!address) {
      throw new Error(`DNS resolution returned no address for: ${hostname}`);
    }
    resolvedIp = address;
  } catch (error) {
    throw new Error(`DNS resolution failed for ${hostname}: ${error.message}`);
  }

  if (isPrivateIp(resolvedIp)) {
    throw new Error(
      `Blocked: ${hostname} resolved to private IP ${resolvedIp}`
    );
  }

  return resolvedIp;
}

// Custom dispatcher that connects to a specific IP
// instead of re-resolving the hostname
function createPinnedDispatcher(resolvedIp) {
  return new Agent({
    connect: {
      lookup: (_hostname, _options, callback) => {
        if (_options.all) {
          callback(null, [{ address: resolvedIp, family: 4 }]);
        } else {
          callback(null, resolvedIp, 4);
        }
      },
    },
  });
}

const MAX_REDIRECTS = 3;
const REQUEST_TIMEOUT_MS = 10000;

// Main pinned fetch function - use this instead of safeFetch
export async function pinnedFetch(url, options = {}, redirectCount = 0) {
  if (redirectCount > MAX_REDIRECTS) {
    throw new Error(`Too many redirects (max ${MAX_REDIRECTS})`);
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  // Only allow HTTP and HTTPS
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`Blocked: disallowed protocol ${parsed.protocol}`);
  }

  const hostname = parsed.hostname;

  // Single DNS resolution with validation
  // This IP is used for the actual connection, DNS cannot be swapped after this
  const resolvedIp = await resolveAndValidate(hostname);

  // Create dispatcher that connects to the resolved IP directly
  const dispatcher = createPinnedDispatcher(resolvedIp);

  let response;
  try {
    response = await fetch(url, {
      ...options,
      redirect: "manual",           // Never auto-follow redirects
      dispatcher,                   // Use our pinned IP dispatcher
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        ...options.headers,
        "User-Agent": "SEO-Analyzer-Bot/1.0",
        Host: hostname,             // Send original hostname in Host header
      },
    });
  } catch (error) {
    throw error;
  }

  // Handle redirects manually with full validation on destination
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");

    if (!location) {
      throw new Error("Redirect response missing Location header");
    }

    // Resolve relative redirect URLs against the original URL
    const redirectUrl = new URL(location, url).toString();

    // Recurse - the next call will validate the redirect destination
    return pinnedFetch(redirectUrl, options, redirectCount + 1);
  }

  return response;
}
