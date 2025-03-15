"use client";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, addDoc } from "firebase/firestore";

import { z } from "zod";

import { firestore } from "@/services/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

const suggestionSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(255),
});

type Sugggestion = z.infer<typeof suggestionSchema>;

export default function Create() {
  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    register,
  } = useForm<Sugggestion>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function handleCreateNewPost(data: Sugggestion) {
    try {
      const suggestion: Sugggestion = {
        title: data.title,
        description: data.description,
      };

      await addDoc(collection(firestore, "suggestion"), suggestion);

      toast.success("Sugestão enviada");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="px-8">
      <main className="max-w-[800px] mx-auto mt-16 flex flex-col gap-4">
        <h3>Cadastrar um conteudo</h3>

        <form
          onSubmit={handleSubmit(handleCreateNewPost)}
          className="flex flex-col gap-4"
        >
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
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Cadastrar"}
          </Button>
        </form>
      </main>
    </div>
  );
}
