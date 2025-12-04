import { Response } from 'express'
import { createObjectCsvStringifier } from 'csv-writer'

export function createCSVReport(res: Response, title: string, data: any[]) {
  if (!data || data.length === 0) {
    res.status(404).json({ message: 'Нет данных для экспорта' })
    return
  }
  
  const flattenedData = data.map(item => flattenObject(item))
  
  const allKeys = new Set<string>()
  flattenedData.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key))
  })
  
  const headers = Array.from(allKeys).map(key => ({
    id: key,
    title: formatKey(key)
  }))
  
  const csvStringifier = createObjectCsvStringifier({
    header: headers
  })
  
  const csvContent = 
    csvStringifier.getHeaderString() +
    csvStringifier.stringifyRecords(flattenedData)
  
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '_')}.csv"`)
  
  res.write('\uFEFF')
  res.send(csvContent)
}

function flattenObject(obj: any, prefix = ''): any {
  const flattened: any = {}
  
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    const newKey = prefix ? `${prefix}_${key}` : key
    
    if (value === null || value === undefined) {
      flattened[newKey] = ''
    } else if (Array.isArray(value)) {
      flattened[newKey] = value.length
      flattened[`${newKey}_details`] = JSON.stringify(value)
    } else if (typeof value === 'object' && !(value instanceof Date)) {
      Object.assign(flattened, flattenObject(value, newKey))
    } else if (value instanceof Date) {
      flattened[newKey] = value.toLocaleDateString('ru-RU')
    } else {
      flattened[newKey] = value
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