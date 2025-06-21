# Dashboard per la creazione di un piano di esercizi fisici settimanale
>Creazione di un'applicazione web che consente a medici (con competenze in fisioterapia) o personal trainer di gestire piani di esercizi fisici settimanali per i propri pazienti o clienti. L'applicazione permette la registrazione e l'autenticazione sicura degli utenti, la gestione dei dati anagrafici dei pazienti, e la definizione personalizzata degli esercizi per ciascun giorno della settimana.

>Ogni esercizio è caratterizzato da informazioni come nome, descrizione, durata o numero di ripetizioni, livello di difficoltà ed eventuali note. È possibile suddividere gli esercizi per giorni della settimana e orari, oltre a salvare e modificare i piani in qualsiasi momento grazie all’integrazione con Firestore. È inoltre prevista la possibilità di aggiungere nuovi esercizi personalizzati al database.
<br>
<br>

# Login

## Descrizione 

La pagina di login rappresenta il punto di accesso  per gli utenti registrati del progetto. È sviluppata con React, utilizzando il **framework Next.js** e utilizza **Firebase Authentication** per gestire l'autenticazione tramite email e password.

---

## Funzionalità Implementate

- **Autenticazione con Firebase**: Login con email e password tramite `signInWithEmailAndPassword`.
- **Gestione degli errori**: Visualizzazione del messaggio di errore in caso di credenziali non valide.
- **Reindirizzamento post-login**: In caso di login riuscito, l'utente viene reindirizzato alla pagina `/dashboard/schede`.
- **Collegamento alla registrazione**: Link diretto, `/register/`, per accedere alla pagina di registrazione se l’utente non ha un account registrato.

---

## Tecnologie Utilizzate

- **React / Next.js**
- **TypeScript**
- **Firebase Authentication**
- **Tailwind CSS**
- **Componenti Custom (UI)**: `Input`, `Button` e `Image` sono componenti riutilizzabili per uniformare l’interfaccia.

---

## Comportamento del Componente

### Stato del Componente
- `email`: contiene l'input dell'email inserita dall'utente.
- `password`: contiene la password inserita.
- `error`: contiene l'eventuale errore generato dal login.

### Funzione Principale: `handleLogin`
- Previene il comportamento di default del form (`e.preventDefault()`).
- Chiamata a `signInWithEmailAndPassword()` con `email` e `password`.
- Se l'autenticazione va a buon fine, reindirizza alla dashboard.
- In caso contrario, aggiorna lo stato `error` per mostrare il messaggio di errore all’utente.

---

## Interfaccia Utente

La pagina è centrata verticalmente e orizzontalmente. Contiene:
- Il logo del progetto.
- Un titolo e un link per la registrazione.
- Un form con:
  - Input per email e password.
  - Messaggio di errore, se presente.
  - Pulsante di login.


---
<br>
<br>
<br>

# Registrazione 
#### `/register`

## Descrizione
La pagina di registrazione, `/page.tsx`, permette all'utente di registrarsi all'applicazione, utilizzando un componente di supporto `/RegisterComponent.tsx`.

---
#### `/RegisterComponent.tsx`

## Funzionalità Implementate

- **Registrazione tramite Firebase**: Crea un nuovo utente usando `createUserWithEmailAndPassword`.
- **Salvataggio del profilo utente su Firestore**: Dopo la creazione dell'utente, vengono salvati `nome`, `cognome` e la data di creazione nel percorso `users/{uid}/users-fitney/profile`.
- **Gestione errori**: In caso di problemi nella registrazione, viene mostrato un messaggio di errore all’utente.
- **Reindirizzamento post-registrazione**: Dopo essersi registrato, l'utente viene reindirizzato alla pagina di login (`/login`).
- **Collegamento alla pagina di login**: Per gli utenti già registrati.

---

## Tecnologie Utilizzate

