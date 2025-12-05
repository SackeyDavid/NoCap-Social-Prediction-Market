import 'dotenv/config';
import { db } from '../src/db';
import { markets, marketOptions } from '../src/db/schema';

// Ghana-focused sample markets - 10+ per category
const sampleMarkets = [
    // MUSIC (10)
    { title: "Will Sarkodie drop a new song this week? 🎵", category: "music", daysUntilClose: 3 },
    { title: "Will Shatta Wale shade Stonebwoy on Twitter within 48 hours? 🔥", category: "music", daysUntilClose: 2 },
    { title: "Will Black Sherif announce a new project this week? 🖤", category: "music", daysUntilClose: 4 },
    { title: "Will King Promise release a music video within 72 hours? 🎬", category: "music", daysUntilClose: 3 },
    { title: "Will KiDi and Kuami Eugene collab announcement trend this week? 🎶", category: "music", daysUntilClose: 4 },
    { title: "Will Gyakie hit 1M streams on a new single this week? 📈", category: "music", daysUntilClose: 5 },
    { title: "Will Medikal respond to any diss track within 48 hours? 🎤", category: "music", daysUntilClose: 2 },
    { title: "Will Wendy Shay and Sista Afia beef resurface this week? 🥊", category: "music", daysUntilClose: 4 },
    { title: "Will Camidoh feature on a new international track? 🌍", category: "music", daysUntilClose: 5 },
    { title: "Will Mr Drew drop a TikTok challenge song this week? 💃", category: "music", daysUntilClose: 3 },

    // SPORTS (10)
    { title: "Will Mohammed Kudus score in his next match? ⚽", category: "sports", daysUntilClose: 3 },
    { title: "Will Thomas Partey start for Arsenal this weekend? 🔴", category: "sports", daysUntilClose: 2 },
    { title: "Will Ghana Black Stars win their next match? 🇬🇭", category: "sports", daysUntilClose: 5 },
    { title: "Will Inaki Williams score for Athletic Bilbao? ⚡", category: "sports", daysUntilClose: 3 },
    { title: "Will Otto Addo make changes to the squad this week? 📋", category: "sports", daysUntilClose: 4 },
    { title: "Will Hearts of Oak win their next GPL match? ❤️", category: "sports", daysUntilClose: 3 },
    { title: "Will Asante Kotoko sign a new player this week? 🔴⚪", category: "sports", daysUntilClose: 5 },
    { title: "Will any GPL player trend for a wonder goal? 🎯", category: "sports", daysUntilClose: 4 },
    { title: "Will Ghana Premier League see a red card this weekend? 🟥", category: "sports", daysUntilClose: 2 },
    { title: "Will Andre Ayew transfer rumors surface this week? 🔄", category: "sports", daysUntilClose: 4 },

    // LOCAL (10)
    { title: "Will ECG announce dumsor in Accra within 48 hours? 🕯️", category: "local", daysUntilClose: 2 },
    { title: "Will fuel prices increase at Goil or Shell this week? ⛽", category: "local", daysUntilClose: 5 },
    { title: "Will tomato prices rise at Makola market? 🍅", category: "local", daysUntilClose: 4 },
    { title: "Will a viral trotro video trend on Ghana Twitter? 🚐", category: "local", daysUntilClose: 3 },
    { title: "Will traffic on Spintex Road trend for being terrible? 🚗", category: "local", daysUntilClose: 2 },
    { title: "Will water shortage hit any Accra suburb this week? 💧", category: "local", daysUntilClose: 4 },
    { title: "Will onion prices at Agbogbloshie increase? 🧅", category: "local", daysUntilClose: 3 },
    { title: "Will Uber/Bolt fares increase in Accra this week? 🚕", category: "local", daysUntilClose: 5 },
    { title: "Will any area in Kumasi experience extended dumsor? 🔌", category: "local", daysUntilClose: 3 },
    { title: "Will waakye prices increase at popular spots in Accra? 🍛", category: "local", daysUntilClose: 4 },

    // ENTERTAINMENT (10)
    { title: "Will Jackie Appiah post a new luxury lifestyle video? 💅", category: "entertainment", daysUntilClose: 3 },
    { title: "Will Nana Ama McBrown's show get celebrity drama? 📺", category: "entertainment", daysUntilClose: 4 },
    { title: "Will Yvonne Nelson respond to any beef on social media? 🍿", category: "entertainment", daysUntilClose: 2 },
    { title: "Will John Dumelo make a political statement this week? 🎭", category: "entertainment", daysUntilClose: 4 },
    { title: "Will Kwadwo Sheldon roast any celebrity this week? 😂", category: "entertainment", daysUntilClose: 3 },
    { title: "Will Delay interview a controversial guest? 🎤", category: "entertainment", daysUntilClose: 5 },
    { title: "Will Fella Makafui and Medikal relationship drama trend? 👀", category: "entertainment", daysUntilClose: 2 },
    { title: "Will any Ghanaian celebrity wedding trend this week? 💍", category: "entertainment", daysUntilClose: 5 },
    { title: "Will Zionfelix post exclusive celebrity gist? 📱", category: "entertainment", daysUntilClose: 3 },
    { title: "Will any Kumawood star trend for controversial statement? 🎬", category: "entertainment", daysUntilClose: 4 },

    // CULTURE (10)
    { title: "Will Ghana Jollof vs Nigeria Jollof debate resurface? 🍚", category: "culture", daysUntilClose: 3 },
    { title: "Will any Ghana vs Nigeria banter trend on Twitter? 🇬🇭🇳🇬", category: "culture", daysUntilClose: 2 },
    { title: "Will a viral 'tweaaa' moment trend this week? 😤", category: "culture", daysUntilClose: 3 },
    { title: "Will Ghanaian TikTokers trend for a new dance challenge? 💃", category: "culture", daysUntilClose: 4 },
    { title: "Will any Ghanaian meme format go viral this week? 😂", category: "culture", daysUntilClose: 3 },
    { title: "Will 'chale' trend in international context? 🌍", category: "culture", daysUntilClose: 5 },
    { title: "Will any Ghanaian traditional festival trend online? 🎉", category: "culture", daysUntilClose: 4 },
    { title: "Will a viral Kejetia Market video trend? 📹", category: "culture", daysUntilClose: 3 },
    { title: "Will any 'Accra lifestyle' content go viral? 🏙️", category: "culture", daysUntilClose: 4 },
    { title: "Will Ghanaian food content trend internationally? 🍲", category: "culture", daysUntilClose: 5 },

    // CRYPTO (5 - smaller category)
    { title: "Will Bitcoin hit $45k this week? ₿", category: "crypto", daysUntilClose: 4 },
    { title: "Will Ghana's cedi/crypto news make headlines? 💰", category: "crypto", daysUntilClose: 3 },
    { title: "Will any Ghana crypto influencer trend? 📊", category: "crypto", daysUntilClose: 5 },
    { title: "Will Solana outperform Ethereum this week? ⚡", category: "crypto", daysUntilClose: 4 },
    { title: "Will any African crypto exchange make news? 🌍", category: "crypto", daysUntilClose: 5 },
];

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 60) + '-' + Date.now().toString(36);
}

async function seedMarkets() {
    console.log('🌱 Seeding markets...');

    for (const m of sampleMarkets) {
        const closesAt = new Date();
        closesAt.setDate(closesAt.getDate() + m.daysUntilClose);

        const slug = generateSlug(m.title);

        try {
            // Insert market
            const [market] = await db.insert(markets).values({
                title: m.title,
                slug,
                category: m.category,
                sourceType: 'manual',
                sourceMeta: { seeded: true },
                status: 'active',
                closesAt,
                createdBy: null,
            }).returning();

            // Insert Yes/No options
            await db.insert(marketOptions).values([
                { marketId: market.id, label: 'Yes' },
                { marketId: market.id, label: 'No' },
            ]);

            console.log(`✅ Created: ${m.title.substring(0, 50)}...`);
        } catch (error: any) {
            console.error(`❌ Failed: ${m.title.substring(0, 30)}... - ${error.message}`);
        }
    }

    console.log('\n🎉 Seeding complete!');
    console.log(`Total markets: ${sampleMarkets.length}`);
    console.log('Categories:', [...new Set(sampleMarkets.map(m => m.category))].join(', '));
    process.exit(0);
}

seedMarkets().catch(console.error);
