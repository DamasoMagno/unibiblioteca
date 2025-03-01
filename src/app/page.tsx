"use client";
import Link from "next/link";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";


const posts = [
  {
    id: 1,
    titulo: "🌍 Descubra os Segredos da Geografia!",
    descricao:
      "Conheça os principais conceitos de Geografia de forma clara e prática. Entenda mapas, relevo, clima e muito mais!",
  },
  {
    id: 2,
    titulo: "📖 Português Sem Mistérios: Dicas Essenciais!",
    descricao:
      "Aprenda gramática, interpretação de texto e redação com explicações simples e diretas. Torne-se um mestre da língua portuguesa!",
  },
  {
    id: 3,
    titulo: "🏛 História: Momentos que Moldaram o Mundo!",
    descricao:
      "Reviva os principais acontecimentos históricos e entenda como eles impactam o presente. Uma viagem pelo passado!",
  },
  {
    id: 4,
    titulo: "🔬 Ciências Descomplicadas: Aprenda com Facilidade!",
    descricao:
      "Quer entender os principais conceitos de Ciências? Neste resumo, exploramos Biologia, Química e Física de forma simples e objetiva, facilitando o aprendizado e a aplicação no dia a dia. 🚀🔬",
  },
  {
    id: 5,
    titulo: "💰 Educação Financeira: Como Cuidar do Seu Dinheiro!",
    descricao:
      "Aprenda a organizar suas finanças, economizar e investir de forma inteligente. Um guia essencial para sua vida financeira!",
  },
];

export default function Home() {
  return (
    <div className="px-8">
      <Header />

      <main className="max-w-[800px] mx-auto mt-16 flex flex-col gap-4">
        <div className="flex flex-col gap-8">
          <Input placeholder="Buscar conteudo " />
          <span className="font-light text-gray-400 text-[14px] text-right">12 posts encontrados</span>
        </div>

        <ul className="flex flex-col gap-8">
          {posts.map((post) => {
            return (
              <Link
                href="/"
                className="flex flex-col gap-2 border-b border-gray-100/50 pb-8 last:border-none"
                key={post.id}
              >
                <strong className="text-[18px] text-gray-800">
                  {post.titulo}
                </strong>
                <p className="text-gray-500 leading-9 text-base mt-2">
                  {post.descricao}
                </p>

                <footer className="flex justify-between items-center mt-6">
                  <span className="text-gray-600 font-medium text-base">
                    por: Italo Fonseca
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </footer>
              </Link>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
