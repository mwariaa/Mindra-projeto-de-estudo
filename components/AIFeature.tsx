
export default function AIFeature() {
  return (
    <section className="bg-white px-8 py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">

        <div>
          <span className="text-sm font-semibold tracking-[0.2em] text-[#7775A8]">
            INTELIGÊNCIA ARTIFICIAL
          </span>

          <h2 className="mt-5 text-4xl font-semibold leading-tight text-[#202B4A] md:text-5xl">
            Seu material.
            <br />
            Novas formas de aprender.
          </h2>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#7775A8]">
            Envie seus materiais de estudo e deixe a inteligência artificial
            ajudar a transformar conteúdos em flashcards.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex items-start gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F0ED] text-[#7775A8]">
                01
              </span>
              <div>
                <h3 className="font-semibold text-[#202B4A]">
                  Envie seu material
                </h3>
                <p className="mt-1 text-sm text-[#7775A8]">
                  Utilize seus materiais de estudo em PDF.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F0ED] text-[#7775A8]">
                02
              </span>
              <div>
                <h3 className="font-semibold text-[#202B4A]">
                  A IA organiza o conteúdo
                </h3>
                <p className="mt-1 text-sm text-[#7775A8]">
                  Os principais assuntos são identificados e transformados.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F0ED] text-[#7775A8]">
                03
              </span>
              <div>
                <h3 className="font-semibold text-[#202B4A]">
                  Seus flashcards ficam prontos
                </h3>
                <p className="mt-1 text-sm text-[#7775A8]">
                  Revise, personalize e comece a aprender.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[430px] items-center justify-center rounded-[2rem] bg-[#F5F0ED] p-8">

          <div className="absolute left-8 top-10 rotate-[-8deg] rounded-2xl bg-white p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5E7E7] text-xl text-[#B87979]">
                PDF
              </div>
              <div>
                <p className="font-semibold text-[#202B4A]">
                  Material de estudo
                </p>
                <p className="text-xs text-[#7775A8]">Documento PDF</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div className="h-2 w-40 rounded-full bg-[#E8E5E2]" />
              <div className="h-2 w-32 rounded-full bg-[#E8E5E2]" />
              <div className="h-2 w-36 rounded-full bg-[#E8E5E2]" />
            </div>
          </div>

          <div className="absolute right-8 top-24 rounded-2xl bg-[#7775A8] px-5 py-3 text-sm font-medium text-white shadow-lg">
            ✦ Inteligência artificial
          </div>

          <div className="relative z-10 mt-28 w-full max-w-sm rotate-[3deg] rounded-3xl bg-white p-8 shadow-2xl">
            <span className="text-xs font-semibold tracking-widest text-[#7775A8]">
              MINDRA · FLASHCARD
            </span>

            <h3 className="mt-8 text-2xl font-semibold leading-relaxed text-[#202B4A]">
              Como transformar informação em conhecimento?
            </h3>

            <div className="mt-8 h-1 w-full rounded-full bg-[#F5F0ED]">
              <div className="h-1 w-2/3 rounded-full bg-[#7775A8]" />
            </div>

            <p className="mt-4 text-xs text-[#7775A8]">
              Um novo jeito de estudar.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
