export interface Vehicle {
  id: number;
  name: string;
  category: string;
  description: string;
  passengers: number;
  luggage: number;
  image: string;
  features?: string[];
  popular?: boolean;
}

export interface Route {
  origin: string;
  dest: string;
  dist: string;
  time: string;
  image: string;
}

export interface Service {
  icon: string;
  title: string;
  desc: string;
}

export interface NavLink {
  name: string;
  href: string;
}

export interface Stat {
  value: number | string;
  suffix?: string;
  label: string;
  animated?: boolean;
}

export interface BookingRequest {
  type: 'point_to_point' | 'hourly';
  origin: string;
  destination?: string;
  date: string;
  return_trip: boolean;
}

export interface BookingResponse {
  id: string;
  estimated_price: number;
  currency: string;
  estimated_duration: string;
}

export interface ContactInfo {
  phone: string;
  email?: string;
  social: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}
