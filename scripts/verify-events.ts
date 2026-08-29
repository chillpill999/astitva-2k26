// ============================================================================
// ASTITVA 2K26 - Events Verification
// ============================================================================

import { getFestCategories, getFestEvents } from "../lib/data/fest-data";

async function verify() {
  console.log("Checking festival categories and events...");
  const categories = await getFestCategories();
  console.log(`Found ${categories.length} categories:`);
  categories.forEach((c) => console.log(` - ${c.name} (${c.slug}) -> ${c.eventCount} events`));

  const events = await getFestEvents();
  console.log(`Found ${events.length} total events:`);
  events.forEach((e) =>
    console.log(` - [${e.category?.name || e.categoryId}] ${e.title} (${e.eventType}) | Venue: ${e.venue}`)
  );
}

verify().catch((e) => {
  console.error(e);
  process.exit(1);
});
