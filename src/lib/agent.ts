import { comboSuggestions, menu, MenuItem } from "@/data/menu";
import { offers } from "@/data/offers";
import { stores } from "@/data/stores";

export type AgentRole = "user" | "assistant" | "system";

export interface AgentMessage {
  role: AgentRole;
  content: string;
  createdAt?: string;
}

export interface AgentResponse {
  role: "assistant";
  content: string;
  suggestions: string[];
  intent: string;
}

type DietaryPreference =
  | "vegetarian"
  | "gluten-free"
  | "low-calorie"
  | "high-protein"
  | "dairy-free";

interface GuestProfile {
  dietary: Set<DietaryPreference>;
  dislikes: Set<string>;
  likes: Set<string>;
  spiceLevel: "mild" | "medium" | "spicy" | null;
  mealPeriod: "breakfast" | "lunch" | "dinner" | "snack" | null;
  partySize: "solo" | "pair" | "family" | "group" | null;
  budget: "value" | "standard" | "premium" | null;
  locationPreference: (typeof stores)[number] | null;
  cravingKeywords: Set<string>;
}

type Intent =
  | "greeting"
  | "goodbye"
  | "menu"
  | "nutrition"
  | "allergens"
  | "offers"
  | "hours"
  | "delivery"
  | "kids"
  | "dessert"
  | "coffee"
  | "feedback"
  | "unknown";

interface IntentMatch {
  intent: Intent;
  confidence: number;
}

const fallbackSuggestions = [
  "Suggest a combo for lunch",
  "Ask for nutrition on a menu item",
  "Find deals near me",
  "Check location hours",
];

const allergenKeywords = ["allergy", "allergen", "gluten", "dairy", "soy", "nuts", "peanut"];

