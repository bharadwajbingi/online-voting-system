export interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  role: 'admin' | 'voter';
}

export interface Election {
  id: string;
  name: string;
  date: string;
  timeSlot: string;
  status: 'upcoming' | 'active' | 'completed';
  voterCount?: number;
  votedCount?: number;
  candidates?: Candidate[];
}

export interface Candidate {
  id: string;
  name: string;
  position?: string;
  votes?: number;
  votePercentage?: number;
}

export interface Voter {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  hasVoted: boolean;
}