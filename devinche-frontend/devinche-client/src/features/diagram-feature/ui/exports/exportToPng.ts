import { toPng } from 'html-to-image';

export async function exportDiagramToPng(
  element: HTMLDivElement,
  filename = 'diagram.png'
) {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    backgroundColor: '#ffffff',
    skipFonts: true,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
