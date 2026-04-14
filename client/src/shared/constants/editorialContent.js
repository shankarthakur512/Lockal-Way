import Img1 from "../../assets/places/tajmahal.jpg";
import Img2 from "../../assets/places/water.jpg";
import Img3 from "../../assets/places/boat.jpg";

export const BLOGS_DATA = [
  {
    id: 1,
    image: Img1,
    title: "How to experience India beyond the postcard spots",
    description:
      "A warmer, slower way to travel through iconic cities with better local context, softer itineraries, and memorable stays.",
    author: "Aarav Menon",
    date: "April 22, 2026",
    category: "Destination Notes",
    body: [
      "The best trips rarely come from collecting landmarks as fast as possible. They come from slowing down enough to notice neighborhoods, routines, and local rhythms that never fit neatly into a postcard.",
      "A stronger India itinerary often means fewer check-ins, more time with a knowledgeable local guide, and a better balance between iconic stops and quieter experiences that actually stay with you.",
      "That is where thoughtful planning matters. The right local context can turn a famous destination from something crowded and expected into something textured, human, and memorable.",
    ],
  },
  {
    id: 2,
    image: Img2,
    title: "What makes a guide-led island trip feel truly effortless",
    description:
      "From transfers and timing to the best local food stops, here is how great planning turns a beach holiday into something richer.",
    author: "Mila Ross",
    date: "May 03, 2026",
    category: "Planning Ideas",
    body: [
      "Island travel feels luxurious when the awkward parts disappear. Reliable transfers, local timing, and a guide who knows what to skip often matter more than adding more activities to the itinerary.",
      "The most effortless trips build in breathing room. That means knowing when to leave space for weather, when to book the boat early, and where to eat without sending travelers into tourist-trap guesswork.",
      "A well-guided island stay feels calm because the decisions are already clearer. Travelers can focus on the setting instead of managing logistics all day.",
    ],
  },
  {
    id: 3,
    image: Img3,
    title: "Planning a slower luxury trip without overpacking the itinerary",
    description:
      "A practical framework for balancing signature experiences, good hotels, and actual breathing room in your travel calendar.",
    author: "Ritika Shah",
    date: "May 18, 2026",
    category: "Luxury Travel",
    body: [
      "Luxury is not just about better hotels. It is also about pace, comfort, and enough room in the day for a trip to feel graceful rather than exhausting.",
      "A slower trip often works better when each day has one anchor experience instead of three competing highlights. That keeps energy higher and gives the destination a chance to feel lived in rather than consumed.",
      "The strongest premium itineraries trade volume for quality. Fewer rushed moves, stronger local curation, and more intentional downtime usually create a much better traveler memory.",
    ],
  },
];

export const ABOUT_CONTENT = {
  eyebrow: "Careers at Lockal Way",
  title: "Help build a travel platform where local insight leads every journey.",
  body:
    "We are creating a calmer, more trustworthy way for travelers to discover destinations and for guides to grow meaningful businesses. If you care about product craft, local communities, and thoughtful travel experiences, there is room to shape what comes next here.",
  storyTitle: "Our history",
  storyBody:
    "Lockal Way started as a simple idea in 2023: travel feels better when the people who know a place best are part of the experience from the beginning. Since then, the product has grown from an early guide directory into a broader platform for discovery, trip planning, and guide-led packages.",
  historyTimeline: [
    {
      year: "2023",
      title: "The idea takes shape",
      description:
        "The first concept focused on helping travelers find trustworthy local guides without jumping between scattered apps and social profiles.",
    },
    {
      year: "2024",
      title: "Guide onboarding launched",
      description:
        "We introduced onboarding, profile completion, and verification steps so guide identities could feel more credible and professional.",
    },
    {
      year: "2025",
      title: "Trips and packages expanded",
      description:
        "The platform evolved beyond profiles into curated trips, package publishing, and stronger traveler support flows.",
    },
    {
      year: "2026",
      title: "Hiring for the next chapter",
      description:
        "Now we are growing the team with product, design, operations, and partnerships roles to make the experience richer from end to end.",
    },
  ],
  founderTitle: "Why people join",
  founderName: "Lockal Way team",
  founderBody:
    "People join Lockal Way to work on real travel problems with visible product impact. The team cares about clarity, trust, and building tools that respect both travelers and local experts. We value curiosity, ownership, and the ability to turn rough ideas into polished experiences.",
  impactTitle: "What makes the work meaningful",
  impactCards: [
    {
      value: "Product ownership",
      label: "Work close to decisions and help shape features from concept to launch.",
    },
    {
      value: "Real-world impact",
      label: "Your work directly affects how travelers discover guides and book trips.",
    },
    {
      value: "Travel-minded team",
      label: "Collaborate with people who care deeply about hospitality and local culture.",
    },
  ],
  careerPathsTitle: "Career paths",
  careerPathsBody:
    "A few sample paths below show the kind of roles we are building around product growth. These are dummy examples for now, but they reflect the type of team structure the platform can support.",
  careerPaths: [
    {
      title: "Product & UX",
      description:
        "Own traveler journeys, guide onboarding flows, experiments, and polished interfaces that reduce friction.",
    },
    {
      title: "Engineering",
      description:
        "Build scalable booking, dashboard, profile, and search experiences across frontend and backend systems.",
    },
    {
      title: "Guide Success",
      description:
        "Partner with local guides, improve onboarding quality, and help hosts launch stronger offers on the platform.",
    },
    {
      title: "Growth & Partnerships",
      description:
        "Create destination partnerships, shape launch campaigns, and connect demand with the right local supply.",
    },
  ],
  openingsTitle: "Current openings",
  openingsBody:
    "These sample roles are included as placeholder job data for the new Career section.",
  openings: [
    {
      title: "Frontend Developer",
      meta: "Product Engineering • Remote / India • Full-time",
      description:
        "Build responsive booking, dashboard, and discovery experiences with a strong eye for UI polish and interaction quality.",
    },
    {
      title: "Travel Operations Associate",
      meta: "Operations • Hybrid • Full-time",
      description:
        "Coordinate guide onboarding, traveler support, and quality checks so every itinerary feels reliable and ready to launch.",
    },
    {
      title: "Partnerships Manager",
      meta: "Growth • Remote / India • Full-time",
      description:
        "Develop relationships with local experts, boutique stays, and destination partners to expand high-quality supply.",
    },
    {
      title: "Content & Community Intern",
      meta: "Brand • Remote • Internship",
      description:
        "Support destination storytelling, guide spotlights, and editorial campaigns that bring the product voice to life.",
    },
  ],
  contactTitle: "Apply or start a conversation",
  contactBody:
    "If one of these roles feels close to your strengths, share a short note and we can begin the conversation. The form below is placeholder content for now, but the section is ready for a real hiring workflow later.",
  locationsTitle: "Where we collaborate",
  locationsBody:
    "Today the team can collaborate remotely, with room to support hybrid destination hubs later. This placeholder map can evolve into office, guide, or regional operations locations as the company grows.",
};

export const slugifyBlogTitle = (title = "") =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
