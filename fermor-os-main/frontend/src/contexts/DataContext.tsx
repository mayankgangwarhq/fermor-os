import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Farm, CropCycle, FarmTask, FarmExpense, FarmRevenue,
  WeatherData, MandiPrice, MarketplaceListing, PurchaseRequest,
  Expert, Consultation, GovernmentScheme, Equipment, EquipmentBooking,
  Notification
} from '../types';
import {
  sampleFarms, sampleCropCycles, sampleTasks, sampleExpenses,
  sampleRevenues, sampleWeather, sampleMandiPrices,
  sampleMarketplaceListings, samplePurchaseRequests, sampleExperts,
  sampleConsultations, sampleSchemes, sampleEquipment,
  sampleEquipmentBookings, sampleNotifications
} from '../services/mockData';

interface DataContextType {
  farms: Farm[];
  addFarm: (farm: Omit<Farm, 'id'>) => void;
  cropCycles: CropCycle[];
  addCropCycle: (crop: Omit<CropCycle, 'id'>) => void;
  updateCropStatus: (id: string, status: CropCycle['status']) => void;
  tasks: FarmTask[];
  addTask: (task: Omit<FarmTask, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  expenses: FarmExpense[];
  addExpense: (exp: Omit<FarmExpense, 'id'>) => void;
  revenues: FarmRevenue[];
  addRevenue: (rev: Omit<FarmRevenue, 'id'>) => void;
  weather: WeatherData;
  mandiPrices: MandiPrice[];
  marketplaceListings: MarketplaceListing[];
  addListing: (listing: Omit<MarketplaceListing, 'id' | 'listedDate' | 'interestedCount'>) => void;
  purchaseRequests: PurchaseRequest[];
  addPurchaseRequest: (req: Omit<PurchaseRequest, 'id' | 'requestDate' | 'status'>) => void;
  updatePurchaseRequestStatus: (id: string, status: 'accepted' | 'rejected') => void;
  experts: Expert[];
  consultations: Consultation[];
  addConsultation: (cons: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => void;
  schemes: GovernmentScheme[];
  equipmentListings: Equipment[];
  equipmentBookings: EquipmentBooking[];
  addEquipmentBooking: (booking: Omit<EquipmentBooking, 'id' | 'status' | 'bookedAt'>) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

import { useFarmLocation } from './FarmLocationContext';
import { fetchWeatherForLocation } from '../services/weatherService';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { location: farmLoc } = useFarmLocation();
  const [weather, setWeather] = useState<WeatherData>(sampleWeather);

  useEffect(() => {
    const syncWeather = async () => {
      const liveWeatherData = await fetchWeatherForLocation(farmLoc);
      setWeather(liveWeatherData);
    };
    syncWeather();
  }, [farmLoc]);
  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem('agrinext_farms');
    return saved ? JSON.parse(saved) : sampleFarms;
  });

  const [cropCycles, setCropCycles] = useState<CropCycle[]>(() => {
    const saved = localStorage.getItem('agrinext_crops');
    return saved ? JSON.parse(saved) : sampleCropCycles;
  });

  const [tasks, setTasks] = useState<FarmTask[]>(() => {
    const saved = localStorage.getItem('agrinext_tasks');
    return saved ? JSON.parse(saved) : sampleTasks;
  });

  const [expenses, setExpenses] = useState<FarmExpense[]>(() => {
    const saved = localStorage.getItem('agrinext_expenses');
    return saved ? JSON.parse(saved) : sampleExpenses;
  });

  const [revenues, setRevenues] = useState<FarmRevenue[]>(() => {
    const saved = localStorage.getItem('agrinext_revenues');
    return saved ? JSON.parse(saved) : sampleRevenues;
  });

