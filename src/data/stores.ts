export interface StoreLocation {
  city: string;
  address: string;
  phone: string;
  timezone: string;
  coordinates: { lat: number; lng: number };
  services: string[];
  hours: Record<
    "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
    { open: string; close: string; driveThru24h?: boolean }
  >;
}

export const stores: StoreLocation[] = [
  {
    city: "Chicago, IL - River North",
    address: "600 N Clark St, Chicago, IL 60654",
    phone: "(312) 555-0199",
    timezone: "America/Chicago",
    coordinates: { lat: 41.8923, lng: -87.6312 },
    services: [
      "Mobile order pickup shelves",
      "McDelivery",
      "Late-night drive-thru",
      "McCafé Bakery counter",
    ],
    hours: {
      monday: { open: "05:00", close: "23:00" },
      tuesday: { open: "05:00", close: "23:00" },
      wednesday: { open: "05:00", close: "23:00" },
      thursday: { open: "05:00", close: "23:00" },
      friday: { open: "05:00", close: "01:00" },
      saturday: { open: "05:00", close: "01:00" },
      sunday: { open: "06:00", close: "23:00" },
    },
  },
  {
    city: "Los Angeles, CA - Sunset & Vine",
    address: "1951 N Highland Ave, Los Angeles, CA 90068",
    phone: "(213) 555-0145",
    timezone: "America/Los_Angeles",
    coordinates: { lat: 34.1063, lng: -118.3287 },
    services: ["Front-counter pickup", "Self-order kiosks", "PlayPlace", "Curbside pickup"],
    hours: {
      monday: { open: "06:00", close: "23:00" },
      tuesday: { open: "06:00", close: "23:00" },
      wednesday: { open: "06:00", close: "23:00" },
      thursday: { open: "06:00", close: "00:00" },
      friday: { open: "06:00", close: "01:00" },
      saturday: { open: "06:00", close: "01:00" },
      sunday: { open: "06:00", close: "23:00" },
    },
  },
  {
    city: "New York, NY - Times Square",
    address: "1528 Broadway, New York, NY 10036",
    phone: "(212) 555-0172",
    timezone: "America/New_York",
    coordinates: { lat: 40.758, lng: -73.9855 },
    services: [
      "24-hour dining",
      "Mobile order express pickup",
      "Tourist-friendly menu boards",
      "Digital ordering",
    ],
    hours: {
      monday: { open: "00:00", close: "23:59", driveThru24h: true },
      tuesday: { open: "00:00", close: "23:59", driveThru24h: true },
      wednesday: { open: "00:00", close: "23:59", driveThru24h: true },
      thursday: { open: "00:00", close: "23:59", driveThru24h: true },
      friday: { open: "00:00", close: "23:59", driveThru24h: true },
      saturday: { open: "00:00", close: "23:59", driveThru24h: true },
      sunday: { open: "00:00", close: "23:59", driveThru24h: true },
    },
  },
  {
    city: "Austin, TX - South Congress",
    address: "2320 S Congress Ave, Austin, TX 78704",
    phone: "(512) 555-0111",
    timezone: "America/Chicago",
    coordinates: { lat: 30.2414, lng: -97.758 },
    services: ["Dual-lane drive-thru", "Curbside pickup", "PlayPlace"],
    hours: {
      monday: { open: "05:00", close: "23:00" },
      tuesday: { open: "05:00", close: "23:00" },
      wednesday: { open: "05:00", close: "23:00" },
      thursday: { open: "05:00", close: "23:00" },
      friday: { open: "05:00", close: "01:00" },
      saturday: { open: "05:00", close: "01:00" },
      sunday: { open: "06:00", close: "23:00" },
    },
  },
];
