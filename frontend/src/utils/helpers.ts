export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const dummyElections: any[] = [
  {
    id: '1',
    name: 'Student Council Election 2025',
    date: '2025-03-15',
    timeSlot: '9:00 AM - 5:00 PM',
    status: 'upcoming',
    voterCount: 1250,
    votedCount: 0,
    candidates: [
      { id: 'c1', name: 'Alex Johnson', position: 'President' },
      { id: 'c2', name: 'Maria Rodriguez', position: 'President' },
      { id: 'c3', name: 'David Chen', position: 'President' },
    ]
  },
  {
    id: '2',
    name: 'Department Representative Election',
    date: '2025-02-20',
    timeSlot: '10:00 AM - 4:00 PM',
    status: 'active',
    voterCount: 580,
    votedCount: 342,
    candidates: [
      { id: 'c4', name: 'Sarah Williams', position: 'Representative' },
      { id: 'c5', name: 'James Lee', position: 'Representative' },
    ]
  },
  {
    id: '3',
    name: 'Faculty Board Election 2024',
    date: '2024-12-10',
    timeSlot: '8:00 AM - 6:00 PM',
    status: 'completed',
    voterCount: 95,
    votedCount: 82,
    candidates: [
      { 
        id: 'c6', 
        name: 'Emily Davis', 
        position: 'Faculty Board Member',
        votes: 45,
        votePercentage: 54.9
      },
      { 
        id: 'c7', 
        name: 'Michael Taylor', 
        position: 'Faculty Board Member',
        votes: 37,
        votePercentage: 45.1
      },
    ]
  }
];

export const dummyVoters: any[] = [
  { id: 'v1', name: 'John Smith', email: 'john.smith@example.edu', hasVoted: true },
  { id: 'v2', name: 'Emma Brown', email: 'emma.brown@example.edu', hasVoted: true },
  { id: 'v3', name: 'Noah Wilson', email: 'noah.w@example.edu', hasVoted: true },
  { id: 'v4', name: 'Olivia Martinez', email: 'olivia.m@example.edu', hasVoted: true },
  { id: 'v5', name: 'William Johnson', email: 'william.j@example.edu', hasVoted: false },
  { id: 'v6', name: 'Sophia Garcia', email: 'sophia.g@example.edu', hasVoted: true },
  { id: 'v7', name: 'James Miller', email: 'james.m@example.edu', hasVoted: false },
  { id: 'v8', name: 'Charlotte Davis', email: 'charlotte.d@example.edu', hasVoted: true },
  { id: 'v9', name: 'Benjamin Rodriguez', email: 'benjamin.r@example.edu', hasVoted: false },
  { id: 'v10', name: 'Amelia Jackson', email: 'amelia.j@example.edu', hasVoted: true },
];

export const getElectionById = (id: string) => {
  return dummyElections.find(election => election.id === id);
};

export const getVotersForElection = (electionId: string) => {
  // In a real app, you would filter based on the election ID
  return dummyVoters;
};