export async function runAgent(messages: AgentMessage[]): Promise<AgentResponse> {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!latestUserMessage) {
    return {
      role: "assistant",
      intent: "greeting",
      content:
        "Hi there! I'm your McDonald's crew assistant. I can recommend meals, check nutrition, share current offers, or look up restaurant hours. What are you craving today?",
      suggestions: fallbackSuggestions.slice(0, 3),
    };
  }

  const profile = extractProfile(messages);
  const { intent } = detectIntent(latestUserMessage.content);
  const lowered = latestUserMessage.content.toLowerCase();

  switch (intent) {
    case "greeting":
      return {
        role: "assistant",
        intent,
        content: buildGreeting(profile),
        suggestions: buildSuggestionsForProfile(profile),
      };
    case "goodbye":
      return {
        role: "assistant",
        intent,
        content:
          "Thanks for chatting! If you crave McDonald's again, I'm here to help with recommendations or the latest deals.",
        suggestions: [],
      };
    case "menu":
    case "kids":
    case "dessert":
    case "coffee": {
      const response = buildMenuResponse(latestUserMessage.content, profile, intent);
      return {
        role: "assistant",
        intent,
        content: response,
        suggestions: buildSuggestionsForProfile(profile),
      };
    }
    case "nutrition":
    case "allergens": {
      const response = buildNutritionResponse(latestUserMessage.content, profile, intent);
      return {
        role: "assistant",
        intent,
        content: response,
        suggestions: [
          "Suggest a lower calorie option",
          "Compare protein between menu items",
          "See dessert nutrition facts",
        ],
      };
    }
    case "offers": {
      const response = buildOfferResponse(profile, lowered);
      return {
        role: "assistant",
        intent,
        content: response,
        suggestions: ["Show breakfast deals", "Plan a value meal", "Check loyalty rewards"],
      };
    }
    case "hours":
    case "delivery": {
      const response = buildLocationResponse(profile, intent, lowered);
      return {
        role: "assistant",
        intent,
        content: response,
        suggestions: ["See another city", "Ask about drive-thru", "Get delivery-friendly meals"],
      };
    }
    case "feedback": {
      return {
        role: "assistant",
        intent,
        content:
          "I appreciate the feedback. I'll pass it along to the crew so we can keep improving your experience. Can I help with anything else on the menu?",
        suggestions: buildSuggestionsForProfile(profile),
      };
    }
    case "unknown":
    default: {
      const contextual = attemptContextualFollowup(messages, profile);
      return {
        role: "assistant",
        intent,
        content: contextual,
        suggestions: buildSuggestionsForProfile(profile),
      };
    }
  }
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function detectIntent(content: string): IntentMatch {
  const text = normalize(content);
  const keyword = (words: string[]) =>
    words.some((word) =>
      text.split(" ").some((token) => token.startsWith(word) || token.includes(word))
    );

  if (keyword(["hello", "hi", "hey", "morning", "evening", "afternoon"])) {
    return { intent: "greeting", confidence: 0.8 };
  }

  if (keyword(["bye", "goodbye", "thanks,bye", "thankyoubye", "see you"])) {
    return { intent: "goodbye", confidence: 0.7 };
  }

  if (allergenKeywords.some((word) => text.includes(word))) {
    return { intent: "allergens", confidence: 0.75 };
  }

  if (
    keyword([
      "calorie",
      "protein",
      "nutrition",
      "carb",
      "sugar",
      "fat",
      "macro",
      "ingredient",
    ])
  ) {
    return { intent: "nutrition", confidence: 0.65 };
  }

  if (keyword(["deal", "offer", "promo", "special", "coupon", "discount"])) {
    return { intent: "offers", confidence: 0.75 };
  }

  if (keyword(["hour", "open", "close", "time", "24"])) {
    return { intent: "hours", confidence: 0.7 };
  }

  if (keyword(["delivery", "deliver", "uber", "doordash", "grubhub", "courier"])) {
    return { intent: "delivery", confidence: 0.7 };
  }

  if (keyword(["kid", "happy meal", "child", "toddler"])) {
    return { intent: "kids", confidence: 0.7 };
  }

  if (keyword(["dessert", "sweet", "mcflurry", "ice cream", "cone"])) {
    return { intent: "dessert", confidence: 0.7 };
  }

  if (keyword(["coffee", "latte", "espresso", "macchiato", "iced coffee"])) {
    return { intent: "coffee", confidence: 0.7 };
  }

  if (keyword(["complain", "bad", "upset", "disappoint", "feedback"])) {
    return { intent: "feedback", confidence: 0.6 };
  }

  if (
    keyword([
      "recommend",
      "what should",
      "menu",
      "order",
      "suggest",
      "hungry",
      "combo",
      "meal",
      "burger",
      "nugget",
      "breakfast",
      "lunch",
      "dinner",
      "snack",
    ])
  ) {
    return { intent: "menu", confidence: 0.65 };
  }

  return { intent: "unknown", confidence: 0.25 };
}

