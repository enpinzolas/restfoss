# REST Client Expo App

A mobile REST API client built with Expo/React Native that allows you to save, manage, and test HTTP requests directly on your device.

## Features

### Home View
- **Tagged Query Boxes**: Displays saved queries marked as "Show on Main View" in a grid layout
- **One-Click Execution**: Tap any query box to execute the request immediately
- **Response Status**: Visual indicator showing the last response status code (green for success, red for errors)
- **Real-time Execution**: Loading indicator while request is in progress

### Queries View (Explore Tab)
- **Full Query Management**: View all saved queries in a list format
- **Create New Queries**: Add new HTTP requests with a "New Query" button
- **Query Details**: Click any query to open the detail panel

### Query Detail Panel (Postman-like Interface)
- **Query Name**: Give your request a descriptive name
- **HTTP Method**: Choose from GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **URL Input**: Enter the full endpoint URL
- **Headers Management**: Add/remove custom headers with key-value pairs
- **Request Body**: Add JSON body for POST/PUT/PATCH requests
- **Tags**: Add custom tags to organize queries
- **Show on Main View**: Toggle to display query on the home screen
- **Test Request**: Execute the request and view:
  - Response status code and status text
  - Response headers
  - Response body (formatted as JSON if possible)
  - Request duration in milliseconds
- **Save Query**: Save the request for future use
- **Delete Query**: Remove queries you no longer need

## Data Structure

### SavedQuery
```typescript
{
  id: string;
  name: string;
  method: HTTPMethod;
  url: string;
  headers: QueryHeader[];
  body: string;
  tags: string[];
  isTagged: boolean;
  createdAt: number;
  updatedAt: number;
  lastResponse?: {
    status: number;
    body: string;
    duration: number;
    timestamp: number;
  };
}
```

## Technology Stack

- **Framework**: Expo Router with Tab Navigation
- **Language**: TypeScript
- **State Management**: React Context API
- **Persistence**: AsyncStorage (React Native Async Storage)
- **HTTP**: Native Fetch API
- **UI**: React Native components with themed colors

## Project Structure

```
app/
  _layout.tsx          # Tab layout with QueryProvider
  index.tsx            # Home view with tagged queries
  explore.tsx          # Queries list view

components/
  query-detail-panel.tsx    # Postman-like editor interface
  query-item.tsx            # Query list item component
  tagged-query-box.tsx      # Grid box for home view
  [other themed components...]

hooks/
  use-queries.tsx      # Query management context and hook

services/
  http.ts             # HTTP request execution
  storage.ts          # AsyncStorage operations

types/
  query.ts            # TypeScript type definitions

constants/
  theme.ts            # Color and styling constants
```

## How to Use

1. **Create a Query**:
   - Go to the "Explore" tab
   - Tap "+ New Query"
   - Fill in the query details (name, method, URL, headers, body)
   - Tap "Test Request" to verify it works
   - Tap "Save Query" to save it

2. **Tag a Query for Home View**:
   - Open a query from the list
   - Toggle "Show on Main View" switch
   - The query will now appear on the home screen as a clickable box

3. **Execute a Query**:
   - From the home view: Tap any query box to execute it
   - From the explore view: Open a query and tap "Test Request"
   - View the response in the response panel

4. **Manage Queries**:
   - Edit: Open any query from the list and modify its details
   - Delete: Open a query and tap "Delete Query"
   - Organize: Add tags to queries for better organization

## Key Dependencies

- `expo@~54.0.31` - React Native framework
- `expo-router@~6.0.21` - File-based routing
- `react-native@0.81.5` - Native framework
- `@react-native-async-storage/async-storage@^1.x` - Persistent storage
- `react-native-uuid@^2.x` - Unique ID generation
- `@react-navigation/*` - Navigation components

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm start

# Run on iOS (requires Xcode)
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Features to Consider

- Query collections/workspaces
- Environment variables for request URLs
- Request history/logs
- Export/import queries
- Request templates
- Authentication (Bearer token, Basic auth, etc.)
- Request/response formatting options
- Syntax highlighting for JSON
