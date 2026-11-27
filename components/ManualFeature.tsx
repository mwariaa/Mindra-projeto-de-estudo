
export default function ManualFeature() {
  return (
    <section className="bg-[#F5F0ED] px-8 py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-20 md:grid-cols-2">

        <div className="order-2 flex items-center justify-center md:order-1">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

            <div className="mb-8 flex items-center justify-between">
              <span className="text-sm font-semibold tracking-widest text-[#7775A8]">
                MINDRA · NOVO FLASHCARD
              </span>
              <span className="rounded-full bg-[#F5F0ED] px-3 py-1 text-xs text-[#7775A8]">
                Manual
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#202B4A]">
                  Pergunta
                </label>
                <div className="rounded-xl border border-[#C6C4E0]/60 bg-[#FDFCFC] p-5">
                  <p className="text-[#202B4A]">
                    O que é inteligência artificial?
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#202B4A]">
                  Resposta
                </label>
                <div className="rounded-xl border border-[#C6C4E0]/60 bg-[#FDFCFC] p-5">
                  <p className="text-[#7775A8]">
                    É a área da computação que desenvolve sistemas capazes
                    de realizar tarefas que exigem inteligência humana.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#F0ECEA] pt-5">
                <span className="text-xs text-[#7775A8]">
                  Seu conhecimento, do seu jeito.
                </span>
                <span className="rounded-xl bg-[#202B4A] px-5 py-3 text-sm font-medium text-white">
                  Salvar flashcard
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <span className="text-sm font-semibold tracking-[0.2em] text-[#7775A8]">
            DO SEU JEITO
          </span>

          <h2 className="mt-5 text-4xl font-semibold leading-tight text-[#202B4A] md:text-5xl">
            Seu aprendizado também pode começar por você.
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-[#7775A8]">
            Crie seus próprios flashcards, registre perguntas e respostas
            e organize cada informação de acordo com sua maneira de estudar.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7775A8]">
                01
              </span>
              <p className="text-[#202B4A]">
                Escreva suas próprias perguntas.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7775A8]">
                02
              </span>
              <p className="text-[#202B4A]">
                Adicione respostas e informações importantes.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7775A8]">
                03
              </span>
              <p className="text-[#202B4A]">
                Organize seus cartões por matéria e conteúdo.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
