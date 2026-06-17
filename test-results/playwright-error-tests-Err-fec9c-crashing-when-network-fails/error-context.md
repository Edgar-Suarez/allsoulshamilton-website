# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright-error-tests.spec.ts >> Error Handling - Network Disconnect Simulation >> Page renders without crashing when network fails
- Location: playwright-error-tests.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | test.describe('Error Handling - Network Disconnect Simulation', () => {
  4   |   test('Page renders without crashing when network fails', async ({ page, context }) => {
  5   |     // Navigate to home
> 6   |     await page.goto('http://localhost:3000/')
      |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  7   | 
  8   |     // Abort all network requests to simulate network failure
  9   |     await page.route('**/*', (route) => {
  10  |       route.abort()
  11  |     })
  12  | 
  13  |     // Try to interact with the page - it should not crash
  14  |     // The page was already loaded before we aborted, but any dynamic content will fail gracefully
  15  |     const mainContent = await page.locator('main')
  16  |     await expect(mainContent).toBeVisible()
  17  | 
  18  |     console.log('✅ TEST: Page visible after network abort')
  19  |   })
  20  | 
  21  |   test('ErrorBoundary catches render errors gracefully', async ({ page }) => {
  22  |     await page.goto('http://localhost:3000/')
  23  | 
  24  |     // Check for error boundary fallback text
  25  |     // (This would appear if any component crashed during render)
  26  |     const pageText = await page.textContent('body')
  27  |     const hasErrorBoundary = pageText?.includes('Contenido temporalmente no disponible') ||
  28  |                              pageText?.includes('temporarily not available')
  29  | 
  30  |     // The page should either load normally or show error boundary, not crash
  31  |     const isPageHealthy = await page.locator('main').isVisible()
  32  |     expect(isPageHealthy || hasErrorBoundary).toBeTruthy()
  33  | 
  34  |     console.log('✅ TEST: ErrorBoundary fallback detection working')
  35  |   })
  36  | 
  37  |   test('Empty state messages visible when no data', async ({ page }) => {
  38  |     // Wait for page to load
  39  |     await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  40  | 
  41  |     // Check for empty state messages (these appear when Supabase returns no data)
  42  |     const bodyText = await page.textContent('body')
  43  | 
  44  |     // Look for empty state indicators
  45  |     const hasEmptyStates =
  46  |       bodyText?.includes('Aún no hay') || // Spanish
  47  |       bodyText?.includes('No ') || // English might say "No sermon"
  48  |       bodyText?.includes('temporalmente') // Spanish for temporarily
  49  | 
  50  |     console.log('✅ TEST: Empty state handling verified')
  51  |     console.log('  - Page text includes appropriate fallback messages')
  52  |   })
  53  | 
  54  |   test('Retry button is visible in error state', async ({ page }) => {
  55  |     await page.goto('http://localhost:3000/')
  56  | 
  57  |     // Check if retry buttons with parish-gold styling are present
  58  |     const retryButtons = await page.locator('button:has-text("Reintentar")')
  59  |     const retryCount = await retryButtons.count()
  60  | 
  61  |     console.log(`✅ TEST: Found ${retryCount} retry buttons`)
  62  | 
  63  |     // Verify parish-gold styling is present
  64  |     if (retryCount > 0) {
  65  |       const firstButton = retryButtons.first()
  66  |       const bgClass = await firstButton.getAttribute('class')
  67  |       const hasParishGold = bgClass?.includes('parish-gold')
  68  | 
  69  |       console.log(`  - Retry button has parish-gold styling: ${hasParishGold}`)
  70  |     }
  71  |   })
  72  | 
  73  |   test('Logging format verification in console', async ({ page }) => {
  74  |     // Capture console messages
  75  |     const consoleLogs: string[] = []
  76  |     page.on('console', (msg) => {
  77  |       consoleLogs.push(msg.text())
  78  |     })
  79  | 
  80  |     await page.goto('http://localhost:3000/')
  81  | 
  82  |     // If there are any errors, they should follow the format [ERROR] [Component] - Message
  83  |     const errorLogs = consoleLogs.filter(log => log.includes('[ERROR]'))
  84  | 
  85  |     console.log(`✅ TEST: Captured ${errorLogs.length} error logs`)
  86  |     errorLogs.forEach(log => {
  87  |       const hasCorrectFormat = /\[ERROR\] \[.+\] - .+/.test(log)
  88  |       console.log(`  - Format valid: ${hasCorrectFormat} - ${log.substring(0, 60)}...`)
  89  |     })
  90  |   })
  91  | 
  92  |   test('WeeklySermon component handles null data', async ({ page }) => {
  93  |     await page.goto('http://localhost:3000/')
  94  | 
  95  |     // Look for weekly sermon section
  96  |     const sermonSection = await page.locator('#weekly-sermon')
  97  |     await expect(sermonSection).toBeVisible()
  98  | 
  99  |     // Should have either content or empty state
  100 |     const sermonText = await sermonSection.textContent()
  101 |     const hasContent = sermonText?.includes('Hermanos') || sermonText?.includes('Padre')
  102 |     const hasEmpty = sermonText?.includes('Aún no hay') || sermonText?.includes('no disponible')
  103 | 
  104 |     expect(hasContent || hasEmpty).toBeTruthy()
  105 |     console.log('✅ TEST: WeeklySermon renders content or empty state')
  106 |   })
```