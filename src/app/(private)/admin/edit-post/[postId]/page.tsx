"use client";
import { firestore } from "@/services/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { Params } from "next/dist/server/request/params";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Trash } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, query, getDocs } from "firebase/firestore";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PostParams extends Params {
  postId: string;
}

const postSchema = z.object({
  video: z.string().url(),
  title: z.string().min(3).max(100),
  subject: z.string({
    message: "Informe uma categoria",
  }),
  description: z.string().min(3).max(255),
  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        const selectedFile =
          file instanceof FileList ? (file as FileList) : null;
        if (!selectedFile) return true;

        return selectedFile[0].type.match(/^image\/(png|jpeg|jpg|svg|gif)$/i);
      },
      {
        message:
          "Apenas imagens do tipo PNG, JPEG, JPG, SVG, GIF são permitidas.",
      }
    ),
});

type Post = z.infer<typeof postSchema>;

interface Category {
  id: string;
  name: string;
}

export default function Page() {
  const router = useRouter()
  const params = useParams() as PostParams;

  const [file, setFile] = useState("");
  const [subjects, setSubjects] = useState<Category[]>([]);

  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    control,
    register,
    watch,
    reset,
  } = useForm<Post>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      image: "",
    },
  });

  useEffect(() => {
    async function fetchPost() {
      try {
        const docRef = doc(firestore, "post", params.postId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.log("Post não encontrado");
          return;
        }

        const post = docSnap.data() as Post;

        reset(post);
        setFile(post.image);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPost();
  }, [params.postId]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const postsCollection = query(collection(firestore, "subject"));
        const querySnapshot = await getDocs(postsCollection);

        setSubjects(
          querySnapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            name: snapshot.data().name,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, []);

  async function handleCreateNewPost(data: Post) {
    try {
      let imageUrl;

      if (data.image) {
        imageUrl = await uploadFile(data.image[0]);
      }

      await updateDoc(doc(firestore, "post", params.postId), {
        title: data.title,
        description: data.description,
        image: imageUrl?.url ? imageUrl.url : file,
        video: data.video,
        subject: data.subject,
        createdAt: new Date(),
      });

      toast.success("Post cadastrado com sucesso.");
    } catch (error) {
      console.log(error);
    }
  }

  async function deletePost() {
    try {
      await deleteDoc(doc(firestore, "post", params.postId));
      toast.success("Post deletado com sucesso.");

      router.push("/admin")
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
    }
  }

  async function uploadFile(image: File | undefined) {
    try {
      if (!image) return;

      const form = new FormData();
      form.append("image", image);

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

  const filePreview = watch("image");
  console.log(errors);

  useEffect(() => {
    if (filePreview?.length && typeof filePreview !== "string") {
      const formattedFile = filePreview[0];
      const objectUrl = URL.createObjectURL(formattedFile);

      setFile(objectUrl);
    }
  }, [filePreview]);

  return (
    <div className="px-8 w-full h-screen">
      <main className="max-w-[800px] mx-auto mt-16 flex flex-col gap-4">
        <header className="flex items-center justify-between">
          <h3>Cadastrar um conteudo</h3>
          <Button onClick={deletePost} className="flex gap-2 items-center">
            <Trash size={30}/>
            Deletar
          </Button>
        </header>

        <form
          onSubmit={handleSubmit(handleCreateNewPost)}
          className="flex flex-col gap-4"
        >
          <Controller
            control={control}
            name="subject"
            render={({ field }) => {
              return (
                <Select
                  value={field.value}
                  onValueChange={(e) => {
                    if (!e) return;
                    field.onChange(e);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />

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

          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value } }) => (
              console.log(value),
              (<Input type="file" onChange={(e) => onChange(e.target.files)} />)
            )}
          />
          {file && (
            <img
              src={file}
              alt="Preview"
              className="w-full h-128 object-cover rounded"
            />
          )}
          <div>
            <Input placeholder="Informe um título" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Informe uma descrição"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <Button>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Atualizar"}
          </Button>
        </form>
      </main>
    </div>
  );
}
