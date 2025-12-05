import 'dotenv/config';
import { db } from '../src/db';
import { wallets } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function debugWallet() {
    const userId = '8dccba02-40fb-4dc0-b9ac-1663b82251e6'; // From error message
    console.log(`Attempting to fetch wallet for user: ${userId}`);

    try {
        const wallet = await db.query.wallets.findFirst({
            where: eq(wallets.userId, userId),
        });
        console.log('Wallet found:', wallet);
    } catch (error) {
        console.error('Error fetching wallet:', error);
    }
    process.exit(0);
}

debugWallet();
