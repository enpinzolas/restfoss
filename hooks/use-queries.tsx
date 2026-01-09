import { storageService } from '@/services/storage';
import { SavedQuery } from '@/types/query';
import React, { createContext, useContext, useEffect, useState } from 'react';
import uuid from 'react-native-uuid';

interface QueryContextType {
  queries: SavedQuery[];
  loading: boolean;
  addQuery: (query: Omit<SavedQuery, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SavedQuery>;
  updateQuery: (query: SavedQuery) => Promise<void>;
  deleteQuery: (id: string) => Promise<void>;
  toggleTag: (id: string) => Promise<void>;
  getTaggedQueries: () => SavedQuery[];
  refresh: () => Promise<void>;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await storageService.getAllQueries();
      setQueries(data);
    } catch (error) {
      console.error('Error loading queries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addQuery = async (queryData: Omit<SavedQuery, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newQuery: SavedQuery = {
      ...queryData,
      id: uuid.v4() as string,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storageService.saveQuery(newQuery);
    await refresh();
    return newQuery;
  };

  const updateQuery = async (query: SavedQuery) => {
    await storageService.saveQuery(query);
    await refresh();
  };

  const deleteQuery = async (id: string) => {
    await storageService.deleteQuery(id);
    await refresh();
  };

  const toggleTag = async (id: string) => {
    const query = queries.find((q) => q.id === id);
    if (query) {
      await updateQuery({
        ...query,
        isTagged: !query.isTagged,
      });
    }
  };

  const getTaggedQueries = () => queries.filter((q) => q.isTagged);

  return (
    <QueryContext.Provider
      value={{
        queries,
        loading,
        addQuery,
        updateQuery,
        deleteQuery,
        toggleTag,
        getTaggedQueries,
        refresh,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
}

export function useQueries() {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQueries must be used within QueryProvider');
  }
  return context;
}
