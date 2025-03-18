"use client";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { Book, Menu } from "lucide-react";
import { removeSession } from "@/actions/auth-actions";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "@/services/firebase";

const materias = ["Matemática", "Física", "Química"];

interface SubjectProps {
  id: string;
  name: string;
}

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<SubjectProps[]>([]);

  const isAdminRoute = path.includes("/admin");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const subjectsCollection = query(collection(firestore, "subject"));
        const querySnapshot = await getDocs(subjectsCollection);

        setSubjects(
          querySnapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            name: snapshot.data().name,
          }))
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    setUserSession(getCookie("user_session") as string | null);
  }, []);

  function navigate() {
    if (userSession) {
      removeSession();
      setUserSession(null);

      return router.push("/");
    }

    router.push("/sign-in");
  }

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="max-w-[800px] mx-auto">
      <h3 className="flex items-center justify-center gap-2 mt-4 font-bold text-xl">
        <Book size={16} />
        UniBiblioteca
      </h3>

      <nav className="flex gap-8 items-center justify-between mt-8">
        {isAdminRoute ? (
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex justify-center itens-center gap-2 text-gray-600 p-1 rounded-4xl"
            >
              Posts
            </Link>

            <Link
              href="/admin/subjects"
              className="flex justify-center itens-center gap-2 text-gray-600 p-1 rounded-4xl"
            >
              Matérias
            </Link>
            <Link
              href="/admin/suggestions"
              className="flex justify-center itens-center gap-2 text-gray-600 p-1 rounded-4xl"
            >
              Sugestões
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <button
              className="cursor-pointer flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu color="#333" size={24} />
            </button>

            <ul className="flex gap-4">
              {subjects.map((materia, index) => (
                <Link
                  href="/"
                  key={index}
                  data-last={materias.indexOf(materia.name) > 1}
                  className="data-[last=true]:hidden min-sm:data-[last=true]:block"
                >
                  {materia.name}
                </Link>
              ))}
            </ul>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={navigate}
          className="flex justify-center itens-center gap-2 border text-gray-400 border-gray-400 px-4 py-1 rounded-4xl hover:border-gray-800 hover:text-gray-800 transition-all cursor-pointer"
        >
          <span>{userSession ? "Sair" : "Entrar"}</span>
        </Button>
      </nav>
    </header>
  );
}
