import { apiClient } from './client';
import type { Vehicle, Route, Service, BookingRequest, BookingResponse } from '../types';
import { vehicles as staticVehicles } from '../data/vehicles';
import { routes as staticRoutes } from '../data/routes';
import { services as staticServices } from '../data/services';

// Set to true when the FastAPI backend is ready
const USE_API = import.meta.env.VITE_USE_API === 'true';

export async function getVehicles(): Promise<Vehicle[]> {
  if (!USE_API) return staticVehicles;
  return apiClient<Vehicle[]>('/api/vehicles');
}

export async function getRoutes(): Promise<Route[]> {
  if (!USE_API) return staticRoutes;
  return apiClient<Route[]>('/api/routes');
}

export async function getServices(): Promise<Service[]> {
  if (!USE_API) return staticServices;
  return apiClient<Service[]>('/api/services');
}

export async function createBooking(booking: BookingRequest): Promise<BookingResponse> {
  return apiClient<BookingResponse>('/api/bookings', {
    method: 'POST',
    body: booking,
  });
}

export async function getBookingQuote(booking: BookingRequest): Promise<BookingResponse> {
  return apiClient<BookingResponse>('/api/bookings/quote', {
    method: 'POST',
    body: booking,
  });
}
