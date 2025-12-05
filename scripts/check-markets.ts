import 'dotenv/config';
import { db } from '../src/db';
import { markets } from '../src/db/schema';
import { count, eq } from 'drizzle-orm';

async function checkMarkets() {
    try {
        const allMarkets = await db.select().from(markets);
        console.log(`Total markets: ${allMarkets.length}`);

        const openMarkets = allMarkets.filter(m => m.status === 'open');
        console.log(`Open markets: ${openMarkets.length}`);

        const closedMarkets = allMarkets.filter(m => m.status === 'closed');
        console.log(`Closed markets: ${closedMarkets.length}`);

        if (allMarkets.length > 0) {
            console.log('Sample market:', allMarkets[0]);
        }

    } catch (error) {
        console.error('Error checking markets:', error);
    }
    process.exit(0);
}

checkMarkets();