function extractProfile(messages: AgentMessage[]): GuestProfile {
  const dietary = new Set<DietaryPreference>();
  const dislikes = new Set<string>();
  const likes = new Set<string>();
  const cravingKeywords = new Set<string>();

  let spiceLevel: GuestProfile["spiceLevel"] = null;
  let mealPeriod: GuestProfile["mealPeriod"] = null;
  let partySize: GuestProfile["partySize"] = null;
  let budget: GuestProfile["budget"] = null;
  let locationPreference: GuestProfile["locationPreference"] = null;

  const lowerStores = stores.map((store) => ({
    store,
    query: normalize(`${store.city} ${store.address}`),
  }));

  const addDietary = (keyword: string) => {
    switch (keyword) {
      case "vegetarian":
      case "veggie":
        dietary.add("vegetarian");
        break;
      case "gluten-free":
      case "no gluten":
        dietary.add("gluten-free");
        break;
      case "low calorie":
      case "lighter":
      case "healthy":
        dietary.add("low-calorie");
        break;
      case "high protein":
      case "protein":
        dietary.add("high-protein");
        break;
      case "dairy-free":
      case "lactose":
        dietary.add("dairy-free");
        break;
      default:
        break;
    }
  };

  const patterns: Array<[RegExp, (match: RegExpMatchArray) => void]> = [
    [/\bno\s+([a-z]+)/gi, (match) => dislikes.add(match[1].toLowerCase())],
    [/\ballergic\s+to\s+([a-z]+)/gi, (match) => dislikes.add(match[1].toLowerCase())],
    [/\blove\s+([a-z\s]+)/gi, (match) => likes.add(match[1].trim())],
    [
      /\b(craving|want)\s+(.*)/gi,
      (match) => cravingKeywords.add(match[2].trim().toLowerCase()),
    ],
    [/\bspicy\b/gi, () => (spiceLevel = "spicy")],
    [/\bmild\b/gi, () => (spiceLevel = "mild")],
    [/\bmedium spicy\b/gi, () => (spiceLevel = "medium")],
    [
      /\b(breakfast|lunch|dinner|late night|snack)\b/gi,
      (match) => {
        const value = match[0].toLowerCase();
        if (value.includes("breakfast")) mealPeriod = "breakfast";
        else if (value.includes("lunch")) mealPeriod = "lunch";
        else if (value.includes("dinner") || value.includes("late night")) mealPeriod = "dinner";
        else if (value.includes("snack")) mealPeriod = "snack";
      },
    ],
    [
      /\b(cheap|affordable|value|budget)\b/gi,
      () => {
        budget = "value";
      },
    ],
    [
      /\b(premium|treat|splurge)\b/gi,
      () => {
        budget = "premium";
      },
    ],
    [
      /\b(kid|kids|family|children|toddler)\b/gi,
      () => {
        partySize = "family";
      },
    ],
    [
      /\b(office|team|coworker|group)\b/gi,
      () => {
        partySize = "group";
      },
    ],
    [
      /\bdate\b/gi,
      () => {
        partySize = "pair";
      },
    ],
  ];

  for (const message of messages) {
    if (message.role !== "user") continue;
    const content = message.content;
    const lowered = normalize(content);

    if (lowered.includes("vegetarian") || lowered.includes("veggie")) {
      addDietary("vegetarian");
    }
    if (lowered.includes("gluten")) {
      addDietary("gluten-free");
    }
    if (lowered.includes("lactose") || lowered.includes("dairy-free") || lowered.includes("no dairy")) {
      addDietary("dairy-free");
    }
    if (lowered.includes("low calorie") || lowered.includes("lighter")) {
      addDietary("low calorie");
    }
    if (lowered.includes("high protein") || lowered.includes("protein")) {
      addDietary("high protein");
    }

    if (lowered.includes("kids") || lowered.includes("happy meal")) {
      partySize = partySize ?? "family";
    }

    for (const [pattern, handler] of patterns) {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(content)) !== null) {
        handler(match);
      }
      pattern.lastIndex = 0;
    }

    for (const { store, query } of lowerStores) {
      if (lowered.includes(store.city.toLowerCase()) || lowered.includes(query)) {
        locationPreference = store;
      }
    }
  }

  return {
    dietary,
    dislikes,
    likes,
    spiceLevel,
    mealPeriod,
    partySize,
    budget,
    locationPreference,
    cravingKeywords,
  };
}

function buildGreeting(profile: GuestProfile): string {
  const parts = ["Hey there! Welcome to McDonald's digital crew counter."];
  if (profile.mealPeriod === "breakfast") {
    parts.push("Hotcakes, Egg McMuffins, and McCafé drinks are ready to roll this morning.");
  } else if (profile.mealPeriod === "dinner") {
    parts.push("Evening appetite? I can line up combos, late-night bites, or dessert treats.");
  }

  if (profile.partySize === "family") {
    parts.push("Need Happy Meals or shareable nuggets? I can build a family order fast.");
  } else if (profile.budget === "value") {
    parts.push("Looking to save? Ask about today’s app-friendly deals and value picks.");
  }

  parts.push("How can I make your McDonald's run easier right now?");
  return parts.join(" ");
}

