"use client";
import Link from "next/link";
import { collection, query, getDocs } from "firebase/firestore";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { firestore } from "@/services/firebase";
import { PostSkeleton } from "@/components/post-skeleton";

interface SubjectProps {
  id: string;
  name: string;
}

export default function Categories() {
  const [subjects, setSubjects] = useState<SubjectProps[]>([]);
  const [isLoading, setLoading] = useState(true);

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

  return (
    <div className="px-8 w-full">
      <main className="max-w-[800px] mx-auto mt-16 flex flex-col gap-4">
        <Link
          href="/admin/create-post"
          className="flex justify-center itens-center gap-2 border text-white border-transparent bg-gray-800 px-4 py-1 rounded-4xl hover:border-gray-800 hover:bg-transparent hover:text-gray-800 transition-all cursor-pointer w-[160px] self-end"
        >
          Cadastrar matéria
        </Link>

        <div className="flex flex-col gap-8">
          <Input placeholder="Buscar matéria" />
          <span className="font-light text-gray-400 text-[14px] text-right">
            {subjects.length} matérias encontradas
          </span>
        </div>

        <ul className="flex flex-col gap-8">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={i} />)
            : subjects.map((post) => (
                <Link
                  href={`/admin/edit-post/${post.id}`}
                  className="flex flex-col gap-2 border-b border-gray-100/50 pb-8 last:border-none"
                  key={post.id}
                >
                  <strong className="text-[18px] text-gray-800">
                    {post.name}
                  </strong>
                </Link>
              ))}
        </ul>
      </main>
    </div>
  );
}
