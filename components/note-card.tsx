"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Pin, 
  PinOff, 
  Pencil, 
  Trash2 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { EditNoteDialog } from "@/components/edit-note-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: "blue" | "green" | "purple" | "yellow" | "red";
  date: string;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
  onEdit: (id: string, updatedNote: Partial<{
    title: string;
    content: string;
    tags: string[];
    color: "blue" | "green" | "purple" | "yellow" | "red";
  }>) => void;
  onDelete: (id: string) => void;
}

// Color map for styling
const colorMap = {
  blue: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
  green: "bg-green-500/10 border-green-500/20 hover:bg-green-500/20",
  purple: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20",
  yellow: "bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20",
  red: "bg-red-500/10 border-red-500/20 hover:bg-red-500/20",
};

const tagColorMap = {
  blue: "bg-blue-500/20 text-blue-500 dark:text-blue-300",
  green: "bg-green-500/20 text-green-500 dark:text-green-300",
  purple: "bg-purple-500/20 text-purple-500 dark:text-purple-300",
  yellow: "bg-yellow-500/20 text-yellow-500 dark:text-yellow-300",
  red: "bg-red-500/20 text-red-500 dark:text-red-300",
};

export function NoteCard({
  id,
  title,
  content,
  tags,
  color,
  date,
  isPinned,
  onTogglePin,
  onEdit,
  onDelete,
}: NoteCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteNote = () => {
    onDelete(id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className={`border transition-colors ${colorMap[color]} h-full flex flex-col`}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="flex-1 pr-2">
          <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{date}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background/80"
            onClick={() => onTogglePin(id)}
            title={isPinned ? "Unpin note" : "Pin note"}
          >
            {isPinned ? (
              <Pin className="h-4 w-4 text-amber-500" />
            ) : (
              <PinOff className="h-4 w-4" />
            )}
          </Button>
          <EditNoteDialog
            id={id}
            initialTitle={title}
            initialContent={content}
            initialTags={tags}
            initialColor={color}
            onEditNote={(updatedNote) => onEdit(id, updatedNote)}
            trigger={
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background/80"
                title="Edit note"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-background/80"
            onClick={() => setIsDeleteDialogOpen(true)}
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 py-2">
        <div className="whitespace-pre-line text-sm">{content}</div>
      </CardContent>
      {tags.length > 0 && (
        <CardFooter className="flex flex-wrap gap-1 pt-2 pb-4">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={`text-xs font-normal ${tagColorMap[color]}`}
            >
              {tag}
            </Badge>
          ))}
        </CardFooter>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the note -{title}-. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
