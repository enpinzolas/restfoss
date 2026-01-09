import { SavedQuery } from '@/types/query';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUERIES_KEY = 'rest_client_queries';

export const storageService = {
  async getAllQueries(): Promise<SavedQuery[]> {
    try {
      const data = await AsyncStorage.getItem(QUERIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading queries:', error);
      return [];
    }
  },

  async saveQuery(query: SavedQuery): Promise<SavedQuery> {
    try {
      const queries = await this.getAllQueries();
      const index = queries.findIndex((q) => q.id === query.id);

      if (index >= 0) {
        queries[index] = {
          ...query,
          updatedAt: Date.now(),
        };
      } else {
        queries.push({
          ...query,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      await AsyncStorage.setItem(QUERIES_KEY, JSON.stringify(queries));
      return query;
    } catch (error) {
      console.error('Error saving query:', error);
      throw error;
    }
  },

  async deleteQuery(id: string): Promise<void> {
    try {
      const queries = await this.getAllQueries();
      const filtered = queries.filter((q) => q.id !== id);
      await AsyncStorage.setItem(QUERIES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting query:', error);
      throw error;
    }
  },

  async getTaggedQueries(): Promise<SavedQuery[]> {
    try {
      const queries = await this.getAllQueries();
      return queries.filter((q) => q.isTagged);
    } catch (error) {
      console.error('Error getting tagged queries:', error);
      return [];
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(QUERIES_KEY);
    } catch (error) {
      console.error('Error clearing queries:', error);
      throw error;
    }
  },
};
