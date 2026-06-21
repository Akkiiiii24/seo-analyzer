import { pinnedFetch } from "../app/lib/pinned-fetch.js";

async function test() {
  console.log("Testing safe public URL...");
  try {
    const res = await pinnedFetch("https://example.com");
    console.log("✅ Public URL works, status:", res.status);
  } catch (e) {
    console.log("❌ Public URL failed:", e);
    if (e.cause) console.log("Cause was:", e.cause);
  }

  console.log("\nTesting localhost block...");
  try {
    await pinnedFetch("http://localhost:3000");
    console.log("❌ Should have been blocked");
  } catch (e) {
    console.log("✅ Localhost correctly blocked:", e.message);
  }

  console.log("\nTesting metadata IP block...");
  try {
    await pinnedFetch("http://169.254.169.254");
    console.log("❌ Should have been blocked");
  } catch (e) {
    console.log("✅ Metadata IP correctly blocked:", e.message);
  }
}

test();
