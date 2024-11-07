// src/score/score.schema.ts
import { Schema, Document } from 'mongoose';

export const ScoreSchema = new Schema({
  studentId: { type: Number, required: true, index: true, unique: true },
  math: { type: Number, required: true },
  literature: { type: Number, required: true },
  foreignLanguage: { type: Number, required: true },
  physics: { type: Number },
  chemistry: { type: Number },
  biology: { type: Number },
  history: { type: Number },
  geography: { type: Number },
  civics: { type: Number },
  foreignCode: { type: String, required: true },
});

export interface Score extends Document {
  studentId: number;
  math: number;
  literature: number;
  foreignLanguage: number;
  physics?: number | null;
  chemistry?: number | null;
  biology?: number | null;
  history?: number | null;
  geography?: number | null;
  civics?: number | null;
  foreignCode: string;
}
