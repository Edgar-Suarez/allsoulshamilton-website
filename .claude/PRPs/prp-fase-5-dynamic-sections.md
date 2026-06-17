# PRP-005: Fase 5 — Secciones Dinámicas en Sitio Público

> **Estado**: PENDIENTE
> **Fecha**: 2026-06-17
> **Proyecto**: Our Lady of All Souls Parish (allsoulshamilton.com)
> **Relativo a**: PRP-001 (Voice CMS) — Fase 5 de 6

---

## Objetivo

Implementar 3 componentes visuales nuevos que presentan el contenido grabado por el párroco desde el Voice CMS — **Sermón de la Semana**, **Frase del Día** y **Avisos Parroquiales** — en la página pública (`/`) con fetching server-side desde Supabase, respetando el patrón visual y tokens de diseño existentes (`parish-navy`, `parish-gold`, `text-senior-*`), y estrategia de datos específica (1 más reciente para sermón/frase, últimos 5 para avisos).

## Por Qué

| Problema | Solución |
|----------|----------|
| El párroco puede grabar contenido en `/padre`, pero nadie lo ve en el sitio | Secciones nuevas en la home que leen automáticamente de Supabase |
| El sitio sigue siendo en su mayoría estático, sin los beneficios de contenido dinámico | ISR + Server Components: contenido aparece sin redeploy, se actualiza cada X segundos |
| Los visitantes anónimos deben poder leer el contenido sin autenticarse | RLS permite lectura pública (published=true) sin sesión |
| Nuevo contenido grabado debe ser trilingüe en títulos/labels (EN/ES/IT) pero en español en el texto | Separar traducciones de UI de contenido, incorporar en `Translations` interface y locales |

**Valor de negocio**: El sitio pasa de "contenido estático + CMS oculto" a "vitrina viva del púlpito parroquial". Visitantes ven mensajes frescos del párroco cada semana sin que se redeploye el código. Aumenta engagement y percepción de comunidad conectada.

## Qué

### Criterios de Éxito

- [ ] Tres componentes nuevos (`weekly-sermon`, `daily-quote`, `announcements`) renderizan contenido fetched desde Supabase sin romper el sitio existente
- [ ] Los títulos y labels son trilingües (EN/ES/IT); el contenido grabado se muestra en español sin traducir (respeta voz del párroco)
- [ ] Estrategia de datos: Sermón → 1 más reciente; Frase → 1 más reciente; Avisos → últimos 5 publicados ordenados por fecha descendente
- [ ] ISR funcional: cambios en el contenido visibles en <5 minutos sin redeploy (revalidate time configurable)
- [ ] Estado vacío elegante: si no hay contenido en una sección, muestra mensaje amable sin romper layout
- [ ] Diseño coherente con `mass-schedule.tsx`: mismo patrón de header, tokens `parish-*`, `text-senior-*`, layout responsive (cards mobile, tabla/grid desktop)
- [ ] Links en navbar apuntan a las secciones nuevas (smooth scroll con `id`)
- [ ] Contenido visible para visitantes anónimos; RLS impide que publiquen
- [ ] `npm run build` y `npx tsc --noEmit` pasan sin errores
- [ ] Playwright confirma visibilidad en viewport móvil y desktop

### Comportamiento Esperado (Happy Path)

1. **Pre-requisito**: El párroco ha completado Fases 1-4: tiene login, ha grabado un sermón/frase/avisos desde `/padre`, y publicó con éxito (contenido en `parish_content` con `published=true`).
2. El visitante (anónimo) entra a `https://allsoulshamilton.com/` (home).
3. Debajo del Hero y Schedule, ve 3 secciones nuevas en orden:
   - **"Weekly Sermon" / "Sermón de la Semana" / "Omelia della Settimana"** (título traducido) → muestra 1 sermón más reciente con el texto grabado en spanish
   - **"Daily Quote" / "Frase del Día" / "Citazione del Giorno"** → muestra 1 frase más reciente
   - **"Parish Announcements" / "Avisos Parroquiales" / "Avvisi Parrocchiali"** → lista de 5 avisos más recientes con fechas
4. Si una sección está vacía (ej. aún no hay avisos grabados), muestra: *"No announcements yet. Check back soon."* / *"Sin avisos por ahora. Vuelve pronto."* etc.
5. Cambiar idioma (selector EN/ES/IT en navbar) actualiza los títulos/labels; el contenido grabado (en español) permanece igual.
6. **Revalidación**: El párroco publica un aviso nuevo desde `/padre` → en <5 min (revalidate time), el aviso aparece en la home sin refrescar.

---

## Contexto

### Referencias (Codebase Real Verificado)

- **`src/app/page.tsx`** — Actualmente es placeholder vacío. Será Server Component que:
  - Importa los 3 componentes nuevos
  - Hace fetch de `parish_content` segmentado por `section` y `limit`
  - Pasa datos por props a los componentes
  - Declara `export const revalidate = 300` (ISR)
  
