"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface Song {
  id: number;
  name: string;
  url: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminUpload() {
  const router = useRouter();

  const [songs, setSongs] = useState<Song[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [authorized, setAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "12345";

  // تحقق كلمة المرور
  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthorized(true);
      fetchSongs();
    } else {
      alert("Неверный пароль");
    }
  };

  // جلب الأغاني
  const fetchSongs = async () => {
    const { data, error } = await supabase.from<Song>("songs").select("*");
    if (error) {
      alert("Ошибка при получении песен: " + error.message);
    } else if (data) {
      setSongs(data);
    }
  };

  // إضافة أغنية جديدة
  const handleAdd = async () => {
    if (!name || !url) return alert("Введите имя и URL песни");
    setLoading(true);
    const { data, error } = await supabase
      .from<Song>("songs")
      .insert([{ name, url }])
      .select();
    setLoading(false);
    if (error) {
      alert("Ошибка при добавлении: " + error.message);
    } else if (data) {
      setSongs([...songs, ...data]);
      setName("");
      setUrl("");
    }
  };

  // حذف أغنية
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Вы уверены, что хотите удалить песню?");
    if (!confirmDelete) return;
    const { error } = await supabase.from<Song>("songs").delete().eq("id", id);
    if (error) {
      alert("Ошибка при удалении: " + error.message);
    } else {
      setSongs(songs.filter((s) => s.id !== id));
    }
  };

  // إذا لم يدخل كلمة المرور بعد
  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Введите пароль для доступа</h1>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="p-2 border rounded mb-4"
          placeholder="Пароль"
        />
        <button
          onClick={handlePasswordSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Войти
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Управление песнями</h1>

      {/* زر العودة للصفحة الرئيسية */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/")}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
        >
          На главную
        </button>
      </div>

      {/* Форма добавления */}
      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Название песни"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="URL песни (Yandex)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Добавление..." : "Добавить песню"}
        </button>
      </div>

      {/* Список песен */}
      <ul className="flex flex-col gap-4">
        {songs.map((song) => (
          <li
            key={song.id}
            className="flex justify-between items-center p-3 border rounded"
          >
            <div>
              <p className="font-semibold">{song.name}</p>
              <a href={song.url} target="_blank" className="text-blue-600 underline">
                Прослушать
              </a>
            </div>
            <button
              onClick={() => handleDelete(song.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