- **React / Next.js**
- **TypeScript**
- **Firebase Authentication**
- **Firebase Firestore**
- **Tailwind CSS**
- **Componenti UI personalizzati**: `Input`, `Button`, `Image`.

---

## Struttura dello Stato

- `name`, `surname`, `email`, `password`: input che vengono gestiti tramite l'hook fornito da react: `useState`.
- `error`: stato per visualizzare eventuali errori a schermo.

---

## Logica del Componente

### `handleRegister`

1. Previene il comportamento predefinito del form.
2. Crea l’utente con `createUserWithEmailAndPassword`.
3. Recupera l’UID dell’utente autenticato.
4. Crea un documento Firestore nel percorso `users/{uid}/users-fitney/profile` con nome, cognome e timestamp.
5. Reindirizza alla pagina di login.
6. In caso di errore, lo salva nello stato per mostrarlo all'utente.

---

## Interfaccia Utente

La UI è centrata nello schermo e include:

- Logo del progetto.
- Titolo "Registrati" con link per chi ha già un account.
- Form con:
  - Input divisi tra `nome` e `cognome`.
  - Email e password.
  - Messaggio di errore.
  - Pulsante per inviare i dati.

---

<br>
<br>
<br>

# Pagina Gestione Schede - Fitney Dashboard

## Descrizione

La pagina `/dashboard/schede` è il cuore della dashboard utente all'interno del progetto **Fitney**, dedicata alla gestione delle schede di allenamento dei clienti. Una volta autenticato, il Personal Trainer può visualizzare le schede esistenti e accedere a una modale per aggiungerne di nuove,modificarle oppure eliminarle.

---

## Funzionalità Implementate

- **Controllo autenticazione Firebase**: Se l’utente non è autenticato, viene reindirizzato alla pagina di login (`/login`).
- **Recupero dinamico del nome utente**: Viene richiamata una funzione asincrona per mostrare un saluto personalizzato.
- **Modale per aggiunta schede**: È presente un pulsante per aprire una modale (`AddSchedule`) dove inserire nuove schede.
- **Visualizzazione elenco schede**: Il componente `SchedeSelection` si occupa di visualizzare le schede esistenti.
- **Sidebar persistente**: La `Sidebar` consente di navigare tra le sezioni dell’applicazione.

---


## Struttura dello Stato

- `nome`: Nome dell’utente, recuperato da Firestore.
- `loading`: Stato di caricamento durante il recupero del nome.
- `showModal`: Booleano che controlla l'apertura della modale per aggiungere una nuova scheda.

---

## Logica dei `useEffect`

### 1. Controllo autenticazione
```tsx
useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
    }
  });
  return () => unsub();
}, [router]);
```
### 2. Recupero del nome
```tsx
useEffect(() => {
  getUserName()
    .then((userName) => setNome(userName))
    .catch((error) => {
      console.error("Errore nel recupero del nome:", error);
      setNome("");
    })
    .finally(() => setLoading(false));
}, []);
```

---
### `/AddSchedule.tsx`

> Componente per la creazione di una nuova scheda di allenamento associata ad un cliente.

#### Descrizione

Questo componente visualizza un modale che permette al personal trainer di:

- Selezionare un cliente associato.
- Selezionare uno o più esercizi personalizzati.
- Scegliere un giorno della settimana.
- Inserire una nota.
- Creare e salvare una nuova scheda di allenamento nel database Firebase (Firestore).

---

##  Stato (useState)

| Stato               | Tipo         | Descrizione                                 |
|---------------------|--------------|---------------------------------------------|
| `user`              | `User \| null` | Utente attualmente autenticato              |
| `clients`           | `any[]`      | Lista dei clienti associati al trainer      |
| `exercises`         | `any[]`      | Lista degli esercizi creati dal trainer     |
| `selectedClient`    | `string`     | ID del cliente selezionato                  |
| `selectedExercises` | `string[]`   | Lista degli ID degli esercizi selezionati   |
| `note`              | `string`     | Nota associata alla scheda                  |
| `day`               | `string`     | Giorno della settimana selezionato          |

