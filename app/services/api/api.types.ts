/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  ID: string
  Reference: string
  StatusTypeID: string
  Amps: string
  Voltage: string
  PowerKW: string
  Quantity: string
}

export interface ApiFeedResponse {
  UUID: string
  UsageCost: string
  AddressInfo: {
    Title: string
    AddressLine1: string
    AddressLine2: string
    Town: string
    StateOrProvince: string
    Postcode: string
    Country: string
    Latitude: number
    Longitude: number
  }
  Connections: EpisodeItem[]
}

export interface LocationResponse {
  coords: {
    accuracy: number
    altitude: number
    altitudeAccuracy: number
    heading: number
    latitude: number
    longitude: number
    speed: number
  }
}
/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the evenergy api.
   */
   evEnergyUrl: string

  /**
   * The URL of the open charge map org api.
   */
   openMapsUrl: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
