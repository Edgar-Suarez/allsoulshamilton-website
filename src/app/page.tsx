import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/features/parish/components/navbar'
import { Hero } from '@/features/parish/components/hero'
import { MassSchedule } from '@/features/parish/components/mass-schedule'
import { Sacraments } from '@/features/parish/components/sacraments'
import { Donations } from '@/features/parish/components/donations'
import { SponsorsFooter } from '@/features/parish/components/sponsors-footer'
import { WeeklySermon } from '@/features/parish/components/weekly-sermon'
import { DailyQuote } from '@/features/parish/components/daily-quote'
import { Announcements } from '@/features/parish/components/announcements'
import { ContentErrorBoundary } from '@/features/parish/components/content-error-boundary'
import type { ParishContentDisplay } from '@/features/parish/types'

// ISR: Revalidate every 5 minutes (300 seconds)
// This allows fresh content from the Voice CMS to appear without full redeploy
export const revalidate = 300

// Structured logging
const log = {
  error: (component: string, message: string, details?: unknown) => {
    const logMsg = `[ERROR] [${component}] - ${message}`
    console.error(logMsg, details || '')
  }
}

// Fetch content from Supabase
async function fetchParishContent() {
  try {
    const supabase = await createClient()

    // Fetch latest sermon (1)
    const { data: sermonData, error: sermonError } = await supabase
      .from('parish_content')
      .select('*')
      .eq('section', 'sermon')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (sermonError && sermonError.code !== 'PGRST116') {
      log.error('WeeklySermon', `Supabase error: ${sermonError.message}`, sermonError)
    }

    // Fetch latest quote (1)
    const { data: quoteData, error: quoteError } = await supabase
      .from('parish_content')
      .select('*')
      .eq('section', 'quote')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (quoteError && quoteError.code !== 'PGRST116') {
      log.error('DailyQuote', `Supabase error: ${quoteError.message}`, quoteError)
    }

    // Fetch latest announcements (5)
    const { data: announcementsData, error: announcementsError } = await supabase
      .from('parish_content')
      .select('*')
      .eq('section', 'announcement')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(5)

    if (announcementsError) {
      log.error('Announcements', `Supabase error: ${announcementsError.message}`, announcementsError)
    }

    return {
      sermon: sermonData as ParishContentDisplay | null,
      quote: quoteData as ParishContentDisplay | null,
      announcements: (announcementsData as ParishContentDisplay[]) || [],
    }
  } catch (error) {
    log.error('FetchParishContent', `Fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`, error)
    return {
      sermon: null,
      quote: null,
      announcements: [],
    }
  }
}

export default async function Home() {
  const { sermon, quote, announcements } = await fetchParishContent()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MassSchedule />

        <ContentErrorBoundary componentName="WeeklySermon">
          <WeeklySermon sermon={sermon || undefined} />
        </ContentErrorBoundary>

        <ContentErrorBoundary componentName="DailyQuote">
          <DailyQuote quote={quote || undefined} />
        </ContentErrorBoundary>

        <ContentErrorBoundary componentName="Announcements">
          <Announcements announcements={announcements} />
        </ContentErrorBoundary>

        <Sacraments />
        <Donations />
      </main>
      <SponsorsFooter />
    </>
  )
}