---

## Effetti (useEffect)

- Recupera l'utente autenticato (`onAuthStateChanged`)
- Recupera gli esercizi filtrati per `user.uid`
- Recupera i clienti filtrati per `trainerId`

---

## Funzioni principali

### `handleExerciseToggle(id: string)`

Aggiunge o rimuove un esercizio dalla lista degli esercizi selezionati.

---

### `createSchedule()`

Salva la nuova scheda in Firestore (`schedules`) con i seguenti campi:

- `clientId`
- `exercises`
- `note`
- `day`
- `trainerId`

Se l'utente non è autenticato, viene mostrato un alert.

### `/SchedeSelection.tsx`

> Componente che consente ai **personal trainer** di visualizzare, filtrare, modificare e eliminare le **schede di allenamento**. In particolare, utilizza **Firebase Firestore** per il recupero e per la modifica dei dati.

---
## Funzionalità principali

- Recupero delle schede associate all’utente loggato (come client o trainer).
- Visualizzazione degli esercizi e dettagli associati.
- Filtraggio per giorno della settimana e per nome cliente.
- Modifica e salvataggio delle schede.
- Eliminazione delle schede con conferma.
- Visualizzazione in modal dei dettagli scheda.

---

## Funzioni principali

#### `fetchSchedules()`
```ts
const fetchSchedules = = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const qClient = query(
        collection(db, "schedules"),
        where("clientId", "==", user.uid)
      );

      const qTrainer = query(
        collection(db, "schedules"),
        where("trainerId", "==", user.uid)
      );

      const [clientSnap, trainerSnap] = await Promise.all([
        getDocs(qClient),
        getDocs(qTrainer),
      ]);

      const clientSchedules = clientSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const trainerSchedules = trainerSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const allSchedules = [...clientSchedules, ...trainerSchedules];
      const uniqueSchedules = Array.from(
        new Map(allSchedules.map((s) => [s.id, s])).values()
      );

      setSchedules(uniqueSchedules);
    };
```
Recupera tutte le schede dal database Firebase relative al `current.user`, quindi all'utente corrente.

In particolare, popola lo state `schedules` con i documenti trovati nella collezione `schedules`.

#### `fetchExercises()`
```ts
const fetchExercises = async () => {
      const querySnapshot = await getDocs(collection(db, "exercises"));
      const exercisesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllExercises(exercisesArray);
    };
```
Recupera tutti gli esercizi disponibili nella collezione `exercises`, popola lo state `allExercises`.

#### `fetchClients()`
```ts
const fetchClients = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const q = query(
        collection(db, "clients"),
        where("trainerId", "==", user.uid)
      );

      const clientsSnap = await getDocs(q);
      const clientsArray = clientsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllClients(clientsArray);
    };
```
Recupera la lista dei clienti assegnati al personal trainer attualmente loggato; popola lo state `allClients`.

#### `handleDelete()`
```ts
const handleDelete = async (id: string) => {
    if (!confirm("Vuoi davvero eliminare questa scheda?")) return;
    try {
      await deleteDoc(doc(db, "schedules", id));
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error(error);
    }
  };
```
Elimina una specifica scheda da Firebase.
- Parametri:
    - `id`: l'ID della scheda da eliminare.

Dopo aver rimosso la scheda, aggiorna lo state `schedules`, in modo tale da riflettere correttamente le modifiche.

#### `handleEditClick()`
```ts
const handleEditClick = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      note: schedule.note || "",
      day: schedule.day || "",
      exercises: schedule.exercises || [],
    });
    setModalOpen(true);
  };
```
Apre il modale per la modifica della scheda selezionata.
Popola  `formData` con i dati della scheda selezionata.

