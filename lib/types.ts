export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  image: string;
  organizerId: string;
  organizer: { id: string; name: string; email: string };
  registrations: { id: string; userId: string; status: string }[];
  _count?: { registrations: number };
  createdAt: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}
