# REST Client App - Architecture Documentation

## Project Overview

This is a complete REST API client application built with Expo and React Native. It allows users to create, save, test, and manage HTTP requests directly from their mobile device, similar to Postman.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     App Root (_layout.tsx)                   │
│                        ↓                                     │
│                   QueryProvider (Context)                   │
│                        ↓                                     │
│            ┌───────────┴───────────┐                        │
│            ↓                       ↓                        │
│         Home Screen          Explore Screen                │
│       (index.tsx)            (explore.tsx)                 │
│                                                             │
│    Displays Tagged         Shows all saved queries          │
│    Queries as Boxes        + Create/Edit/Delete            │
└─────────────────────────────────────────────────────────────┘
```

## File Structure & Responsibilities

### Core App Files

#### `app/_layout.tsx`
- **Purpose**: Root layout with Tab navigation
- **Responsibilities**:
  - Wraps entire app with QueryProvider
  - Sets up bottom tab navigator
  - Configures tab icons and labels
  - Manages theme colors and styling

#### `app/index.tsx` (Home Screen)
- **Purpose**: Display tagged queries as interactive boxes
- **Responsibilities**:
  - Fetch and display tagged queries
  - Execute queries on tap
  - Show loading states
  - Display response status indicators
  - Grid layout for query boxes

#### `app/explore.tsx` (Explore Screen)
- **Purpose**: Manage all saved queries
- **Responsibilities**:
  - List all queries
  - Create new queries modal
  - Edit existing queries
  - Show empty state when no queries exist
  - Open detail panel in modal

### Components

#### `components/query-detail-panel.tsx` (Postman-like Interface)
- **Purpose**: Complete query editor and tester
- **Features**:
  - Query name input
  - HTTP method selector (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
  - URL input field
  - Headers management (add/remove/edit)
  - Request body editor (for POST/PUT/PATCH)
  - Tags management
  - "Show on Main View" toggle
  - Test button to execute requests
  - Response display with formatting
  - Save and Delete buttons
- **Key Methods**:
  - `handleTest()`: Executes HTTP request
  - `handleSave()`: Saves query to storage
  - `handleDelete()`: Removes query
  - `handleAddHeader()`: Adds new header field
  - `handleUpdateHeader()`: Updates header value

#### `components/query-item.tsx` (List Item)
- **Purpose**: Display query in a list
- **Features**:
  - Query name and URL
  - HTTP method badge with color coding
  - Tags display
  - Clickable for editing

#### `components/tagged-query-box.tsx` (Grid Box)
- **Purpose**: Display query as interactive box on home
- **Features**:
  - Method badge with color
  - Query name (2 lines max)
  - URL preview
  - Flexible grid layout

### Hooks

#### `hooks/use-queries.tsx` (Context & Provider)
- **Purpose**: Global query state management
- **Exports**:
  - `QueryProvider`: Context provider component
  - `useQueries()`: Hook to access query context
- **Context Methods**:
  - `queries[]`: Array of all saved queries
  - `loading`: Boolean indicating data load state
  - `addQuery()`: Create new query
  - `updateQuery()`: Modify existing query
  - `deleteQuery()`: Remove query
  - `toggleTag()`: Toggle "Show on Main View" status
  - `getTaggedQueries()`: Get queries marked for home view
  - `refresh()`: Reload queries from storage

### Services

#### `services/storage.ts` (AsyncStorage Wrapper)
- **Purpose**: Persistent local storage using AsyncStorage
- **Methods**:
  - `getAllQueries()`: Retrieve all saved queries
  - `saveQuery()`: Create or update a query
  - `deleteQuery()`: Remove a query by ID
  - `getTaggedQueries()`: Get only tagged queries
  - `clearAll()`: Clear all stored data
- **Storage Key**: `rest_client_queries`
- **Format**: JSON stringified array of SavedQuery objects

#### `services/http.ts` (HTTP Client)
- **Purpose**: Execute HTTP requests with Fetch API
- **Methods**:
  - `sendRequest()`: Execute HTTP request with method, URL, headers, body
  - Returns: `RequestResponse` with status, headers, body, duration
  - Error handling: Catches network errors and provides error details

### Types

#### `types/query.ts` (TypeScript Definitions)
```typescript
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

interface QueryHeader {
  id: string;
  key: string;
  value: string;
}

interface SavedQuery {
  id: string;
  name: string;
  method: HTTPMethod;
  url: string;
  headers: QueryHeader[];
  body: string;
  tags: string[];
  isTagged: boolean; // Show on main view
  createdAt: number;
  updatedAt: number;
  lastResponse?: {
    status: number;
    body: string;
    duration: number;
    timestamp: number;
  };
}

interface RequestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
}
```

## Data Flow

### Creating/Saving a Query

```
User Input (DetailPanel)
         ↓
handleSave() validates
         ↓
updateQuery() or addQuery()
         ↓
storageService.saveQuery()
         ↓
