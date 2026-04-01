import { writable, get } from 'svelte/store';

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  status: string;
  createdAt: Date;
  mediaUrls?: string[];
}

function createReportStore() {
  const { subscribe, set, update } = writable<Report[]>([]);
  
  const getAuthToken = () => {
    // Try to get token from localStorage or cookies
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token') || localStorage.getItem('session_token');
    }
    return null;
  };
  
  return {
    subscribe,
    loadNearby: async (lat: number, lng: number, radius: number = 5000) => {
      try {
        const response = await fetch(`/api/reports?lat=${lat}&lng=${lng}&radius=${radius}`);
        if (!response.ok) {
          throw new Error('Failed to load reports');
        }
        const reports = await response.json();
        set(reports);
        return reports;
      } catch (error) {
        console.error('Failed to load reports:', error);
        throw error;
      }
    },
    
    createReport: async (reportData: {
      categoryId: string;
      title: string;
      description: string;
      location: {
        type: 'Point';
        coordinates: [number, number];
      };
      locationName?: string;
      address?: string;
      isAnonymous?: boolean;
      media?: File[];
    }) => {
      try {
        const token = getAuthToken();
        const response = await fetch('/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify(reportData),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create report');
        }
        
        const newReport = await response.json();
        update(reports => [...reports, newReport]);
        return newReport;
      } catch (error) {
        console.error('Failed to create report:', error);
        throw error;
      }
    },
    
    getCountBySeverity: (minSeverity: number | string, maxSeverity?: number | string) => {
      const severityValues: Record<string, number> = {
        low: 1,
        medium: 2,
        high: 3,
        critical: 4,
      };
      
      const minValue = typeof minSeverity === 'string' ? severityValues[minSeverity] : minSeverity;
      const maxValue = maxSeverity ? (typeof maxSeverity === 'string' ? severityValues[maxSeverity] : maxSeverity) : undefined;
      
      let count = 0;
      const reports = get({ subscribe });
      reports.forEach(report => {
        const severityValue = severityValues[report.severity];
        if (severityValue >= minValue && (!maxValue || severityValue <= maxValue)) {
          count++;
        }
      });
      return count;
    },
    
    getReportById: async (id: string) => {
      try {
        const response = await fetch(`/api/reports/${id}`);
        if (!response.ok) {
          throw new Error('Failed to load report');
        }
        return await response.json();
      } catch (error) {
        console.error('Failed to load report:', error);
        throw error;
      }
    },
    
    clear: () => {
      set([]);
    }
  };
}

export const reportStore = createReportStore();