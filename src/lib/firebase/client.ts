import { getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
	authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
	databaseURL: import.meta.env.PUBLIC_FIREBASE_DATABASE_URL,
	projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
	measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasRequiredFirebaseConfig =
	Boolean(firebaseConfig.apiKey) &&
	Boolean(firebaseConfig.projectId) &&
	Boolean(firebaseConfig.storageBucket);

if (!hasRequiredFirebaseConfig) {
	console.error(
		'[Firebase] Faltan variables PUBLIC_FIREBASE_* requeridas para App/Firestore/Storage. Revisa tu archivo .env.'
	);
}

export const firebaseApp = getApps().length
	? getApps()[0]
	: initializeApp(firebaseConfig);
