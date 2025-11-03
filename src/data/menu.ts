export type MenuTag =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "coffee"
  | "beef"
  | "chicken"
  | "fish"
  | "vegetarian"
  | "kids"
  | "combo"
  | "dessert"
  | "value"
  | "limited"
  | "low-calorie"
  | "high-protein";

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  calories: number;
  protein: number;
  tags: MenuTag[];
  allergens: string[];
  sides?: string[];
  drinkOptions?: string[];
}

export interface MenuCategory {
  name: string;
  headline: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    name: "Signature Burgers",
    headline: "The hallmark classics people crave",
    items: [
      {
        name: "Big Mac",
        description:
          "Two 100% beef patties with Big Mac Sauce, shredded lettuce, and pickles on a sesame seed bun.",
        price: 5.99,
        calories: 550,
        protein: 25,
        tags: ["lunch", "dinner", "beef", "combo"],
        allergens: ["gluten", "soy", "egg", "sesame"],
        sides: ["World Famous Fries", "Side Salad"],
        drinkOptions: ["Coca-Cola", "Sprite", "Iced Tea", "Bottled Water"],
      },
      {
        name: "Quarter Pounder with Cheese",
        description:
          "Quarter pound of 100% fresh beef, two slices of cheese, pickles, onions, ketchup, and mustard.",
        price: 5.79,
        calories: 520,
        protein: 30,
        tags: ["lunch", "dinner", "beef", "combo", "high-protein"],
        allergens: ["gluten", "soy", "dairy", "sesame"],
        sides: ["Fries", "Apple Slices"],
        drinkOptions: ["Coca-Cola", "Diet Coke", "Dr Pepper", "Minute Maid"],
      },
      {
        name: "McDouble",
        description:
          "Two beef patties, pickles, onions, cheese, ketchup, and mustard on a toasted bun.",
        price: 3.39,
        calories: 400,
        protein: 22,
        tags: ["lunch", "dinner", "beef", "value"],
        allergens: ["gluten", "soy", "dairy", "sesame"],
      },
    ],
  },
  {
    name: "Chicken Favorites",
    headline: "Crispy or grilled protein-packed choices",
    items: [
      {
        name: "McCrispy",
        description:
          "Crispy chicken filet with toasted potato roll, crinkle-cut pickles, and butter.",
        price: 5.49,
        calories: 470,
        protein: 27,
        tags: ["lunch", "dinner", "chicken", "combo"],
        allergens: ["gluten", "soy", "dairy"],
        sides: ["Fries", "Side Salad", "Hash Browns (all-day)"],
        drinkOptions: ["Sweet Tea", "Frozen Fanta", "Hi-C Orange"],
      },
      {
        name: "Spicy McCrispy",
        description:
          "Crispy chicken filet layered with spicy pepper sauce and pickles.",
        price: 5.69,
        calories: 530,
        protein: 27,
        tags: ["lunch", "dinner", "chicken", "combo", "limited"],
        allergens: ["gluten", "soy", "dairy"],
      },
      {
        name: "Chicken McNuggets 10pc",
        description:
          "Ten tender, juicy chicken bites paired with your favorite dipping sauces.",
        price: 5.29,
        calories: 440,
        protein: 24,
        tags: ["lunch", "dinner", "chicken", "combo"],
        allergens: ["gluten", "soy"],
        sides: ["Fries", "Apple Slices"],
        drinkOptions: ["Any Soft Drink", "Milk", "Honest Kids Apple Juice"],
      },
    ],
  },
  {
    name: "Breakfast All-Stars",
    headline: "Fast fuel to start the day right",
    items: [
      {
        name: "Egg McMuffin",
        description:
          "Fresh cracked Grade A egg, lean Canadian bacon, and melty cheese on a toasted English muffin.",
        price: 3.99,
        calories: 310,
        protein: 17,
        tags: ["breakfast", "high-protein"],
        allergens: ["gluten", "dairy", "egg"],
        sides: ["Hash Browns", "Fruit & Maple Oatmeal"],
        drinkOptions: ["Premium Roast Coffee", "Latte", "Orange Juice"],
      },
      {
        name: "Sausage Burrito",
        description:
          "Scrambled eggs, sausage, vegetables, and cheese wrapped in a soft tortilla.",
        price: 2.49,
        calories: 300,
        protein: 13,
        tags: ["breakfast", "value"],
        allergens: ["gluten", "dairy", "egg"],
      },
      {
        name: "Hotcakes",
        description:
          "Three golden-brown hotcakes served with butter and maple-flavored syrup.",
        price: 3.49,
        calories: 580,
        protein: 9,
        tags: ["breakfast", "dessert"],
        allergens: ["gluten", "dairy", "egg"],
      },
    ],
  },
  {
    name: "Balanced Choices",
    headline: "Options for lighter or specialized diets",
    items: [
      {
        name: "Southwest Grilled Chicken Salad",
        description:
          "Mixed greens, grilled chicken, black beans, corn, tomatoes, cheddar, and tortilla strips with cilantro lime dressing.",
        price: 5.89,
        calories: 350,
        protein: 37,
        tags: ["lunch", "dinner", "chicken", "vegetarian", "low-calorie", "high-protein"],
        allergens: ["dairy"],
      },
      {
        name: "Apple Slices",
        description: "Fresh-cut apple slices, perfect for snacking or sides.",
        price: 1.29,
        calories: 15,
        protein: 0,
        tags: ["snack", "vegetarian", "kids", "low-calorie"],
        allergens: [],
      },
      {
        name: "Fruit & Maple Oatmeal",
        description:
          "Whole-grain oats, diced apples, cranberry raisin blend, and cream for natural sweetness.",
        price: 2.99,
        calories: 320,
        protein: 6,
        tags: ["breakfast", "vegetarian"],
        allergens: ["gluten", "dairy"],
      },
    ],
  },
  {
    name: "Treats & Sips",
    headline: "Desserts and beverages to round out any meal",
    items: [
      {
        name: "McFlurry with Oreo",
        description:
          "Soft serve vanilla blended with crushed Oreo cookies for a creamy treat.",
        price: 3.89,
        calories: 510,
        protein: 12,
        tags: ["dessert"],
        allergens: ["dairy", "gluten"],
      },
      {
        name: "Vanilla Cone",
        description:
          "Classic soft-serve vanilla cone for a cool-down moment on the go.",
        price: 1.49,
        calories: 200,
        protein: 5,
        tags: ["dessert", "value"],
        allergens: ["dairy"],
      },
      {
        name: "Iced Caramel Macchiato",
        description:
          "Cold whole milk with rich caramel syrup, layered with espresso and topped with caramel drizzle.",
        price: 3.69,
        calories: 260,
        protein: 9,
        tags: ["coffee"],
        allergens: ["dairy"],
      },
    ],
  },
  {
    name: "Family & Kids",
    headline: "Smiles guaranteed for little ones",
    items: [
      {
        name: "4 Piece Chicken McNuggets Happy Meal",
        description:
          "Four Chicken McNuggets, kid’s fries, apple slices, and a choice of drink with a Happy Meal toy.",
        price: 4.19,
        calories: 395,
        protein: 14,
        tags: ["kids", "chicken", "combo"],
        allergens: ["gluten", "soy"],
        drinkOptions: ["Milk", "Honest Kids Apple Juice", "Bottled Water"],
      },
      {
        name: "Hamburger Happy Meal",
        description:
          "Classic hamburger with kids fries, apple slices, and a kids drink plus the latest Happy Meal toy.",
        price: 3.99,
        calories: 475,
        protein: 14,
        tags: ["kids", "beef", "combo"],
        allergens: ["gluten", "soy", "sesame"],
      },
    ],
  },
];

export const comboSuggestions = [
  {
    title: "Classic Comfort",
    items: ["Big Mac", "Medium Fries", "Coca-Cola"],
    description: "Satisfying American classic built for a lunch break.",
  },
  {
    title: "Protein Power Lunch",
    items: ["Quarter Pounder with Cheese", "Side Salad", "Iced Tea"],
    description: "Higher protein with greens on the side for balance.",
  },
  {
    title: "Spicy Share Box",
    items: ["Spicy McCrispy", "10pc Chicken McNuggets", "2 Sauces", "Large Fries"],
    description: "Kick up the heat while keeping enough to share.",
  },
  {
    title: "Kids Night Out",
    items: ["4pc McNuggets Happy Meal", "Hamburger Happy Meal", "Vanilla Cone"],
    description: "Easy crowd-pleaser for younger diners.",
  },
  {
    title: "Morning Boost",
    items: ["Egg McMuffin", "Hash Browns", "Large Latte"],
    description: "Grab-and-go breakfast before the day ramps up.",
  },
];
