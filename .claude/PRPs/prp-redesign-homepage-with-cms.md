---
name: prp-redesign-homepage-cms
description: Rediseño profesional del sitio web + integración Voice CMS para gestión de contenidos
metadata:
  type: prp
  status: PLANNING — AWAITING USER ANSWERS
  created: 2026-06-17
---

# PRP-002: Rediseño Profesional del Sitio Web + Voice CMS Integrado

> **ESTADO**: 🔴 BLOQUEADO EN PLANNING — Esperando respuestas del usuario
> **OBJETIVO**: Transformar allsoulshamilton.com de sitio básico a sitio profesional, manteniendo info pero con diseño mejorado
> **ALCANCE**: Rediseño visual + Estructura de contenidos + Sistema de edición para párroco

---

## 🎯 LO QUE ENTIENDO (hasta ahora)

### Situación Actual
- **Sitio actual**: https://www.allsoulshamilton.com/ (básico, feo)
- **Nuevo sitio en desarrollo**: https://allsoulshamilton-website.vercel.app/ (mejor, pero incompleto)
- **Voice CMS**: `/padre` (para que párroco grabe sermones/avisos)
- **Cambios anteriores**: Se hicieron cambios en Sacraments + Sponsors que se perdieron en git

### Frustración del Usuario
1. No sabe dónde están las modificaciones (¿en el sitio en vivo? ¿en local?)
2. No sabe cómo probar antes de publicar
3. No ve la aplicación Voice CMS funcionando
4. Cambios anteriores desaparecieron

---

## ❓ PREGUNTAS CRÍTICAS (responde TODAS antes de continuar)

### PARTE 1: VISIÓN DEL DISEÑO
**¿Cuál es la mejora visual que quieres?**

1. **Estructura general:**
   - ¿Mantener los mismos componentes? (Navbar, Hero, Schedule, Donations, Sponsors, Footer)
   - ¿Agregar nuevas secciones?
   - ¿Cambiar el orden?
   - ¿Eliminar algo?

2. **Estilo visual:**
   - ¿Más minimalista / más colorido?
   - ¿Más moderno / más clásico?
   - ¿Cambiar los colores (azul marino/dorado)?
   - ¿Más fotografías / menos texto?

3. **Sacraments específicamente:**
   - El componente actual: 4 cards (Confessions, Baptism, Marriage, Sick Visits)
   - ¿Qué cambios le viste en la página original que NO están aquí?
   - ¿Quieres más información por sacramento?
   - ¿Otro layout?
   - **MUÉSTRAME UNA CAPTURA o DESCRIBE exactamente qué viste**

4. **Sponsors/Publicidad específicamente:**
   - El componente actual: imagen grande + grid de tarjetas de comercios
   - ¿Qué cambios de TAMAÑO querías?
   - ¿Quieres: más grande / más pequeño / diferente layout?
   - ¿Más énfasis en la imagen de sponsors-ads?
   - **MUÉSTRAME qué viste en los QA screenshots del 2026-06-08**

---

### PARTE 2: CÓMO FUNCIONA EL FLUJO DE EDICIÓN

**El párroco necesita poder actualizar CONTENIDO sin tocar código. Tenemos dos opciones:**

**OPCIÓN A: Voice CMS (Lo que ya desarrollamos)**
- Párroco va a `/padre` → Graba sermón/frase/aviso → Se publica automáticamente
- Aparece en: Weekly Sermon + Daily Quote + Announcements
- **PREGUNTA**: ¿Esto está funcionando o qué falta?

**OPCIÓN B: Admin Panel Manual**
- Párroco edita horarios, sacramentos, sponsors directamente en el sitio
- Cambia textos sin código
- **PREGUNTA**: ¿Necesitas AMBAS opciones?

---

### PARTE 3: ENTORNO DE DESARROLLO (CÓMO PROBAR)

**Necesitas entender 3 ambientes:**

1. **LOCAL (tu máquina):**
   ```bash
   npm run dev
   ```
   - Accesible en: http://localhost:3000
   - Cambios al código = refresco automático
   - **PREGUNTA**: ¿Tienes esto corriendo ahora?

