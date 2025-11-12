import api from '../axios';

export const authorApi = {
  getAuthors: async (
    params: { cursor?: number | null; limit?: number; search?: string } = {}
  ) => {
    const { data } = await api.get('/api/authors', { params });
    return data;
  },
  createAuthor: async (payload: {
    name: string;
    surname: string;
    patronymic?: string | null;
    description?: string | null;
    birthYear?: number | null;
  }) => {
    const { data } = await api.post('/api/authors', payload);
    return data;
  },
};

export default authorApi;
