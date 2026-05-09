export type OpenMeteoGeocodingRequest = {
  name: string
  count?: number
  language?: string
  countryCode?: string
}

export type OpenMeteoGeocodingResult = {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation?: number
  feature_code?: string
  country_code?: string
  country?: string
  country_id?: number
  timezone?: string
  population?: number
  postcodes?: string[]
  admin1?: string
  admin2?: string
  admin3?: string
  admin4?: string
  admin1_id?: number
  admin2_id?: number
  admin3_id?: number
  admin4_id?: number
}

export type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoGeocodingResult[]
}