2. **STAGING (pruebas antes de producción):**
   - ¿Quieres una rama de prueba (`staging`) en Vercel?
   - ¿O probar todo en local y después hacer push directo a main?

3. **PRODUCCIÓN:**
   - https://allsoulshamilton-website.vercel.app/
   - Se actualiza automáticamente cuando haces push a `main` en GitHub

**PREGUNTA**: ¿Cuál es tu flujo preferido?
- A) Cambiar en LOCAL → Probar en http://localhost:3000 → Push a GitHub → Ver en Vercel
- B) Tener rama `staging` en Vercel para pruebas → Cuando esté bien, merge a main → Producción

---

### PARTE 4: CAMBIOS PERDIDOS

**¿Qué cambios EXACTAMENTE se hicieron antes que querías mantener?**

Tenemos QA screenshots del 2026-06-08 que muestran iteraciones:
- `07-bulletin-large.png` — Versión más grande del bulletin?
- `09-bulletin-v3.png` — Iteración 3?
- `10-bulletin-v4.png` — Iteración 4?
- `11-bulletin-final.png` — Versión final aprobada?
- `12-sponsors-banner.png` — Banner de sponsors modificado?
- `13-sponsors-ads.png` — Ads con tamaño diferente?

**PREGUNTA**: ¿Cuál de estas imágenes muestra lo que querías? ¿Puedes describir QUÉ cambió en cada una?

---

### PARTE 5: INFORMACIÓN QUE DEBE CAMBIAR

**¿Qué contenido necesita ser EDITABLE por el párroco?**

Marcar con ✅ lo que SÍ necesita editarse desde la app:

- [ ] Horarios de Misa (Mass Schedule)
- [ ] Información de Sacramentos (Sacraments)
- [ ] Horarios de Oficina (Contact)
- [ ] Información de Patrocinadores (Sponsors)
- [ ] Texto del Hero (Welcome message)
- [ ] Foto del Hero
- [ ] Información de Donaciones (Donations)
- [ ] Galería de fotos de la iglesia
- [ ] Otros: ___________

**PREGUNTA**: ¿Para CADA uno de estos, quieres que el párroco lo edite vía Voice (hablando) o vía formulario (escribiendo)?

---

## 🛣️ RUTA PROPUESTA (Espera confirmación)

Si responden bien las preguntas anteriores, el plan sería:

1. **FASE 1: Diagnosticar qué falta**
   - Ejecutar servidor local
   - Comparar con página original
   - Identificar diseños/cambios que faltaron

2. **FASE 2: Rediseñar componentes**
   - Mejorar Sacraments (según lo que viste)
   - Mejorar Sponsors (tamaños/layout)
   - Otros cambios visuales

3. **FASE 3: Integrar Voice CMS**
   - Verificar que /padre funciona
   - Conectar Voice CMS con contenido visible
   - Probar grabación → Publicación → Aparece en sitio

4. **FASE 4: Sistema de Edición Flexible**
   - Crear admin panel para contenidos editables
   - Permitir párroco cambiar info SIN Voice (si lo necesita)

5. **FASE 5: Testing en Staging**
   - Probar todo en rama `staging`
   - Validar en desktop y móvil
   - Aprobación del usuario

6. **FASE 6: Deploy a Producción**
   - Merge a main
   - Vercel actualiza automáticamente

---

## ✅ CHECKLIST — "LISTO PARA PROCEDER"

**Responde SÍ a TODO antes de que yo continue:**

- [ ] ¿Entiendes que hay 3 ambientes? (Local / Staging / Producción)
- [ ] ¿Entiendes que los cambios en LOCAL se prueban primero?
- [ ] ¿Entiendes que push a GitHub = automática actualización en Vercel?
- [ ] ¿Tienes claro qué cambios visuales quieres?
- [ ] ¿Identificaste en los screenshots QA cuál es la versión "correcta"?
- [ ] ¿Sabes qué contenidos necesita poder editar el párroco?

**Si algo NO está claro, dímelo ahora.**

---

## 📌 PRÓXIMO PASO

1. **RESPONDE TODAS las preguntas arriba**
2. **Yo creo un PLAN EJECUTIVO**
3. **Empezamos FASE 1: Diagnosticar y planificar cambios visuales**
4. **Vamos por partes — nada de sorpresas**

