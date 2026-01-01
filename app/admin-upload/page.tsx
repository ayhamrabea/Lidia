"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// إعداد Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Song {
  id: number;
  name: string;
  url: string;
}

export default function AdminUploadPage() {
  const [password, setPassword] = useState("");
  const [passwordEntered, setPasswordEntered] = useState(false);

  const [songs, setSongs] = useState<Song[]>([]);
  const [newSongName, setNewSongName] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");

  // التحقق من كلمة المرور
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setPasswordEntered(true);
    } else {
      alert("Неверный пароль!");
    }
  };

  // جلب الأغاني عند الدخول بعد التحقق من كلمة المرور
  useEffect(() => {
    if (!passwordEntered) return;

    const fetchData = async () => {
      const { data, error } = await supabase.from("songs").select("*");
      if (error) {
        alert("Ошибка при получении песен: " + error.message);
      } else if (data) {
        setSongs(data as Song[]);
      }
    };

    fetchData();
  }, [passwordEntered]);

  // إضافة أغنية جديدة
  const handleAddSong = async () => {
    if (!newSongName || !newSongUrl) return alert("Введите название и URL");

    const { error } = await supabase.from("songs").insert([
      { name: newSongName, url: newSongUrl },
    ]);

    if (error) {
      alert("Ошибка при добавлении песни: " + error.message);
    } else {
      setNewSongName("");
      setNewSongUrl("");
      // إعادة جلب الأغاني
      const { data } = await supabase.from("songs").select("*");
      if (data) setSongs(data as Song[]);
    }
  };

  // حذف أغنية
  const handleDeleteSong = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту песню?")) return;

    const { error } = await supabase.from("songs").delete().eq("id", id);
    if (error) {
      alert("Ошибка при удалении песни: " + error.message);
    } else {
      setSongs(songs.filter((s) => s.id !== id));
    }
  };

  if (!passwordEntered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl mb-4">Введите пароль для доступа</h1>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
          />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">Админ: управление песнями</h1>

      {/* زر العودة للصفحة الرئيسية */}
      <Link href="/">
        <button className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          На главную
        </button>
      </Link>

      {/* إضافة أغنية جديدة */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Название песни"
          value={newSongName}
          onChange={(e) => setNewSongName(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <input
          type="text"
          placeholder="URL песни"
          value={newSongUrl}
          onChange={(e) => setNewSongUrl(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <button
          onClick={handleAddSong}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Добавить
        </button>
      </div>

      {/* قائمة الأغاني */}
      <ul className="flex flex-col gap-2">
        {songs.map((song) => (
          <li key={song.id} className="flex justify-between items-center p-2 border rounded">
            <span>{song.name}</span>
            <div className="flex gap-2">
              <a
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Прослушать
              </a>
              <button
                onClick={() => handleDeleteSong(song.id)}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
