import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock Supabase auth endpoints
  http.post('https://test.supabase.co/auth/v1/signup', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      },
      session: null,
    })
  }),

  http.post('https://test.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
    })
  }),

  // Mock Supabase database endpoints
  http.get('https://test.supabase.co/rest/v1/prompts', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Prompt',
        content: 'Test content',
        created_at: new Date().toISOString(),
        user_id: 'test-user-id',
      },
    ])
  }),

  http.post('https://test.supabase.co/rest/v1/prompts', () => {
    return HttpResponse.json({
      id: '2',
      title: 'New Prompt',
      content: 'New content',
      created_at: new Date().toISOString(),
      user_id: 'test-user-id',
    })
  }),
]