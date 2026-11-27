import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export const instant = false;

export default async function ProgressoPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  const [topicos, historico] = await Promise.all([
    prisma.topic.findMany({
      where: { deck: { userId: session.user.id } },
      include: {
        deck: true,
        _count: { select: { flashcards: true } },
      },
      orderBy: { createdAt: "desc" },
    }),

    prisma.reviewHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { reviewDate: "desc" },
    }),
  ]);

  const classificacaoAtual = new Map<string, string>();

  for (const avaliacao of historico) {
    if (!classificacaoAtual.has(avaliacao.topicId)) {
      classificacaoAtual.set(avaliacao.topicId, avaliacao.rating);
    }
  }

  const totalTopicos = topicos.length;

  const totalAprofundar = topicos.filter(
    (topico) => classificacaoAtual.get(topico.id) === "APROFUNDAR"
  ).length;

  const totalRevisar = topicos.filter(
    (topico) => classificacaoAtual.get(topico.id) === "REVISAR"
  ).length;

  const totalDominando = topicos.filter(
    (topico) => classificacaoAtual.get(topico.id) === "DOMINANDO"
  ).length;

  const totalAvaliados =
    totalAprofundar + totalRevisar + totalDominando;

  const percentual =
    totalAvaliados > 0
      ? Math.round((totalDominando / totalAvaliados) * 100)
      : 0;

  const materias = Array.from(
    new Map(topicos.map((topico) => [topico.deck.id, topico.deck])).values()
  );

  return (
    <main className="flex min-h-screen bg-[#F5F0ED]">
      <Sidebar />

      <div className="min-w-0 flex-1 px-6 py-10 md:px-12 md:py-14">
        <header className="mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#7775A8]">
            SUA JORNADA DE APRENDIZADO
          </p>

          <h1 className="mt-3 font-[var(--font-cormorant)] text-5xl font-semibold text-[#202B4A]">
            Meu progresso.
          </h1>

          <p className="mt-3 text-sm text-[#7775A8]">
            Cada revisão é um passo a mais na sua evolução.
          </p>
        </header>

        {/* Gráfico à esquerda e domínio à direita */}
        <section className="mb-10 grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col justify-center rounded-[28px] bg-white p-7 shadow-sm md:p-10">
            <h2 className="text-lg font-semibold text-[#202B4A]">
              Distribuição dos conteúdos
            </h2>

            <p className="mt-1 text-sm text-[#7775A8]">
              Como estão suas classificações.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-8">
              <div className="relative h-44 w-44 shrink-0">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#F0EFF8"
                    strokeWidth="13"
                  />

                  {totalAvaliados > 0 && (
                    <>
                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke="#83A68A"
                        strokeWidth="13"
                        strokeDasharray={`${(totalDominando / totalAvaliados) * 282.74} 282.74`}
                      />

                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke="#D2B66F"
                        strokeWidth="13"
                        strokeDasharray={`${(totalRevisar / totalAvaliados) * 282.74} 282.74`}
                        strokeDashoffset={`${-(totalDominando / totalAvaliados) * 282.74}`}
                      />

                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke="#C58D86"
                        strokeWidth="13"
                        strokeDasharray={`${(totalAprofundar / totalAvaliados) * 282.74} 282.74`}
                        strokeDashoffset={`${-((totalDominando + totalRevisar) / totalAvaliados) * 282.74}`}
                      />
                    </>
                  )}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold text-[#202B4A]">
                    {totalAvaliados}
                  </span>
                  <span className="text-[10px] tracking-wider text-[#AAA8B8]">
                    AVALIADOS
                  </span>
                </div>
              </div>

              <div className="min-w-[130px] space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-[#83A68A]" />
                  <div>
                    <p className="text-sm text-[#202B4A]">Dominando</p>
                    <p className="text-xs text-[#AAA8B8]">
                      {totalDominando} conteúdos
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-[#D2B66F]" />
                  <div>
                    <p className="text-sm text-[#202B4A]">Revisar</p>
                    <p className="text-xs text-[#AAA8B8]">
                      {totalRevisar} conteúdos
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-[#C58D86]" />
                  <div>
                    <p className="text-sm text-[#202B4A]">Aprofundar</p>
                    <p className="text-xs text-[#AAA8B8]">
                      {totalAprofundar} conteúdos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[28px] bg-white p-7 shadow-sm md:p-10">
            <p className="text-sm text-[#7775A8]">
              Conteúdos que você já domina
            </p>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-[var(--font-cormorant)] text-6xl font-semibold text-[#202B4A]">
                {percentual}%
              </span>
              <span className="text-sm text-[#AAA8B8]">
                dos conteúdos avaliados
              </span>
            </div>

            <p className="mt-3 text-sm text-[#7775A8]">
              {totalDominando} de {totalAvaliados} conteúdos dominados
            </p>

            <div className="mt-8">
              <div className="mb-3 flex justify-between text-xs text-[#AAA8B8]">
                <span>Seu domínio</span>
                <span>{percentual}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-[#F0EFF8]">
                <div
                  className="h-full rounded-full bg-[#7775A8] transition-all"
                  style={{ width: `${percentual}%` }}
                />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#AAA8B8]">
              Continue estudando no seu ritmo.
            </p>
          </div>
        </section>

        {/* Indicadores */}
        <section className="mb-14">
          <div className="grid grid-cols-3 gap-3 md:gap-5">
            {[
              {
                nome: "Aprofundar",
                total: totalAprofundar,
                cor: "bg-[#C58D86]",
              },
              {
                nome: "Revisar",
                total: totalRevisar,
                cor: "bg-[#D2B66F]",
              },
              {
                nome: "Dominando",
                total: totalDominando,
                cor: "bg-[#83A68A]",
              },
            ].map((item) => (
              <div
                key={item.nome}
                className="rounded-2xl border border-[#C6C4E0]/40 bg-white p-4 md:p-6"
              >
                <div className={`mb-3 h-2 w-2 rounded-full ${item.cor}`} />
                <p className="text-xs text-[#7775A8] md:text-sm">
                  {item.nome}
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#202B4A] md:text-3xl">
                  {item.total}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Matérias */}
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#202B4A]">
                Suas matérias
              </h2>
              <p className="mt-1 text-sm text-[#7775A8]">
                Acompanhe a evolução de cada conteúdo.
              </p>
            </div>

            <span className="text-xs text-[#AAA8B8]">
              {materias.length} {materias.length === 1 ? "matéria" : "matérias"}
            </span>
          </div>

          {materias.length === 0 ? (
            <div className="rounded-3xl border border-[#C6C4E0]/40 bg-white px-6 py-14 text-center">
              <h3 className="font-[var(--font-cormorant)] text-3xl font-semibold text-[#202B4A]">
                Sua evolução começa aqui.
              </h3>
              <p className="mt-3 text-sm text-[#7775A8]">
                Cadastre matérias e conteúdos para acompanhar seu progresso.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {materias.map((materia) => {
                const topicosDaMateria = topicos.filter(
                  (topico) => topico.deck.id === materia.id
                );

                const dominados = topicosDaMateria.filter(
                  (topico) => classificacaoAtual.get(topico.id) === "DOMINANDO"
                ).length;

                const revisao = topicosDaMateria.filter(
                  (topico) => classificacaoAtual.get(topico.id) === "REVISAR"
                ).length;

                const aprofundar = topicosDaMateria.filter(
                  (topico) => classificacaoAtual.get(topico.id) === "APROFUNDAR"
                ).length;

                return (
                  <details
                    key={materia.id}
                    className="group rounded-2xl border border-[#C6C4E0]/40 bg-white p-6"
                  >
                    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-[#202B4A]">
                          {materia.name}
                        </h3>
                        <p className="mt-1 text-xs text-[#AAA8B8]">
                          {topicosDaMateria.length} conteúdos
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="hidden gap-3 text-xs sm:flex">
                          <span className="text-[#B87570]">
                            {aprofundar} aprofundar
                          </span>
                          <span className="text-[#A88A45]">
                            {revisao} revisar
                          </span>
                          <span className="text-[#64866B]">
                            {dominados} dominados
                          </span>
                        </div>

                        <span className="text-lg text-[#7775A8] transition group-open:rotate-180">
                          ⌄
                        </span>
                      </div>
                    </summary>

                    <div className="mt-5 space-y-3 border-t border-[#F0EFF8] pt-4">
                      {topicosDaMateria.map((topico) => {
                        const rating = classificacaoAtual.get(topico.id);

                        const nomes: Record<string, string> = {
                          APROFUNDAR: "Aprofundar",
                          REVISAR: "Revisar",
                          DOMINANDO: "Dominando",
                        };

                        const cores: Record<string, string> = {
                          APROFUNDAR: "text-[#B87570]",
                          REVISAR: "text-[#A88A45]",
                          DOMINANDO: "text-[#64866B]",
                        };

                        return (
                          <div
                            key={topico.id}
                            className="flex flex-wrap items-center justify-between gap-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-[#202B4A]">
                                {topico.name}
                              </p>
                              <p className="mt-1 text-xs text-[#AAA8B8]">
                                {topico._count.flashcards} flashcards
                              </p>
                            </div>

                            <span
                              className={`text-xs font-semibold ${
                                rating ? cores[rating] : "text-[#AAA8B8]"
                              }`}
                            >
                              {rating ? nomes[rating] : "Não avaliado"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}