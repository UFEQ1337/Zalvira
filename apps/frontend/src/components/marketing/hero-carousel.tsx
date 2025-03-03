"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Powitalny Bonus 100%",
    description:
      "Zarejestruj się dziś i zgarnij 100% bonus do 1000 PLN na start!",
    buttonText: "Odbierz Bonus",
    buttonLink: "/promotions/welcome",
    bgColor: "from-primary-600 to-primary-900",
    image: "/api/placeholder/800/400",
  },
  {
    id: 2,
    title: "Nowe Sloty VIP",
    description:
      "Ekskluzywne automaty o wysokiej wygranej tylko w Zalvira Casino!",
    buttonText: "Zagraj Teraz",
    buttonLink: "/slots/vip",
    bgColor: "from-secondary-600 to-secondary-900",
    image: "/api/placeholder/800/400",
  },
  {
    id: 3,
    title: "Turniej Weekendowy",
    description:
      "Weź udział w weekendowym turnieju i wygraj nagrodę główną 10,000 PLN!",
    buttonText: "Dołącz do Turnieju",
    buttonLink: "/tournaments/weekend",
    bgColor: "from-accent-600 to-accent-900",
    image: "/api/placeholder/800/400",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Zatrzymaj autoplay podczas najechania myszką
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, currentSlide]);

  return (
    <div
      className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tło/zdjęcia karuzeli */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className={cn(
            "absolute inset-0 bg-gradient-to-r",
            slides[currentSlide].bgColor
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              opacity: 0.3,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Przyciski nawigacji */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white z-10 transition-colors"
        aria-label="Poprzedni slajd"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white z-10 transition-colors"
        aria-label="Następny slajd"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Zawartość slajdu */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {slides[currentSlide].title}
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-white/90 max-w-lg mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {slides[currentSlide].description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Link href={slides[currentSlide].buttonLink}>
                {slides[currentSlide].buttonText}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Wskaźniki slajdów */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-colors",
              currentSlide === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Przejdź do slajdu ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
