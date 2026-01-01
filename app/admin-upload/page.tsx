"use client";
import React, { useState } from "react";

export default function AdminUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [songName, setSongName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file || !songName || !password) return alert("Выберите файл, введите название и пароль");

    setStatus("Загрузка песни...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", songName);
    formData.append("password", password);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.message);
        setFile(null);
        setSongName("");
      } else {
        setStatus(data.error);
      }
    } catch (err) {
      console.error(err);
      setStatus("Ошибка при загрузке песни");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10">
      <h2 className="text-2xl font-bold mb-4">Загрузка новой песни</h2>
      <input
        type="text"
        placeholder="Название песни"
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
        className="border p-2 rounded mb-2 w-full max-w-md"
      />
      <input
        type="password"
        placeholder="Пароль администратора"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded mb-2 w-full max-w-md"
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 rounded mb-2 w-full max-w-md"
      />
      <button
        onClick={handleUpload}
        className="bg-green-500 text-white px-4 py-2 rounded mb-2"
      >
        Загрузить песню
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
