import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req, res) {
  const { text } = req.body;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const lines = text.split('\n');

  let y = 800;
  for (let line of lines) {
    if (y < 50) {
      y = 800;
      pdfDoc.addPage([595, 842]);
    }
    const currentPage = pdfDoc.getPages().at(-1);
    currentPage.drawText(line, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    });
    y -= 18;
  }

  const pdfBytes = await pdfDoc.save();
  res.setHeader('Content-Disposition', 'attachment; filename=book.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from(pdfBytes));
}
