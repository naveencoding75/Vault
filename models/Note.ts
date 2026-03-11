// models/Note.ts
import mongoose, { Schema, model, models } from "mongoose";

interface INote {
  title: string;
  content: string;
  category: string;
  createdAt: Date;
}

// 2. THE SCHEMA (The Rulebook)
// This tells MongoDB how to store it
const NoteSchema = new Schema<INote>(
  {
    title: { 
      type: String, 
      required: [true, "Please provide a title"],
      trim: true 
    },
    content: { 
      type: String, 
      required: [true, "Content cannot be empty"] 
    },
    category: { 
      type: String, 
      default: "General" 
    },
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt'
);

// 3. THE MODEL (The Worker)
// If the "Note" model already exists, use it. If not, create it.
const Note = models.Note || model<INote>("Note", NoteSchema);

export default Note;