#### `handleSave()`
```ts
const handleSave = async () => {
    if (!editingSchedule) return;
    try {
      const docRef = doc(db, "schedules", editingSchedule.id);
      await updateDoc(docRef, formData);

      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingSchedule.id ? { ...s, ...formData } : s
        )
      );

      setModalOpen(false);
      setEditingSchedule(null);
    } catch (error) {
      console.error(error);
    }
  };
```
Salva le modifiche fatte alla scheda e aggiorna il documento in Firestore.

> Per poter visualizzare i clienti in base al giorno della settimana oppure in base al nome, è stato implementato questo filtro: <br>
```ts
const filteredSchedules = schedules.filter((s) => {
    const client = allClients.find((c) => c.id === s.clientId);
    if (!client) return false; // se non ha ancora caricato il client, escludi

    const fullName = `${client.nome} ${client.cognome}`.toLowerCase();
    const matchesDay = selectedDay === "Tutti" || s.day === selectedDay;
    const matchesName = fullName.includes(searchName.toLowerCase());

    return matchesDay && matchesName;
  });
```

## Pagina Clienti

> `/dashboard/clienti`<br>
Questa pagina permette di **selezionare,aggiungere ed eliminare** i clienti da parte del personal trainer loggato.
<br>
<br>
---

#### `/clienti/addClient.tsx`
> Questa pagina permette di **aggiungere un nuovo cliente a una collezione Firebase Firestore** tramite un modale.

#### Salvataggio su Firestore
I dati vengono salvati nella collezione `clients`, con il campo `trainerId`:<br>
```ts
await addDoc(collection(db, "clients"), {
  nome,
  cognome,
  età: Number(età),
  limitazioni,
  trainerId: user?.uid,
});
```
<br>
<br>

---
## Pagina Esercizi
> Questa pagina, `/dashboard/esercizi/Esercizi.tsx`, è dedicata alla **visualizzazione e modifica** degli esercizi.

In particolare l'aggiunta di esercizi è implementata in `/esercizi/addExercise.tsx`.
<br>
<br>
Grazie a questo codice:
```ts
try {
      await addDoc(collection(db, "exercises"), {
        nome,
        difficoltà,
        note,
        ripetizioni,
        userId: user.uid,
      });
      onClose();
    } catch (e: any) {
      setError("Errore durante il salvataggio: " + e.message);
    }
  };
```
Possiamo aggiungere alla collezione exercises un nuovo documento che rappresenta il nostro nuovo esercizio che comprenderà il nome dell'esercizio, la difficlotà, note aggiuntive, il numero di ripetizione e l'ID dell'utente loggato, quindi del personal trainer.

#### `/esercizi/ExerciseSelection.tsx`
Questa pagina permette agli utenti autenticati di **visualizzare,modificare ed eliminare** degli esercizi salvati nel database Firestore.

> Recupero degli esercizi
```ts
const q = query(
          collection(db, "exercises"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
```
Tramite questa query al database, db, alla collezione `exercises` andiamo a filtrare tutti gli esercizi, ottenendo solo quelli che hanno uno userId uguale user.uid dell'utente corrente.

> Eliminazione e Modifica degli esercizi
```ts
try {
      await deleteDoc(doc(db, "exercises", id));
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };

  const handleEditClick = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      nome: exercise.nome,
      ripetizioni: exercise.ripetizioni,
      difficoltà: exercise.difficoltà,
      note: exercise.note,
    });
    setModalOpen(true);
  };
```

# Sign Out
> Questa pagina è dedicata al Sign Out dell'utente utilizzando una funzione fornita da Firebase, che elimina i cookie relativi alla sessione dell'utente, garantendo una maggiore sicurezza.

Il codice relativo è:

```ts
 const router = useRouter();
    
    const handleSignOut = async () => {
        try{
            await signOut(auth);
            router.push("/login")
        }catch(err: any){
            console.log(err.message);
        }
    }
```
