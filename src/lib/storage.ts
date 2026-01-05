export type User = {
  id: string;
  email: string;
  username: string;
  password: string;
};

export type Release = {
  id: string;
  userId: string;
  albumTitle: string;
  albumArtists: string[];
  wasReleased: "yes" | "no";
  upc?: string;
  oldReleaseDate?: string;
  cover?: string;
  status: "draft" | "moderation" | "approved" | "rejected";
  genre: string;
  tracks: Track[];
  createdAt: string;
  rejectionReason?: string;
};

export type Track = {
  id: string;
  name: string;
  artists: string[];
  file?: string;
  isrc: string;
  version: string;
  musicians: string[];
  lyricists: string[];
  tiktokMoment: string;
  explicitLyrics: boolean;
  hasLyrics: boolean;
  language?: string;
  lyrics?: string;
};

export type Ticket = {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: "open" | "closed";
  date: string;
  response?: string;
};

const STORAGE_KEYS = {
  USERS: "kedoo_users",
  RELEASES: "kedoo_releases",
  TICKETS: "kedoo_tickets",
  TRASH: "kedoo_trash",
  CURRENT_USER: "kedoo_current_user",
};

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  findUser: (email: string, password: string): User | null => {
    const users = storage.getUsers();
    return users.find((u) => u.email === email && u.password === password) || null;
  },

  updateUser: (userId: string, updates: Partial<User>) => {
    const users = storage.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getReleases: (userId?: string): Release[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RELEASES);
    const releases = data ? JSON.parse(data) : [];
    return userId ? releases.filter((r: Release) => r.userId === userId) : releases;
  },

  saveRelease: (release: Release) => {
    const releases = storage.getReleases();
    releases.push(release);
    localStorage.setItem(STORAGE_KEYS.RELEASES, JSON.stringify(releases));
  },

  updateRelease: (releaseId: string, updates: Partial<Release>) => {
    const releases = storage.getReleases();
    const index = releases.findIndex((r) => r.id === releaseId);
    if (index !== -1) {
      releases[index] = { ...releases[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.RELEASES, JSON.stringify(releases));
    }
  },

  deleteRelease: (releaseId: string) => {
    const releases = storage.getReleases();
    const release = releases.find((r) => r.id === releaseId);
    if (release) {
      const trash = storage.getTrash();
      trash.push(release);
      localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(trash));
    }
    const filtered = releases.filter((r) => r.id !== releaseId);
    localStorage.setItem(STORAGE_KEYS.RELEASES, JSON.stringify(filtered));
  },

  getTrash: (userId?: string): Release[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRASH);
    const trash = data ? JSON.parse(data) : [];
    return userId ? trash.filter((r: Release) => r.userId === userId) : trash;
  },

  restoreFromTrash: (releaseId: string) => {
    const trash = storage.getTrash();
    const release = trash.find((r) => r.id === releaseId);
    if (release) {
      storage.saveRelease(release);
    }
    const filtered = trash.filter((r) => r.id !== releaseId);
    localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(filtered));
  },

  deleteFromTrashPermanently: (releaseId: string) => {
    const trash = storage.getTrash();
    const filtered = trash.filter((r) => r.id !== releaseId);
    localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(filtered));
  },

  getTickets: (userId?: string): Ticket[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
    const tickets = data ? JSON.parse(data) : [];
    return userId ? tickets.filter((t: Ticket) => t.userId === userId) : tickets;
  },

  saveTicket: (ticket: Ticket) => {
    const tickets = storage.getTickets();
    tickets.push(ticket);
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  },

  updateTicket: (ticketId: string, updates: Partial<Ticket>) => {
    const tickets = storage.getTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index !== -1) {
      tickets[index] = { ...tickets[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    }
  },
};