AsyncStorage.setItem()
         ↓
refresh() reloads state
         ↓
Queries list updates
```

### Executing a Query

```
User taps query box/button
         ↓
handleExecuteQuery() or handleTest()
         ↓
httpService.sendRequest()
         ↓
fetch() API call
         ↓
Response parsing
         ↓
updateQuery() saves response
         ↓
Response displayed
```

### Toggling Tag Status

```
User toggles "Show on Main View"
         ↓
handleSave() with updated isTagged
         ↓
updateQuery()
         ↓
storageService.saveQuery()
         ↓
refresh() triggers
         ↓
HomeScreen's getTaggedQueries() updates
         ↓
Grid display updates
```

## State Management

### Global State (React Context)
- Managed by `QueryProvider` in `hooks/use-queries.tsx`
- Single source of truth for all queries
- Persisted to AsyncStorage automatically

### Component Local State
- Detail panel manages form inputs locally
- Home screen manages execution state and responses
- List screen manages modal visibility

### Key State Variables

**In QueryProvider:**
- `queries: SavedQuery[]` - All saved queries
- `loading: boolean` - Initial data load status

**In Home Screen:**
- `taggedQueries: SavedQuery[]` - Filtered tagged queries
- `executing: string | null` - ID of currently executing query

**In Explore Screen:**
- `selectedQuery: SavedQuery | null` - Currently edited query
- `isDetailModalVisible: boolean` - Modal visibility
- `isNewQuery: boolean` - Is creating new query

**In Detail Panel:**
- `name, method, url, headers, body, tags` - Form fields
- `isTagged` - Show on main view toggle
- `response, responseStatus, loading` - Response display
- `savingQuery` - Save button loading state

## Network & Storage

### AsyncStorage
- **Key**: `rest_client_queries`
- **Value**: JSON stringified array of `SavedQuery[]`
- **Persistence**: Device local storage
- **Sync**: None (single device only)

### HTTP Requests
- **Client**: Native Fetch API
- **Headers**: Converted from array to object format
- **Body**: Only sent for POST, PUT, PATCH methods
- **Timeout**: Default (browser/device dependent)
- **CORS**: Subject to device/API restrictions

## Styling & Theme

### Color System
- Uses `Colors` constant from `constants/theme.ts`
- Light and dark mode support via `useColorScheme()`
- Theme applied via `ThemeProvider`
- `colors.tint`: Primary action color
- `colors.text`: Text color
- `colors.background`: Background color
- `colors.tabIconDefault`: Secondary background

### UI Components
- Pre-styled with `ThemedText` and `ThemedView`
- Consistent spacing and typography
- Responsive layouts for different screen sizes
- Color-coded HTTP method badges

## Error Handling

### Storage Errors
- Caught and logged in `storageService`
- User sees: Empty list or previous state
- Recovery: Automatic retry on next action

### Network Errors
- Caught in `httpService.sendRequest()`
- User sees: Error message in response panel
- Status code: 0 (indicates network error)
- Error message: From catch block

### Validation
- Query name required
- URL required
- Performed before save
- User sees: Alert dialog

## Performance Considerations

- Queries loaded once on app startup
- Refresh triggered only on data mutations
- No background syncing
- Minimal re-renders with proper state isolation
- Large response bodies scrollable

## Security Notes

- No credentials stored (user must add headers)
- No request history or logs (only last response)
- Local device storage only
- No encryption (device-level security applied)
- CORS subject to device browser security

## Future Enhancement Ideas

1. **Collections/Workspaces**: Group related queries
2. **Environment Variables**: ${ENV_VAR} substitution in URLs
3. **Request History**: Keep log of past requests
4. **Export/Import**: JSON backup of all queries
5. **Authentication**: Pre-built auth headers
6. **Templates**: Save as template for cloning
7. **Syntax Highlighting**: For JSON bodies
8. **Pagination**: For large query lists
9. **Search/Filter**: Find queries by name or tag
10. **Cloud Sync**: iCloud/Drive backup

## Testing the App

1. **Local Testing**:
   ```bash
   npm start
   # Scan QR code with Expo Go app
   ```

2. **iOS Testing**:
   ```bash
   npm run ios
   # Requires Xcode installed
   ```

3. **Android Testing**:
   ```bash
   npm run android
   # Requires Android Studio/Emulator
   ```

4. **Web Testing**:
   ```bash
   npm run web
   # Opens in browser
   ```

## Dependencies

### Core
- `expo@~54.0.31` - Framework
- `react@19.1.0` - UI library
- `react-native@0.81.5` - Native bridge

### Navigation
- `expo-router@~6.0.21` - File-based routing
- `@react-navigation/*` - Navigation components

### Storage
- `@react-native-async-storage/async-storage@^1.x` - Persistent storage

### Utilities
- `react-native-uuid@^2.x` - Unique ID generation

### Development
- `typescript@~5.9.2` - Type checking
- `eslint@^9.25.0` - Code linting
