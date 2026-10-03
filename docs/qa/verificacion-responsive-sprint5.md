# QA - Verificación Responsive Sprint 5

Este documento valida el comportamiento responsive de las pantallas clave del Sprint 5 en la plataforma LearnFex.

---

## Precondición

- El PR #23 debe estar mergeado.
- Ejecutar la aplicación con: `npm run dev`.
- Abrir la app en el navegador.
- Usar herramientas de desarrollador (modo responsive).

---

## Dispositivos / Anchos a probar

- 📱 Mobile: ~375px
- 📲 Tablet: ~768px
- 💻 Desktop: ~1280px

---

## Caso 1: Retroalimentación - tarjeta de puntaje

**Qué se hace:**

- Completar un cuestionario o simulacro.
- Ir a la pantalla de retroalimentación.
- Revisar la tarjeta de puntaje en los 3 tamaños.

**Qué se espera:**

- La tarjeta se ve completa.
- No hay cortes de contenido.
- El texto es legible.
- No hay desbordes horizontales.

**Resultado real:**

- Mobile (~375px): [ ] OK / [ ] Error
- Tablet (~768px): [ ] OK / [ ] Error
- Desktop (~1280px): [ ] OK / [ ] Error

## **Observaciones:**

## Caso 2: Retroalimentación - opciones de respuesta

**Qué se hace:**

- En la misma pantalla de retroalimentación, observar las opciones de respuesta.

**Qué se espera:**

- Las opciones no se cortan.
- Se pueden leer completamente.
- No se superponen entre sí.
- Los estados (correcta/incorrecta) se visualizan claramente.

**Resultado real:**

- Mobile (~375px): [ ] OK / [ ] Error
- Tablet (~768px): [ ] OK / [ ] Error
- Desktop (~1280px): [ ] OK / [ ] Error

## **Observaciones:**

## Caso 3: Estadísticas - barras de progreso

**Qué se hace:**

- Ir a la pantalla de Estadísticas.
- Revisar las barras de progreso por área.

**Qué se espera:**

- Las barras son visibles completas.
- El porcentaje o progreso es legible.
- No se deforman en mobile.
- Mantienen contraste adecuado.

**Resultado real:**

- Mobile (~375px): [ ] OK / [ ] Error
- Tablet (~768px): [ ] OK / [ ] Error
- Desktop (~1280px): [ ] OK / [ ] Error

## **Observaciones:**

## Caso 4: Ranking - fila resaltada con nombres largos

**Qué se hace:**

- Ir a la pantalla de Ranking.
- Ubicar la fila del usuario actual.
- Probar con nombres largos (si es posible).

**Qué se espera:**

- El nombre no rompe el layout.
- La fila resaltada se mantiene visible correctamente.
- No hay superposición de texto.
- El badge "Tú" se muestra correctamente.

**Resultado real:**

- Mobile (~375px): [ ] OK / [ ] Error
- Tablet (~768px): [ ] OK / [ ] Error
- Desktop (~1280px): [ ] OK / [ ] Error

## **Observaciones:**

## Notas finales

- Registrar cualquier bug indicando el ancho exacto donde ocurre.
- Adjuntar capturas si es posible.
- Priorizar problemas de legibilidad y layout roto.