function buildMenuResponse(content: string, profile: GuestProfile, intent: Intent): string {
  const allItems = menu.flatMap((category) => category.items);
  const scored = allItems
    .map((item) => ({
      item,
      score: scoreMenuItem(item, content, profile, intent),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) {
    const neutral = allItems
      .map((item) => ({ item, score: scoreMenuItem(item, content, profile, intent, true) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (neutral.length === 0) {
      return [
        "I'm ready with personalized suggestions as soon as you share what you're craving—breakfast, burgers, chicken, desserts, anything!",
        "Try something like “Recommend a spicy chicken sandwich” or “Need kids meals under $5.”",
      ].join(" ");
    }

    return formatMenuRecommendations(neutral.map((entry) => entry.item), profile, intent);
  }

  return formatMenuRecommendations(scored.map((entry) => entry.item), profile, intent);
}

function scoreMenuItem(
  item: MenuItem,
  content: string,
  profile: GuestProfile,
  intent: Intent,
  neutral = false
): number {
  let score = neutral ? 0.2 : 0.5;
  const loweredItem = item.name.toLowerCase();
  const loweredContent = content.toLowerCase();

  if (profile.dietary.has("vegetarian") && !item.tags.includes("vegetarian")) {
    return 0;
  }
  if (profile.dietary.has("low-calorie") && item.calories > 450) {
    score -= 0.4;
  }
  if (profile.dietary.has("high-protein") && item.protein >= 20) {
    score += 0.4;
  }
  if (profile.dietary.has("dairy-free") && item.allergens.includes("dairy")) {
    return 0.1;
  }

  for (const dislike of profile.dislikes) {
    if (item.description.toLowerCase().includes(dislike)) {
      score -= 0.5;
    }
  }
  for (const like of profile.likes) {
    if (loweredItem.includes(like) || item.description.toLowerCase().includes(like)) {
      score += 0.3;
    }
  }
  for (const craving of profile.cravingKeywords) {
    if (loweredItem.includes(craving) || item.description.toLowerCase().includes(craving)) {
      score += 0.35;
    }
  }

  if (profile.mealPeriod && item.tags.includes(profile.mealPeriod)) {
    score += 0.3;
  }

  if (profile.partySize === "family" && item.tags.includes("kids")) {
    score += 0.4;
  }
  if (intent === "kids" && item.tags.includes("kids")) {
    score += 0.6;
  }
  if (intent === "dessert" && item.tags.includes("dessert")) {
    score += 0.6;
  }
  if (intent === "coffee" && item.tags.includes("coffee")) {
    score += 0.6;
  }

  const keyTokens = [
    ["spicy", "spiceLevel", "spicy"],
    ["mild", "spiceLevel", "mild"],
    ["protein", "dietary", "high-protein"],
    ["calorie", "dietary", "low-calorie"],
    ["value", "budget", "value"],
  ] as const;

  for (const [keyword, prop, value] of keyTokens) {
    if (content.toLowerCase().includes(keyword)) {
      if (prop === "spiceLevel" && profile.spiceLevel === value) score += 0.3;
      if (prop === "dietary" && profile.dietary.has(value as DietaryPreference)) score += 0.2;
      if (prop === "budget" && profile.budget === value) score += 0.2;
    }
  }

  if (loweredContent.includes(item.name.toLowerCase())) {
    score += 0.5;
  }

  if (profile.budget === "value" && item.tags.includes("value")) {
    score += 0.3;
  }

  return score;
}

function formatMenuRecommendations(items: MenuItem[], profile: GuestProfile, intent: Intent): string {
  const lines = [];
  if (intent === "dessert") {
    lines.push("Treat yourself! Here are desserts fans rave about:");
  } else if (intent === "coffee") {
    lines.push("Here's a quick McCafé lineup to match your vibe:");
  } else if (profile.partySize === "family") {
    lines.push("For a family-friendly spread, these are crowd favorites:");
  } else if (profile.budget === "value") {
    lines.push("Sticking to the value side? These pack flavor without stretching the budget:");
  } else {
    lines.push("Here’s what I’d recommend based on what you shared:");
  }

  items.forEach((item) => {
    const price = `$${item.price.toFixed(2)}`;
    const calorieNote =
      profile.dietary.has("low-calorie") || item.calories <= 450
        ? ` • ${item.calories} cal`
        : ` • ${item.calories} cal`;
    const extras =
      item.sides || item.drinkOptions
        ? [
            item.sides ? `Try with ${item.sides.join(" / ")}` : null,
            item.drinkOptions ? `Pair with ${item.drinkOptions.join(", ")}` : null,
          ]
            .filter(Boolean)
            .join(" · ")
        : null;

    lines.push(`- **${item.name}** (${price}${calorieNote}): ${item.description}${extras ? ` · ${extras}` : ""}`);
  });

  const combo = comboSuggestions[Math.floor(Math.random() * comboSuggestions.length)];
  if (combo) {
    lines.push(
      "",
      `Bonus combo idea — **${combo.title}**: ${combo.items.join(", ")}. ${combo.description}`
    );
  }

  lines.push("", "Want nutrition info, swap an ingredient, or explore current deals?");
  return lines.join("\n");
}

function buildNutritionResponse(content: string, profile: GuestProfile, intent: Intent): string {
  const lowered = content.toLowerCase();
  const allItems = menu.flatMap((category) => category.items);

  const matched = allItems.filter((item) => lowered.includes(item.name.toLowerCase()));
  const fallback =
    matched.length === 0
      ? allItems.filter((item) => {
          return item.tags.some((tag) => {
            if (intent === "nutrition" && tag === "high-protein") return true;
            if (intent === "allergens" && allergenKeywords.some((key) => item.allergens.includes(key))) {
              return true;
            }
            return lowered.includes(tag);
          });
        })
      : [];

  const items = matched.length > 0 ? matched.slice(0, 3) : fallback.slice(0, 3);

  if (items.length === 0) {
    return [
      "I can pull nutrition and allergen stats for any McDonald's menu item in seconds.",
      "Try asking something like “Calories in a Big Mac” or “Allergens for Chicken McNuggets.”",
    ].join(" ");
  }

  const header = intent === "allergens" ? "Here's the allergen rundown:" : "Nutrition break-down coming up:";
  const lines = [header];

  items.forEach((item) => {
    const allergenLine =
      item.allergens.length > 0 ? `Allergens: ${item.allergens.join(", ")}` : "Allergens: none noted.";
    const macros = `Calories: ${item.calories} · Protein: ${item.protein}g`;
    lines.push(`- **${item.name}** — ${macros} · ${allergenLine}`);
  });

  if (profile.dietary.size > 0) {
    lines.push(
      "",
      "I kept your dietary preferences in mind. Let me know if you need more swaps or alternatives."
    );
  } else {
    lines.push("", "Need ideas that match a specific goal like low-calorie or high-protein? Just say the word.");
  }

  return lines.join("\n");
}

function buildOfferResponse(profile: GuestProfile, lowered: string): string {
  const relevantOffers = offers
    .map((offer) => ({
      offer,
      score: scoreOffer(offer.tags, lowered, profile),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.offer);

  const lines = ["Here are the current offers worth tapping into:"];
  (relevantOffers.length > 0 ? relevantOffers : offers.slice(0, 3)).forEach((offer) => {
    const code = offer.code ? `Use code ${offer.code}. ` : "";
    lines.push(`- **${offer.title}** — ${offer.description}. ${code}${offer.validity}`);
    if (offer.conditions.length > 0) {
      lines.push(`  Conditions: ${offer.conditions.join("; ")}`);
    }
  });

  lines.push(
    "",
    "Tip: The McDonald’s app rotates weekly deals. Toggle on notifications to capture the freshest limited-time offers."
  );
  return lines.join("\n");
}

function scoreOffer(tags: string[], lowered: string, profile: GuestProfile): number {
  let score = 0.3;
  if (profile.mealPeriod === "breakfast" && tags.includes("breakfast")) score += 0.4;
  if (profile.partySize === "family" && tags.includes("family")) score += 0.4;
  if (profile.budget === "value" && tags.includes("value")) score += 0.4;
  if (profile.dietary.has("vegetarian") && tags.includes("veggie")) score += 0.2;
  if (profile.dietary.has("high-protein") && tags.includes("high-protein")) score += 0.2;
  if (lowered.includes("delivery") && tags.includes("delivery")) score += 0.4;
  if (lowered.includes("coffee") && tags.includes("coffee")) score += 0.4;
  if (lowered.includes("app") && tags.includes("app")) score += 0.3;
  return score;
}

function buildLocationResponse(profile: GuestProfile, intent: Intent, lowered: string): string {
  const found = profile.locationPreference ?? matchStoreByQuery(lowered);

  if (!found) {
    const exampleCities = stores.map((store) => store.city.split("-")[0].trim());
    return [
      "I can pull hours, services, and delivery partners instantly—just drop a city or your cross streets.",
      `Try “What are the hours in ${exampleCities[0]}?” or “Does the ${exampleCities[1]} location offer McDelivery?”`,
    ].join(" ");
  }

  const lines = [`Here's what the **${found.city}** crew is running:`];
  if (intent === "hours" || intent === "delivery") {
    lines.push(
      "Hours:",
      ...formatHours(found).map((line) => `- ${line}`)
    );
  }

  if (intent === "delivery") {
    lines.push(
      "",
      "Delivery & services:",
      ...found.services.map((service) => `- ${service}`)
    );
    lines.push(
      "",
      "McDelivery works best through the McDonald’s app, Uber Eats, and DoorDash. Fees vary by partner."
    );
  } else {
    lines.push("", "Services available:", ...found.services.map((service) => `- ${service}`));
  }

  lines.push(
    "",
    `Address: ${found.address}`,
    `Phone: ${found.phone}`,
    "Need a different spot? Just mention another neighborhood or city."
  );

  return lines.join("\n");
}

function matchStoreByQuery(lowered: string) {
  const cityWords = lowered.split(/\s+/);
  for (const store of stores) {
    const normalizedCity = store.city.toLowerCase();
    if (normalizedCity.split(/\s|,/).some((part) => cityWords.includes(part))) {
      return store;
    }
  }
  return null;
}

function formatHours(store: (typeof stores)[number]): string[] {
  const days: Array<[keyof typeof store.hours, string]> = [
    ["monday", "Mon"],
    ["tuesday", "Tue"],
    ["wednesday", "Wed"],
    ["thursday", "Thu"],
    ["friday", "Fri"],
    ["saturday", "Sat"],
    ["sunday", "Sun"],
  ];
  return days.map(([key, label]) => {
    const hours = store.hours[key];
    if (hours.driveThru24h || (hours.open === "00:00" && hours.close === "23:59")) {
      return `${label}: Open 24 hours (drive-thru)`;
    }
    return `${label}: ${formatTime(hours.open)} – ${formatTime(hours.close)}`;
  });
}

function formatTime(value: string): string {
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${normalizedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

function attemptContextualFollowup(messages: AgentMessage[], profile: GuestProfile): string {
  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  if (lastAssistant && lastAssistant.content.toLowerCase().includes("anything else")) {
    return "What else can I line up for you—combos, dessert add-ons, or maybe the latest deals in the app?";
  }

  if (profile.dietary.size > 0) {
    return "I caught your dietary preferences. Want me to find compatible items or share allergen-safe picks?";
  }

  return "I'm ready to help with menu picks, nutrition facts, or nearby restaurant info—just say the word!";
}

function buildSuggestionsForProfile(profile: GuestProfile): string[] {
  const suggestions = new Set<string>();
  if (profile.mealPeriod === "breakfast") {
    suggestions.add("Show breakfast sandwiches");
  } else {
    suggestions.add("Recommend a combo meal");
  }

  if (profile.dietary.has("low-calorie")) {
    suggestions.add("Find options under 450 calories");
  } else if (profile.dietary.has("high-protein")) {
    suggestions.add("Suggest high-protein picks");
  }

  if (profile.partySize === "family") {
    suggestions.add("Build a family order");
  }

  if (profile.locationPreference) {
    suggestions.add("Check a different city");
  } else {
    suggestions.add("Find store hours near me");
  }

  suggestions.add("See current McDonald's deals");

  return Array.from(suggestions).slice(0, 3);
}
