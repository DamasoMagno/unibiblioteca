"use client";
import { firestore } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Params } from "next/dist/server/request/params";
import ReactPlayer from "react-player";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PostParams extends Params {
  postId: string;
}

interface Post {
  id: string;
  titulo: string;
  descricao: string;
  imageUrl: string;
  createdAt: Date;
  video: string;
}

export default function Page() {
  const [post, setPost] = useState<Post | null>(null);
  const params = useParams() as PostParams;

  useEffect(() => {
    async function fetchPost() {
      try {
        const docRef = doc(firestore, "appointment", params.postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data() as Post);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchPost();
  }, [params.postId]);

  return (
    <div className="px-8">
      <div className="max-w-[800px] mx-auto mt-16 flex flex-col gap-4">
        {/* Se os dados ainda estão carregando, exibe o Skeleton */}
        {!post ? (
          <>
            {/* Skeleton do título */}
            <Skeleton className="h-6 w-48 rounded-md" />

            {/* Skeleton do vídeo */}
            <Skeleton className="w-full aspect-video rounded-md" />

            {/* Skeleton da descrição */}
            <Skeleton className="h-16 w-full rounded-md" />

            {/* Skeleton da imagem dentro do card */}
            <Card className="mt-8">
              <CardContent>
                <Skeleton className="h-52 w-full rounded-md" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <strong className="text-[18px] text-gray-800">{post.titulo}</strong>

            <div className="w-full aspect-video">
              <ReactPlayer
                url={post.video}
                width="100%"
                height="100%"
                controls
              />
            </div>

            <p className="text-gray-500 leading-9 text-base">
              {post.descricao}
            </p>

            {/* <Card className="mt-8">
              <CardContent>
                <img
                  src={post.imageUrl}
                  alt={post.titulo}
                  className="rounded-sm"
                />
              </CardContent>
            </Card> */}
          </>
        )}
      </div>
    </div>
  );
}
