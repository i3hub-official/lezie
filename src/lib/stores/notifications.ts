import { writable } from 'svelte/store';

type SocketInstance = import('socket.io-client').Socket;

interface Notification {
  id: string;
  title: string;
  message: string;
  body?: string;
  type: 'alert' | 'info' | 'warning' | 'critical' | 'verification' | 'system';
  isRead: boolean;
  createdAt: Date;
  data?: unknown;
}

interface AlertPayload {
  reportId?: string;
  title?: string;
  severity?: string;
  [key: string]: unknown;
}

function createNotificationsStore() {
  const { subscribe, set, update } = writable<Notification[]>([]);
  let unreadCountValue = 0;
  let socket: SocketInstance | null = null;
  
  const getAuthToken = () => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token') || localStorage.getItem('session_token');
    }
    return null;
  };
  
  // Function to request notification permission
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };
  
  // Function to show browser notification
  const showBrowserNotification = (notification: Notification) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message || notification.body,
        icon: '/favicon.svg',
        tag: notification.id,
      });
    }
  };
  
  return {
    subscribe,
    
    init: async (socketInstance: SocketInstance | null = null) => {
      socket = socketInstance ?? null;
      
      // Request notification permission
      await requestNotificationPermission();
      
      // Load existing notifications
      try {
        const token = getAuthToken();
        if (!token) return;
        
        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const notifications = await response.json();
          set(notifications);
          unreadCountValue = notifications.filter((n: Notification) => !n.isRead).length;
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
      
      // Listen to socket events if socket is provided
      if (socket) {
        socket.on('new-notification', (notification: Notification) => {
          update(notifications => [notification, ...notifications]);
          unreadCountValue++;
          
          // Show browser notification
          showBrowserNotification(notification);
        });
        
        socket.on('new-alert', (alert: AlertPayload) => {
          const notification: Notification = {
            id: alert.reportId ? String(alert.reportId) : Date.now().toString(),
            title: 'Alert!',
            message: alert.title ? String(alert.title) : 'New incident reported in your area',
            body: alert.title ? String(alert.title) : undefined,
            type: alert.severity === 'critical' ? 'critical' : 'alert',
            isRead: false,
            createdAt: new Date(),
            data: alert,
          };
          
          update(notifications => [notification, ...notifications]);
          unreadCountValue++;
          
          // Show browser notification
          showBrowserNotification(notification);
        });
      }
    },
    
    markAsRead: async (id: string) => {
      update(notifications => {
        const updated = notifications.map(n => {
          if (n.id === id) {
            if (!n.isRead) unreadCountValue--;
            return { ...n, isRead: true };
          }
          return n;
        });
        return updated;
      });
      
      try {
        const token = getAuthToken();
        await fetch(`/api/notifications/${id}/read`, {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    },
    
    markAllAsRead: async () => {
      update(notifications => {
        const updated = notifications.map(n => ({ ...n, isRead: true }));
        unreadCountValue = 0;
        return updated;
      });
      
      try {
        const token = getAuthToken();
        await fetch('/api/notifications/read-all', {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    },
    
    unreadCount: {
      subscribe: (callback: (value: number) => void) => {
        callback(unreadCountValue);
        const unsubscribe = subscribe(notifications => {
          unreadCountValue = notifications.filter(n => !n.isRead).length;
          callback(unreadCountValue);
        });
        return unsubscribe;
      },
      get: () => unreadCountValue,
    },
    
    openPanel: () => {
      // Implementation for opening notification panel
      // This would typically dispatch a custom event or update a UI state
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-notifications-panel'));
      }
    },
    
    clear: () => {
      set([]);
      unreadCountValue = 0;
    },
    
    delete: async (id: string) => {
      update(notifications => notifications.filter(n => n.id !== id));
      
      try {
        const token = getAuthToken();
        await fetch(`/api/notifications/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    },
  };
}

export const notificationsStore = createNotificationsStore();