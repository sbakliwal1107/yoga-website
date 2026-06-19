// React Native Firebase initializes itself from the native config files
// (google-services.json on Android, GoogleService-Info.plist on iOS).
// You don't pass any config object here — just re-export the modules so the
// rest of the app has a single import point.

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

export { auth, firestore, storage };

export const usersCol = () => firestore().collection("users");
export const paymentsCol = () => firestore().collection("payments");
export const reviewsCol = () => firestore().collection("reviews");
export const contactsCol = () => firestore().collection("contacts");