  const [mandiPrices] = useState<MandiPrice[]>(sampleMandiPrices);
  const [schemes] = useState<GovernmentScheme[]>(sampleSchemes);
  const [experts] = useState<Expert[]>(sampleExperts);
  const [equipmentListings] = useState<Equipment[]>(sampleEquipment);

  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(() => {
    const saved = localStorage.getItem('agrinext_listings');
    return saved ? JSON.parse(saved) : sampleMarketplaceListings;
  });

  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(() => {
    const saved = localStorage.getItem('agrinext_purchase_reqs');
    return saved ? JSON.parse(saved) : samplePurchaseRequests;
  });

  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    const saved = localStorage.getItem('agrinext_consultations');
    return saved ? JSON.parse(saved) : sampleConsultations;
  });

  const [equipmentBookings, setEquipmentBookings] = useState<EquipmentBooking[]>(() => {
    const saved = localStorage.getItem('agrinext_eq_bookings');
    return saved ? JSON.parse(saved) : sampleEquipmentBookings;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('agrinext_notifications');
    return saved ? JSON.parse(saved) : sampleNotifications;
  });

  useEffect(() => { localStorage.setItem('agrinext_farms', JSON.stringify(farms)); }, [farms]);
  useEffect(() => { localStorage.setItem('agrinext_crops', JSON.stringify(cropCycles)); }, [cropCycles]);
  useEffect(() => { localStorage.setItem('agrinext_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('agrinext_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('agrinext_revenues', JSON.stringify(revenues)); }, [revenues]);
  useEffect(() => { localStorage.setItem('agrinext_listings', JSON.stringify(marketplaceListings)); }, [marketplaceListings]);
  useEffect(() => { localStorage.setItem('agrinext_purchase_reqs', JSON.stringify(purchaseRequests)); }, [purchaseRequests]);
  useEffect(() => { localStorage.setItem('agrinext_consultations', JSON.stringify(consultations)); }, [consultations]);
  useEffect(() => { localStorage.setItem('agrinext_eq_bookings', JSON.stringify(equipmentBookings)); }, [equipmentBookings]);
  useEffect(() => { localStorage.setItem('agrinext_notifications', JSON.stringify(notifications)); }, [notifications]);

  const addFarm = (farmData: Omit<Farm, 'id'>) => {
    const newFarm: Farm = { ...farmData, id: `farm-${Date.now()}` };
    setFarms(prev => [...prev, newFarm]);
  };

  const addCropCycle = (cropData: Omit<CropCycle, 'id'>) => {
    const newCrop: CropCycle = { ...cropData, id: `crop-${Date.now()}` };
    setCropCycles(prev => [...prev, newCrop]);
  };

  const updateCropStatus = (id: string, status: CropCycle['status']) => {
    setCropCycles(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const addTask = (taskData: Omit<FarmTask, 'id'>) => {
    const newTask: FarmTask = { ...taskData, id: `task-${Date.now()}` };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addExpense = (expData: Omit<FarmExpense, 'id'>) => {
    const newExp: FarmExpense = { ...expData, id: `exp-${Date.now()}` };
    setExpenses(prev => [newExp, ...prev]);
  };

  const addRevenue = (revData: Omit<FarmRevenue, 'id'>) => {
    const newRev: FarmRevenue = { ...revData, id: `rev-${Date.now()}` };
    setRevenues(prev => [newRev, ...prev]);
  };

  const addListing = (listingData: Omit<MarketplaceListing, 'id' | 'listedDate' | 'interestedCount'>) => {
    const newListing: MarketplaceListing = {
      ...listingData,
      id: `list-${Date.now()}`,
      listedDate: new Date().toISOString().split('T')[0],
      interestedCount: 0
    };
    setMarketplaceListings(prev => [newListing, ...prev]);
  };

  const addPurchaseRequest = (reqData: Omit<PurchaseRequest, 'id' | 'requestDate' | 'status'>) => {
    const newReq: PurchaseRequest = {
      ...reqData,
      id: `pr-${Date.now()}`,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    setPurchaseRequests(prev => [newReq, ...prev]);
  };

  const updatePurchaseRequestStatus = (id: string, status: 'accepted' | 'rejected') => {
    setPurchaseRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const addConsultation = (consData: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => {
    const newCons: Consultation = {
      ...consData,
      id: `cons-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toLocaleString()
    };
    setConsultations(prev => [newCons, ...prev]);
  };

  const addEquipmentBooking = (bookingData: Omit<EquipmentBooking, 'id' | 'status' | 'bookedAt'>) => {
    const newBooking: EquipmentBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      status: 'confirmed',
      bookedAt: new Date().toISOString().split('T')[0]
    };
    setEquipmentBookings(prev => [newBooking, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <DataContext.Provider
      value={{
        farms,
        addFarm,
        cropCycles,
        addCropCycle,
        updateCropStatus,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        expenses,
        addExpense,
        revenues,
        addRevenue,
        weather,
        mandiPrices,
        marketplaceListings,
        addListing,
        purchaseRequests,
        addPurchaseRequest,
        updatePurchaseRequestStatus,
        experts,
        consultations,
        addConsultation,
        schemes,
        equipmentListings,
        equipmentBookings,
        addEquipmentBooking,
        notifications,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
