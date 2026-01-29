import { createContext, useContext, useState, ReactNode } from 'react';

interface OfflineContextType {
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
  const [isOffline, setIsOffline] = useState(false);

  return (
    <OfflineContext.Provider value={{ isOffline, setIsOffline }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within OfflineProvider');
  return context;
};

export default OfflineProvider;