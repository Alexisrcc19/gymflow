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
  status: 'Active' | 'Expiring' | 'Expired' | 'Paused';
}

export interface UpcomingClass {
  capacity: number;
  enrolled: number;
  name: string;
  time: string;
  trainer: string;
}

export const attendancePoints: AttendancePoint[] = [
  { attendance: 270, classes: 92, day: 'Mon' },
  { attendance: 312, classes: 116, day: 'Tue' },
  { attendance: 294, classes: 101, day: 'Wed' },
  { attendance: 345, classes: 126, day: 'Thu' },
  { attendance: 389, classes: 141, day: 'Fri' },
  { attendance: 251, classes: 91, day: 'Sat' },
  { attendance: 174, classes: 57, day: 'Sun' },
];

export const membershipStatuses: MembershipStatusItem[] = [
  { color: '#2F8F5B', label: 'Active', value: 1042 },
  { color: '#B5811F', label: 'Expiring soon', value: 168 },
  { color: '#2F6FB5', label: 'Paused', value: 74 },
  { color: '#C0433B', label: 'Expired', value: 121 },
];

export const recentMembers: RecentMember[] = [
  {
    id: 'GM-4821',
    joined: 'Aug 3, 2026',
    name: 'Noelia Ferrand',
    plan: 'Unlimited Annual',
    status: 'Active',
  },
  {
    id: 'GM-4820',
    joined: 'Aug 2, 2026',
    name: 'Teodor Vasquez',
    plan: 'Off-Peak Monthly',
    status: 'Expiring',
  },
  {
    id: 'GM-4819',
    joined: 'Aug 2, 2026',
    name: 'Marisol Ibarra',
    plan: 'Class Pack 10',
    status: 'Active',
  },
  {
    id: 'GM-4818',
    joined: 'Aug 1, 2026',
    name: 'Aurel Sandoval',
    plan: 'Unlimited Monthly',
    status: 'Paused',
  },
  {
    id: 'GM-4817',
    joined: 'Jul 31, 2026',
    name: 'Priya Nandakumar',
    plan: 'Student Monthly',
    status: 'Expired',
  },
];

export const upcomingClasses: UpcomingClass[] = [
  {
    capacity: 20,
    enrolled: 18,
    name: 'Strength Foundations',
    time: '17:30',
    trainer: 'Rhea Alonzo',
  },
  {
    capacity: 24,
    enrolled: 24,
    name: 'Conditioning Circuit',
    time: '18:15',
    trainer: 'Ivo Petrescu',
  },
  {
    capacity: 16,
    enrolled: 11,
    name: 'Mobility & Recovery',
    time: '19:00',
    trainer: 'Ian Torres',
  },
  {
    capacity: 14,
    enrolled: 9,
    name: 'Boxing Fundamentals',
    time: '19:45',
    trainer: 'Derek Nwosa',
  },
];
