"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button"; 
import { Input } from "../ui/input";   

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Landmark } from "lucide-react";

function AddAccountBtn() {
  const { data: session } = useSession(); 
  const router = useRouter();
  const { toast } = useToast();

  const userId = session?.user?.id; 

  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addAccountSchema = z.object({
    accountName: z
      .string()
      .min(3, { message: "Account name should be at least 3 characters" })
      .max(30, { message: "Account name should be less than 30 characters" }),
    color: z.string().min(4, { message: "Please select a color" }).max(7), 
  });

  const form = useForm<z.infer<typeof addAccountSchema>>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      accountName: "",
      color: "#000000",
    },
  });

  const onSubmit = async (values: z.infer<typeof addAccountSchema>) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not authenticated. Please log in.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.accountName,
          balance: 0, 
          userId: userId, 
          color: values.color,
        }),
      });

      let msg;
      try {
        msg = await res.json();
      } catch (jsonError) {
        const textError = await res.text(); 
        console.error("AddAccountBtn: Non-JSON response from /api/account:", textError);
        toast({
          title: "Error",
          description: `Server error: ${res.status}. Please try again.`,
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }
      
      if (!res.ok) {
        toast({
          title: "Failed to Add Account",
          description: msg.message || `Error: ${res.status}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: msg.message || "Account added successfully.",
          variant: "success",
        });
        form.reset();
        setSheetOpen(false);
        router.refresh(); 
      }
    } catch (error: any) {
      console.error("AddAccountBtn: Submit error:", error);
      toast({
        title: "Submission Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button className="flex w-[140px] items-center gap-2 border border-white/10 bg-black/80 backdrop-blur-sm text-white/90 shadow-md hover:border-main-cyan/20 hover:text-main-cyan transition-all duration-300">
            <Landmark className="h-4 w-4" />
            New Account
          </Button>
        </SheetTrigger>
        <SheetContent className="space-y-2 border-l border-white/5 bg-black/95 backdrop-blur-sm">
          <SheetHeader className="text-left">
            <SheetTitle>Add a new account</SheetTitle>
            <SheetDescription>
              Create a new finance account to track your financial transactions.
            </SheetDescription>
          </SheetHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="off" placeholder="e.g., Savings, Wallet" />
                      </FormControl>
                      <FormMessage className="dark:text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Color</FormLabel>
                      <FormControl>
                        {/* Input color lebih baik diletakkan di samping label atau dengan preview */}
                        <div className="flex items-center gap-2">
                           <Input 
                             {...field} 
                             type="color" 
                             className="h-10 w-12 p-1 border-none cursor-pointer" 
                           />
                           <Input 
                             type="text" 
                             value={field.value} 
                             onChange={field.onChange}
                             placeholder="#000000"
                             maxLength={7}
                             className="flex-grow" 
                           />
                        </div>
                      </FormControl>
                      <FormMessage className="dark:text-red-500" />
                    </FormItem>
                  )}
                />
                <SheetFooter className="mt-4"> {/* Tambah margin atas untuk spasi */}
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-main-cyan text-white hover:bg-main-cyan/90 transition-all duration-300 shadow-lg" // w-full agar tombol penuh
                  >
                    {submitting ? "Adding..." : "Add Account"}
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AddAccountBtn;