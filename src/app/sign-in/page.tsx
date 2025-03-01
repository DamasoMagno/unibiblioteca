"use client";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";

const signInSchema = z.object({
  email: z.string().email({
    message: "Por favor, informe um email válido",
  }),
  password: z.string().min(6, "No minimo 6 caraceteres"),
});

type SignIn = z.infer<typeof signInSchema>;

export default function Create() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    reset,
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSignIn(data: SignIn) {
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      reset();
      console.log("User signed in successfully!", response.user);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.message.includes("auth/invalid-credential")) {
          toast.error("Email/Senha incorreto.");
        }
      }
    }
  }

  return (
    <div className="px-8">
      <main className="flex flex-col gap-4 justify-center items-center h-screen">
        <h3 className="font-bold text-2xl text-center mb-4">Entrar</h3>

        <form
          className="flex flex-col gap-4 w-full min-sm:max-w-[20%]"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Informe seu e-mail"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Informe sua senha"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Entrar"}
          </Button>
        </form>
      </main>
    </div>
  );
}
