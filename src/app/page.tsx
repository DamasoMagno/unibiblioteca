import { Book, Menu } from "lucide-react";
import Link from "next/link";

const materias = [
  "Matemática",
  "Português",
  "História",
  "Geografia",
  "Ciências",
];

export default function Home() {
  return (
    <div>
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
            <Link href={`/materia/${materia.toLowerCase()}`} key={index}>
              {materia}
            </Link>
          ))}
        </nav>
      </header>

      <main>
        <ul className="flex flex-col gap-4">
          <Link href="/">
            <strong>
              📚 Domine a Matemática: Conceitos Essenciais para Aprender de
              Verdade!
            </strong>
            <p>
              Quer melhorar seu desempenho em Matemática? Neste resumo,
              abordamos os conceitos fundamentais de forma simples e objetiva,
              ajudando você a entender e aplicar no dia a dia. 🚀🔢
            </p>

            <footer>
              <span>Matemática</span>
              <span>Texto</span>
            </footer>
          </Link>

          <Link href="/">
            <strong>🌍 Descubra os Segredos da Geografia!</strong>
            <p>
              Conheça os principais conceitos de Geografia de forma clara e
              prática. Entenda mapas, relevo, clima e muito mais!
            </p>

            <footer>
              <span>MMatemática</span>
              <span>Texto</span>
            </footer>
          </Link>

          <Link href="/">
            <strong>📖 Português Sem Mistérios: Dicas Essenciais!</strong>
            <p>
              Aprenda gramática, interpretação de texto e redação com
              explicações simples e diretas. Torne-se um mestre da língua
              portuguesa!
            </p>

            <footer>
              <span>MMatemática</span>
              <span>Texto</span>
            </footer>
          </Link>
        </ul>
      </main>
    </div>
  );
}
