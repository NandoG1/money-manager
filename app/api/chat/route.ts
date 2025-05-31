// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

interface CustomSession extends Session {
  user?: {
    id?: string | null; 
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } & Session["user"];
}


const FLASK_API_URL = 'https://money-manager-be-production.up.railway.app';

export async function POST(request: NextRequest) {
  console.log("--- API CHAT (POST) HANDLER INVOKED ---");
  try {
    const session = await getServerSession(authOptions) as CustomSession | null; 

    if (!session || !session.user) {
      console.error("API CHAT (POST) - Error: Unauthorized (No NextAuth session or user object)");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log("API CHAT (POST) - NextAuth session found for user:", session.user.email);

    const body = await request.json();
    console.log("API CHAT (POST) - Received body:", JSON.stringify(body));

    if (!body.sessionId || !body.message) {
        console.error("API CHAT (POST) - Error: 'sessionId' or 'message' missing in request body.");
        return NextResponse.json({ error: "'sessionId' and 'message' are required in the body" }, { status: 400 });
    }

    console.log(`API CHAT (POST) - Forwarding to Flask: ${FLASK_API_URL}/api/chat`);
    const responseFromFlask = await fetch(`${FLASK_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), 
    });

    console.log(`API CHAT (POST) - Response status from Flask: ${responseFromFlask.status}`);

    if (!responseFromFlask.ok) {
      const errorTextFromFlask = await responseFromFlask.text();
      console.error(`API CHAT (POST) - Error from Flask backend: STATUS ${responseFromFlask.status} - BODY ${errorTextFromFlask}`);
      return NextResponse.json(
        { error: `Error from Flask backend: ${errorTextFromFlask}` },
        { status: responseFromFlask.status }
      );
    }

    const dataFromFlask = await responseFromFlask.json();
    return NextResponse.json(dataFromFlask);

  } catch (error: any) {
    console.error('API CHAT (POST) - General catch block error:', error);
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error in Next.js API route (POST)' },
      { status: 500 }
    );
  }
}


export async function GET(request: NextRequest) {
  console.log("--- API CHAT (GET) HANDLER INVOKED ---");
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session || !session.user) {
      console.error("API CHAT (GET) - Error: Unauthorized (No NextAuth session or user object)");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log("API CHAT (GET) - NextAuth session found for user:", session.user.email);

    const sessionId = request.nextUrl.searchParams.get('sessionId');
    console.log("API CHAT (GET) - Received query param sessionId:", sessionId);

    if (!sessionId || sessionId.trim() === "") {
      console.error("API CHAT (GET) - Error: Session ID is missing or empty. Returning 400.");
      return NextResponse.json(
        { error: 'Session ID is required and cannot be empty' },
        { status: 400 }
      );
    }

    const flaskHistoryUrl = `${FLASK_API_URL}/api/history?sessionId=${sessionId}`;
    console.log(`API CHAT (GET) - Forwarding to Flask: ${flaskHistoryUrl}`);
    
    const responseFromFlask = await fetch(
      flaskHistoryUrl, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`API CHAT (GET) - Response status from Flask: ${responseFromFlask.status}`);

    if (!responseFromFlask.ok) {
      const errorTextFromFlask = await responseFromFlask.text();
      console.error(`API CHAT (GET) - Error from Flask backend for sessionId ${sessionId}: STATUS ${responseFromFlask.status} - BODY ${errorTextFromFlask}`);
      return NextResponse.json(
        { error: `Error from Flask backend: ${errorTextFromFlask}` },
        { status: responseFromFlask.status }
      );
    }

    const dataFromFlask = await responseFromFlask.json();
    return NextResponse.json(dataFromFlask);
    
  } catch (error: any) {
    console.error('API CHAT (GET) - General catch block error:', error);
    return NextResponse.json(
      { error: 'Internal server error in Next.js API route (GET)' },
      { status: 500 }
    );
  }
}