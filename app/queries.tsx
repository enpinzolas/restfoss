import { QueryDetailPanel } from '@/components/query-detail-panel';
import { QueryItem } from '@/components/query-item';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useQueries } from '@/hooks/use-queries';
import { SavedQuery } from '@/types/query';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ExploreScreen() {
  const { queries, loading, addQuery, updateQuery, deleteQuery } = useQueries();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedQuery, setSelectedQuery] = useState<SavedQuery | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isNewQuery, setIsNewQuery] = useState(false);

  const handleNewQuery = () => {
    setSelectedQuery(null);
    setIsNewQuery(true);
    setIsDetailModalVisible(true);
  };

  const handleSelectQuery = (query: SavedQuery) => {
    setSelectedQuery(query);
    setIsNewQuery(false);
    setIsDetailModalVisible(true);
  };

  const handleSaveQuery = async (query: SavedQuery) => {
    try {
      if (isNewQuery) {
        await addQuery({
          name: query.name,
          method: query.method,
          url: query.url,
          headers: query.headers,
          body: query.body,
          tags: query.tags,
          isTagged: query.isTagged,
        });
      } else {
        await updateQuery(query);
      }
      setIsDetailModalVisible(false);
      setSelectedQuery(null);
    } catch (error) {
      console.error('Error saving query:', error);
    }
  };

  const handleDeleteQuery = async (id: string) => {
    try {
      await deleteQuery(id);
      setIsDetailModalVisible(false);
      setSelectedQuery(null);
    } catch (error) {
      console.error('Error deleting query:', error);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={colors.tint} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
            Saved Queries
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.text }]}>
            {queries.length} total queries
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.newQueryButton, { backgroundColor: colors.buttonPrimary }]}
          onPress={handleNewQuery}
        >
          <ThemedText style={[styles.newQueryButtonText, { color: '#fff' }]}>
            + New Query
          </ThemedText>
        </TouchableOpacity>

        {queries.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={[styles.emptyStateText, { color: colors.text }]}>
              No saved queries yet.
            </ThemedText>
            <ThemedText style={[styles.emptyStateSubtext, { color: colors.text }]}>
              Tap &quot;New Query&quot; to create your first REST query.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.queriesList}>
            {queries.map((query) => (
              <QueryItem
                key={query.id}
                query={query}
                onPress={handleSelectQuery}
              />
            ))}
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>

      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <QueryDetailPanel
          query={selectedQuery}
          onSave={handleSaveQuery}
          onDelete={handleDeleteQuery}
          onClose={() => setIsDetailModalVisible(false)}
        />
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  newQueryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  newQueryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    maxWidth: 250,
  },
  queriesList: {
    marginBottom: 16,
  },
  spacer: {
    height: 32,
  },
});
