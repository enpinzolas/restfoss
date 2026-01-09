import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SavedQuery } from '@/types/query';
import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

interface TaggedQueryBoxProps {
  query: SavedQuery;
}

export function TaggedQueryBox({ query }: TaggedQueryBoxProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : colors.tabIconDefault,
          borderColor: colors.tint,
        },
      ]}
    >
      <View style={styles.methodBadge}>
        <ThemedText style={styles.method}>{query.method}</ThemedText>
      </View>
      <ThemedText style={styles.name} numberOfLines={2}>
        {query.name}
      </ThemedText>
      <ThemedText style={styles.url} numberOfLines={1}>
        {query.url}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 6,
    flex: 1,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  methodBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  method: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  url: {
    fontSize: 11,
    opacity: 0.6,
  },
});
