"use client";

import { useState, useRef } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AccountType, BASE_API_URL } from "@/index";
import { PiggyBank, Upload, Loader2, ScanLine } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

type Props = {
  accounts: AccountType[];
};

function AddIncomeBtn({ accounts }: Props) {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const userId = session?.data?.user?.id;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addIncomeSchema = z.object({
    incomeName: z
      .string()
      .min(4, { message: "Income name should be atleast 4 characters" })
      .max(30, { message: "Income name should be less than 30 characters" }),
    date: z.date(),
    amount: z.coerce
      .number()
      .min(1, { message: "Income amount should be greater than 0" }),
    account: z.string(),
  });

  const form = useForm<z.infer<typeof addIncomeSchema>>({
    resolver: zodResolver(addIncomeSchema),
    defaultValues: {
      incomeName: "",
      date: new Date(),
      amount: 0,
    },
  });

  const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setScanning(true);
    
    try {
      // Convert the file to base64
      const base64String = await convertFileToBase64(file);
      
      // Send the image to the OCR API
      const response = await fetch('/api/ocr-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64String }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to scan receipt');
      }
      
      const data = await response.json();
      
      try {
        let cleanedResponse = data.analysis;
        cleanedResponse = cleanedResponse.replace(/```json\s*|\s*```/g, '').trim();
        
        const analysisJson = JSON.parse(cleanedResponse);
        setScanResults(analysisJson);
        
        if (analysisJson.judul && analysisJson.judul !== 'Tidak ditemukan') {
          form.setValue('incomeName', analysisJson.judul);
        }
        
        if (analysisJson.tanggal && analysisJson.tanggal !== 'Tidak ditemukan') {
          try {
            // First try to use the Date constructor directly (handles ISO format)
            let newDate = new Date(analysisJson.tanggal);
            
            // If that doesn't work, try to parse the date manually
            if (isNaN(newDate.getTime())) {
              // Check if the date uses '-' or '/' as separator
              let separator = '';
              if (analysisJson.tanggal.includes('-')) {
                separator = '-';
              } else if (analysisJson.tanggal.includes('/')) {
                separator = '/';
              } else if (analysisJson.tanggal.includes('.')) {
                separator = '.';
              }
              
              if (separator) {
                const dateParts = analysisJson.tanggal.split(separator);
                
                if (dateParts.length === 3) {
                  let day: number, month: number, year: number;
                  
                  // Try to determine the format based on the values
                  const part0 = parseInt(dateParts[0]);
                  const part1 = parseInt(dateParts[1]);
                  const part2 = parseInt(dateParts[2]);
                  
                  // If first part is > 31, it's likely a year (YYYY-MM-DD)
                  if (part0 > 31) {
                    year = part0;
                    month = part1 - 1; // JS months are 0-indexed
                    day = part2;
                  }
                  // If last part is > 31, it's likely a year (DD-MM-YYYY)
                  else if (part2 > 31) {
                    day = part0;
                    month = part1 - 1;
                    year = part2;
                  }
                  // If middle part > 12, it might be a day in MM-DD-YYYY format
                  else if (part1 > 12) {
                    month = part0 - 1;
                    day = part1;
                    year = part2;
                  }
                  // Default to DD-MM-YYYY format
                  else {
                    day = part0;
                    month = part1 - 1;
                    year = part2;
                  }
                  
                  // Handle 2-digit years (assuming 20xx for simplicity)
                  const fullYear = year < 100 ? 2000 + year : year;
                  
                  newDate = new Date(fullYear, month, day);
                }
              }
            }
            
            // If we have a valid date, update the form
            if (!isNaN(newDate.getTime())) {
              form.setValue('date', newDate);
            }
          } catch (error) {
            console.error('Error parsing date:', error);
          }
        }
        
        if (analysisJson.subtotal && analysisJson.subtotal !== 'Tidak ditemukan') {
          // Remove any non-numeric characters and convert to number
          const amount = parseFloat(analysisJson.subtotal.replace(/[^0-9]/g, ''));
          if (!isNaN(amount)) {
            form.setValue('amount', amount);
          }
        }
        
        toast({
          description: 'Receipt scanned successfully!',
          variant: 'success',
        });
      } catch (error) {
        console.error('Error parsing analysis result:', error);
        toast({
          description: 'Could not parse the receipt data. Please enter details manually.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error scanning receipt:', error);
      toast({
        description: 'Failed to scan receipt. Please try again or enter details manually.',
        variant: 'destructive',
      });
    } finally {
      setScanning(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (values: z.infer<typeof addIncomeSchema>) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_API_URL}/api/income`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.incomeName,
          date: values.date,
          amount: values.amount,
          accountId: values.account,
          userId: userId,
        }),
      });

      const msg = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        toast({
          description: msg.message,
          variant: "destructive",
        });
      }

      if (res.ok) {
        setSubmitting(false);
        toast({
          description: msg.message,
          variant: "success",
        });
        form.reset();
        router.refresh();
        setSheetOpen(false);
      }
    } catch (error: any) {
      setSubmitting(false);
      throw new Error(error);
    }
  };

  return (
    <div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button className="flex w-[140px] items-center gap-2 border-2 border-foreground bg-transparent text-foreground duration-300 hover:text-background">
            <PiggyBank className="h-10 w-10" /> New Income
          </Button>
        </SheetTrigger>
        <SheetContent className="space-y-2">
          <SheetHeader className="text-left">
            <SheetTitle>Add a new income</SheetTitle>
            <SheetDescription>
              Create a new income inside your financial tracker.
            </SheetDescription>
          </SheetHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {/* Receipt Scanning */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="receipt-upload" className="text-sm font-medium">
                      Scan Photo
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs text-muted-foreground cursor-help">
                            <ScanLine className="h-4 w-4" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload a receipt image to automatically fill the form</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      id="receipt-upload"
                      accept="image/*"
                      onChange={handleScanReceipt}
                      ref={fileInputRef}
                      className="hidden"
                      disabled={scanning}
                    />
                    <label
                      htmlFor="receipt-upload"
                      className={`flex items-center justify-center gap-2 w-full py-2 px-3 border border-dashed rounded-md cursor-pointer transition-colors ${scanning ? 'bg-black/20 border-white/20' : 'bg-black/10 border-white/10 hover:border-white/30 hover:bg-black/20'}`}
                    >
                      {scanning ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                          <span className="text-sm text-white/70">Processing receipt...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-white/70" />
                          <span className="text-sm text-white/70">Upload receipt image</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="incomeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger
                          asChild
                          className="dark:outline dark:outline-1"
                        >
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="z-50 w-auto p-0">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              // Close the popover after selection
                              document.body.click();
                            }}
                            fromYear={2000}
                            toYear={2025}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="account"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue=""
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.length ? (
                            accounts.map((account: any) => (
                              <SelectItem
                                key={account._id}
                                value={account._id.toString()}
                                style={{ color: account.color }}
                              >
                                {account.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem
                              value="novalue"
                              disabled
                              className="flex items-center justify-center"
                            >
                              No accounts yet
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <span className="absolute ml-2">Rp</span>
                          <Input
                            {...field}
                            min={0}
                            type="number"
                            autoComplete="off"
                            className="pl-8"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SheetFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Adding..." : "Add Income"}
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

export default AddIncomeBtn;
