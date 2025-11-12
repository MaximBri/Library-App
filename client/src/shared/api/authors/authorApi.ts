import api from '../axios';
import type {
  AuthorCreateModel,
  AuthorModel,
  AuthorsResponseInfinite,
} from './types';

export const authorApi = {
  getAuthors: async (
    params: { cursor?: number | null; limit?: number; search?: string } = {}
  ): Promise<AuthorsResponseInfinite> => {
    const { data } = await api.get('/api/authors', { params });
    return data;
  },
  createAuthor: async (payload: AuthorCreateModel): Promise<AuthorModel> => {
    const { data } = await api.post('/api/authors', payload);
    return data;
  },
};

export default authorApi;
