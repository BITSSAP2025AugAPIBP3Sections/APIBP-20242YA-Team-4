import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { notificationAPI } from '@/lib/api-service';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const deletedIdsRef = useRef<Set<string>>(new Set());

  // Fetch real notifications from backend
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const data = await notificationAPI.getAllNotifications();
        
        // Filter notifications for current user and exclude deleted ones
        const userNotifications = data.filter((n: any) => {
          const id = n.id.toString();
          // Skip if deleted
          if (deletedIdsRef.current.has(id)) return false;
          // Show all broadcasts (recipient: "all")
          if (n.recipient === 'all') return true;
          // Show user-specific notifications (recipient: "user:{id}")
          if (n.recipient === `user:${user.id}`) return true;
          return false;
        });
        
        // Transform backend notifications to frontend format
        const transformed = userNotifications.map((n: any) => {
          const id = n.id.toString();
          // Check if this notification exists in current state to preserve read status
          const existingNotif = notifications.find(existing => existing.id === id);
          
          return {
            id: id,
            type: n.title.includes('Payment') ? 'success' as const : 'info' as const,
            message: n.message,
            timestamp: new Date(n.sentAt),
            read: existingNotif ? existingNotif.read : false, // Preserve read status
          };
        });
        
        setNotifications(transformed);
      } catch (error) {
        console.error('❌ Failed to fetch notifications:', error);
      }
    };
    
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [user]); // Only user dependency

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearNotification = (id: string) => {
    // Add to deleted IDs to prevent from showing again
    deletedIdsRef.current.add(id);
    // Remove from current list
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
