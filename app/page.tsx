"use client";

import { useState, useEffect } from "react";
import { Trash2, X, Search, Lock, Tag } from "lucide-react";

interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

const CATEGORIES = ["All", "General", "Personal", "Work", "Study"];

export default function VaultPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [activeTab, setActiveTab] = useState("All");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => { fetchNotes(); }, []);

  // 1. ADVANCED FILTERING (Search + Category)
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "All" || note.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category }),
    });
    if (res.ok) { setTitle(""); setContent(""); setCategory("General"); fetchNotes(); }
    setLoading(false);
  };

  const deleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this note forever?")) return;
    const res = await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchNotes();
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8 pb-20">
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-black tracking-tighter text-blue-500">VAULT v2</h1>
          <Lock size={20} className="text-neutral-700" />
        </header>

        {/* 🔍 SEARCH & FILTERS */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" placeholder="Search entries..."
              className="w-full bg-neutral-900 border border-neutral-800 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${
                  activeTab === cat 
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 📝 INPUT FORM */}
        <form onSubmit={handleSave} className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
            <input 
              type="text" placeholder="Entry Title" className="bg-transparent text-xl font-bold outline-none flex-1"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
            <select 
              className="bg-neutral-800 text-[10px] font-bold uppercase p-2 rounded-lg outline-none"
              value={category} onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea 
            placeholder="Record your thoughts..." className="w-full bg-transparent outline-none h-24 resize-none text-neutral-300"
            value={content} onChange={(e) => setContent(e.target.value)}
          />
          <button disabled={loading} className="w-full bg-white text-black hover:bg-neutral-200 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
            {loading ? "Syncing..." : "Archive Entry"}
          </button>
        </form>

        {/* 📜 LIST VIEW */}
        <div className="grid gap-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div 
                key={note._id} onClick={() => setSelectedNote(note)}
                className="group p-6 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 transition-all cursor-pointer relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase text-blue-500 tracking-tighter bg-blue-500/10 px-2 py-1 rounded">
                    {note.category}
                  </span>
                  <button onClick={(e) => deleteNote(note._id, e)} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-xl font-bold mb-1">{note.title}</h3>
                <p className="text-neutral-400 line-clamp-2 text-sm">{note.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-neutral-900 rounded-3xl">
              <p className="text-neutral-600">No memories found in {activeTab}.</p>
            </div>
          )}
        </div>
      </div>

      {/* 📍 MODAL VIEW */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-[2.5rem] p-12 overflow-y-auto relative shadow-2xl">
            <button onClick={() => setSelectedNote(null)} className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors">
              <X size={32} />
            </button>
            <div className="flex items-center gap-3 mb-4">
               <Tag size={14} className="text-blue-500" />
               <span className="text-xs font-bold uppercase text-blue-500 tracking-widest">{selectedNote.category}</span>
            </div>
            <h2 className="text-5xl font-black text-white mb-6 tracking-tighter leading-none">{selectedNote.title}</h2>
            <div className="text-neutral-400 text-lg leading-relaxed whitespace-pre-wrap font-medium border-l-2 border-neutral-800 pl-6">
              {selectedNote.content}
            </div>
            <p className="text-[10px] text-neutral-600 font-mono mt-12 uppercase tracking-[0.3em]">
              Archive Reference: {selectedNote._id}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}