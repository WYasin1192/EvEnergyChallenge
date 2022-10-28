# Welcome to Ev.energy Coding Challenge!

[![CircleCI](https://circleci.com/gh/infinitered/ignite.svg?style=svg)](https://circleci.com/gh/infinitered/ignite)



This is based on react native expo

Currently includes:

- React Native
- React Navigation
- MobX State Tree
- TypeScript

### ./app directory

Included in an Ignite boilerplate project is the `app` directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the `app` directory looks similar to the following:

```
app
├── components
├── config
├── i18n
├── models
├── navigators
├── screens
├── services
├── theme
├── utils
├── app.tsx
```

**Description**
This app fetches a list of charging stations based on user locations and displays it in a list. From the list, you can click to start charging or get directions.
Start charging starts an API call to send the request to ev energy backend.
Directions button options map with the lat lng filled in so the user can get to the charging station.
apisauce is used for API call 
mobx to pass the data between components and maintain state. 

**Install**
After cloning the project `yarn install` on the root directory.

**Launch**
Use `npx expo run:android` to launch android project
Use `npx expo run:ios` to launch iOS project

**Test**
Jest is used this project to run tests.
Use `npx jest --watchAll` to run test.

**Things to Improve**
Get optimized SVG icons for app or png in different sizes
Clear back stack of navigation
Accessibility testing and improvement
Add manual enter location option.
Allow users to pick and charge on individual connections at the station location.
Handle charging API failure status better for user ease
Add a charging station detail page so users can get more details and select individual charging points from the list available.