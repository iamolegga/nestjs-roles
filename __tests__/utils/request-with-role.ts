import * as request from 'supertest';

export function requestWithRole(server: any, role: any) {
  if (role) {
    return request(server)
      .get('/')
      .set('role', role);
  }

  return request(server).get('/');
}
