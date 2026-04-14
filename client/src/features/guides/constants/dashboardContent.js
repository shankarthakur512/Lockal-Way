import { NAV_STRINGS } from "../../../shared/constants/strings";

export const GUIDE_DASHBOARD_COPY = {
  eyebrow: "Guide Studio",
  heroTitle: "Build a trusted guide profile and start hosting richer journeys.",
  heroBody:
    "Complete your verification, publish packages, and manage your traveler experience from one shared dashboard.",
  checklistHeading: "Onboarding checklist",
  checklistBody: "Finish these steps once to unlock trip hosting.",
  overviewHeading: "Guide overview",
  overviewBody: "A quick snapshot of your current guide business.",
  analyticsHeading: "Income overview",
  analyticsBody: "Performance metrics become more useful as bookings and chats start coming in.",
  activityHeading: "Traveler calls",
  activityBody: "Calls and bookings will appear here once your guide profile is live.",
  upcomingCalls: "Upcoming call bookings",
  pastCalls: "Past call bookings",
  callsEmpty: "No call bookings yet.",
  callsLocked: "Complete your onboarding before you can accept bookings.",
  reviewsHeading: "Traveler reviews",
  reviewsEmpty: "Reviews will appear after your first completed trip.",
  createTripPrompt: "Create a package to start receiving bookings from travelers.",
  completionReady: "Guide account ready",
  completionPending: "Setup in progress",
  statCards: [
    { label: "Packages published", value: "0", tone: "forest" },
    { label: "Traveler conversations", value: "0", tone: "sage" },
    { label: "Estimated earnings", value: "$0", tone: "gold" },
  ],
};

export const GUIDE_ONBOARDING_STEPS = [
  {
    key: "verification",
    title: "Verify your account",
    pendingDescription: "Confirm your mobile number, email, and government ID.",
    completeDescription: "Your identity details are verified.",
  },
  {
    key: "profile",
    title: "Complete your profile",
    pendingDescription: "Add your photo, languages, and local expertise.",
    completeDescription: "Your guide profile details are ready.",
  },
  {
    key: "address",
    title: "Verify your address",
    pendingDescription: "Share your city, country, and local street details.",
    completeDescription: "Your address is verified and saved.",
  },
];

export const GUIDE_TRIP_DASHBOARD_COPY = {
  emptyHeading: "Start hosting memorable trips",
  emptyBody:
    "Create your first package once your guide setup is complete and start turning local knowledge into bookings.",
  createFirstTrip: "Create your first trip",
  createNewTrip: NAV_STRINGS.createPackage,
  fetchTripsError: "Unable to load your trips right now.",
  disabledTripCreation: "Complete your guide setup before creating a trip.",
  manageTripsHeading: "Hosted trips",
  tripDetailsFallback: "Trip details will appear here once you publish a package.",
  hotelFallback: "Hotel details not added",
  durationSuffix: "days",
  statusButton: "Pause bookings",
  cancelButton: "Cancel trip",
  actionsUnavailable: "Trip management actions are not available yet.",
};

export const GUIDE_LANDING_CONTENT = {
  eyebrow: "Guide Partner Program",
  heroTitle: "Share your city with travelers who want more than a checklist.",
  heroBody:
    "Create a polished local-guide profile, publish your own experiences, and manage bookings from a dashboard built for trust.",
  heroCtaGuest: "Sign in to start",
  heroCtaGuide: "Open dashboard",
  heroCtaMember: "Become a Guide",
  stepsHeading: "Become a guide in four clear steps",
  stepsBody: "The onboarding flow is simple, and each step is already supported in the app.",
  proofHeading: "What guide partners value most",
  proofBody: "A strong guide experience needs trust, visibility, and simple operations.",
  testimonialsHeading: "Guide stories",
};

export const GUIDE_LANDING_STEPS = [
  {
    title: "Create your account",
    description: "Sign in once and unlock your guide workspace from the main navigation.",
  },
  {
    title: "Verify your details",
    description: "Confirm your contact information and submit basic identity checks.",
  },
  {
    title: "Complete your profile",
    description: "Add your photo, languages, and local context so travelers can trust you.",
  },
  {
    title: "Publish your packages",
    description: "Launch curated trips, review bookings, and manage your guide presence.",
  },
];

