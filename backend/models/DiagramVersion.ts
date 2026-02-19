import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiagramVersion extends Document {
  diagramId: mongoose.Types.ObjectId;
  message: string;
  description?: string;
  nodes: any[];
  edges: any[];
  viewport?: { x: number; y: number; zoom: number };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const DiagramVersionSchema = new Schema<IDiagramVersion>(
  {
    diagramId: { type: Schema.Types.ObjectId, ref: 'Diagram', required: true, index: true },
    message: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    nodes: [{ type: Schema.Types.Mixed }],
    edges: [{ type: Schema.Types.Mixed }],
    viewport: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      zoom: { type: Number, default: 1 },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const DiagramVersion: Model<IDiagramVersion> =
  mongoose.models.DiagramVersion ||
  mongoose.model<IDiagramVersion>('DiagramVersion', DiagramVersionSchema);

export default DiagramVersion;
