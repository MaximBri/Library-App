import { Request, Response } from 'express'
import * as authorService from '../services/author.service'
import {
  CreateAuthorInput,
  UpdateAuthorInput,
  GetAuthorsQueryInput,
} from '../validators/author.validator'

export const createAuthor = async (req: Request, res: Response) => {
  const data = CreateAuthorInput.parse(req.body)
  const author = await authorService.createAuthor(data)

  res.status(201).json(author)
}

export const getAuthor = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid author ID' })
  }

  const author = await authorService.getAuthorById(id)
  res.json(author)
}

export const getAuthors = async (req: Request, res: Response) => {
  const query = GetAuthorsQueryInput.parse(req.query)

  const authors = await authorService.getAuthors({
    cursor: query.cursor ? parseInt(query.cursor) : undefined,
    limit: query.limit,
    search: query.search,
  })

  res.json(authors)
}

export const updateAuthor = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid author ID' })
  }

  const data = UpdateAuthorInput.parse(req.body)
  const author = await authorService.updateAuthor(id, data)

  res.json(author)
}

export const deleteAuthor = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid author ID' })
  }

  const result = await authorService.deleteAuthor(id)
  res.json(result)
}