
"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const flashcards = [
  {
    front: "Seu aprendizado começa com uma boa pergunta.",
    back: "A curiosidade é o primeiro passo para descobrir.",
  },
  {
    front: "Transforme seus materiais em conhecimento.",
    back: "Com a Mindra, seus estudos ganham uma nova forma.",
  },
  {
    front: "Cada revisão é uma oportunidade de evoluir.",
    back: "Aprender também é lembrar do que você estudou.",
  },
];

export default function HeroFlashcards() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isFlipped) {
        setIsFlipped(true);
      } else {
        setIsFlipped(false);
        setCurrentCard((current) => (current + 1) % flashcards.length);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isFlipped]);

  const card = flashcards[currentCard];

  return (
    <div className="w-full max-w-md">
      <div
        className="relative h-72 w-full"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="relative h-full w-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white p-10 text-center shadow-xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <h2 className="text-3xl font-semibold leading-relaxed text-[#202B4A]">
              {card.front}
            </h2>
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center rounded-3xl bg-[#7775A8] p-10 text-center shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h2 className="text-3xl font-semibold leading-relaxed text-white">
              {card.back}
            </h2>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
