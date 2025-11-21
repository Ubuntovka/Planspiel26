import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiagram extends Document {
  userId: mongoose.Types.ObjectId;
  objects: any[];
  connections: any[];
}

const DiagramSchema = new Schema<IDiagram>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  objects: [{ type: Schema.Types.Mixed }],
  connections: [{ type: Schema.Types.Mixed }],
}, {
  timestamps: true,
});

export const Diagram: Model<IDiagram> = mongoose.models.Diagram || mongoose.model<IDiagram>('Diagram', DiagramSchema);

export default Diagram;
