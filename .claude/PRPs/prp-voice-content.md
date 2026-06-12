# PRP-001: Sistema de Gestión de Contenidos por Voz (Voice CMS)

> **Estado**: APROBADO — EN EJECUCIÓN (Fase 1)
> **Fecha**: 2026-06-12
> **Aprobado**: 2026-06-12 — PWA `/padre`, paso de confirmación y Supabase aprobados tal cual
> **Proyecto**: Our Lady of All Souls Parish (allsoulshamilton.com)

---

## Objetivo

El párroco graba notas de voz desde su teléfono en una pantalla ultra-simple de 3 botones grandes; el audio se transcribe automáticamente (Whisper, español) y el texto alimenta 3 secciones nuevas del sitio web — **Sermón de la semana**, **Frase del día**, y **Avisos parroquiales** — sin que nadie toque código.

## Por Qué

| Problema | Solución |
|----------|----------|
| El sitio es 100% estático: cualquier cambio de contenido requiere un desarrollador | Contenido dinámico desde Supabase, actualizable por el párroco |
| El párroco (usuario senior, no técnico) no puede usar un CMS tradicional | Interfaz de 3 botones grandes + voz: hablar es la única habilidad requerida |
| El boletín semanal en papel/PDF es la única vía de avisos | Avisos publicados en segundos desde el teléfono, visibles al instante en el sitio |

**Valor de negocio**: El sitio pasa de "folleto estático" a canal vivo de comunicación parroquial. Tiempo de publicación: de días (pedir cambio a un dev) a ~60 segundos (grabar y confirmar). Cero curva de aprendizaje para el párroco.

## Qué

### Criterios de Éxito
- [ ] El párroco puede hacer login una vez y su sesión persiste en el teléfono
- [ ] Pantalla `/padre` con 3 botones grandes (Sermón / Frase / Aviso), accesible y mobile-first (touch targets ≥ 56px, consistente con WCAG AA del sitio)
- [ ] Grabar audio en español → transcripción automática → preview editable → botón "Publicar"
- [ ] Las 3 secciones nuevas aparecen en el sitio público leyendo desde Supabase (sermón más reciente, frase más reciente, últimos 5 avisos)
- [ ] Contenido nuevo visible en el sitio sin redeploy (revalidación)
- [ ] Visitantes anónimos solo pueden LEER contenido publicado (RLS); solo usuarios autenticados pueden escribir
- [ ] Funciona en iPhone Safari y Android Chrome (MediaRecorder en ambos)
- [ ] **Documentación Evolutiva** (requerimiento del usuario, 2026-06-12): al cierre de CADA fase se actualiza `documentation.html` en la raíz — autocontenido (Tailwind CDN + Mermaid.js), con estado del desarrollo, lógica técnica explicada y diagramas visuales. Incluir su actualización como subtarea final de cada fase.

### Comportamiento Esperado (Happy Path)

1. El párroco abre `/padre` en su teléfono (guardado en pantalla de inicio). Ya tiene sesión activa.
2. Ve 3 botones gigantes: **🎙 Sermón**, **✝ Frase del día**, **📢 Aviso**.
3. Toca "Aviso" → pantalla con un solo botón rojo de grabar. Habla: *"Este sábado a las 10 habrá confesiones en español…"*. Toca detener.
4. El audio se envía a `/api/transcribe` → Whisper devuelve el texto en español.
5. Ve el texto transcrito en letra grande, puede corregirlo tocando el texto, y toca **"Publicar"** (o **"Volver a grabar"**).
6. El texto se guarda en Supabase y se revalida la home. En segundos, el aviso aparece en la sección "Avisos Parroquiales" del sitio.

---

## Contexto

### Referencias (codebase real, verificado)

