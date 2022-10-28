import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { LocationResponse } from "../services/api/api.types"
import { ChargingUnit, ChargingUnitModel } from "./ChargingUnit"
import { withSetPropAction } from "./helpers/withSetPropAction"


export const ChargingStationModel = types
  .model("ChargingStation")
  .props({
    chargingUnits: types.array(ChargingUnitModel),
    chargingList: types.array(types.reference(ChargingUnitModel)),
    distance: 5
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchchargingUnits(location: LocationResponse) {
      const response = await api.getChargers(location, store.distance)
      if (response.kind === "ok") {
        store.setProp("chargingUnits", response.chargingUnits)
      } else {
        console.tron.error(`Error fetching chargers: ${JSON.stringify(response)}`, [])
      }
    },
    addCharging(charger: ChargingUnit) {
      store.chargingList.push(charger)
    },
    //not used now but may but should be used at some point
    removeCharging(charger: ChargingUnit) {
      store.chargingList.remove(charger)
    },
  }))
  .views((store) => ({
    get chargersForList() {
      return store.chargingUnits
    },

    hasCharging(charger: ChargingUnit) {
      return store.chargingList.includes(charger)
    },
  }))
  .actions((store) => ({
    async startCharging(charger: ChargingUnit) {
      // ChargePointID was always returning null so using UUID instead
      const response = await api.submitCharging(charger.UUID)
      if (response.kind === "ok") {
        store.addCharging(charger)
      } else {
        console.tron.error(`Error fetching chargers: ${JSON.stringify(response)}`, [])
      }
    },
  }))

export interface ChargingStation extends Instance<typeof ChargingStationModel> {}
export interface ChargingStationSnapshot extends SnapshotOut<typeof ChargingStationModel> {}

