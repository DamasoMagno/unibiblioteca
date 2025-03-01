import { useState } from "react";
import Link from "next/link";
import { Book, Menu } from "lucide-react";

const materias = [
  "Matemática",
  "Física",
  "Química",
  "História",
  "Geografia",
  "Biologia",
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="max-w-[800px] mx-auto">
      <h3 className="flex items-center justify-center gap-2 mt-4 font-bold text-xl">
        <Book size={16} />
        Unibiblioteca
      </h3>

      <nav className="flex gap-8 items-center justify-center mt-8">
        <button
          className="cursor-pointer flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu color="#333" size={24} />
        </button>

        <ul className="flex gap-4">
          {materias.map((materia, index) => (
            <Link
              href="/"
              key={index}
              data-last={materias.indexOf(materia) > 2}
              className="data-[last=true]:hidden min-sm:data-[last=true]:block"
            >
              {materia}
            </Link>
          ))}
        </ul>
      </nav>
    </header>
  );
}
