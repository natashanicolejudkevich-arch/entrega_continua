import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'matches.json');
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matches = JSON.parse(fileContents);
    
    // Podemos ordenar los partidos por fecha (los más recientes primero)
    matches.sort((a: { date: string }, b: { date: string }) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(matches);
  } catch {
    return NextResponse.json({ error: 'Error leyendo los datos de los partidos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'matches.json');
  
  try {
    const newMatch = await request.json();
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matches = JSON.parse(fileContents);
    
    // Generar un ID simple
    newMatch.id = String(matches.length + 1);
    matches.push(newMatch);
    
    // Guardar en el archivo JSON
    fs.writeFileSync(filePath, JSON.stringify(matches, null, 2));

    return NextResponse.json(newMatch, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al guardar el partido' }, { status: 500 });
  }
}
