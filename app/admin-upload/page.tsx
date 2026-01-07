"use client";

import { useState, useEffect } from "react";
import { createClient, Session } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Song {
  id: number;
  name: string;
  url: string;
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // New song inputs
  const [newSongName, setNewSongName] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");


  // Fetch songs
  const fetchSongs = async () => {
    const { data, error } = await supabase.from("songs").select("*");
    if (error) alert("Ошибка при получении песен: " + error.message);
    else setSongs(data as Song[]);
    setLoading(false);
  };
  
  // Fetch session on load
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsAdmin(data.session?.user.app_metadata?.role === "admin");
      fetchSongs();
    };
    getSession();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAdmin(session?.user.app_metadata?.role === "admin");
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Ошибка при входе: " + error.message);
    else {
      setEmail("");
      setPassword("");
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  // Add new song
  const handleAddSong = async () => {
    if (!newSongName || !newSongUrl) return alert("Введите название и URL");

    const { error } = await supabase.from("songs").insert([
      { name: newSongName, url: newSongUrl },
    ]);

    if (error) alert("Ошибка при добавлении песни: " + error.message);
    else {
      setNewSongName("");
      setNewSongUrl("");
      fetchSongs();
    }
  };

  // Delete song
  const handleDeleteSong = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту песню?")) return;

    const { error } = await supabase.from("songs").delete().eq("id", id);
    if (error) alert("Ошибка при удалении песни: " + error.message);
    else setSongs(songs.filter((s) => s.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  // Not logged in
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl mb-4">Вход для админа</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl">Песни</h1>
        <div>
          {isAdmin && <span className="mr-4 text-green-600">Admin</span>}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Add song section (Admin only) */}
      {isAdmin && (
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
      )}

      {/* Songs list */}
      <ul className="flex flex-col gap-2">
        {songs.map((song) => (
          <li
            key={song.id}
            className="flex justify-between items-center p-2 border rounded"
          >
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
              {isAdmin && (
                <button
                  onClick={() => handleDeleteSong(song.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Удалить
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
