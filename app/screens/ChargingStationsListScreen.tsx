import { observer } from "mobx-react-lite"
import React, { FC, useState, useEffect } from "react"
import {
  ActivityIndicator,
  FlatList,
  Platform,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { Button, Card, EmptyState, Screen, Text } from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
import { ChargingUnit } from "../models/ChargingUnit"
import { DemoTabScreenProps } from "../navigators/AppNavigator"
import { colors, spacing } from "../theme"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"

export const ChargingStationsListScreen: FC<DemoTabScreenProps> = observer(
  function ChargingStationsListScreen(_props) {
  const { chargingStationStore } = useStores()

  const [locationError, setLocationError] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      let locationData = await getUserLocation()
      if(locationData){
      await chargingStationStore.fetchchargingUnits(locationData)
      }
      setIsLoading(false)
    })()
  }, [chargingStationStore])


  async function getUserLocation(){
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(true);
        return false;
      }
      let location = await Location.getCurrentPositionAsync({});
      return location
  }

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true)
    let locationData = await getUserLocation()
    if(locationData){
      await chargingStationStore.fetchchargingUnits(locationData)
      }
    setRefreshing(false)
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContentContainer}>
      <FlatList<ChargingUnit>
        data={chargingStationStore.chargersForList}
        extraData={chargingStationStore.chargingList.length + chargingStationStore.chargingUnits.length}
        contentContainerStyle={$flatListContentContainer}
        refreshing={refreshing}
        onRefresh={manualRefresh}
        ListEmptyComponent={
          isLoading ? (<ActivityIndicator />) : (
            <EmptyState
              preset="generic"
              style={$emptyState}
              headingTx={
                locationError
                  ? "chargingStationsListScreen.noLocationEmptyState.heading"
                  : undefined
              }
              contentTx={
                locationError
                  ? "chargingStationsListScreen.noLocationEmptyState.content"
                  : undefined
              }
              button={undefined}
              buttonOnPress={manualRefresh}
              imageStyle={$emptyStateImage}
              ImageProps={{ resizeMode: "contain" }}
            />
          )
        }
        ListHeaderComponent={
          <View style={$heading}>
            <Text preset="heading" tx="chargingStationsListScreen.title" />
              <View style={$toggle}>
                <Text>Distance </Text>
                <Slider
                  style={$seekBar}
                  minimumValue={2}
                  maximumValue={10}
                  step={2}
                  value={chargingStationStore.distance}
                  onValueChange= {(value) => 
                    chargingStationStore.setProp("distance", value)
                  }
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#000000"
                />
              </View>
          </View>
        }
        renderItem={({ item }) => (
          <ChargingStationCard
            key={item.UUID}
            charger={item}
            isCharging={chargingStationStore.hasCharging(item)}
            onPressCharging={() => chargingStationStore.startCharging(item)}
          />
        )}
      />
    </Screen>
  )
})

const ChargingStationCard = observer(function ChargingStationCard({
  charger,
  isCharging,
  onPressCharging,
}: {
  charger: ChargingUnit
  onPressCharging: () => void
  isCharging: boolean
}) {


  const handlePressCharging = () => {
    onPressCharging()
  }

  const handleDirectionPress = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${charger.Latitude},${charger.Longitude}`;
    const label = charger.parsedTitle;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    openLinkInBrowser(url)
  }

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onLongPress={handlePressCharging}
      HeadingComponent={
        <View style={$metadata}>
          <Text
            style={$metadataText}
            size="xxs"
          >
            {charger.AddressLine1}
          </Text>
          <Text
            style={$metadataText}
            size="xxs"
          >
            {charger.parsedUsage}
          </Text>
        </View>
      }
      content={`${charger.parsedTitle.title}`}
      RightComponent={<Button onPress={handleDirectionPress} style={$itemThumbnail} >
        <Text
            size="xxs"
            weight="medium"
            text={
              translate("chargingStationsListScreen.directions")
            }
          />
      </Button>}
      FooterComponent={
        <Button
          onPress={handlePressCharging}
          onLongPress={handlePressCharging}
          style={[$chargingButton, isCharging && $stopChargingButton]}
        >
          <Text
            size="xxs"
            weight="medium"
            text={
              isCharging
                ? translate("chargingStationsListScreen.stopChargingButton")
                : translate("chargingStationsListScreen.chargingButton")
            }
          />
        </Button>
      }
    />
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.large,
}

const $heading: ViewStyle = {
  marginBottom: spacing.medium,
}

const $item: ViewStyle = {
  padding: spacing.medium,
  marginTop: spacing.medium,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.small,
  borderRadius: 50,
  alignSelf: "flex-start",
}

const $toggle: ViewStyle = {
  marginTop: spacing.medium,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems:'center'
}

const $seekBar: ViewStyle = {
  width: 250,
  height: 60
}


const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.extraSmall,
  flexDirection: "row",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginRight: spacing.medium,
  marginBottom: spacing.extraSmall,
}

const $chargingButton: ViewStyle = {
  borderRadius: 17,
  marginTop: spacing.medium,
  justifyContent: "flex-start",
  backgroundColor: colors.palette.neutral300,
  borderColor: colors.palette.neutral300,
  paddingHorizontal: spacing.medium,
  paddingTop: spacing.micro,
  paddingBottom: 0,
  minHeight: 32,
  alignSelf: "flex-start",
}

const $stopChargingButton: ViewStyle = {
  borderColor: colors.palette.primary100,
  backgroundColor: colors.palette.primary100,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.huge,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}