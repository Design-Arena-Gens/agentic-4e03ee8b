export interface Offer {
  title: string;
  description: string;
  code?: string;
  validity: string;
  conditions: string[];
  tags: string[];
}

export const offers: Offer[] = [
  {
    title: "Mobile App Exclusive: Buy One Big Mac, Get One for $1",
    description:
      "Order through the McDonald’s app to unlock the BOGO $1 Big Mac deal.",
    code: "APPBIGMAC1",
    validity: "Valid through May 31",
    conditions: [
      "Requires mobile order and pay",
      "Available once per day",
      "Not combinable with other Big Mac offers",
    ],
    tags: ["app", "burger", "limited"],
  },
  {
    title: "2 for $3 Breakfast Mix & Match",
    description:
      "Choose any two: Sausage McMuffin, Sausage Biscuit, Sausage Burrito.",
    validity: "Available daily until 10:30 AM",
    conditions: [
      "No substitutions",
      "Participation may vary",
      "Kiosk or counter orders qualify",
    ],
    tags: ["breakfast", "value"],
  },
  {
    title: "$0 Delivery Fee Weeknights",
    description:
      "Skip the delivery fee on McDelivery orders placed Mon-Thu after 5 PM.",
    validity: "Valid with DoorDash and Uber Eats partners",
    conditions: [
      "Minimum order $15 before fees",
      "Third-party service fees still apply",
      "Offer subject to courier availability",
    ],
    tags: ["delivery", "evening"],
  },
  {
    title: "Happy Meal Family Night",
    description:
      "Free kid’s size fries with every Happy Meal after 4 PM on Tuesdays.",
    validity: "Dine-in and drive-thru only",
    conditions: [
      "Limit 4 per customer",
      "Not valid with mobile orders",
      "Participating locations only",
    ],
    tags: ["family", "kids", "dine-in"],
  },
  {
    title: "McCafé Rewards",
    description:
      "Buy any 5 McCafé beverages, get the 6th one on us. Track progress in the app.",
    validity: "Ongoing loyalty program",
    conditions: [
      "Digital punches only",
      "Free drink applied to equal or lesser value",
      "Excludes bottled beverages",
    ],
    tags: ["coffee", "loyalty"],
  },
];
