# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright-error-tests.spec.ts >> Visual Regression - Error States >> Snapshot: Empty state with no data
- Location: playwright-error-tests.spec.ts:156:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
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
  107 | 
  108 |   test('DailyQuote component handles null data', async ({ page }) => {
  109 |     await page.goto('http://localhost:3000/')
  110 | 
  111 |     // Look for daily quote section
  112 |     const quoteSection = await page.locator('#daily-quote')
  113 |     await expect(quoteSection).toBeVisible()
  114 | 
  115 |     // Should have either quote or empty state
  116 |     const quoteText = await quoteSection.textContent()
  117 |     const hasContent = quoteText?.includes('"')
  118 |     const hasEmpty = quoteText?.includes('Aún no hay') || quoteText?.includes('no disponible')
  119 | 
  120 |     expect(hasContent || hasEmpty).toBeTruthy()
  121 |     console.log('✅ TEST: DailyQuote renders content or empty state')
  122 |   })
  123 | 
  124 |   test('Announcements component handles empty array', async ({ page }) => {
  125 |     await page.goto('http://localhost:3000/')
  126 | 
  127 |     // Look for announcements section
  128 |     const announcementsSection = await page.locator('#announcements')
  129 |     await expect(announcementsSection).toBeVisible()
  130 | 
  131 |     // Should have either announcements or empty state
  132 |     const announcementsText = await announcementsSection.textContent()
  133 |     const hasContent = announcementsText?.includes('Este')
  134 |     const hasEmpty = announcementsText?.includes('Sin avisos') || announcementsText?.includes('no disponible')
  135 | 
  136 |     expect(hasContent || hasEmpty).toBeTruthy()
  137 |     console.log('✅ TEST: Announcements renders content or empty state')
  138 |   })
  139 | 
  140 |   test('Touch targets meet WCAG AA (min 56px) - Retry button', async ({ page }) => {
  141 |     await page.goto('http://localhost:3000/')
  142 | 
  143 |     // Check retry button size
  144 |     const retryButton = await page.locator('button:has-text("Reintentar")').first()
  145 |     if (await retryButton.count() > 0) {
  146 |       const boundingBox = await retryButton.boundingBox()
  147 |       if (boundingBox) {
  148 |         const isAccessible = boundingBox.width >= 56 && boundingBox.height >= 56
  149 |         console.log(`✅ TEST: Retry button size: ${boundingBox.width}x${boundingBox.height} (WCAG AA: ${isAccessible})`)
  150 |       }
  151 |     }
  152 |   })
  153 | })
  154 | 
  155 | test.describe('Visual Regression - Error States', () => {
  156 |   test('Snapshot: Empty state with no data', async ({ page }) => {
> 157 |     await page.goto('http://localhost:3000/')
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  158 | 
  159 |     // Scroll to each section
  160 |     const sections = ['#weekly-sermon', '#daily-quote', '#announcements']
  161 | 
  162 |     for (const selector of sections) {
  163 |       const section = await page.locator(selector)
  164 |       if (await section.isVisible()) {
  165 |         await section.scrollIntoViewIfNeeded()
  166 |         const name = selector.substring(1)
  167 |         console.log(`📸 Section visible: ${name}`)
  168 |       }
  169 |     }
  170 |   })
  171 | })
  172 | 
```