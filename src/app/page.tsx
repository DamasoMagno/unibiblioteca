import { Book, Menu } from "lucide-react";
import Link from "next/link";

const materias = [
  "Matemática",
  "Português",
  "História",
  "Geografia",
  // "Ciências",
];

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
      <header className="max-w-[800px] mx-auto">
        <h3 className="flex items-center justify-center gap-2 mt-4 font-bold text-xl">
          <Book size={16} />
          Unibiblioteca
        </h3>

        <nav className="flex gap-8 items-center justify-center mt-8">
          <button className="cursor-pointer justify-center items-center">
            <Menu color="#333" size={20} />
          </button>
          {materias.map((materia, index) => (
            <Link href="/" key={index}>
              {materia}
            </Link>
          ))}
        </nav>
      </header>

      <main className="max-w-[800px] mx-auto mt-16">
        <ul className="flex flex-col gap-8">
          {posts.map((post) => {
            return (
              <Link href="/" className="flex flex-col gap-2" key={post.id}>
                <strong>{post.titulo}</strong>
                <p className="text-gray-500">{post.descricao}</p>

                <footer className="flex justify-between items-center">
                  <span>Matemática</span>
                  <span>Texto</span>
                </footer>
              </Link>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
