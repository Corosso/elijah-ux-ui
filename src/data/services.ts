import type { Service } from '../types';

export const services: Service[] = [
  {
    icon: 'MapPin',
    title: 'Point to Point',
    desc: 'Direct transfers with maximum punctuality and comfort for your meetings and commitments.',
  },
  {
    icon: 'Clock',
    title: 'By the Hour',
    desc: 'A chauffeur at your complete disposal for as long as you need, with total flexibility.',
  },
  {
    icon: 'Plane',
    title: 'Airport Transfers',
    desc: 'Reception and transfer service with flight monitoring to guarantee your on-time arrival.',
  },
  {
    icon: 'Sparkles',
    title: 'Special Events',
    desc: 'Luxury vehicles for weddings, corporate galas and occasions that demand the highest elegance.',
  },
];

export const experienceFeatures: string[] = [
  'Certified professional chauffeurs',
  'Latest generation vehicles',
  '24/7 Service',
  'Real-time tracking',
];

export const stats = [
  { value: 500, suffix: '+', label: 'Satisfied Clients', animated: true },
  { value: 50, suffix: 'k+', label: 'Completed Trips', animated: true },
  { value: 6, label: 'Cities', animated: true },
  { value: 4.9, label: 'Rating', animated: false },
];
