"use client";
import Link from "next/link";
import { collection, query, getDocs } from "firebase/firestore";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { firestore } from "@/services/firebase";
import { PostSkeleton } from "@/components/post-skeleton";

interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: Date;
  video: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsCollection = query(collection(firestore, "post"));
        const querySnapshot = await getDocs(postsCollection);

        setPosts(
          querySnapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            title: snapshot.data().title,
            description: snapshot.data().description,
            image: snapshot.data().image,
            createdAt: snapshot.data().createdAt,
            video: snapshot.data().video,
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
      <Header />
      <main className="max-w-[800px] mx-auto mt-16 flex flex-col gap-4">
        <div className="flex flex-col gap-8">
          <Input placeholder="Buscar conteudo " />
          <span className="font-light text-gray-400 text-[14px] text-right">
            {posts.length} posts encontrados
          </span>
        </div>

        <ul className="flex flex-col gap-8">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={i} />)
            : posts.map((post) => {
                return (
                  <Link
                    href={`/post/${post.id}`}
                    className="flex flex-col gap-2 border-b border-gray-100/50 pb-8 last:border-none"
                    key={post.id}
                  >
                    <strong className="text-[18px] text-gray-800">
                      {post.title}
                    </strong>
                    <p className="text-gray-500 leading-9 text-base mt-2">
                      {post.description}
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
