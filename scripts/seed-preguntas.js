import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

const areas = [
  {
    id: "matematicas",
    nombre: "Matemáticas",
    descripcion: "Razonamiento cuantitativo y resolución de problemas.",
    numPreguntas: 6,
    tiempoLimite: 20,
  },
  {
    id: "lectura_critica",
    nombre: "Lectura Crítica",
    descripcion: "Comprensión e interpretación de textos.",
    numPreguntas: 6,
    tiempoLimite: 20,
  },
  {
    id: "ciencias_naturales",
    nombre: "Ciencias Naturales",
    descripcion: "Biología, física y química.",
    numPreguntas: 6,
    tiempoLimite: 20,
  },
  {
    id: "sociales_ciudadanas",
    nombre: "Ciencias Sociales y Ciudadanas",
    descripcion: "Historia, geografía y competencias ciudadanas.",
    numPreguntas: 6,
    tiempoLimite: 20,
  },
  {
    id: "ingles",
    nombre: "Inglés",
    descripcion: "Comprensión lectora y gramática en inglés.",
    numPreguntas: 6,
    tiempoLimite: 15,
  },
];

const preguntas = [
  // ================= MATEMÁTICAS =================
  {
    areaId: "matematicas",
    dificultad: "baja",
    enunciado: "¿Cuánto es 7 × 8?",
    opciones: [
      { id: "A", text: "54" },
      { id: "B", text: "56" },
      { id: "C", text: "58" },
      { id: "D", text: "64" },
    ],
    respuestaCorrecta: "B",
    explicacion: "7 × 8 = 56.",
  },
  {
    areaId: "matematicas",
    dificultad: "media",
    enunciado: "¿Cuál es el valor de x en 2x + 6 = 14?",
    opciones: [
      { id: "A", text: "2" },
      { id: "B", text: "3" },
      { id: "C", text: "4" },
      { id: "D", text: "5" },
    ],
    respuestaCorrecta: "C",
    explicacion: "2x = 8 → x = 4.",
  },
  {
    areaId: "matematicas",
    dificultad: "alta",
    enunciado: "¿Cuál es el área de un triángulo de base 10 y altura 6?",
    opciones: [
      { id: "A", text: "30" },
      { id: "B", text: "60" },
      { id: "C", text: "16" },
      { id: "D", text: "20" },
    ],
    respuestaCorrecta: "A",
    explicacion: "Área = (base × altura) / 2 = 30.",
  },

  // ================= LECTURA CRÍTICA =================
  {
    areaId: "lectura_critica",
    dificultad: "baja",
    enunciado: "¿Cuál es la idea principal de un texto?",
    opciones: [
      { id: "A", text: "Un detalle irrelevante" },
      { id: "B", text: "El tema central del texto" },
      { id: "C", text: "El título únicamente" },
      { id: "D", text: "Una opinión del lector" },
    ],
    respuestaCorrecta: "B",
    explicacion: "La idea principal resume el contenido esencial.",
  },
  {
    areaId: "lectura_critica",
    dificultad: "media",
    enunciado: "Un sinónimo de 'rápido' es:",
    opciones: [
      { id: "A", text: "Lento" },
      { id: "B", text: "Veloz" },
      { id: "C", text: "Pesado" },
      { id: "D", text: "Débil" },
    ],
    respuestaCorrecta: "B",
    explicacion: "Veloz significa rápido.",
  },
  {
    areaId: "lectura_critica",
    dificultad: "alta",
    enunciado: "Identificar el tono de un texto implica:",
    opciones: [
      { id: "A", text: "Contar palabras" },
      { id: "B", text: "Reconocer la actitud del autor" },
      { id: "C", text: "Traducir el texto" },
      { id: "D", text: "Eliminar ideas" },
    ],
    respuestaCorrecta: "B",
    explicacion: "El tono refleja la actitud del autor.",
  },

  // ================= CIENCIAS NATURALES =================
  {
    areaId: "ciencias_naturales",
    dificultad: "baja",
    enunciado: "¿Qué planeta es conocido como el planeta rojo?",
    opciones: [
      { id: "A", text: "Venus" },
      { id: "B", text: "Marte" },
      { id: "C", text: "Júpiter" },
      { id: "D", text: "Saturno" },
    ],
    respuestaCorrecta: "B",
    explicacion: "Marte es llamado el planeta rojo.",
  },
  {
    areaId: "ciencias_naturales",
    dificultad: "media",
    enunciado: "¿Qué órgano bombea la sangre?",
    opciones: [
      { id: "A", text: "Pulmón" },
      { id: "B", text: "Hígado" },
      { id: "C", text: "Corazón" },
      { id: "D", text: "Cerebro" },
    ],
    respuestaCorrecta: "C",
    explicacion: "El corazón bombea la sangre.",
  },
  {
    areaId: "ciencias_naturales",
    dificultad: "alta",
    enunciado: "¿Qué tipo de energía es la del movimiento?",
    opciones: [
      { id: "A", text: "Potencial" },
      { id: "B", text: "Cinética" },
      { id: "C", text: "Química" },
      { id: "D", text: "Térmica" },
    ],
    respuestaCorrecta: "B",
    explicacion: "La energía del movimiento es cinética.",
  },

  // ================= SOCIALES =================
  {
    areaId: "sociales_ciudadanas",
    dificultad: "baja",
    enunciado: "¿Cuál es la capital de Colombia?",
    opciones: [
      { id: "A", text: "Medellín" },
      { id: "B", text: "Cali" },
      { id: "C", text: "Bogotá" },
      { id: "D", text: "Cartagena" },
    ],
    respuestaCorrecta: "C",
    explicacion: "Bogotá es la capital.",
  },
  {
    areaId: "sociales_ciudadanas",
    dificultad: "media",
    enunciado: "¿Qué es la democracia?",
    opciones: [
      { id: "A", text: "Gobierno de una persona" },
      { id: "B", text: "Gobierno del pueblo" },
      { id: "C", text: "Gobierno militar" },
      { id: "D", text: "Gobierno religioso" },
    ],
    respuestaCorrecta: "B",
    explicacion: "Democracia significa gobierno del pueblo.",
  },
  {
    areaId: "sociales_ciudadanas",
    dificultad: "alta",
    enunciado: "¿Qué es la Constitución?",
    opciones: [
      { id: "A", text: "Una ley menor" },
      { id: "B", text: "La ley principal de un país" },
      { id: "C", text: "Un decreto" },
      { id: "D", text: "Un reglamento escolar" },
    ],
    respuestaCorrecta: "B",
    explicacion: "Es la norma suprema.",
  },

  // ================= INGLÉS =================
  {
    areaId: "ingles",
    dificultad: "baja",
    enunciado: "Translate: 'House'",
    opciones: [
      { id: "A", text: "Casa" },
      { id: "B", text: "Carro" },
      { id: "C", text: "Libro" },
      { id: "D", text: "Mesa" },
    ],
    respuestaCorrecta: "A",
    explicacion: "'House' significa casa.",
  },
  {
    areaId: "ingles",
    dificultad: "media",
    enunciado: "Choose correct: 'They ___ playing.'",
    opciones: [
      { id: "A", text: "is" },
      { id: "B", text: "are" },
      { id: "C", text: "am" },
      { id: "D", text: "be" },
    ],
    respuestaCorrecta: "B",
    explicacion: "Plural → are.",
  },
  {
    areaId: "ingles",
    dificultad: "alta",
    enunciado: "Choose correct future form:",
    opciones: [
      { id: "A", text: "I go tomorrow" },
      { id: "B", text: "I went tomorrow" },
      { id: "C", text: "I will go tomorrow" },
      { id: "D", text: "I going tomorrow" },
    ],
    respuestaCorrecta: "C",
    explicacion: "Future → will go.",
  },
];

const logros = [
  {
    id: "primer_quiz",
    nombre: "Primer paso",
    descripcion: "Completá tu primer cuestionario o simulacro.",
    criterio: "primer_quiz",
  },
  {
    id: "cinco_simulacros",
    nombre: "Estudiante dedicado",
    descripcion: "Completá 5 simulacros o cuestionarios.",
    criterio: "cinco_simulacros",
  },
  {
    id: "diez_simulacros",
    nombre: "Maestro de las áreas",
    descripcion: "Completá 10 simulacros o cuestionarios.",
    criterio: "diez_simulacros",
  },
];

async function seed() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Faltan credenciales");
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);

  for (const area of areas) {
    await setDoc(doc(db, "areas", area.id), area);
  }

  for (const [index, pregunta] of preguntas.entries()) {
    await setDoc(doc(db, "preguntas", `seed_${index + 1}`), pregunta);
  }

  for (const logro of logros) {
    await setDoc(doc(db, "logros", logro.id), logro);
  }

  console.log("Seed completo");
  process.exit(0);
}

seed().catch(console.error);
