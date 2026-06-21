// safe-fetch.js now delegates to pinnedFetch
// which handles both SSRF validation AND DNS pinning
export { pinnedFetch as safeFetch } from "./pinned-fetch.js";
