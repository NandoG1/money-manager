'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Dynamically import 
const ChatBot = dynamic(() => import('./ChatBot'), { ssr: false });

const ChatBotWrapper = () => {
  const { data: session, status } = useSession();

  if (status !== 'authenticated' || !session) {
    return null;
  }

  return <ChatBot />;
};

export default ChatBotWrapper;
