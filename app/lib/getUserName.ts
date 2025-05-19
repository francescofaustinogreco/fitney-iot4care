import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

export async function getUserName(): Promise<string> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();

      if (!user) {
        reject('Utente non autenticato');
        return;
      }

      try {
        // Recupera tutti i documenti nella subcollection
        const subCollectionRef = collection(db, 'users', user.uid, 'users-fitney');
        const snapshot = await getDocs(subCollectionRef);

        if (snapshot.empty) {
          reject('Nessun documento trovato in users-fitney');
          return;
        }

        // Prende il primo documento
        const docData = snapshot.docs[0].data();
        resolve(docData.name || 'Sconosciuto');
      } catch (error) {
        reject(error);
      }
    });
  });
}
