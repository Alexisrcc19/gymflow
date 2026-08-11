export interface AttendancePoint {
  attendance: number;
  classes: number;
  day: string;
}

export interface MembershipStatusItem {
  color: string;
  label: string;
  value: number;
}

export interface RecentMember {
  id: string;
  joined: string;
  name: string;
  plan: string;
  status: 'Activa' | 'Por vencer' | 'Vencida' | 'Pausada';
}

export interface UpcomingClass {
  capacity: number;
  enrolled: number;
  name: string;
  time: string;
  trainer: string;
}

export const attendancePoints: AttendancePoint[] = [
  { attendance: 270, classes: 92, day: 'Lun' },
  { attendance: 312, classes: 116, day: 'Mar' },
  { attendance: 294, classes: 101, day: 'Mié' },
  { attendance: 345, classes: 126, day: 'Jue' },
  { attendance: 389, classes: 141, day: 'Vie' },
  { attendance: 251, classes: 91, day: 'Sáb' },
  { attendance: 174, classes: 57, day: 'Dom' },
];

export const membershipStatuses: MembershipStatusItem[] = [
  { color: '#2F8F5B', label: 'Activas', value: 1042 },
  { color: '#B5811F', label: 'Por vencer', value: 168 },
  { color: '#2F6FB5', label: 'Pausadas', value: 74 },
  { color: '#C0433B', label: 'Vencidas', value: 121 },
];

export const recentMembers: RecentMember[] = [
  {
    id: 'GM-4821',
    joined: '3 ago 2026',
    name: 'Noelia Ferrand',
    plan: 'Anual ilimitado',
    status: 'Activa',
  },
  {
    id: 'GM-4820',
    joined: '2 ago 2026',
    name: 'Teodor Vasquez',
    plan: 'Mensual fuera de hora pico',
    status: 'Por vencer',
  },
  {
    id: 'GM-4819',
    joined: '2 ago 2026',
    name: 'Marisol Ibarra',
    plan: 'Paquete de 10 clases',
    status: 'Activa',
  },
  {
    id: 'GM-4818',
    joined: '1 ago 2026',
    name: 'Aurel Sandoval',
    plan: 'Mensual ilimitado',
    status: 'Pausada',
  },
  {
    id: 'GM-4817',
    joined: '31 jul 2026',
    name: 'Priya Nandakumar',
    plan: 'Mensual para estudiantes',
    status: 'Vencida',
  },
];

export const upcomingClasses: UpcomingClass[] = [
  {
    capacity: 20,
    enrolled: 18,
    name: 'Fundamentos de fuerza',
    time: '17:30',
    trainer: 'Rhea Alonzo',
  },
  {
    capacity: 24,
    enrolled: 24,
    name: 'Circuito de acondicionamiento',
    time: '18:15',
    trainer: 'Ivo Petrescu',
  },
  {
    capacity: 16,
    enrolled: 11,
    name: 'Movilidad y recuperación',
    time: '19:00',
    trainer: 'Ian Torres',
  },
  {
    capacity: 14,
    enrolled: 9,
    name: 'Fundamentos de boxeo',
    time: '19:45',
    trainer: 'Derek Nwosa',
  },
];
