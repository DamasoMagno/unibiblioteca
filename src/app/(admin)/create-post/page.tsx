"use client";
import { Book, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { removeSession } from '@/actions/auth-actions';

import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { firestore } from "@/services/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const postSchema = z.object({
  video: z.string().url(),
  titulo: z.string().min(3).max(100),
  category: z.string({
    message: "Informe uma categoria",
  }),
  descricao: z.string().min(3).max(255),
  imagem: z
    .instanceof(FileList)
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
          "application/pdf",
        ].includes(file?.[0].type),
      {
        message:
          "Apenas imagens do tipo PNG, JPEG, JPG, SVG, GIF são permitidas.",
      }
    )
    .optional(),
});

type Post = z.infer<typeof postSchema>;

interface Category {
  id: string;
  name: string;
}

export default function Create() {
  const [file, setFile] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    control,
    watch,
    register,
  } = useForm<Post>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      category: "",
    },
  });

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsCollection = query(collection(firestore, "category"));
        const querySnapshot = await getDocs(postsCollection);

        setCategories(
          querySnapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            name: snapshot.data().name,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    }

    fetchPosts();
  }, []);

  async function handleCreateNewPost(data: Post) {
    try {
      let imageUrl;

      if (data.imagem) {
        imageUrl = await uploadFile(data.imagem[0]);
      }

      await addDoc(collection(firestore, "appointment"), {
        titulo: data.titulo,
        descricao: data.descricao,
        imageUrl: imageUrl?.url,
        video: data.video,
        category: data.category,
        createdAt: new Date(),
      });

      toast.success("Post cadastrado com sucesso.");
    } catch (error) {}
  }

  async function uploadFile(image: File | undefined) {
    try {
      const form = new FormData();
      form.append("image", image as any);

      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      return {
        url: data.url as string,
      };
    } catch (error) {
      console.log(error);
    }
  }

  const filePreview = watch("imagem");

  useEffect(() => {
    if (filePreview?.length && typeof filePreview !== "string") {
      const formattedFile = filePreview[0];
      const objectUrl = URL.createObjectURL(formattedFile);

      if (file !== objectUrl) setFile(objectUrl);
    }
  }, [filePreview]);

  return (
    <div className="px-8">
      <header className="max-w-[800px] mx-auto">
        <h3 className="flex items-center justify-center gap-2 mt-4 font-bold text-xl">
          <Book size={16} />
          Unibiblioteca
        </h3>
        <Button onClick={removeSession}>
          Sair
        </Button>
      </header>

      <main className="max-w-[800px] mx-auto mt-16 flex flex-col gap-4">
        <h3>Cadastrar um conteudo</h3>

        <form
          onSubmit={handleSubmit(handleCreateNewPost)}
          className="flex flex-col gap-4"
        >
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <Input
              placeholder="Informe o vídeo"
              type="url"
              {...register("video")}
            />
            {errors.video && (
              <p className="text-red-500 text-sm">{errors.video.message}</p>
            )}
          </div>
          {file && (
            <img
              src={file}
              alt="Preview"
              className="w-full h-64 object-covers rounded"
            />
          )}
          <Controller
            name="imagem"
            control={control}
            render={({ field: { onChange } }) => (
              <Input type="file" onChange={(e) => onChange(e.target.files)} />
            )}
          />
          <div>
            <Input placeholder="Informe um título" {...register("titulo")} />
            {errors.titulo && (
              <p className="text-red-500 text-sm">{errors.titulo.message}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Informe uma descrição"
              {...register("descricao")}
            />
            {errors.descricao && (
              <p className="text-red-500 text-sm">{errors.descricao.message}</p>
            )}
          </div>
          <Button>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Cadastrar"}
          </Button>
        </form>
      </main>
    </div>
  );
}
