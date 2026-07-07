import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/marketing/features"
import { Categories } from "@/components/marketing/categories"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Faq } from "@/components/marketing/faq"
import { Pricing } from "@/components/marketing/pricing"
import { getActiveCategories } from "@/modules/templates/queries/get-categories"
import { getActivePlans } from "@/modules/billing/queries/get-plans"

export default async function HomePage() {
  const [categories, plans] = await Promise.all([getActiveCategories(), getActivePlans()])

  return (
    <>
      <Hero />
      <Features />
      <Categories categories={categories} />
      <HowItWorks />
      <Pricing plans={plans} />
      <Faq />
    </>
  )
}
