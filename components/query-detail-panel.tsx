import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { httpService } from '@/services/http';
import { HTTPMethod, QueryHeader, SavedQuery } from '@/types/query';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface QueryDetailPanelProps {
  query: SavedQuery | null;
  onSave: (query: SavedQuery) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onClose?: () => void;
}

const METHODS: HTTPMethod[] = ['GET', 'POST'];

export function QueryDetailPanel({
  query,
  onSave,
  onDelete,
  onClose,
}: QueryDetailPanelProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [name, setName] = useState(query?.name || '');
  const [method, setMethod] = useState<HTTPMethod>(query?.method || 'GET');
  const [url, setUrl] = useState(query?.url || '');
  const [headers, setHeaders] = useState<QueryHeader[]>(query?.headers || []);
  const [body, setBody] = useState(query?.body || '');
  const [isTagged, setIsTagged] = useState(query?.isTagged || false);
  const [tags, setTags] = useState(query?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const [response, setResponse] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingQuery, setSavingQuery] = useState(false);

  const handleAddHeader = () => {
    setHeaders([...headers, { id: Date.now().toString(), key: '', value: '' }]);
  };

  const handleRemoveHeader = (id: string) => {
    setHeaders(headers.filter((h) => h.id !== id));
  };

  const handleUpdateHeader = (id: string, key: string, value: string) => {
    setHeaders(
      headers.map((h) => (h.id === id ? { ...h, key, value } : h))
    );
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTest = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const result = await httpService.sendRequest(
        method,
        url,
        headers,
        body || undefined
      );

      setResponseStatus(result.status);
      let responseText = `Status: ${result.status} ${result.statusText}\n\n`;

      if (Object.keys(result.headers).length > 0) {
        responseText += 'Headers:\n';
        responseText += JSON.stringify(result.headers, null, 2);
        responseText += '\n\n';
      }

      responseText += 'Response:\n';
      try {
        responseText += JSON.stringify(JSON.parse(result.body), null, 2);
      } catch {
        responseText += result.body;
      }

      responseText += `\n\nDuration: ${result.duration}ms`;

      setResponse(responseText);
    } catch (error) {
      const err = error as any;
      setResponseStatus(err.status || 0);
      setResponse(
        `Error: ${err.statusText || (error instanceof Error ? error.message : 'Unknown error')}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a query name');
      return;
    }
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    setSavingQuery(true);
    try {
      const updatedQuery: SavedQuery = {
        ...(query || {
          id: Date.now().toString(),
          createdAt: Date.now(),
          lastResponse: undefined,
        }),
        name,
        method,
        url,
        headers,
        body,
        tags,
        isTagged,
        updatedAt: Date.now(),
      } as SavedQuery;

      await onSave(updatedQuery);
      Alert.alert('Success', 'Query saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save query');
      console.error(error);
    } finally {
      setSavingQuery(false);
    }
  };

  const handleDelete = async () => {
    if (!query?.id) return;

    Alert.alert('Delete Query', 'Are you sure you want to delete this query?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            if (onDelete) {
              await onDelete(query.id);
              Alert.alert('Success', 'Query deleted successfully');
              onClose?.();
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to delete query');
            console.error(error);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.tint }]}>
        <ThemedText style={styles.headerTitle}>
          {query ? 'Edit Query' : 'New Query'}
        </ThemedText>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <ThemedText style={styles.closeButtonText}>✕</ThemedText>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Query Name */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>Query Name</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.buttonPrimary,
              },
            ]}
            placeholder="Enter query name"
            placeholderTextColor={colors.tabIconDefault}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Method & URL */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>Method</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.methodButtonGroup}>
              {METHODS.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.methodButton,
                    {
                      backgroundColor:
                        method === m ? colors.buttonPrimary : colors.buttonBackground,
                    },
                  ]}
                  onPress={() => setMethod(m)}
                >
                  <ThemedText
                    style={[
                      styles.methodButtonText,
                      {
                        color: method === m ? '#fff' : colors.text,
                      },
                    ]}
                  >
                    {m}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>URL</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.buttonPrimary,
              },
            ]}
            placeholder="https://example.com/api/endpoint"
            placeholderTextColor={colors.tabIconDefault}
            value={url}
            onChangeText={setUrl}
          />
        </View>

        {/* Headers */}
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <ThemedText style={styles.label}>Headers</ThemedText>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.buttonPrimary }]}
              onPress={handleAddHeader}
            >
              <ThemedText style={styles.addButtonText}>+ Add Header</ThemedText>
            </TouchableOpacity>
          </View>
          {headers.map((header) => (
            <View key={header.id} style={styles.headerItem}>
              <TextInput
                style={[
                  styles.headerInput,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                  },
                ]}
                placeholder="Key"
                placeholderTextColor={colors.tabIconDefault}
                value={header.key}
                onChangeText={(text) =>
                  handleUpdateHeader(header.id, text, header.value)
                }
              />
              <TextInput
                style={[
                  styles.headerInput,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                  },
                ]}
                placeholder="Value"
                placeholderTextColor={colors.tabIconDefault}
                value={header.value}
                onChangeText={(text) =>
                  handleUpdateHeader(header.id, header.key, text)
                }
              />
              <TouchableOpacity
                onPress={() => handleRemoveHeader(header.id)}
                style={styles.removeButton}
              >
                <ThemedText style={{ color: 'red' }}>✕</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Body */}
        {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
          <View style={styles.section}>
            <ThemedText style={styles.label}>Body (JSON)</ThemedText>
            <TextInput
              style={[
                styles.largeInput,
                {
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                },
              ]}
              placeholder='{"key": "value"}'
              placeholderTextColor={colors.tabIconDefault}
              value={body}
              onChangeText={setBody}
              multiline
              numberOfLines={6}
            />
          </View>
        )}

        {/* Tags */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>Tags</ThemedText>
          <View style={styles.tagInputRow}>
            <TextInput
              style={[
                styles.tagInput,
                {
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                },
              ]}
              placeholder="Add a tag"
              placeholderTextColor={colors.tabIconDefault}
              value={tagInput}
              onChangeText={setTagInput}
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.buttonPrimary }]}
              onPress={handleAddTag}
            >
              <ThemedText style={styles.addButtonText}>Add</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsList}>
            {tags.map((tag) => (
              <View
                key={tag}
                style={[styles.tag, { backgroundColor: colors.buttonPrimary }]}
              >
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                  <ThemedText style={styles.tagRemove}>✕</ThemedText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Show on Main View Toggle */}
        <View style={[styles.section, styles.taggedSection]}>
          <ThemedText style={styles.label}>Show on Main View</ThemedText>
          <Switch
            value={isTagged}
            onValueChange={setIsTagged}
            trackColor={{ false: colors.buttonBackground, true: colors.buttonPrimary }}
          />
        </View>

        {/* Test Button */}
        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: colors.buttonPrimary }]}
          onPress={handleTest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.testButtonText}>Test Request</ThemedText>
          )}
        </TouchableOpacity>

        {/* Response */}
        {response && (
          <View style={styles.section}>
            <ThemedText style={styles.label}>
              Response ({responseStatus})
            </ThemedText>
            <ScrollView
              style={[
                styles.responseBox,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor:
                    responseStatus && responseStatus < 400 ? colors.successColor : colors.errorColor,
                },
              ]}
            >
              <ThemedText style={styles.responseText}>{response}</ThemedText>
            </ScrollView>
          </View>
        )}

        {/* Save & Delete Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.buttonPrimary }]}
            onPress={handleSave}
            disabled={savingQuery}
          >
            {savingQuery ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.saveButtonText}>
                Save Query
              </ThemedText>
            )}
          </TouchableOpacity>
          {query?.id && (
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: colors.errorColor }]}
              onPress={handleDelete}
            >
              <ThemedText style={styles.deleteButtonText}>
                Delete Query
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  largeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  methodButtonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  methodButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  methodButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  headerItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  headerInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderColor: '#ccc',
  },
  removeButton: {
    padding: 8,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderColor: '#ccc',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  tagRemove: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  taggedSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  responseBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    maxHeight: 300,
    marginBottom: 16,
  },
  responseText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
