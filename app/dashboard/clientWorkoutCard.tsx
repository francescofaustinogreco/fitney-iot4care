import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";

type Exercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
};

type WorkoutFormModalProps = {
  onClose: () => void;
};

export default function WorkoutFormModal({ onClose }: WorkoutFormModalProps) {
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: "", sets: "", reps: "", rest: "" },
  ]);

  type ExerciseField = keyof Exercise;

  const handleChangeExercise = (index: number, field: ExerciseField, value: string) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", rest: "" }]);
  };

  const saveWorkout = async () => {
    try {
      await addDoc(collection(db, "workout_plans"), {
        title,
        exercises,
      });
      onClose();
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Crea Scheda Allenamento</h2>

        <input
          type="text"
          placeholder="Titolo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mb-4 w-full"
        />

        {exercises.map((ex, i) => (
          <div key={i} className="mb-2 space-y-1">
            <input
              type="text"
              placeholder="Nome esercizio"
              value={ex.name}
              onChange={(e) => handleChangeExercise(i, "name", e.target.value)}
              className="border p-1 w-full"
            />
            <input
              type="number"
              placeholder="Serie"
              value={ex.sets}
              onChange={(e) => handleChangeExercise(i, "sets", e.target.value)}
              className="border p-1 w-full"
            />
            <input
              type="number"
              placeholder="Ripetizioni"
              value={ex.reps}
              onChange={(e) => handleChangeExercise(i, "reps", e.target.value)}
              className="border p-1 w-full"
            />
            <input
              type="text"
              placeholder="Recupero (es. 90s)"
              value={ex.rest}
              onChange={(e) => handleChangeExercise(i, "rest", e.target.value)}
              className="border p-1 w-full"
            />
          </div>
        ))}

        <button onClick={addExercise} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">
          + Aggiungi esercizio
        </button>

        <div className="mt-4 flex justify-between">
          <button onClick={onClose} className="text-gray-500">Annulla</button>
          <button onClick={saveWorkout} className="bg-green-600 text-white px-4 py-2 rounded">
            Salva scheda
          </button>
        </div>
      </div>
    </div>
  );
}
