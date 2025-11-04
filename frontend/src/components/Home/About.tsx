"use client";

export function About() {
  return (
    <section id="sobre" className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <div className="rounded-2xl shadow-xl ring-1 ring-slate-200 w-full h-80 flex items-center justify-center text-slate-500 italic bg-slate-100">
            [ Espaço reservado para imagem de demonstração ]
          </div>
        </div>

        <div className="lg:w-1/2 text-left">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Sobre o sistema
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            Desenvolvido com <b>FastAPI</b>, <b>Laravel</b> e <b>React</b>, o
            sistema foi criado para agilizar diagnósticos de retinopatia
            diabética. Todos os módulos estão integrados via <b>Docker</b> e
            armazenam imagens com <b>Cloudinary</b>, garantindo performance e
            confiabilidade.
          </p>
        </div>
      </div>
    </section>
  );
}
