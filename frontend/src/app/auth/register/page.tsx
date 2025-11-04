"use client";

import { FontAwesomeIcon, icons } from "../../../lib/icons";
import { useAppNavigation } from "../../../hooks/useAppNavigation";
import { routes } from "../../../config/routes";

export default function RegisterPage() {
  const { goTo } = useAppNavigation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl ring-1 ring-slate-200 w-full max-w-md">
        {/* CABEÇALHO */}
        <div className="text-center mb-8">
          <FontAwesomeIcon
            icon={icons.userPlus}
            className="text-sky-500 text-5xl mb-3"
          />
          <h1 className="text-3xl font-bold text-slate-800">
            Criar nova conta
          </h1>
          <p className="text-slate-500 mt-2">Preencha os dados para começar</p>
        </div>

        {/* FORMULÁRIO */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome completo
            </label>
            <input
              type="text"
              placeholder="Digite seu nome"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none transition shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none transition shadow-sm"
              />
              <FontAwesomeIcon
                icon={icons.envelope}
                className="absolute right-4 top-3.5 text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none transition shadow-sm"
              />
              <FontAwesomeIcon
                icon={icons.lock}
                className="absolute right-4 top-3.5 text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
          >
            Criar conta
          </button>
        </form>

        {/* RODAPÉ */}
        <div className="text-center mt-6 text-sm text-slate-500">
          <p>
            Já tem uma conta?{" "}
            <button
              onClick={() => goTo(routes.login)}
              className="text-sky-500 font-semibold hover:underline"
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
