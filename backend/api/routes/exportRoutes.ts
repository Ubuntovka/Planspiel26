import { Router, Request, Response } from 'express';
import { exportDiagramToRdfTurtle, exportDiagramToXml } from '../controllers/exportController';
import { DiagramState } from '../../types/diagramTypes';

const router: Router = Router();

interface ExportRequest extends Request {
  body: {
    data: DiagramState;
  };
}


router.post('/rdf', async (req: ExportRequest, res: Response) => {
  try {
    const { data } = req.body;

    if (data == null) {
      return res.status(400).json({ error: 'Missing data in request body.' });
    }

    let rdf: string;
    try {
      rdf = exportDiagramToRdfTurtle(data);
    } catch (error) {
      console.error('Error exporting to RDF:', error);
      return res.status(500).json({ error: 'Failed to export diagram to RDF.' });
    }
    return res.status(200).json({ diagram: rdf });
  } catch (error) {
    console.error('Unexpected error in /rdf handler:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/xml', async (req: ExportRequest, res: Response) => {
  try {
    const { data } = req.body;

    if (data == null) {
      return res.status(400).json({ error: 'Missing data in request body.' });
    }

    let rdf: string;
    try {
      rdf = exportDiagramToXml(data);
    } catch (error) {
      console.error('Error exporting to RDF:', error);
      return res.status(500).json({ error: 'Failed to export diagram to RDF.' });
    }
    return res.status(200).json({ diagram: rdf });
  } catch (error) {
    console.error('Unexpected error in /rdf handler:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


export default router;