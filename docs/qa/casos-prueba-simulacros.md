# QA – Casos de Prueba Simulacros

Basado en ERS – Sección 3.1.2 (Evaluación)  
Requisitos cubiertos: RF-006, RF-007, RF-008, RF-009

---

## 🧪 Caso 1: Selección de área y carga de preguntas

**Qué se hace:**

1. Iniciar sesión como estudiante.
2. Ir a la sección de práctica/simulacros.
3. Seleccionar cada una de las 5 áreas disponibles (una por una).

**Qué se espera:**

- Cada área debe cargar preguntas reales desde Firestore.
- No deben mostrarse listas vacías.
- No debe haber errores en consola.

**Resultado real:**

- Resultado:
- Observaciones:

---

## 🧪 Caso 2: Simulacro completo con todas las áreas

**Qué se hace:**

1. Iniciar un simulacro completo.
2. Verificar las preguntas incluidas.

**Qué se espera:**

- El simulacro debe incluir preguntas de las 5 áreas.
- No debe permitir iniciar si falta alguna área.
- No debe haber opción para omitir áreas.

**Resultado real:**

- Resultado:
- Observaciones:

---

## 🧪 Caso 3: Temporizador llega a cero (auto-finalización)

**Qué se hace:**

1. Iniciar un simulacro.
2. No responder nada o esperar hasta que el tiempo termine.

**Qué se espera:**

- El simulacro se finaliza automáticamente.
- Se redirige a la pantalla de resultados.
- No se pierde la información del intento.

**Resultado real:**

- Resultado:
- Observaciones:

---

## 🧪 Caso 4: Cambio de respuesta

**Qué se hace:**

1. Iniciar un simulacro.
2. Responder una pregunta.
3. Cambiar la respuesta antes de finalizar.

**Qué se espera:**

- La respuesta se actualiza correctamente.
- Solo se guarda la última selección.
- No se duplican respuestas en la base de datos.

**Resultado real:**

- Resultado:
- Observaciones:

---

## 🧪 Caso 5: Acceso sin autenticación

**Qué se hace:**

1. Abrir el navegador en modo incógnito o cerrar sesión.
2. Intentar acceder directamente a:
   `/practica/cuestionario`

**Qué se espera:**

- El sistema debe bloquear el acceso.
- Debe redirigir al login o mostrar error de autorización.
- No debe cargar el cuestionario.

**Resultado real:**

- Resultado:
- Observaciones:

---

## 🧪 Caso 6: Registro correcto del resultado (extra recomendado)

**Qué se hace:**

1. Completar un simulacro completamente.
2. Finalizar normalmente.

**Qué se espera:**

- Se crea un documento en `resultados`.
- Se crean subdocumentos en `respuestas`.
- Cada respuesta debe tener `usuarioId` correcto.

**Resultado real:**

- Resultado:
- Observaciones:

---

## 🧪 Caso 7: Persistencia de datos (extra recomendado)

**Qué se hace:**

1. Iniciar un simulacro.
2. Responder algunas preguntas.
3. Recargar la página.

**Qué se espera:**

- El estado se mantiene (si está implementado).
- O se reinicia correctamente sin errores.

**Resultado real:**

- Resultado:
- Observaciones:

---

## ✅ Notas generales

- Ejecutar pruebas con `npm run dev`.
- Revisar consola del navegador en cada caso.
- Validar datos en Firebase cuando aplique.
