import request from 'supertest';
import type { App } from 'supertest/types';

export function requestWithRole(server: App, role?: string | string[]) {
  if (role) {
    return (
      request(server)
        .get('/')
        // wrong types for passing array
        .set('role', role as any)
    );
  }

  return request(server).get('/');
}
