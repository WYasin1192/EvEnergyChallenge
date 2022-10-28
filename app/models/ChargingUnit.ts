import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const ChargingUnitModel = types
  .model("ChargingUnit")
  .props({
    UUID: types.identifier,
    UsageCost: "" ,
    Title: "",
    AddressLine1: "", 
    AddressLine2: "",
    Town: "",
    StateOrProvince: "",
    Postcode: "",
    Country: "",
    Latitude: 1,
    Longitude: 1,
  })
  .actions(withSetPropAction)
  .views((chargingUnit) => ({
    get parsedTitle() {
      const defaultValue = { title: chargingUnit.Title?.trim() }

      if(defaultValue) return defaultValue

      return ({title: chargingUnit.AddressLine1 })
    },
    get parsedUsage(){
      if(chargingUnit.UsageCost.length > 15){
        return chargingUnit.UsageCost.substring(0, 15) + '...'
      }
      return chargingUnit.UsageCost
    }
    
  }))

export interface ChargingUnit extends Instance<typeof ChargingUnitModel> {}
export interface ChargerSnapshotOut extends SnapshotOut<typeof ChargingUnitModel> {}
export interface ChargerSnapshotIn extends SnapshotIn<typeof ChargingUnitModel> {}

