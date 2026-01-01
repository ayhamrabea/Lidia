import type { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

// ================= Supabase =================
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ================= Yandex Cloud S3 =================
const s3 = new S3Client({
  region: "ru-central1",
  endpoint: "https://storage.yandexcloud.net",
  credentials: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY!,
    secretAccessKey: process.env.YANDEX_SECRET_KEY!,
  },
});

// ================= POST =================
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;
    const password = formData.get("password") as string | null;

    // 🔐 التحقق من كلمة المرور
    if (password !== process.env.ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Неверный пароль" }),
        { status: 401 }
      );
    }

    // 🧪 التحقق من البيانات
    if (!file || !name) {
      return new Response(
        JSON.stringify({ error: "Нет файла или названия" }),
        { status: 400 }
      );
    }

    // تحويل الملف إلى Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // اسم فريد للملف (مهم جدًا)
    const fileName = `${Date.now()}-${file.name}`;

    // ⬆️ رفع الملف إلى Yandex Cloud
    const command = new PutObjectCommand({
      Bucket: process.env.YANDEX_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3.send(command);

    // 🌍 إنشاء الرابط العام
    const publicURL = `https://storage.yandexcloud.net/${process.env.YANDEX_BUCKET_NAME}/${fileName}`;

    // 💾 حفظ البيانات في Supabase (فقط name + url)
    const { error } = await supabase
      .from("songs")
      .insert([{ name, url: publicURL }]);

    if (error) {
      throw error;
    }

    // ✅ نجاح
    return new Response(
      JSON.stringify({
        message: "Песня успешно загружена",
        url: publicURL,
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Ошибка при загрузке песни" }),
      { status: 500 }
    );
  }
}
