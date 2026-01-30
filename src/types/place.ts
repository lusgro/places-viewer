export interface OpeningHour {
  day: string;
  hours: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface AdditionalInfoItem {
  [key: string]: boolean;
}

export interface AdditionalInfo {
  [category: string]: AdditionalInfoItem[];
}

export interface Place {
  title: string;
  description?: string | null;
  price?: string | null;
  categoryName?: string;
  address: string;
  neighborhood?: string;
  street?: string;
  city?: string;
  postalCode?: string | null;
  state?: string;
  countryCode?: string;
  website?: string | null;
  phone?: string | null;
  phoneUnformatted?: string | null;
  claimThisBusiness?: boolean;
  location: Location;
  totalScore: number | null;
  permanentlyClosed?: boolean;
  temporarilyClosed?: boolean;
  placeId: string;
  categories?: string[];
  fid?: string;
  cid?: string;
  reviewsCount?: number;
  imagesCount?: number;
  imageCategories?: string[];
  scrapedAt?: string;
  googleFoodUrl?: string | null;
  hotelAds?: unknown[];
  openingHours?: OpeningHour[];
  peopleAlsoSearch?: unknown[];
  placesTags?: unknown[];
  reviewsTags?: unknown[];
  additionalInfo?: AdditionalInfo;
  gasPrices?: unknown[];
  url?: string;
  searchPageUrl?: string;
  searchString?: string;
  language?: string;
  rank?: number;
  isAdvertisement?: boolean;
  imageUrl?: string;
  kgmid?: string;
}