- **`src/features/parish/components/mass-schedule.tsx`** — Patrón visual a replicar:
  - Header con centrado, ✝ emoji, `parish-navy` y `parish-gold`
  - Secciones con `id` para smooth scroll
  - Responsive: cards en mobile, grid/tabla en desktop
  - Tokens: `text-senior-base`, `text-senior-lg`, `text-senior-2xl`, `bg-parish-navy`, `text-parish-gold`
  - Manejo de lenguaje con `useLanguage()` en client components
  
- **`src/features/parish/types/index.ts`** — Interfaz `Translations` a extender:
  - Agregar keys para títulos/labels de las 3 secciones nuevas (EN/ES/IT)
  - Mantener la estructura: `{ en: "...", es: "...", it: "..." }` donde aplique
  
- **`src/locales/{en,es,it}.json`** — Archivos JSON de idiomas:
  - Agregar entradas para las 3 secciones bajo claves like `weeklySermon`, `dailyQuote`, `announcements`
  - Estructura: labels de estado vacío, títulos, subtítulos si los hay
  
- **`src/features/voice-cms/services/content.ts`** — Ya existe `fetchContentBySection(section, limit)`:
  - Reutilizar para el fetch server-side
  - No modificar; ya hace la query correcta con RLS
  
- **`src/features/voice-cms/types/index.ts`** — Tipos `ContentSection`, `ParishContent` ya definidos.
  
- **`src/shared/contexts/language-context.tsx`** — Context que proporciona `useLanguage()` con `t` (translations) y `lang` (idioma actual). Usado en los componentes client de las 3 secciones.

- **`src/features/parish/components/hero.tsx`** — Referencia de estilos de alto contraste (WCAG AA verificado, 4.88:1+ para buttons). Las secciones nuevas deben respetar la misma auditoría de accesibilidad.

- **`documentation.html` en raíz** — Documentación evolutiva (requerimiento de usuario, 2026-06-12): actualizar al cierre de esta fase con diagrama de fetch, estado de BD, links a las secciones.

### Arquitectura Propuesta

```
src/features/parish/components/
├── weekly-sermon.tsx          # Client: renderiza 1 sermón con patrón de mass-schedule
├── daily-quote.tsx            # Client: renderiza 1 frase
└── announcements.tsx          # Client: renderiza lista de últimos 5 avisos

src/app/
└── page.tsx                   # Server Component: fetch + props a los 3 nuevos

src/features/parish/types/
└── index.ts                   # Extender Translations con las 3 secciones

src/locales/
├── en.json                    # + labels: "Weekly Sermon", "Daily Quote", "No announcements yet", etc.
├── es.json                    # + "Sermón de la Semana", "Frase del Día", "Sin avisos por ahora", etc.
└── it.json                    # + "Omelia della Settimana", "Citazione del Giorno", etc.
```

### Estrategia de Datos (SQL / RLS)

Usa la tabla existente `parish_content` (creada en Fase 1):

```sql
-- Lectura pública ya habilitada (RLS):
-- - SELECT donde published = true → acceso anónimo OK
-- - INSERT/UPDATE/DELETE → solo authenticated (created_by = auth.uid())

-- Fetch en page.tsx (server-side con cliente autenticado OR anónimo + RLS):
SELECT * FROM parish_content 
WHERE section = 'sermon' AND published = true 
ORDER BY created_at DESC LIMIT 1;

SELECT * FROM parish_content 
WHERE section = 'quote' AND published = true 
ORDER BY created_at DESC LIMIT 1;

SELECT * FROM parish_content 
WHERE section = 'announcement' AND published = true 
ORDER BY created_at DESC LIMIT 5;
```

**Nota**: El fetch es anónimo (sin sesión requerida) gracias a RLS que permite lectura pública. Si hay error de conexión o Supabase no responde, componentes muestran estado vacío (fallback graceful).

### Modelo de Datos (sin cambios, extiende Fase 1)

`parish_content` + campos en `Translations` interface. 

**Extensión de `Translations` (TypeScript, tipos nuevos)**:

```typescript
// src/features/parish/types/index.ts
export interface Translations {
  // ... existentes ...
  weeklySermon: {
    title: string;
    noContentLabel: string;
  };
  dailyQuote: {
    title: string;
    noContentLabel: string;
  };
  announcements: {
    title: string;
    noContentLabel: string;
  };
}
```

**Extensión de locales (JSON)**:

```json
// src/locales/en.json
{
  "weeklySermon": {
    "title": "Weekly Sermon",
    "noContentLabel": "No sermon published yet. Check back soon."
  },
  "dailyQuote": {
    "title": "Daily Quote",
    "noContentLabel": "No quote published yet. Check back soon."
  },
  "announcements": {
    "title": "Parish Announcements",
    "noContentLabel": "No announcements yet. Check back soon."
  }
}
```

---

## Blueprint (Assembly Line)

