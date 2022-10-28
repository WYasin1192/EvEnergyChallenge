import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChargingStationModel } from "./ChargingStationStore" 

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  chargingStationStore: types.optional(ChargingStationModel, {}), 
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