- `src/app/page.tsx` — Server Component que compone secciones. Las nuevas secciones se inyectan aquí; el fetch de datos se hace en el server y se pasa por props.
- `src/features/parish/components/mass-schedule.tsx` — Patrón visual a seguir: sección con `id`, header centrado con ✝, tokens `parish-navy`/`parish-gold`/`parish-cream`, clases `section-title`/`section-subtitle`, `text-senior-*`, tabla desktop + cards mobile.
- `src/shared/contexts/language-context.tsx` — Context de idioma client-side (EN/ES/IT) con `useLanguage()`. Los **títulos/labels** de las nuevas secciones van en `src/locales/{en,es,it}.json`; el **contenido grabado** se muestra tal cual (español).
- `src/features/parish/types/index.ts` — Interfaz `Translations` a extender con las claves nuevas.
- `src/lib/supabase/server.ts` y `src/lib/supabase/client.ts` — Clientes Supabase SSR/browser ya creados (`@supabase/ssr`).
- `src/app/(auth)/login/page.tsx` — **PLACEHOLDER**: dice "Implementa LoginForm". El auth está scaffolded pero NO implementado.
- `.env.local.example` — Requiere `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Memoria del proyecto indica "Sin Supabase (sitio estático)": **hay que crear/conectar el proyecto Supabase real**.
- [Whisper API](https://platform.openai.com/docs/guides/speech-to-text) — `whisper-1`, parámetro `language: 'es'`, límite 25MB por archivo.

### Decisiones de Arquitectura

1. **"App móvil" = ruta PWA-style dentro del mismo Next.js** (`/padre`), no app nativa. KISS: cero stores, cero builds nativos, mismo deploy en Vercel. Se agrega a pantalla de inicio del teléfono. (PWA instalable formal con `add-mobile` queda como mejora futura.)
2. **Grabación con MediaRecorder API** en el browser → `FormData` → API route. Sin librerías extra.
3. **Flujo en 2 pasos** (transcribe → preview → publicar): la API `/api/transcribe` solo transcribe y devuelve texto. La publicación es un paso separado (insert a Supabase desde el cliente autenticado, RLS protege). El párroco siempre confirma antes de publicar.
4. **Una sola tabla** `parish_content` con columna `section` discriminadora, en vez de 3 tablas. Mismo shape de datos, mismo flujo.
5. **Lectura server-side con ISR**: `page.tsx` (Server Component) hace fetch con el cliente server de Supabase y pasa datos por props a componentes client. `revalidatePath('/')` tras publicar + `export const revalidate = 300` como red de seguridad.
6. **Whisper vía OpenAI SDK directo** en la API route (server-only, `OPENAI_API_KEY` nunca expuesta). Validación del request con Zod.

### Arquitectura Propuesta (Feature-First)

```
src/features/voice-cms/
├── components/
│   ├── recorder-screen.tsx      # 3 botones grandes + estado de grabación
│   ├── record-button.tsx        # Botón grabar/detener con feedback visual
│   └── transcript-preview.tsx   # Texto editable + Publicar / Regrabar
├── hooks/
│   └── use-recorder.ts          # MediaRecorder: start/stop/blob, mime fallback iOS
├── services/
│   ├── transcribe.ts            # POST /api/transcribe (FormData)
│   └── content.ts               # insert/select parish_content (Supabase)
└── types/
    └── index.ts                 # ContentSection, ParishContent, etc.

src/app/
├── padre/page.tsx               # Pantalla del párroco (protegida por sesión)
├── api/transcribe/route.ts      # Whisper STT (server-only)
└── page.tsx                     # + fetch de contenido + 3 secciones nuevas

src/features/parish/components/
├── weekly-sermon.tsx            # Sección: Sermón de la semana
├── daily-quote.tsx              # Sección: Frase del día
└── announcements.tsx            # Sección: Avisos parroquiales
```

### Modelo de Datos

```sql
CREATE TABLE parish_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL CHECK (section IN ('sermon', 'quote', 'announcement')),
  content TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parish_content_section_date
  ON parish_content (section, created_at DESC);

ALTER TABLE parish_content ENABLE ROW LEVEL SECURITY;

-- Lectura pública solo de contenido publicado
CREATE POLICY "public_read_published" ON parish_content
  FOR SELECT USING (published = true);