> Solo FASES. Las subtareas se generan al entrar a cada fase con `/bucle-agentico`.

### Fase 1: Estructura & Tipos
**Objetivo**: Extender `Translations` interface con keys para las 3 secciones; agregar entradas a los 3 locales (EN/ES/IT); scaffolding de los 3 componentes nuevos (shell vacío).
**Validación**: TypeScript sin errores; componentes importables en `page.tsx`.

### Fase 2: Componentes Estáticos (UI)
**Objetivo**: Renderizar cada componente con datos mock (props hardcodeados). Patrón visual de `mass-schedule.tsx`: header + contenido + estado vacío. Responsive (mobile/desktop). Design tokens respetados.
**Validación**: Playwright screenshot de los 3 componentes en viewport mobile (375px) y desktop (1024px); contraste WCAG AA auditado.

### Fase 3: Server-Side Fetch & Integration
**Objetivo**: Implementar `page.tsx` como Server Component que fetches desde Supabase (via `fetchContentBySection`), pasa datos serializables por props a los 3 componentes, declara `revalidate = 300`.
**Validación**: `npm run build` exitoso; fetch retorna datos o `null` sin crashes; componentes reciben props tipo `ParishContent[] | null`.

### Fase 4: Manejo de Errores & Empty States
**Objetivo**: Fallbacks graceful si Supabase no responde o no hay contenido; logs server-side de errors (no exponerlos al usuario); componentes muestran estado vacío trilingüe.
**Validación**: Apagar Supabase → componentes renderizan estado vacío sin romper; logs claros en consola.

### Fase 5: Navbar & Links
**Objetivo**: Agregar links en navbar que smooth-scroll a las 3 secciones nuevas (via `id` en componentes + `href="#weekly-sermon"` etc. en navbar).
**Validación**: Click en navbar → smooth scroll a sección correcta.

### Fase 6: Validación Final & Documentación
**Objetivo**: Sistema end-to-end funcionando (Fases 1-4 completadas). Actualizar `documentation.html` con diagrama de fetch, estado del Voice CMS Fase 5, links a secciones nuevas.
**Validación**:
- [ ] `npm run build` exitoso
- [ ] `npx tsc --noEmit` sin errores
- [ ] Playwright: usuario anónimo → home → ve las 3 secciones con contenido de fixture (si lo hay)
- [ ] Playwright: cambiar idioma → títulos se traducen, contenido queda igual
- [ ] Screenshots móviles + desktop
- [ ] Criterios de éxito cumplidos
- [ ] `documentation.html` actualizado

---

## 🧠 Aprendizajes (Self-Annealing)

> Esta sección CRECE durante la implementación.

(Vacía al inicio — se llena conforme se descubren patrones/errores)

---

## Gotchas

> Cosas críticas ANTES de implementar

- [ ] **Server Components en `page.tsx`**: El fetch va en el servidor, no en el cliente. Usar `async/await` directo, no `useEffect`.
- [ ] **RLS y acceso anónimo**: El fetch no requiere sesión; RLS filtra automáticamente `published=true`. Si la tabla/política está mal, fetch fallará silenciosamente — probar primero en SQL (Supabase dashboard).
- [ ] **ISR delay**: `revalidate = 300` (5 min) es el default. Contenido publicado es visible después de ese tiempo o si alguien hace manual revalidation. Explicar esto al párroco si espera resultado inmediato.
- [ ] **TypeScript con Translations**: Después de extender `Translations`, actualizar todos los imports de `useLanguage()` si hay errores de tipo.
- [ ] **Smooth scroll**: Los links en navbar deben apuntar a `id` de las secciones (ej. `id="weekly-sermon"`). La URL sin hash debe seguir siendo `/` (no agregar `?section=...`).
- [ ] **Fallback de contenido null**: Si `fetchContentBySection` devuelve `null` o array vacío, los componentes deben mostrar estado vacío trilingüe, no crashear.
- [ ] **Design tokens en Tailwind**: `parish-navy`, `parish-gold`, `text-senior-*`, `rounded-parish` ya existen en la config. Si no se ven, verificar `tailwind.config.ts` está importando los valores correctos (puede estar vacío y heredar de defaults).

## Anti-Patrones

- NO crear componentes client que hagan fetch — el servidor lo hace, componentes reciben props
- NO traducir el contenido grabado (español → otros idiomas) — solo los labels de UI
- NO usar `useState` para manejar datos del contenido — es read-only desde el servidor
- NO redeploy para cada cambio de contenido — la idea de ISR es evitar eso
- NO hardcodear límites de items (1 / 5) en los componentes — recibirlos desde `page.tsx` o variables de config
- NO ignorar RLS — verificar permisos en SQL antes de pensar que el código está roto
- NO romper el patrón visual existente — usar tokens `parish-*` y `text-senior-*`, mantener coherencia con hero + mass-schedule

---

*PRP pendiente aprobación. No se ha modificado código.*
