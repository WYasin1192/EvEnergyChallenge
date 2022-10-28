const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back"
  },
  welcomeScreen: {
    postscript:
      "Before we can we need to get location permission for this application to work properly.",
    readyForLaunch: "Welcome to EvEnergy tech test!",
    exciting: "(ohh, this is exciting!)",
    letsGo: "Let's go!", 
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack", 
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  demoNavigator: {
    componentsTab: "Components",
    debugTab: "Debug",
    communityTab: "Community",
    podcastListTab: "Podcast",
  },
  chargingStationsListScreen: {
    title: "Ev Energy Charging Stations",
    chargingButton: "Start Charging",
    stopChargingButton: "Stop Charging",
    directions: "Direction",
    noLocationEmptyState: {
      heading: "Location Error",
      content:
        "We cannot fetch charging stations near you without your location. Please manually grant location permission.",
    },
  },
}

export default en
export type Translations = typeof en
