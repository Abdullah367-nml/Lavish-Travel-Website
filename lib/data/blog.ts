import type { BlogPost } from "@/lib/types";

/**
 * DEMO DATA — replaced by MDX files or a Supabase `blog_posts` query.
 * Seasonal topics deliberately match the SEO plan in Section 6: Kruger dry
 * season, Cape summer, and the Hermanus whale run.
 */
export const blogPosts: BlogPost[] = [
  {
    id: "b1000000-0000-4000-8000-000000000001",
    slug: "when-to-visit-kruger",
    title: "When to visit Kruger, and why winter wins",
    excerpt:
      "Everyone assumes summer is safari season. In Kruger it is the opposite, and the difference in what you actually see is not marginal.",
    body: [
      "The single most useful thing to understand about Kruger is that its best season runs opposite to Cape Town's. Cape Town peaks from November to March. Kruger peaks from May to September, in the dry winter, and the gap between a good month and a bad one is larger than most visitors expect.",
      "The mechanism is simple. In the dry season the grass is grazed short and the deciduous trees drop their leaves, so sightlines open up from a few metres to a hundred. At the same time, seasonal water dries up and animals are forced to concentrate around the remaining rivers and waterholes. You are looking through thinner bush at a denser concentration of animals.",
      "Summer inverts all of it. The bush is green and genuinely beautiful, impala are dropping lambs, and migrant birds arrive in numbers that matter if you are a birder. But the grass is waist high, water is everywhere so animals disperse, and afternoon thunderstorms can cut a drive short. Mosquito activity, and therefore malaria risk, is also at its highest.",
      "If your dates are fixed and they fall in summer, come anyway — but adjust expectations towards birds and landscape rather than a Big Five checklist, and consider a private concession where off-road driving lets a guide work a sighting properly.",
      "One practical note on temperature: winter dawn drives in an open vehicle are cold in a way that surprises people who have packed for Africa. Two degrees at 06:00, moving at forty kilometres an hour, is a serious wind chill. Bring a proper jacket, a hat and gloves.",
    ],
    coverImage: "/images/blog/kruger-winter.jpg",
    author: "Lavish Travels & Tours",
    category: "Safari",
    publishedAt: "2026-04-14",
    readingMinutes: 5,
    seoTitle: "When to Visit Kruger National Park — Best Season for Game Viewing",
    seoDescription:
      "Why the dry winter from May to September is the best time for a Kruger safari, how summer compares, and what to pack for a cold dawn game drive.",
  },
  {
    id: "b1000000-0000-4000-8000-000000000002",
    slug: "how-long-garden-route",
    title: "How long does the Garden Route actually take?",
    excerpt:
      "Three days is the answer most itineraries give. Here is what you give up, and what the drive looks like when you allow a week.",
    body: [
      "You can drive from Cape Town to Port Elizabeth in a long day. You can see the headline stops of the Garden Route in three. Almost nobody who does it that way enjoys it, because the compression forces you onto the N2, and the N2 is a motorway with trees.",
      "The route's character is in the passes and the detours: the Outeniqua and Robinson passes over the mountains, the old road down to Nature's Valley, Route 62 through the Little Karoo, the lakes at Wilderness. Every one of those is a deliberate turn off the fast road.",
      "A five-day itinerary gets you the coast properly. Seven adds two things that materially change the trip: a night in Oudtshoorn and the Little Karoo, which is a completely different landscape from the coast, and two nights at the eastern end for Addo Elephant National Park.",
      "Addo is worth planning around if you are travelling with children. It holds over 600 elephant plus the rest of the Big Five, and it is malaria-free — which removes the prophylaxis conversation entirely and is the main reason we route families here rather than to the lowveld.",
      "The other argument for a longer trip is the whale coast. From June to November, southern right whales calve in Walker Bay at Hermanus, and the cliff path there gives you land-based whale watching as good as anywhere on earth. It costs you one night at the start of the route.",
    ],
    coverImage: "/images/blog/garden-route-passes.jpg",
    author: "Lavish Travels & Tours",
    category: "Road Trips",
    publishedAt: "2026-05-27",
    readingMinutes: 6,
    seoTitle: "How Many Days for the Garden Route? A Realistic Itinerary",
    seoDescription:
      "How long the Garden Route really takes, what a three-day trip misses, and why seven days lets you drive the passes and add Addo Elephant Park.",
  },
  {
    id: "b1000000-0000-4000-8000-000000000003",
    slug: "cape-town-first-time",
    title: "Cape Town for the first time: what to book, what to leave loose",
    excerpt:
      "The weather decides your itinerary here, not your calendar. Book two things firmly and keep the rest flexible.",
    body: [
      "Cape Town punishes rigid planning. The south-easter, known locally as the Cape Doctor, can shut the Table Mountain cable car for an entire day at almost no notice, and it blows hardest in exactly the summer months when most visitors arrive.",
      "So the rule is: book restaurants firmly and views loosely. The Franschhoek valley kitchens and the best Cape Town tables need reserving weeks ahead. Table Mountain needs a clear morning, and you cannot know which morning that is until the night before.",
      "In practice that means holding Table Mountain as a floating item across your first three or four days, and going up the first genuinely still morning you get. Go early: the queue at opening is a fraction of the midday queue, and the cloud that forms the tablecloth tends to build later.",
      "Second, do the Cape Peninsula anti-clockwise. Coach tours run clockwise and reach Boulders Beach between eleven and one, so the boardwalks are shoulder-to-shoulder. Going the other way puts you at the penguins in the late afternoon with better light and a fraction of the crowd.",
      "Third, allow more days than the guidebook suggests. Cape Point, the Winelands, Hermanus and the city itself are each a full day, and they are all within ninety minutes of the Waterfront. Four days is tight. Six is comfortable.",
      "One safety note, since people always ask: normal urban caution applies, as it would in any large city. Do not walk the city centre late at night, do not leave anything visible in a parked car, and use a driver rather than street parking at night. Beyond that, the areas visitors spend time in are well policed.",
    ],
    coverImage: "/images/blog/cape-town-first-time.jpg",
    author: "Lavish Travels & Tours",
    category: "City Guides",
    publishedAt: "2026-06-19",
    readingMinutes: 7,
    seoTitle: "Cape Town for First-Time Visitors — What to Book Ahead",
    seoDescription:
      "A practical first-timer's guide to Cape Town: when to go up Table Mountain, why to drive the Peninsula anti-clockwise, and how many days you really need.",
  },
  {
    id: "b1000000-0000-4000-8000-000000000004",
    slug: "hermanus-whale-season",
    title: "Hermanus whale season: what you see, month by month",
    excerpt:
      "Southern right whales calve in Walker Bay from June to November. You do not need a boat, and the timing within the season matters.",
    body: [
      "Hermanus has a claim few places can make: land-based whale watching that beats most boat trips. Southern right whales come into Walker Bay to calve, and the bay is deep enough close in that they sit metres from a cliff path with a paved walkway along it.",
      "The season runs roughly June to November, but it is not uniform. June and July are the arrivals — numbers are building and sightings are good but not guaranteed on any given day. August through October is the peak, when cows and calves are resting in the bay and you can reasonably expect to see whales from the cliff path on most days.",
      "September and October are also when the behaviour is at its most spectacular: breaching, lobtailing and sailing, where a whale holds its tail out of the water and lets the wind push it along. November is the tail of the season as animals head back to the Southern Ocean.",
      "Bring binoculars. The whales are often close enough not to need them, but they turn a distant blow into an actual animal, and Walker Bay is large.",
      "Hermanus sits about ninety minutes from Cape Town along the R44 coastal road, which is one of the better drives in the country in its own right. It works as a long day trip, or as the first night of a Garden Route itinerary heading east.",
    ],
    coverImage: "/images/blog/hermanus-whales.jpg",
    author: "Lavish Travels & Tours",
    category: "Wildlife",
    publishedAt: "2026-07-30",
    readingMinutes: 4,
    seoTitle: "Hermanus Whale Season Month by Month",
    seoDescription:
      "When to see southern right whales at Hermanus — the June to November season broken down month by month, and why you do not need a boat.",
  },
];