export const GUIDE_LANDING_BENEFITS = [
  {
    title: "Premium guide presence",
    description: "Show up with a refined profile and clearer traveler-facing experience.",
  },
  {
    title: "Simple trip operations",
    description: "Create packages, review activity, and manage your next hosting steps in one place.",
  },
  {
    title: "Traveler trust",
    description: "Verification, profile completion, and clear trip details help bookings feel safer.",
  },
];

export const GUIDE_LANDING_TESTIMONIALS = [
  {
    name: "Aarav Mehta",
    role: "Heritage walk host",
    quote: "A polished guide profile helps travelers trust the experience before the first message.",
  },
  {
    name: "Sana Ali",
    role: "Food trail curator",
    quote: "The biggest win is having a clear flow from onboarding to package publishing.",
  },
  {
    name: "Ritika Sen",
    role: "Weekend trek planner",
    quote: "It feels much easier to manage my guide identity when everything lives in one dashboard.",
  },
];

export const GUIDE_LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Punjabi",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Japanese",
  "Korean",
  "Italian",
];

export const GUIDE_VERIFICATION_COPY = {
  eyebrow: "Identity check",
  title: "Verify the details travelers trust first.",
  body:
    "Confirm your contact information and ID details so your guide profile can move into review.",
  sendOtp: "Send OTP",
  verifyOtp: "Verify details",
  otpLabel: "Enter OTP",
  mobileLabel: "Mobile Number",
  emailLabel: "Email Address",
  governmentIdLabel: "Government ID",
  otpHint: "We’ll send a one-time code to your email.",
};

export const GUIDE_CAPTURE_COPY = {
  eyebrow: "Profile photo",
  title: "Capture a clean photo for verification.",
  body:
    "Your photo helps the platform verify your guide profile and gives travelers a more trustworthy first impression.",
  back: "Back",
  capture: "Take photo",
  previewTitle: "Photo captured",
  previewBody: "If you’d like a better shot, open the camera again and retake it.",
  guidelines: [
    "Use clean lighting so your face is easy to recognize.",
    "Keep your full face visible and avoid hats or strong shadows.",
    "Choose a plain background with minimal distractions.",
    "Avoid heavy filters or edits that change your appearance.",
    "Use a recent photo that matches how travelers will meet you.",
  ],
};

export const GUIDE_PROFILE_COPY = {
  title: "Complete your guide profile",
  body:
    "Add a verified photo, your local connection, and the languages you can comfortably host in.",
  photoTitle: "Capture your photo",
  photoPending: "Take a clear photo to complete your verification profile.",
  photoComplete: "Your photo is ready",
  photoCompleteBody: "If you want to replace it, open the camera again.",
};

export const GUIDE_ADDRESS_COPY = {
  eyebrow: "Address verification",
  title: "Confirm the place you guide from.",
  body:
    "Use your location and address details to verify where you host experiences.",
  mapTitle: "Map preview",
  formTitle: "Address details",
  countryLabel: "Country",
  cityLabel: "City",
  streetLabel: "House No / Street",
  pincodeLabel: "Pincode",
  countryPlaceholder: "Select country",
  cityPlaceholder: "Select city",
  streetPlaceholder: "Enter house number or street",
  pincodePlaceholder: "Enter your pincode",
  submit: "Save address",
};

export const GUIDE_WORK_WITH_US_COPY = {
  eyebrow: "Why guide with us",
  title: "Why host on Lockal Way?",
  body:
    "The guide experience should feel professional for you and trustworthy for travelers from the first booking onward.",
  items: [
    {
      title: "Hassle-free payments",
      description:
        "Secure transactions and clearer booking flow help keep hosting simple and transparent.",
    },
    {
      title: "Reach more travelers",
      description:
        "A stronger guide profile and search experience helps you show up with more confidence.",
    },
    {
      title: "Support when needed",
      description:
        "Consistent tooling and clearer workflows reduce friction as you publish and manage trips.",
    },
  ],
};

export const GUIDE_RECENT_ACTIVITY_COPY = {
  title: "Recent activities",
  empty: "No recent activity yet.",
};

export const GUIDE_GUIDELINES = [
  "Arrive on time and keep communication clear before each trip.",
  "Maintain a professional, welcoming tone with every traveler.",
  "Share accurate local context and set realistic expectations.",
  "Prioritize safety and keep emergency contacts accessible.",
  "Respond quickly when travelers ask questions or need support.",
  "Review your itinerary details regularly so listings stay current.",
];
