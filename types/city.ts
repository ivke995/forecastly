export interface City {
  id: string;
  name: string;
  displayName: string;
  country: string;
  countryCode?: string;
  admin1?: string;
  admin2?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CitySearchResult extends City {
  population?: number;
  elevation?: number;
}

export interface FavoriteCity {
  id: string;
  cityId: string;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  createdAt: string;
}
