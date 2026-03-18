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
				'STORAGE_UNAUTHORIZED: Firebase Storage no permite subir imágenes en /experiences. La experiencia puede guardarse sin imagen o debes ajustar las reglas de Storage.'
			);
		}

		throw error;
	}
};
