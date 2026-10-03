# QA - Casos de Prueba Gamificación

Este documento describe los casos de prueba para validar el sistema de gamificación de la plataforma LearnFex.

---

## Caso 1: Puntaje correcto según respuestas

**Qué se hace:**

- Iniciar un cuestionario o simulacro.
- Responder algunas preguntas correctamente y otras incorrectamente.
- Finalizar la prueba.

**Qué se espera:**

- El puntaje mostrado corresponde exactamente a la cantidad de respuestas correctas.
- No se suman puntos por respuestas incorrectas.

**Resultado real:**

- [ ] OK
- [ ] Error

## **Observaciones:**

## Caso 2: Incremento de XP en Perfil

**Qué se hace:**

- Consultar el XP actual en el perfil.
- Realizar un cuestionario o simulacro.
- Finalizar la prueba.
- Volver al perfil.

**Qué se espera:**

- El XP aumenta de acuerdo con el resultado obtenido.
- No se mantiene igual si se completó una prueba.

**Resultado real:**

- [ ] OK
- [ ] Error

## **Observaciones:**

## Caso 3: Múltiples pruebas seguidas (condición de carrera)

**Qué se hace:**

- Realizar varias pruebas seguidas (mínimo 3).
- Finalizar cada una correctamente.
- Revisar el XP acumulado al final.

**Qué se espera:**

- El XP se acumula correctamente.
- No se pierden puntos entre pruebas.
- No hay sobrescritura de datos.

**Resultado real:**

- [ ] OK
- [ ] Error

## **Observaciones:**

## Caso 4: Logro "Primer paso" automático

**Qué se hace:**

- Iniciar sesión con un usuario nuevo.
- Completar el primer cuestionario o simulacro.

**Qué se espera:**

- El logro "Primer paso" se desbloquea automáticamente.
- No existe botón manual para desbloquearlo.
- El logro aparece en el perfil del usuario.

**Resultado real:**

- [ ] OK
- [ ] Error

## **Observaciones:**

## Caso 5: Seguridad - modificación de XP desde consola

**Qué se hace:**

- Abrir la consola del navegador.
- Intentar modificar manualmente el campo `xp` del usuario en Firestore.

**Qué se espera:**

- La operación es rechazada por las reglas de seguridad.
- No se permite modificar XP directamente desde el cliente.

**Resultado real:**

- [ ] OK
- [ ] Error

## **Observaciones:**

## Notas finales

- Ejecutar todos los casos con la aplicación corriendo (`npm run dev`).
- Registrar cualquier comportamiento inesperado.
- Si hay errores, especificar pasos exactos para reproducirlos.
