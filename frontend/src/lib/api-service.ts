import axios from "axios";

// =============================
// API BASE URL
// =============================
const API_BASE_URL = "http://localhost:3003";

// =============================
// AXIOS INSTANCE
// =============================
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// =============================
// TOKEN INTERCEPTOR
// =============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// =============================
// TYPES
// =============================
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: string;
}

export interface LoginData {
  username: string;
  password: string;
}

// =============================
// AUTH API
// =============================
export const authAPI = {
  register: async (data: RegisterData) => {
    const res = await api.post("/api/auth/signup", data);
    return res.data;
  },

  login: async (data: LoginData) => {
    const res = await api.post("/api/auth/login", data);
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return res.data;
  },

  getUserById: async (id: string) => {
    const res = await api.get(`/api/v1/attendees/${id}`);
    return res.data;
  }
};


// =============================
// ATTENDEE API (PROFILE)
// =============================
export const attendeeAPI = {
  // GET BY ID
  getById: async (id: string) => {
    const res = await api.get(`/api/v1/attendees/${id}`);
    return res.data;
  },

  // UPDATE PROFILE
  updateProfile: async (id: string, data: { fullName?: string; email?: string }) => {
    const res = await api.put(`/api/v1/attendees/${id}/profile`, data);
    return res.data.attendee;
  },

  // CHANGE PASSWORD
  changePassword: async (id: string, currentPassword: string, newPassword: string) => {
    const res = await api.put(`/api/v1/attendees/${id}/password`, {
      currentPassword,
      newPassword
    });
    return res.data;
  },
};

// =============================
// EVENT API
// =============================
export const eventAPI = {
  // GET ALL EVENTS
  getAllEvents: async () => {
    const res = await api.get("/api/v1/events");
    return res.data;
  },

  // GET EVENT BY ID
  getEventById: async (id: string) => {
    const res = await api.get(`/api/v1/events/${id}`);
    return res.data;
  },

  // CREATE EVENT
  createEvent: async (eventData: {
    title: string;
    description: string;
    location: string;
    eventDate: string;
    category?: string;
    price?: number;
    capacity?: number;
    imageUrl?: string;
  }) => {
    const res = await api.post("/api/v1/events", eventData);
    return res.data;
  },

  // UPDATE EVENT
  updateEvent: async (id: string, eventData: any) => {
    const res = await api.put(`/api/v1/events/${id}`, eventData);
    return res.data;
  },

  // DELETE EVENT
  deleteEvent: async (id: string) => {
    const res = await api.delete(`/api/v1/events/${id}`);
    return res.data;
  },
};

// =============================
// PAYMENT API
// =============================
export const paymentAPI = {
  // INITIATE PAYMENT
  initiatePayment: async (paymentData: {
    userId: number;
    eventId: number;
    amount: number;
    paymentMethod: string;
  }) => {
    const res = await api.post("/api/v1/payments/initiate", paymentData);
    return res.data;
  },

  // GET PAYMENT STATUS
  getPaymentStatus: async (paymentId: number) => {
    const res = await api.get(`/api/v1/payments/status/${paymentId}`);
    return res.data;
  },
};

// =============================
// TICKET API
// =============================
export const ticketAPI = {
  // CREATE TICKET (after payment) - Uses /book endpoint
  createTicket: async (ticketData: {
    userId: number;
    eventId: number;
    price: number;
    status: string;
  }) => {
    const res = await api.post("/api/v1/tickets/book", ticketData);
    return res.data;
  },

  // GET USER'S TICKETS
  getUserTickets: async (userId: number) => {
    const res = await api.get(`/api/v1/tickets/user/${userId}`);
    return res.data;
  },

  // GET TICKET BY ID
  getTicketById: async (id: number) => {
    const res = await api.get(`/api/v1/tickets/${id}`);
    return res.data;
  },

  // CANCEL TICKET (DELETE)
  cancelTicket: async (ticketId: number) => {
    const res = await api.delete(`/api/v1/tickets/${ticketId}`);
    return res.data;
  },
};

// =============================
// NOTIFICATION API
// =============================
export const notificationAPI = {
  // GET ALL NOTIFICATIONS
  getAllNotifications: async () => {
    const res = await api.get("/api/v1/notifications");
    return res.data;
  },
};

export default api;
