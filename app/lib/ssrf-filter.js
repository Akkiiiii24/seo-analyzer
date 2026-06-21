import dns from "dns";
import { promisify } from "util";

const lookupPromise = promisify(dns.lookup);

/**
 * Validates a URL to prevent Server-Side Request Forgery (SSRF).
 * Ensures the target resolves to a public, non-reserved IPv4 address.
 */
export async function isSafeUrl(urlString) {
  try {
    const url = new URL(urlString);

    // 1. Only allow HTTP and HTTPS protocols
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      console.log(`[SSRF Block] Invalid protocol: ${url.protocol}`);
      return false;
    }

    // 2. Resolve the hostname to an IP address
    const { address } = await lookupPromise(url.hostname);

    // 3. Simple IPv4 range checks
    const parts = address.split(".").map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) {
      // IPv6 or malformed address - block for safety in this standard setup
      console.log(`[SSRF Block] Blocked non-IPv4 or malformed address: ${address}`);
      return false;
    }

    const [first, second] = parts;

    // Loopback: 127.0.0.0/8
    if (first === 127) {
      console.log(`[SSRF Block] Blocked loopback address: ${address}`);
      return false;
    }

    // Private Class A: 10.0.0.0/8
    if (first === 10) {
      console.log(`[SSRF Block] Blocked Class A private subnet address: ${address}`);
      return false;
    }

    // Private Class B: 172.16.0.0/12
    if (first === 172 && second >= 16 && second <= 31) {
      console.log(`[SSRF Block] Blocked Class B private subnet address: ${address}`);
      return false;
    }

    // Private Class C: 192.168.0.0/16
    if (first === 192 && second === 168) {
      console.log(`[SSRF Block] Blocked Class C private subnet address: ${address}`);
      return false;
    }

    // Link-Local (AWS/GCP/Azure Metadata endpoints): 169.254.0.0/16
    if (first === 169 && second === 254) {
      console.log(`[SSRF Block] Blocked cloud metadata link-local address: ${address}`);
      return false;
    }

    // Local Multicast / Broadcast / Reserved blocks: 0.0.0.0/8, 224.0.0.0+
    if (first === 0 || first >= 224) {
      console.log(`[SSRF Block] Blocked reserved / multicast address: ${address}`);
      return false;
    }

    return true; // IPv4 lies in safe public ranges
  } catch (error) {
    console.error(`[SSRF Filter] Error validating URL ${urlString}:`, error.message);
    return false;
  }
}
