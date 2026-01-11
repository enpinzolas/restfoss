import { TaggedQueryBox } from '@/components/tagged-query-box';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQueries } from "@/hooks/use-queries";
import { httpService } from "@/services/http";
import { SavedQuery } from "@/types/query";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { queries, loading, updateQuery } = useQueries();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [executing, setExecuting] = useState<string | null>(null);

  const taggedQueries = queries.filter((q) => q.isTagged);

  const handleExecuteQuery = async (query: SavedQuery) => {
      setExecuting(query.id);
    try {
      const result = await httpService.sendRequest(
        query.method,
        query.url,
        query.headers,
        query.body || undefined
      );

      const updatedQuery = {
        ...query,
        lastResponse: {
          status: result.status,
          body: result.body,
          duration: result.duration,
          timestamp: Date.now(),
        },
      };

      await updateQuery(updatedQuery);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      Alert.alert('Error', `Failed to execute query: ${errorMessage}`);
      console.error('Error executing query:', error);
    } finally {
      setExecuting(null);
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
          <ThemedText type="title" style={styles.title}>
            REST Client
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {taggedQueries.length} saved queries
          </ThemedText>
        </View>

        {taggedQueries.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No tagged queries yet.
            </ThemedText>
            <ThemedText style={styles.emptyStateSubtext}>
              Go to Explore to create and tag queries to appear here.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.queriesGrid}>
            {taggedQueries.map((query) => (
              <View key={query.id} style={styles.queryBoxWrapper}>
                <TouchableOpacity
                  onPress={() => handleExecuteQuery(query)}
                  disabled={executing === query.id}
                >
                  <TaggedQueryBox query={query} />
                  {executing === query.id && (
                    <View style={[styles.executingOverlay, { backgroundColor: colors.tabIconDefault }]}>
                      <ActivityIndicator size="small" color={colors.tint} />
                    </View>
                  )}
                </TouchableOpacity>
                {query.lastResponse && (
                  <View
                    style={[
                      styles.responseStatus,
                      {
                        backgroundColor:
                          query.lastResponse.status < 400 ? '#4CAF50' : '#ff4444',
                      },
                    ]}
                  >
                    <ThemedText style={styles.responseStatusText}>
                      {query.lastResponse.status}
                    </ThemedText>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  queriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  queryBoxWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  executingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  responseStatus: {
    marginTop: 6,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  responseStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
