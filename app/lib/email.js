/**
 * Mock Email Dispatcher
 *
 * Simulates sending transactional emails. Logs details to console for debugging.
 */

export async function sendWelcomeEmail(email, name) {
  console.log("\n==================================================");
  console.log("📨 SIMULATED TRANSACTIONAL EMAIL SENT");
  console.log(`To: ${name} <${email}>`);
  console.log("Subject: Welcome to SEO Analyzer! ⚡");
  console.log("--------------------------------------------------");
  console.log(`Hi ${name},\n`);
  console.log("Welcome to SEO Analyzer SaaS! We're thrilled to have you.");
  console.log("With your free account, you can:");
  console.log("- Run up to 3 comprehensive website audits every day.");
  console.log("- Save reports to track history.");
  console.log("- View detailed checks and checklist recommendations.\n");
  console.log("Ready to remove limits? Upgrade to Pro anytime for $9/month.");
  console.log("\nBest regards,");
  console.log("The SEO Analyzer Team ⚡");
  console.log("==================================================\n");

  return { success: true };
}
