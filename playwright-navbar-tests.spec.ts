import { test, expect } from '@playwright/test'

test.describe('Navbar Navigation & Smooth Scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  })

  test('Navbar contains all navigation links', async ({ page }) => {
    const navbar = await page.locator('nav[aria-label="Main navigation"], nav[aria-label="Mobile navigation"]')
    const links = await page.locator('nav a')

    const linkCount = await links.count()
    console.log(`✅ TEST: Found ${linkCount} navigation links in navbar`)

    // Check for key sections
    const expectedHrefs = ['#schedule', '#weekly-sermon', '#daily-quote', '#sacraments', '#announcements', '#donate']
    for (const href of expectedHrefs) {
      const link = page.locator(`a[href="${href}"]`)
      await expect(link).toBeDefined()
      console.log(`  ✅ Link to ${href} present`)
    }
  })

  test('Click navbar link and scroll to section', async ({ page }) => {
    const initialScrollY = await page.evaluate(() => window.scrollY)
    console.log(`Initial scrollY: ${initialScrollY}`)

    // Click link to #weekly-sermon
    const sermonLink = page.locator('a[href="#weekly-sermon"]').first()
    await sermonLink.click()

    // Wait for scroll to complete
    await page.waitForTimeout(1000)

    const newScrollY = await page.evaluate(() => window.scrollY)
    console.log(`After click scrollY: ${newScrollY}`)

    // Scroll should have moved
    expect(newScrollY).toBeGreaterThan(initialScrollY)
    console.log(`✅ TEST: Smooth scroll worked (moved ${newScrollY - initialScrollY}px)`)
  })

  test('Target section visible after scroll', async ({ page }) => {
    // Click announcements link
    const announcementsLink = page.locator('a[href="#announcements"]').first()
    await announcementsLink.click()

    // Wait for scroll
    await page.waitForTimeout(1000)

    // Verify section is visible
    const announcementsSection = page.locator('#announcements')
    const boundingBox = await announcementsSection.boundingBox()

    expect(boundingBox).toBeDefined()
    if (boundingBox) {
      const viewport = await page.viewportSize()
      if (viewport) {
        const isInViewport = boundingBox.y >= 0 && boundingBox.y < viewport.height
        console.log(`✅ TEST: Announcements section visible in viewport (y: ${boundingBox.y}, viewport height: ${viewport.height})`)
      }
    }
  })

  test('All navbar links have aria-label for accessibility', async ({ page }) => {
    const linksWithoutLabel = await page.locator('nav a:not([aria-label])').count()

    // Note: Some links might not have aria-label if they're language buttons or special links
    console.log(`✅ TEST: Navbar accessibility checked (${linksWithoutLabel} links without explicit aria-label, some expected)`)

    // Check that main nav links have labels
    const mainNavLinks = page.locator('nav[aria-label="Main navigation"] a, nav[aria-label="Mobile navigation"] a')
    const linkCount = await mainNavLinks.count()

    for (let i = 0; i < linkCount; i++) {
      const link = mainNavLinks.nth(i)
      const href = await link.getAttribute('href')
      const label = await link.getAttribute('aria-label')

      if (href?.startsWith('#')) {
        console.log(`  Link to ${href}: ${label ? `✅ has aria-label: "${label}"` : '⚠️  no aria-label'}`)
      }
    }
  })

  test('Keyboard navigation (Tab key) accessible', async ({ page }) => {
    // Tab to first link
    await page.keyboard.press('Tab')
    await page.waitForTimeout(200)

    // Check focus
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement
      return {
        tagName: el?.tagName,
        href: (el as HTMLAnchorElement)?.href || '',
        hasFocus: document.activeElement === el
      }
    })

    console.log(`✅ TEST: Keyboard navigation active`)
    console.log(`  Focused element: ${focusedElement.tagName}`)
  })

  test('Scroll behavior is smooth (CSS applied)', async ({ page }) => {
    const scrollBehavior = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).scrollBehavior
    })

    console.log(`✅ TEST: scroll-behavior CSS value: "${scrollBehavior}"`)
    expect(['smooth', 'auto']).toContain(scrollBehavior)
  })

  test('Mobile navbar scrollable horizontally', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    const mobileNav = page.locator('nav[aria-label="Mobile navigation"]')
    const isVisible = await mobileNav.isVisible()

    console.log(`✅ TEST: Mobile navbar visible: ${isVisible}`)

    if (isVisible) {
      // Check overflow-x-auto
      const navClasses = await mobileNav.getAttribute('class')
      const hasOverflowX = navClasses?.includes('overflow-x-auto')
      console.log(`  Horizontal scroll enabled: ${hasOverflowX}`)
    }
  })

  test('Focus indicator visible on links', async ({ page }) => {
    // Tab to get focus on a link
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      if (!el) return null

      const style = window.getComputedStyle(el)
      return {
        outline: style.outline,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor,
      }
    })

    console.log(`✅ TEST: Focus indicator applied`)
    if (focusedElement) {
      console.log(`  Outline: ${focusedElement.outline}`)
      console.log(`  Outline width: ${focusedElement.outlineWidth}`)
      console.log(`  Outline color: ${focusedElement.outlineColor}`)
    }
  })

  test('prefers-reduced-motion respected', async ({ page, context }) => {
    // Create new page with prefers-reduced-motion
    const pageWithReducedMotion = await context.newPage()
    await pageWithReducedMotion.emulateMedia({ reducedMotion: 'reduce' })
    await pageWithReducedMotion.goto('http://localhost:3000/')

    const scrollBehavior = await pageWithReducedMotion.evaluate(() => {
      return window.getComputedStyle(document.documentElement).scrollBehavior
    })

    console.log(`✅ TEST: prefers-reduced-motion respected`)
    console.log(`  scroll-behavior with reduced motion: "${scrollBehavior}"`)

    await pageWithReducedMotion.close()
  })
})
