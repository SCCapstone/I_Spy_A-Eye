import { firebaseAuth } from "../utils/firebase";
require("firebase/auth");

/**
 * Function to de authorize users through Firebase. This function is here
 * so that it doesn't conflict with the Settings Screen's Firestore 
 * actions. The signOut function in the settings screen calls this function.
 */
function deAuthUser() {
  firebaseAuth
    .signOut()
    .catch((error) => alert(error.message));
}

export { deAuthUser };
