"use client";
import { firestore } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Params } from "next/dist/server/request/params";
import ReactPlayer from "react-player";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";
// import { Heart } from "lucide-react";

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
  ranking: number;
}

export default function Page() {
  const [post, setPost] = useState<Post | null>(null);
  // const [likedPost, setLikedPost] = useState(false);
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

  // const handleLikePost = async () => {
  //   try {
  //     const docRef = doc(firestore, "post", params.postId);
  //     const docSnap = await getDoc(docRef);

  //     if (!post) return;

  //     await updateDoc(doc(firestore, "appointment", params.postId), {
  //       ranking: post.ranking + 1,
  //     });

  //     if (docSnap.exists()) {
  //       setPost(docSnap.data() as Post);
  //     } else {
  //       console.log("No such document!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="px-8">
      <div className="max-w-[800px] mx-auto mt-16 flex flex-col gap-4">
        {!post ? (
          <>
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="w-full aspect-video rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
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
          </>
        )}
      </div>
    </div>
  );
}
