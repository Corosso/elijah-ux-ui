import type { Route } from '../types';

export const routes: Route[] = [
  {
    origin: 'Bogotá',
    dest: 'Medellín',
    dist: '415 km',
    time: '8h 30m',
    image: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=600&h=500&fit=crop',
  },
  {
    origin: 'Bogotá',
    dest: 'Cartagena',
    dist: '1,038 km',
    time: '18h 45m',
    image: '/bgs/cartagena.png',
  },
  {
    origin: 'Medellín',
    dest: 'Cali',
    dist: '420 km',
    time: '8h 15m',
    image: '/bgs/cali.png',
  },
  {
    origin: 'Cartagena',
    dest: 'Barranquilla',
    dist: '120 km',
    time: '2h 10m',
    image: '/bgs/barranquilla.png',
  },
  {
    origin: 'Barranquilla',
    dest: 'Santa Marta',
    dist: '105 km',
    time: '2h 00m',
    image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600&h=500&fit=crop',
  },
  {
    origin: 'Cali',
    dest: 'Bogotá',
    dist: '460 km',
    time: '9h 30m',
    image: 'https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?w=600&h=500&fit=crop',
  },
];
