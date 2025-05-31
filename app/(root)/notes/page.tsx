"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NoteCard } from "@/components/note-card";
import { CreateNoteDialog } from "@/components/create-note-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { BASE_API_URL } from "@/index";
import { format } from "date-fns";

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  color: "blue" | "green" | "purple" | "yellow" | "red";
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  user: string;
}

export default function NotesPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch notes from the API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_API_URL}/api/notes`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast({
          title: "Error",
          description: "Failed to load notes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchNotes();
    }
  }, [session, toast]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.isPinned);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const handleAddNote = async (newNote: Omit<Note, "_id" | "createdAt" | "updatedAt" | "isPinned" | "user">) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create note");
      }

      setNotes((prev) => [data.note, ...prev]);

      toast({
        title: "Note created",
        description: "Your note has been created successfully.",
      });
    } catch (error: any) {
      console.error("Error creating note:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create note",
        variant: "destructive",
      });
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const noteToUpdate = notes.find((note) => note._id === id);
      if (!noteToUpdate) return;

      const response = await fetch(`${BASE_API_URL}/api/notes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPinned: !noteToUpdate.isPinned,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      setNotes((prev) =>
        prev.map((note) =>
          note._id === id ? { ...note, isPinned: !note.isPinned } : note
        )
      );
    } catch (error: any) {
      console.error("Error toggling pin status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = async (id: string, updatedNote: Partial<Note>) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/notes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNote),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      setNotes((prev) =>
        prev.map((note) => (note._id === id ? { ...note, ...updatedNote } : note))
      );

      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating note:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete note");
      }

      setNotes((prev) => prev.filter((note) => note._id !== id));

      toast({
        title: "Note deleted",
        description: "Your note has been deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex-1 p-6 md:p-8 pt-16 md:pt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">Smart Notes</h1>
          <p className="text-muted-foreground mt-1">Organize your thoughts and ideas</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="w-full pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CreateNoteDialog onCreateNote={handleAddNote}>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </CreateNoteDialog>
        </div>
      </div>

      {loading ? (
        // Loading state
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Card key={n} className="h-64 animate-pulse">
              <CardContent className="p-6">
                <div className="h-5 bg-muted rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                Pinned Notes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    id={note._id}
                    title={note.title}
                    content={note.content}
                    tags={note.tags}
                    color={note.color}
                    date={formatDate(note.updatedAt)}
                    isPinned={note.isPinned}
                    onTogglePin={handleTogglePin}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            </>
          )}

          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            All Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note._id}
                id={note._id}
                title={note.title}
                content={note.content}
                tags={note.tags}
                color={note.color}
                date={formatDate(note.updatedAt)}
                isPinned={note.isPinned}
                onTogglePin={handleTogglePin}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}

            <CreateNoteDialog onCreateNote={handleAddNote}>
              <Card className="flex items-center justify-center h-64 border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="flex flex-col items-center p-6">
                  <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Create a new note</p>
                </CardContent>
              </Card>
            </CreateNoteDialog>
          </div>

          {filteredNotes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No notes found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                {searchQuery
                  ? "No notes match your search criteria. Try a different search term."
                  : "You haven't created any notes yet. Create your first note to get started."}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
