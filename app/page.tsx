
import Link from "next/link";
import HeroFlashcards from "@/components/HeroFlashcards";
import AIFeature from "@/components/AIFeature";
import ManualFeature from "@/components/ManualFeature";


export default function Home() {
  return (
   
      <main className="min-h-screen bg-[#F5F0ED]">

        <header className="fixed top-0 z-50 w-full border-b border-[#C6C4E0]/40 bg-[#F5F0ED]/90 backdrop-blur-md">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

            <Link
              href="/"
              className="font-[var(--font-cormorant)] text-4xl font-semibold tracking-wide text-[#202B4A]"
            >
              Mindra<span className="text-[#7775A8]">.</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[#202B4A]"
              >
                Entrar
              </Link>

              <Link
                href="/cadastro"
                className="rounded-xl bg-[#202B4A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7775A8]"
              >
                Criar conta
              </Link>
            </div>

          </nav>
        </header>

        <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-16 px-8 pb-16 pt-32 md:grid-cols-2">

          <div className="flex flex-col items-start">
            <span className="mb-6 text-sm font-medium tracking-[0.25em] text-[#7775A8]">
              SUA JORNADA DE APRENDIZADO
            </span>

            <h1 className="font-[var(--font-cormorant)] text-5xl font-semibold leading-tight text-[#202B4A] md:text-6xl">
              Aprenda.
              <br />
              Lembre.
              <br />
              <span className="text-[#7775A8]">Evolua.</span>
            </h1>

            <p className="mt-6 text-lg text-[#7775A8]">
              Uma nova forma de construir conhecimento.
            </p>

            <p className="mt-3 max-w-md leading-relaxed text-[#626174]">
              Transforme seus materiais em flashcards, organize seus estudos
              e acompanhe sua evolução.
            </p>

            <Link
              href="/cadastro"
              className="mt-9 rounded-xl bg-[#202B4A] px-7 py-4 font-medium text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#7775A8]"
            >
              Começar
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <HeroFlashcards />
          </div>

        </section>

        <AIFeature />
        <ManualFeature />
      </main>
  
  );
}
