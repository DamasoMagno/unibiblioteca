import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.R2_ENDPOINT!,
});

export async function GET() {
  return NextResponse.json([
    { id: 1, nome: "Damaso" },
    { id: 2, nome: "João" },
  ]);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const params = {
      Bucket: process.env.R2_BUCKET!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(params));
    const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    return NextResponse.json({
      message: "Upload realizado com sucesso!",
      url: fileUrl,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Erro no upload.", message: err.message },
      { status: 500 }
    );
  }
}
