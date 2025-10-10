import { Request, Response } from 'express'
import * as bookService from '../services/book.service'
import {
  CreateBookInput,
  UpdateBookInput,
  GetBooksQueryInput,
} from '../validators/book.validator'

export const createBook = async (req: Request, res: Response) => {
  const data = CreateBookInput.parse(req.body)
  const book = await bookService.createBook(data)

  res.status(201).json(book)
}

export const getBook = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  const book = await bookService.getBookById(id)
  res.json(book)
}

export const getBooks = async (req: Request, res: Response) => {
  const query = GetBooksQueryInput.parse(req.query)

  const books = await bookService.getBooks({
    cursor: query.cursor ? parseInt(query.cursor) : undefined,
    limit: query.limit,
    libraryId: query.libraryId,
  })

  res.json(books)
}

export const getBooksByLibrary = async (req: Request, res: Response) => {
  const libraryId = parseInt(req.params.libraryId, 10)

  if (isNaN(libraryId)) {
    return res.status(400).json({ message: 'Invalid library ID' })
  }

  const query = GetBooksQueryInput.parse(req.query)

  const books = await bookService.getBooksByLibraryId(libraryId, {
    cursor: query.cursor ? parseInt(query.cursor) : undefined,
    limit: query.limit,
  })

  res.json(books)
}

export const updateBook = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  const data = UpdateBookInput.parse(req.body)
  const book = await bookService.updateBook(id, data)

  res.json(book)
}

export const deleteBook = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  const result = await bookService.deleteBook(id)
  res.json(result)
}