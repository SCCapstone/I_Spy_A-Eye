# I Spy Shopper

I Spy Shopper is a mobile grocery shopping application with added focus on accessibility for the blind. See [our project description](https://github.com/SCCapstone/I_Spy_A-Eye/wiki/Project-Description) for additional information.

## External Requirements
In order to build and emulate this project, you first have to install:
- [Node.js](https://nodejs.org/en/)
- [Android Studio](https://developer.android.com/studio)
  
With these installed, use one of the following commands after pulling this repo to build the app:
```
npm install --global expo-cli    // if you haven't installed Expo prior, run this command
npm install                      // if you've installed Expo before, simply run this command for set-up
```
To set up emulation using Android Studio, follow [this straightforward guide](https://docs.expo.dev/workflow/android-studio-emulator/) in the Expo documentation. Make sure to allocate enough memory in your emulator for installing both Expo and the application itself, otherwise you will encounter issues. Once set up, you can run this app using the following command:
```
expo start --android            // starts the app with a specific emulator on your device
```