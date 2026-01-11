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
  const [isAdding, setIsAdding] = useState(false);

  // Auth states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  // New song inputs
  const [newSongName, setNewSongName] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");

  // Fetch songs
  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("id", { ascending: false });
      
      if (error) {
        console.error("Error fetching songs:", error);
        alert("Ошибка при получении песен: " + error.message);
        return;
      }
      
      setSongs(data as Song[]);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch session and songs on load
  useEffect(() => {
    const getInitialData = async () => {
      // Get session first
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      
      // Then fetch songs
      await fetchSongs();
    };

    getInitialData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          await fetchSongs();
        } else {
          setSongs([]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      if (error) {
        alert("Ошибка при входе: " + error.message);
      } else {
        setEmail("");
        setPassword("");
        await fetchSongs(); // Refresh songs after login
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setSongs([]);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Add new song
  const handleAddSong = async () => {
    if (!session) {
      alert("Вы не авторизованы");
      return;
    }

    if (!newSongName.trim() || !newSongUrl.trim()) {
      alert("Введите название и URL");
      return;
    }

    setIsAdding(true);
    
    try {
      const { data, error } = await supabase
        .from("songs")
        .insert({
          name: newSongName.trim(),
          url: newSongUrl.trim(),
        })
        .select()
        .single();

      if (error) {
        console.error("Add song error:", error);
        alert("Ошибка при добавлении песни: " + error.message);
      } else {
        console.log("Song added successfully:", data);
        
        // Update state immediately for better UX
        setSongs(prev => [data, ...prev]);
        
        // Clear inputs
        setNewSongName("");
        setNewSongUrl("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Произошла непредвиденная ошибка");
    } finally {
      setIsAdding(false);
    }
  };

  // Delete song
  const handleDeleteSong = async (id: number) => {
    if (!session) {
      alert("Вы не авторизованы");
      return;
    }

    if (!confirm("Вы уверены, что хотите удалить эту песню?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("songs")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        alert("Ошибка при удалении песни: " + error.message);
      } else {
        console.log("Song deleted successfully");
        // Update state immediately
        setSongs(prev => prev.filter(song => song.id !== id));
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Handle Enter key in add song form
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAdding) {
      handleAddSong();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl">Вход для администратора</h1>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              На главную
            </Link>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border rounded w-full"
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border rounded w-full"
              required
            />
            <button 
              type="submit" 
              className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Войти
            </button>
            <div className="text-center mt-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                ← Вернуться на главную страницу
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              На главную
            </Link>
            <h1 className="text-3xl font-bold">Управление песнями</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Add song section */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Добавить новую песню</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Название песни"
              value={newSongName}
              onChange={(e) => setNewSongName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="p-3 border rounded flex-1"
            />
            <input
              type="text"
              placeholder="URL песни (например, ссылка на YouTube)"
              value={newSongUrl}
              onChange={(e) => setNewSongUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="p-3 border rounded flex-1"
            />
            <button
              onClick={handleAddSong}
              disabled={isAdding}
              className={`px-6 py-3 text-white rounded transition ${
                isAdding 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isAdding ? 'Добавление...' : 'Добавить'}
            </button>
          </div>
        </div>

        {/* Songs list */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Список песен ({songs.length})</h2>
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              ← На главную
            </Link>
          </div>
          
          {songs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Нет добавленных песен
            </div>
          ) : (
            <ul className="divide-y">
              {songs.map((song) => (
                <li
                  key={song.id}
                  className="p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="flex-1">
                      <span className="font-medium text-lg">{song.name}</span>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={song.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                      >
                        Прослушать
                      </a>
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          {/* Bottom back to home link */}
          <div className="p-4 border-t text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Вернуться на главную страницу
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}