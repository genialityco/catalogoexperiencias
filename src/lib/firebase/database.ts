import { FirebaseError } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { firebaseApp } from "./client";

export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

const db = getFirestore(firebaseApp);

const toMillis = (value: unknown): number | undefined => {
  if (value instanceof Timestamp) {
    return value.toMillis();
  }

  if (typeof value === 'number') {
    return value;
  }

  return undefined;
};

export const createLead = async (payload: LeadPayload) => {
  const newLeadRef = await addDoc(collection(db, 'leads'), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  return newLeadRef.id;
};

export interface ClientLead extends LeadPayload {
  id: string;
  createdAt?: number;
}

export interface ExperiencePayload {
  uid: string;
  experiencia: string;
  descripcionDetallada: string;
  pitchComercial: string;
  tecnologia: string;
  objetivo: string;
  costo: string;
  visible: boolean;
  image?: string;
  secondImage?: string; // Nueva propiedad para la segunda imagen
}

export interface ExperienceItem extends ExperiencePayload {
  createdAt?: number;
}

const handleExperiencePermissionError = (error: unknown): never => {
  if (error instanceof FirebaseError && error.code === 'permission-denied') {
    throw new Error(
      'Firebase rechazó la operación en experiences. Revisa tus reglas de Firestore para permitir create/update/delete en experiences/{uid} (o implementa auth en /admin).'
    );
  }

  throw error;
};

export const getLeads = async (): Promise<ClientLead[]> => {
  const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(leadsQuery);

  return snapshot.docs.map((leadDoc) => {
    const lead = leadDoc.data() as Omit<ClientLead, 'id' | 'createdAt'> & {
      createdAt?: Timestamp | number;
    };

    return {
      id: leadDoc.id,
      ...lead,
      createdAt: toMillis(lead.createdAt),
    };
  });
};

export const createExperience = async (payload: ExperiencePayload) => {
  const experienceRef = doc(db, 'experiences', payload.uid);

  try {
    await setDoc(experienceRef, {
      ...payload,
      visible: Boolean(payload.visible),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleExperiencePermissionError(error);
  }

  return payload.uid;
};

export const updateExperience = async (
  uid: string,
  payload: Omit<ExperiencePayload, 'uid'>
) => {
  const experienceRef = doc(db, 'experiences', uid);

  try {
    await updateDoc(experienceRef, {
      ...payload,
      visible: Boolean(payload.visible),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleExperiencePermissionError(error);
  }

  return uid;
};

export const toggleExperienceVisibility = async (uid: string, visible: boolean) => {
  const experienceRef = doc(db, 'experiences', uid);

  try {
    await updateDoc(experienceRef, {
      visible: Boolean(visible),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleExperiencePermissionError(error);
  }

  return uid;
};

export const deleteExperience = async (uid: string) => {
  const experienceRef = doc(db, 'experiences', uid);

  try {
    await deleteDoc(experienceRef);
  } catch (error) {
    handleExperiencePermissionError(error);
  }

  return uid;
};

export const getExperiences = async (): Promise<ExperienceItem[]> => {
  const experiencesQuery = query(
    collection(db, 'experiences'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(experiencesQuery);

  return snapshot.docs.map((experienceDoc) => {
    const experience = experienceDoc.data() as ExperienceItem & {
      createdAt?: Timestamp | number;
    };

    return {
      ...experience,
      uid: experience.uid || experienceDoc.id,
      createdAt: toMillis(experience.createdAt),
    };
  });
};
