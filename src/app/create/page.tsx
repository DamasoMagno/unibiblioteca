"use client";
import { Book } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const postSchema = z.object({
  titulo: z.string().min(3).max(100),
  descricao: z.string().min(3).max(255),
  imagem: z.string().url(),
});

export default function Create() {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      imagem: "",
    },
  });

  return (
    <div className="px-8">
      <header className="max-w-[800px] mx-auto">
        <h3 className="flex items-center justify-center gap-2 mt-4 font-bold text-xl">
          <Book size={16} />
          Unibiblioteca
        </h3>
      </header>

      <main className="max-w-[800px] mx-auto mt-16 flex flex-col gap-4">
        <h3>Cadastrar um conteudo</h3>

        <form>
          <Input type="file"/>
          <Input placeholder="Informe um título" />
          <Textarea placeholder="Informe uma descrição" />
          <Input type="file" />
          <Button>Cadastrar</Button>
        </form>
      </main>
    </div>
  );
}
