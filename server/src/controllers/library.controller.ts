import { Request, Response } from 'express'
import * as libraryService from '../services/library.service'
import { CreateLibraryInput } from '../validators/library.validator'

export const createLibrary = async (req: Request, res: Response) => {
  const data = CreateLibraryInput.parse(req.body)
  const library = await libraryService.createLibrary(data)

  res.status(201).json(library)
}

export const getLibrary = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid library ID' })
  }

  const library = await libraryService.getLibraryById(id)
  res.json(library)
}

export const getAllLibraries = async (req: Request, res: Response) => {
  const libraries = await libraryService.getAllLibraries()
  res.json(libraries)
}

export const getMyLibrary = async (req: Request, res: Response) => {
  const librarianId = (req as any).userId
  const library = await libraryService.getLibraryByLibrarianId(librarianId)

  if (!library) {
    return res.status(404).json({ message: 'You do not have a library' })
  }

  res.json(library)
}
