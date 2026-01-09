import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SavedQuery } from '@/types/query';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface QueryItemProps {
  query: SavedQuery;
  onPress: (query: SavedQuery) => void;
}

export function QueryItem({ query, onPress }: QueryItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : colors.tabIconDefault,
          borderColor: colors.tint,
        },
      ]}
      onPress={() => onPress(query)}
    >
      <View style={styles.header}>
        <ThemedText style={styles.name}>{query.name}</ThemedText>
        <View
          style={[
            styles.methodBadge,
            {
              backgroundColor: getMethodColor(query.method),
            },
          ]}
        >
          <ThemedText style={styles.method}>{query.method}</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.url} numberOfLines={1}>
        {query.url}
      </ThemedText>
      {query.tags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
        >
          {query.tags.map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { backgroundColor: colors.tint }]}
            >
              <ThemedText style={styles.tagText}>{tag}</ThemedText>
            </View>
          ))}
        </ScrollView>
      )}
    </TouchableOpacity>
  );
}

function getMethodColor(method: string): string {
  switch (method) {
    case 'GET':
      return '#61affe';
    case 'POST':
      return '#49cc90';
    case 'PUT':
      return '#fca130';
    case 'DELETE':
      return '#f93e3e';
    case 'PATCH':
      return '#50e3c2';
    default:
      return '#999';
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  methodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  method: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  url: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  tagsContainer: {
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
});
