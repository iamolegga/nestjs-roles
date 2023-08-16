import request from 'supertest';

export function requestWithRole(server: unknown, role?: string | string[]) {
  if (role) {
    return (
      request(server)
        .get('/')
        // wrong types for passing array
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .set('role', role as any)
    );
  }

  return request(server).get('/');
}
