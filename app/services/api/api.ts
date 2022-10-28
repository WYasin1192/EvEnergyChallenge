/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 */
import {
  ApiResponse,
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type {
  ApiConfig,
  ApiFeedResponse,
  LocationResponse
} from "./api.types"
import {ChargerSnapshotIn } from "../../models/ChargingUnit"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  evEnergyUrl: Config.API_URL,
  openMapsUrl: Config.OPEN_CHARGE_BASE_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  evenergyApi: ApisauceInstance
  openMapApi: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config

    this.evenergyApi = create({
      baseURL: this.config.evEnergyUrl,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })

    this.openMapApi = create({
      baseURL: this.config.openMapsUrl,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

 
  async getChargers(location: LocationResponse, distance: number): Promise<{ kind: "ok"; chargingUnits: ChargerSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse[]> = await this.openMapApi.get(
      `/poi`,{key: 123, latitude: location.coords.latitude, longitude: location.coords.longitude, distance: distance, compact: true}
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our MST model.
      const chargingUnits: ChargerSnapshotIn[] = rawData.map((raw) => ({
        UUID : raw.UUID, UsageCost: raw.UsageCost? raw.UsageCost: '', Title: raw.AddressInfo.Title, AddressLine1: raw.AddressInfo.AddressLine1,
        Postcode: raw.AddressInfo.Postcode, Latitude: raw.AddressInfo.Latitude, Longitude: raw.AddressInfo.Longitude
      }))

      return { kind: "ok", chargingUnits }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async submitCharging(id: string): Promise<{ kind: "ok" } | GeneralApiProblem> {

    const response: ApiResponse<ApiFeedResponse[]> = await this.evenergyApi.post(
      `/chargingsession`,{Body: {user: 1, car_id: 1, charger_id: id}}
    )
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
      return { kind: "ok" }
  }
  
}

// Singleton instance of the API for convenience
export const api = new Api()
