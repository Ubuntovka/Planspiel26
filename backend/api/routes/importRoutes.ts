import { Router, Request, Response } from 'express';
import { RDFtoJSON, XMLtoJSON } from '../controllers/importController';
import { DiagramState } from '../../types/diagramTypes';

const router: Router = Router();

interface ExportRequest extends Request {
  body: {
    data: string;
  };
}


router.post('/rdf', async (req: any, res: Response) => {
  try {
    let rdfData = '';

    const contentType = req.headers['content-type'];
    if (contentType?.includes('multipart/form-data')) {
      const boundary = contentType.split('boundary=');
      const body = await new Promise<Buffer>((resolve) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: any) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
      });

      const bodyStr = body.toString();
      const filePart = bodyStr.split('\r\n\r\n')[1]?.split('\r\n--');
      if (filePart) {
        rdfData = filePart.toString();
      }
    }

    if (!rdfData) {
      return res.status(400).json({ error: 'No RDF file found' });
    }

    let json: DiagramState;
    try {
      json = RDFtoJSON(rdfData);
    } catch (error) {
      console.error('Error importing RDF:', error);
      return res.status(500).json({ error: 'Failed to import diagram RDF.' });
    }

    return res.status(200).json(json);
  } catch (error) {
    console.error('Unexpected error in import /rdf handler:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


router.post('/xml', async (req: any, res: Response) => {
  try {
    let xmlData = '';

    const contentType = req.headers['content-type'];
    if (contentType?.includes('multipart/form-data')) {
      const boundary = contentType.split('boundary=')[1];
      const body = await new Promise<Buffer>((resolve) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: any) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
      });
      
      const bodyStr = body.toString();
      const filePart = bodyStr.split('\r\n\r\n')[1]?.split('\r\n--')[0];
      if (filePart) {
        xmlData = filePart.toString();
      }
    }

    if (!xmlData) {
      return res.status(400).json({ error: 'No XML file found' });
    }

    let json: DiagramState;
    try {
      json = XMLtoJSON(xmlData);
    } catch (error) {
      console.error('Error importing XML:', error);
      return res.status(500).json({ error: 'Failed to import diagram XML.' });
    }
    
    return res.status(200).json(json);
  } catch (error) {
    console.error('Unexpected error in import /xml handler:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;