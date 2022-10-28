import { ChargingUnitModel } from "./ChargingUnit"


const data = {
  UUID: "f91f2ea0-378a-4a90-9a83-d438a0cc32f6",
  UsageCost: "5$ / hour this is a very long text",
  Title: "RNR 244",
  AddressLine1: " 123 test drive",
  Postcode: "123 456",
  Latitude: 52.343197,
  Longitude: -0.170632,
}
const episode = ChargingUnitModel.create(data)

test("publish date format", () => {
  expect(episode.parsedTitle.title).toBe("RNR 244")
})

test("duration format", () => {
  expect(episode.parsedUsage).toBe("5$ / hour this ...")
})

// @demo remove-file
