import { Response } from 'express'
import * as XLSX from 'xlsx'

export function createXLSXReport(res: Response, title: string, data: any[], summary: any) {
  if (!data || data.length === 0) {
    res.status(404).json({ message: 'Нет данных для экспорта' })
    return
  }
  
  const wb = XLSX.utils.book_new()
  
  const summaryData = Object.entries(summary).map(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return [formatKey(key), JSON.stringify(value, null, 2)]
    }
    return [formatKey(key), formatValue(value)]
  })
  
  const summarySheet = XLSX.utils.aoa_to_sheet([
    ['Параметр', 'Значение'],
    ...summaryData
  ])
  
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Сводка')
  
  const flattenedData = data.map(item => flattenObject(item))
  const dataSheet = XLSX.utils.json_to_sheet(flattenedData)
  
  const maxWidth = 50
  const colWidths = Object.keys(flattenedData[0] || {}).map(key => ({
    wch: Math.min(
      Math.max(
        key.length,
        ...flattenedData.map(row => String(row[key] || '').length)
      ),
      maxWidth
    )
  }))
  
  dataSheet['!cols'] = colWidths
  
  XLSX.utils.book_append_sheet(wb, dataSheet, 'Данные')
  
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  
  const filename = `${title.replace(/\s+/g, '_')}.xlsx`
  const encodedFilename = encodeURIComponent(filename)
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`)
  res.send(buffer)
}

function flattenObject(obj: any, prefix = ''): any {
  const flattened: any = {}
  
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    const newKey = prefix ? `${prefix}_${key}` : key
    
    if (value === null || value === undefined) {
      flattened[formatKey(newKey)] = ''
    } else if (Array.isArray(value)) {
      flattened[formatKey(`${newKey}_count`)] = value.length
      if (value.length > 0 && typeof value[0] === 'object') {
        flattened[formatKey(`${newKey}_details`)] = JSON.stringify(value, null, 2)
      } else {
        flattened[formatKey(newKey)] = value.join(', ')
      }
    } else if (typeof value === 'object' && !(value instanceof Date)) {
      Object.assign(flattened, flattenObject(value, newKey))
    } else if (value instanceof Date) {
      flattened[formatKey(newKey)] = value.toLocaleDateString('ru-RU')
    } else {
      flattened[formatKey(newKey)] = value
    }
  })
  
  return flattened
}

function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'number') return value.toFixed(2)
  if (value instanceof Date) return value.toLocaleDateString('ru-RU')
  if (typeof value === 'boolean') return value ? 'Да' : 'Нет'
  return String(value)
}