# I Spy Shopper

I Spy Shopper is a mobile grocery shopping application with added focus on accessibility for the blind. See [our project description](https://github.com/SCCapstone/I_Spy_A-Eye/wiki/Project-Description) for additional information.

## External Requirements
In order to build and emulate this project, you first have to install:
- [Node.js](https://nodejs.org/en/)
- [Android Studio](https://developer.android.com/studio)
 
## Setup
With these installed, use one of the following commands after pulling this repo to build the app:
```
npm install --global expo-cli    // if you haven't installed Expo prior, run this command
npm install                      // if you've installed Expo before, simply run this command for set-up
```
## Running
To set up emulation using Android Studio, follow [this straightforward guide](https://docs.expo.dev/workflow/android-studio-emulator/) in the Expo documentation. Make sure to allocate enough memory in your emulator for installing both Expo and the application itself, otherwise you will encounter issues. Once set up, you can run this app using the following command:
```
expo start --android            // starts the app with a specific emulator on your device
```
## Deployment

## Testing
### - General Set Up -
The testing technologies used require React Native CLI and a properly set up Android development enviroment. Running the command 
```
npm install
```
will handle installing the correct version React Native, which has its CLI built-in, in addition to other required packages to run and test the application. To ensure your environment/emulator is set up correctly, follow [the React Native Environment Setup guide](https://reactnative.dev/docs/next/environment-setup).

### - Unit Testing -
Unit testing, handled by [Jest](https://jestjs.io/), can be done nearly out of the box once the repository is cloned and the general set up is done. After using
```
npm install                     # if you haven't installed the packages already
```
to obtain the necessary packages for the application (including the testing technologies), you can run the following command in the central directory to run the unit tests suite:
```
npm test --findRelatedTests __unit__
```

### - End-to-end Testing -
End-to-end testing, handled through [Detox](https://wix.github.io/Detox/), requires additional set-up. First, ensure that the general set up has been done prior. Then you need to create a debug build for the application by using the following command in the **/android/** directory. This will usually take a few minutes the first time its created:
```
cd ./android                        # if not already in the android directory
./gradlew assembleRelease assembleAndroidTest -DtestBuildType=debug
```

 Once the build is complete, follow [Step 3 of the Detox Project Setup guide](https://wix.github.io/Detox/docs/introduction/project-setup#step-3-device-configs) to configure the project for your desired Android emulator or Android device. Once your device/emulator is properly set up, you just need to run the end-to-end testing. Run the command
```
npx react-native run-android
```
to start up the Metro server; leave this running until you are done testing. Afterwards, in another terminal, use the following command to run the end-to-end testing suite:
```
detox test --configuration android.emu.debug
```

### - Notes -
The unit tests can be found in the **\_\_unit\_\_** directory, and the end-to-end tests can be found in the **e2e** directory. These tests require a sufficient .env file to be present in the top level of the directory; the application itself can't run without it, so if it's not present, the tests can't run either. The output of both unit and end-to-end testing will display in the terminal the tests are conducted in.

## Testing Technologies
 - [Jest (Unit Testing)](https://jestjs.io/)
 - [Detox (End-to-end Testing)](https://wix.github.io/Detox/)
## Running Tests

## Authors
- Claude G. Reid III , cgreid@email.sc.edu
- Jackson Sevy       , jsevy@email.sc.edu
- Zack Young         , ztyoung@email.sc.edu
- Mark Valentino     , markav@email.sc.edu
- Danny Higgins      , ddh1@email.sc.edu

