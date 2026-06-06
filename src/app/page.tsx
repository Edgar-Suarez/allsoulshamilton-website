import { Navbar }         from '@/features/parish/components/navbar'
import { Hero }           from '@/features/parish/components/hero'
import { MassSchedule }   from '@/features/parish/components/mass-schedule'
import { Donations }      from '@/features/parish/components/donations'
import { SponsorsFooter } from '@/features/parish/components/sponsors-footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MassSchedule />
        <Donations />
      </main>
      <SponsorsFooter />
    </>
  )
}
