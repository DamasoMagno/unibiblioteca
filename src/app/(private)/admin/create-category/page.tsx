"use client";
import { Book, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, addDoc } from "firebase/firestore";
import {} from "next"
import { z } from "zod";
import { redirect } from "next/navigation";

import { firestore } from "@/services/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";


const postSchema = z.object({
  name: z.string().min(3).max(100),
});

type Post = z.infer<typeof postSchema>;

export default function Create() {
  const [creatingPost, setCreatingPost] = useState(false);

  const { handleSubmit, register } = useForm<Post>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      name: "",
    },
  });

  async function handleCreateNewPost(data: Post) {
    try {
      setCreatingPost(true);

      await addDoc(collection(firestore, "subject"), {
        name: data.name,
        createdAt: new Date(),
      });

      toast.success("Post cadastrado com sucesso.");
      redirect("/admin/subjects")
    } finally {
      setCreatingPost(false);
    }
  }

  return (
    <div className="px-8">
      <header className="max-w-[800px] mx-auto">
        <h3 className="flex items-center justify-center gap-2 mt-4 font-bold text-xl">
          <Book size={16} />
          Unibiblioteca
        </h3>
      </header>

      <main className="max-w-[800px] mx-auto mt-16 flex flex-col gap-4">
        <h3>Cadastrar uma categoria</h3>

        <form
          onSubmit={handleSubmit(handleCreateNewPost)}
          className="flex flex-col gap-4"
        >
          <Input placeholder="Informe um título" {...register("name")} />

          <Button>
            {creatingPost ? <Loader2 className="animate-spin" /> : "Cadastrar"}
          </Button>
        </form>
      </main>
    </div>
  );
}