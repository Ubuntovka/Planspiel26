import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiagram extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  nodes: any[];
  edges: any[];
  viewport?: { x: number; y: number; zoom: number };
}

const DiagramSchema = new Schema<IDiagram>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true, default: 'Untitled Diagram' },
  nodes: [{ type: Schema.Types.Mixed }],
  edges: [{ type: Schema.Types.Mixed }],
  viewport: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    zoom: { type: Number, default: 1 },
  },
}, {
  timestamps: true,
});

export const Diagram: Model<IDiagram> = mongoose.models.Diagram || mongoose.model<IDiagram>('Diagram', DiagramSchema);

export default Diagram;