-- Escritura solo para usuarios autenticados (el párroco / staff)
CREATE POLICY "authenticated_insert" ON parish_content
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "authenticated_update" ON parish_content
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);
```

**Reglas de lectura del sitio**: `sermon` → 1 más reciente · `quote` → 1 más reciente · `announcement` → últimos 5 publicados.

---

## Blueprint (Assembly Line)

> Solo FASES. Las subtareas se generan al entrar a cada fase con `/bucle-agentico`.

### Fase 1: Infraestructura Supabase
**Objetivo**: Proyecto Supabase conectado (env vars reales), tabla `parish_content` creada con RLS e índice, usuario del párroco creado en Auth.
**Validación**: `select` anónimo devuelve solo `published=true`; insert anónimo falla; insert autenticado funciona (verificado vía SQL/MCP).

### Fase 2: Login funcional mínimo
**Objetivo**: Reemplazar el placeholder de `/login` con email/password real (Supabase Auth), sesión persistente, y redirect a `/padre`. Ruta `/padre` protegida (redirect a `/login` sin sesión).
**Validación**: Login con el usuario del párroco entra a `/padre`; sin sesión, `/padre` redirige a `/login`.

### Fase 3: API de transcripción
**Objetivo**: `POST /api/transcribe` recibe audio (FormData), valida sesión + tipo/tamaño con Zod, llama Whisper (`language: 'es'`) y devuelve `{ text }`. `OPENAI_API_KEY` agregada a `.env.local.example`.
**Validación**: `curl` con archivo de audio de prueba en español devuelve transcripción correcta; request sin sesión devuelve 401.

### Fase 4: Pantalla del párroco (`/padre`)
**Objetivo**: Feature `voice-cms` completa: 3 botones grandes (Sermón/Frase/Aviso), hook `use-recorder` con MediaRecorder (fallback de mime para iOS), preview editable de la transcripción, publicar a Supabase + `revalidatePath('/')`. Diseño senior-friendly (texto grande, alto contraste, touch targets ≥ 56px).
**Validación**: Flujo completo grabar → transcribir → editar → publicar crea fila en `parish_content`; probado en viewport móvil con Playwright.

### Fase 5: Secciones dinámicas en el sitio público
**Objetivo**: 3 componentes nuevos (`weekly-sermon`, `daily-quote`, `announcements`) con el patrón visual de `mass-schedule.tsx`, datos fetched server-side en `page.tsx` (con `revalidate`), títulos/labels trilingües en los 3 locales + `Translations` extendido, links en navbar. Estado vacío elegante si aún no hay contenido.
**Validación**: Contenido publicado en Fase 4 visible en la home en los 3 idiomas (títulos traducidos, contenido en español); sin contenido, la sección muestra estado vacío sin romper.

### Fase 6: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npx tsc --noEmit` pasa (no hay script `typecheck` en package.json)
- [ ] `npm run build` exitoso
- [ ] Playwright: login → grabar/publicar (mock o fixture de audio) → contenido visible en home
- [ ] Screenshots móviles de `/padre` y de las 3 secciones nuevas
- [ ] Criterios de éxito del PRP cumplidos

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

*(vacío — se llena durante la implementación)*

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] **El auth NO está implementado**: `/login` y `/signup` son placeholders y la memoria del proyecto dice "Sin Supabase (sitio estático)". La Fase 1-2 debe crear/conectar el proyecto Supabase real y un login funcional — no asumir que existe.
- [ ] **iOS Safari y MediaRecorder**: Safari graba `audio/mp4` (no `audio/webm`). Detectar mime soportado con `MediaRecorder.isTypeSupported()` y enviar la extensión correcta a Whisper (acepta mp4/m4a/webm).
- [ ] **Límite de body en Vercel serverless (~4.5MB)**: limitar la grabación (ej. máx ~3-4 min) y/o fijar `audioBitsPerSecond` bajo en MediaRecorder. Mostrar timer y tope al párroco.
- [ ] **`OPENAI_API_KEY` es server-only**: solo en la API route, jamás con prefijo `NEXT_PUBLIC_`.
- [ ] **`page.tsx` debe seguir siendo Server Component**: el fetch va ahí; los componentes de sección siguen siendo client (`useLanguage`) y reciben el contenido por props serializables.
- [ ] **`revalidatePath` no funciona desde el cliente**: la publicación debe pasar por un Server Action o API route que haga insert + revalidate.
- [ ] **Permiso de micrófono requiere HTTPS** (o localhost): probar en producción/preview de Vercel para el flujo real en teléfono.
- [ ] **Audiencia senior**: nada de gestos complejos; un solo botón visible por paso, feedback claro de "grabando" (color + pulso + texto).
- [ ] **No hay script `typecheck`** en `package.json`: usar `npx tsc --noEmit` o agregar el script.

## Anti-Patrones

- NO crear app nativa ni repo separado — es una ruta del mismo Next.js
- NO crear 3 tablas cuando una con discriminador basta (KISS)
- NO publicar automáticamente sin preview/confirmación del párroco
- NO exponer `OPENAI_API_KEY` ni usar la key de Supabase `service_role` en cliente
- NO ignorar errores de TypeScript ni usar `any` (usar `unknown`)
- NO hardcodear textos de UI — todo label visible va en los 3 locales
- NO omitir validación Zod en `/api/transcribe`
- NO romper el patrón visual existente (tokens `parish-*`, `text-senior-*`)

---

*PRP pendiente aprobación. No se ha modificado código.*
