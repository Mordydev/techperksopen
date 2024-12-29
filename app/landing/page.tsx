import { Hero } from './components/Hero'
import { Benefits } from './components/Benefits'
import { HowItWorks } from './components/HowItWorks'
import { PricingTeaser } from './components/PricingTeaser'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Benefits />
        <HowItWorks />
        <PricingTeaser />
        <Footer />
      </main>
    </>
  )
}