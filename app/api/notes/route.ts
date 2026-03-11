// app/api/notes/route.ts
import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

// HANDLE GET REQUEST (Fetch all notes)
export async function GET() {
  try {
    await connectDB(); // Ensure we are connected
    const notes = await Note.find({}).sort({ createdAt: -1 }); // Get newest first
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

// HANDLE POST REQUEST (Create a new note)
export async function POST(req: Request) {
  try {
    const { title, content, category } = await req.json(); // Get data from user
    await connectDB();
    
    const newNote = await Note.create({ title, content, category });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create note" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // Get the ID from the request body
    await connectDB();
    await Note.findByIdAndDelete(id);
    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}