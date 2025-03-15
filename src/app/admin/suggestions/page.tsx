"use client";
import { collection, query, getDocs } from "firebase/firestore";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { firestore } from "@/services/firebase";
import { PostSkeleton } from "@/components/post-skeleton";

interface SuggestionProps {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export default function Posts() {
  const [suggestions, setSuggestions] = useState<SuggestionProps[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsCollection = query(collection(firestore, "post"));
        const querySnapshot = await getDocs(postsCollection);

        setSuggestions(
          querySnapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            title: snapshot.data().title,
            description: snapshot.data().description,
            createdAt: snapshot.data().createdAt,
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
    <div className="px-8">
      <Header />

      <main className="max-w-[800px] mx-auto mt-16 flex flex-col gap-4">
        <div className="flex flex-col gap-8">
          <Input placeholder="Buscar conteudo " />
        </div>

        <ul className="flex flex-col gap-8">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={i} />)
            : suggestions.map((suggestion) => (
                <li
                  className="flex flex-col gap-2 border-b border-gray-100/50 pb-8 last:border-none"
                  key={suggestion.id}
                >
                  <strong className="text-[18px] text-gray-800">
                    {suggestion.title}
                  </strong>
                  <p className="text-gray-500 leading-9 text-base mt-2">
                    {suggestion.description}
                  </p>
                </li>
              ))}
        </ul>
      </main>
    </div>
  );
}
