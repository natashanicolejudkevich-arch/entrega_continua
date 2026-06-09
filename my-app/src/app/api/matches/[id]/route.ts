import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), 'src', 'data', 'matches.json');
  
  try {
    const updatedData = await request.json();
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let matches = JSON.parse(fileContents);
    
    const matchIndex = matches.findIndex((m: any) => m.id === id);
    if (matchIndex === -1) {
      return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 });
    }
    
    // Actualizar los campos
    matches[matchIndex] = { ...matches[matchIndex], ...updatedData };
    
    // Guardar
    fs.writeFileSync(filePath, JSON.stringify(matches, null, 2));

    return NextResponse.json(matches[matchIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar el partido' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), 'src', 'data', 'matches.json');
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let matches = JSON.parse(fileContents);
    
    const newMatches = matches.filter((m: any) => m.id !== id);
    if (matches.length === newMatches.length) {
      return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 });
    }
    
    // Guardar
    fs.writeFileSync(filePath, JSON.stringify(newMatches, null, 2));

    return NextResponse.json({ message: 'Partido eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar el partido' }, { status: 500 });
  }
}
