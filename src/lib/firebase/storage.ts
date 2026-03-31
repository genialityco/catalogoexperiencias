import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { FirebaseError } from 'firebase/app';
import { firebaseApp } from './client';

const storage = getStorage(firebaseApp);

export const uploadExperienceImage = async (uid: string, file: File) => {
	const cleanName = file.name.replace(/[^a-zA-Z0-9.-_]/g, '_');
	const filePath = `experiences/${uid}/${Date.now()}-${cleanName}`;
	const storageRef = ref(storage, filePath);

	try {
		await uploadBytes(storageRef, file);
		const downloadUrl = await getDownloadURL(storageRef);

		return {
			filePath,
			downloadUrl,
		};
	} catch (error) {
		if (
			error instanceof FirebaseError &&
			(error.code === 'storage/unauthorized' || error.code === 'storage/forbidden')
		) {
			throw new Error(
				'STORAGE_UNAUTHORIZED: Firebase Storage devolvió 403 al subir en /experiences. Revisa que: (1) las reglas estén desplegadas en el proyecto correcto, (2) el archivo sea image/* y <5MB, (3) el bucket PUBLIC_FIREBASE_STORAGE_BUCKET corresponda al proyecto activo.'
			);
		}

		throw error;
	}
};
