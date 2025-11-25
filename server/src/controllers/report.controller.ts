import { Request, Response } from 'express'
import * as reportService from '../services/report.service'
import {
  BookPopularityReportInput,
  LibraryActivityReportInput,
  UserActivityReportInput,
} from '../validators/report.validator'

export const getBookPopularityReport = async (req: Request, res: Response) => {
  const query = BookPopularityReportInput.parse({
    ...req.query,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    status: req.query.status as any,
    libraryId: req.query.libraryId ? parseInt(req.query.libraryId as string) : undefined,
    authorId: req.query.authorId ? parseInt(req.query.authorId as string) : undefined,
    theme: req.query.theme as string,
    sortBy: req.query.sortBy as any,
    sortOrder: req.query.sortOrder as any,
  })

  const report = await reportService.getBookPopularityReport(query)
  res.json(report)
}

export const getLibraryActivityReport = async (req: Request, res: Response) => {
  const query = LibraryActivityReportInput.parse({
    ...req.query,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    status: req.query.status as any,
    libraryId: req.query.libraryId ? parseInt(req.query.libraryId as string) : undefined,
    librarianId: req.query.librarianId ? parseInt(req.query.librarianId as string) : undefined,
    sortBy: req.query.sortBy as any,
    sortOrder: req.query.sortOrder as any,
  })

  const report = await reportService.getLibraryActivityReport(query)
  res.json(report)
}

export const getUserActivityReport = async (req: Request, res: Response) => {
  const query = UserActivityReportInput.parse({
    ...req.query,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    status: req.query.status as any,
    role: req.query.role as any,
    userId: req.query.userId ? parseInt(req.query.userId as string) : undefined,
    sortBy: req.query.sortBy as any,
    sortOrder: req.query.sortOrder as any,
  })

  const report = await reportService.getUserActivityReport(query)
  res.json(report)
}