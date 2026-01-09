import { db } from '@/config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

export interface Project {
  id: string;
  userId: string;
  title: string;
  status: 'in_progress' | 'completed';
  book_metadata: any;
  outline: any[];
  characters: any[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  progress: number; // 0-100
}

export class ProjectService {
  private static COLLECTION = 'projects';

  static async createProject(userId: string, projectData: any): Promise<string> {
    const docRef = await addDoc(collection(db, this.COLLECTION), {
      userId,
      ...projectData,
      status: 'in_progress',
      progress: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  static async getUserProjects(userId: string): Promise<Project[]> {
    const q = query(
      collection(db, this.COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        completedAt: data.completedAt?.toDate(),
      } as Project;
    });
  }

  static async getProject(projectId: string): Promise<Project | null> {
    const docRef = doc(db, this.COLLECTION, projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        completedAt: data.completedAt?.toDate(),
      } as Project;
    }

    return null;
  }

  static async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    const docRef = doc(db, this.COLLECTION, projectId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  static async deleteProject(projectId: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION, projectId);
    await deleteDoc(docRef);
  }

  static async markAsCompleted(projectId: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION, projectId);
    await updateDoc(docRef, {
      status: 'completed',
      completedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  static calculateProgress(outline: any[]): number {
    if (!outline || outline.length === 0) return 0;

    const completedChapters = outline.filter(
      (chapter) => chapter.status === 'completed' || chapter.status === 'validated'
    ).length;

    return Math.round((completedChapters / outline.length) * 100);
  }
}
