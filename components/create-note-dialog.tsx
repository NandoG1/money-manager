"use client";

import { useState, ReactNode } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useSession } from "next-auth/react"; // Not strictly needed here for API call
import { useToast } from "@/components/ui/use-toast";
// import { BASE_API_URL } from "@/index"; // Not needed here for API call

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

const noteFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().max(5000, "Content is too long"),
  color: z.enum(["blue", "green", "purple", "yellow", "red"]),
  tags: z.array(z.string()),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

interface CreateNoteDialogProps {
  children: ReactNode;
  // This function will now expect the data and handle the API call and state update
  onCreateNote: (newNoteData: NoteFormValues) => Promise<void>;
}

export function CreateNoteDialog({ children, onCreateNote }: CreateNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();
  // const session = useSession(); // Not making the API call here directly

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
      color: "blue",
      tags: [],
    },
  });

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.getValues().tags.includes(tag)) {
      form.setValue("tags", [...form.getValues().tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      form.getValues().tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // This onSubmit now just calls the prop function
  const onSubmit = async (data: NoteFormValues) => {
    try {
      // Directly call the onCreateNote prop passed from NotesPage
      // This prop (handleAddNote in NotesPage) will handle the API call
      await onCreateNote(data);

      form.reset();
      setOpen(false);
      // Toast for success can be shown here or in NotesPage after API success
      // toast({
      //   title: "Success",
      //   description: "Note creation initiated.", // Or wait for NotesPage to confirm
      //   variant: "success",
      // });
    } catch (error: any) {
      // This catch might not be strictly necessary if NotesPage handles all errors
      // But good for local form issues if any were to arise before calling onCreateNote
      console.error("Error in dialog submission process:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit note data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Add a new note to your collection. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your note here..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Tags</FormLabel>
              <div className="flex gap-2 mt-1.5">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>
              {form.getValues().tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.getValues().tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Create Note</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}