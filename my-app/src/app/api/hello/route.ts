import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: '¡Hola! Tu API de Next.js está funcionando correctamente.',
    timestamp: new Date().toISOString()
  });
}
