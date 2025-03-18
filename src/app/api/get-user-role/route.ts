import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { z } from "zod";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID!,
      clientEmail: process.env.CLIENT_EMAIL!,
      privateKey: process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

const roleSchema = z.object({
  uid: z.string().min(1, "UID é obrigatório"), 
  role: z.string(),
});

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    const { uid, role } = roleSchema.parse(requestBody);

    if (!uid || !role) {
      throw new Error("Messagem");
    }

    await admin.auth().setCustomUserClaims(uid, { role });

    return NextResponse.json({
      message: `Role "${role}" atribuída ao usuário ${uid}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao salvar dados. " + err },
      { status: 500 }
    );
  }
}
