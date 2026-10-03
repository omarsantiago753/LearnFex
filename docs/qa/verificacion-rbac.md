# QA - Verificación RBAC (Control de Acceso por Roles)

Este documento valida que las reglas de acceso por roles (RBAC) estén correctamente implementadas en la plataforma LearnFex.

---

## Precondiciones

- Aplicación corriendo (`npm run dev`).
- Tener al menos:
  - Un usuario con rol **estudiante**.
  - (Opcional) Un usuario administrador para comparar comportamiento.
- Acceso a consola del navegador.

---

## Caso 1: Acceso de estudiante a rutas de administrador

**Qué se hace:**

- Iniciar sesión con un usuario con rol `estudiante`.
- Navegar manualmente en el navegador a `/admin`.

**Qué se espera:**

- El usuario es redirigido automáticamente (ej: a `/` o `/home`).
- No se renderiza ninguna pantalla de administración.
- No hay acceso a componentes internos de admin.

**Resultado real:**

- [ ] OK
- [ ] Error

## **Observaciones:**

## Caso 2: Lectura de datos de otros usuarios desde consola

**Qué se hace:**

- Iniciar sesión como estudiante.
- Abrir la consola del navegador.
- Intentar leer manualmente un documento de otro usuario en la colección `usuarios`.

Ejemplo:

```js
// (ejemplo conceptual)
getDoc(doc(db, "usuarios", "OTRO_UID"));
```
