"use client";

import { useState, useEffect } from "react";
import { getCurrentUserInfo, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

export default function UserSwitch() {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const user = getCurrentUserInfo();
    setCurrentUser(user);
  }, []);

  const handleUserSwitch = () => {
    signOut().then(() => {
      signIn();

      window.location.reload();
    });
  };


  if (!currentUser) return null;

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="absolute top-2 right-2" 
        onClick={() => setIsOpen(true)}
      >
        User: {currentUser.name.split(" ")[0]}
      </Button>
    );
  }

  return (
    <Card className="absolute top-2 right-2 z-50 w-80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Current User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div><strong>Name:</strong> {currentUser.name}</div>
          <div><strong>ID:</strong> {currentUser.id.substring(0, 8)}...</div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Close</Button>
            <Button size="sm" onClick={handleUserSwitch}>Switch User</Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto" 
              onClick={() => setShowInfo(!showInfo)}
            >
              <InfoIcon size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
      
      {showInfo && (
        <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
          <div className="space-y-2">
            <p>If you are seeing the same quiz progress across different users, run the migration script:</p>
            <pre className="bg-black/30 p-2 rounded text-xs overflow-x-auto">
              node scripts/migrate-quiz-progress.js
            </pre>
            <p>This will update existing quiz data to use unique user IDs.</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 