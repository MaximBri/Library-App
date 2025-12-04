import PDFDocument from 'pdfkit'
import { Response } from 'express'
import path from 'path'

export function createPDFReport(
  res: Response,
  title: string,
  data: any,
  summary: any
) {
  const doc = new PDFDocument({ margin: 50 })

  const fontPath = path.join(process.cwd(), 'assets/fonts/Roboto-Regular.ttf')
  doc.font(fontPath)

  const filename = `${title.replace(/\s+/g, '_')}.pdf`
  const encodedFilename = encodeURIComponent(filename)

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`
  )

  doc.pipe(res)

  doc.fontSize(20).text(title, { align: 'center' })
  doc.moveDown()

  doc.fontSize(14).text('Сводка', { underline: true })
  doc.moveDown(0.5)
  doc.fontSize(10)

  Object.entries(summary).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      doc.text(`${formatKey(key)}:`, { continued: false })
      Object.entries(value).forEach(([subKey, subValue]) => {
        doc.text(`  ${formatKey(subKey)}: ${formatValue(subValue)}`, {
          indent: 20,
        })
      })
    } else {
      doc.text(`${formatKey(key)}: ${formatValue(value)}`)
    }
  })

  doc.moveDown()

  doc.fontSize(14).text('Детальные данные', { underline: true })
  doc.moveDown(0.5)

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((item, index) => {
      doc.fontSize(12).text(`${index + 1}.`, { continued: false })
      doc.fontSize(10)

      Object.entries(item).forEach(([key, value]) => {
        if (key === 'reservations' && Array.isArray(value)) {
          doc.text(`${formatKey(key)}:`, { indent: 20 })
          value.forEach((res: any, resIndex: number) => {
            doc.text(`  ${resIndex + 1}. ${JSON.stringify(res, null, 2)}`, {
              indent: 40,
            })
          })
        } else if (
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value)
        ) {
          doc.text(`${formatKey(key)}:`, { indent: 20 })
          Object.entries(value).forEach(([subKey, subValue]) => {
            doc.text(`  ${formatKey(subKey)}: ${formatValue(subValue)}`, {
              indent: 40,
            })
          })
        } else {
          doc.text(`${formatKey(key)}: ${formatValue(value)}`, { indent: 20 })
        }
      })

      doc.moveDown(0.5)

      if (doc.y > 700) {
        doc.addPage()
      }
    })
  } else {
    doc.text('Нет данных для отображения')
  }

  doc.end()
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return 'Нет данных'
  if (typeof value === 'number') return value.toString()
  if (value instanceof Date) return formatDate(value)
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return formatDate(new Date(value))
  }
  if (typeof value === 'boolean') return value ? 'Да' : 'Нет'
  return String(value)
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}
