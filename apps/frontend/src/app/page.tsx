import { Suspense } from "react";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { FeaturedGames } from "@/components/marketing/featured-games";
import { GameCategories } from "@/components/marketing/game-categories";
import { PromotionsBanner } from "@/components/marketing/promotions-banner";
import { GameGrid } from "@/components/games/game-grid";
import { UserWelcome } from "@/components/account/user-welcome";
import { JackpotCounter } from "@/components/marketing/jackpot-counter";
import { PersonalizedRecommendations } from "@/components/marketing/personalized-recommendations";
import { LiveChatButton } from "@/components/support/live-chat-button";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatedBackground } from "@/components/ui/animated-background";
import {
  FeaturedGamesSkeleton,
  GameGridSkeleton,
  RecommendationsSkeleton,
} from "@/components/ui/skeletons";

export const metadata = {
  title: "Zalvira Casino - Najlepsze gry i zakłady online",
  description:
    "Odkryj świat emocji w Zalvira Casino. Najnowsze sloty, gry stołowe, kasyno na żywo i wiele więcej.",
};

export default function HomePage() {
  return (
    <PageTransition>
      <AnimatedBackground>
        <div className="relative z-10 space-y-8 pb-16">
          <HeroCarousel />

          <section className="container mx-auto px-4">
            <UserWelcome />
            <JackpotCounter className="mt-4" />
          </section>

          <section className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
              Polecane gry
            </h2>
            <Suspense fallback={<FeaturedGamesSkeleton />}>
              <FeaturedGames />
            </Suspense>
          </section>

          <section className="container mx-auto px-4 py-8">
            <GameCategories />
          </section>

          <PromotionsBanner className="my-12" />

          <section className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-secondary-300 to-secondary-500 bg-clip-text text-transparent">
              Nowe gry
            </h2>
            <Suspense fallback={<GameGridSkeleton />}>
              <GameGrid filter="new" limit={12} />
            </Suspense>
          </section>

          <section className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
              Dla Ciebie
            </h2>
            <Suspense fallback={<RecommendationsSkeleton />}>
              <PersonalizedRecommendations />
            </Suspense>
          </section>
        </div>

        <LiveChatButton />
      </AnimatedBackground>
    </PageTransition>
  );
}
