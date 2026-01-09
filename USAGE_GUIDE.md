# REST Client App - Getting Started Guide

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (for iOS testing)
- Android: Android Studio (for Android testing)

### Installation Steps

1. **Install Dependencies**
```bash
cd /path/to/restfoss
npm install
```

2. **Start the Development Server**
```bash
npm start
```

You should see a QR code in the terminal. You can:
- Scan it with your phone using Expo Go app (iOS/Android)
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web version

## App Overview

### Two Main Screens

#### 1. **Home Screen** (Default Tab)
This screen displays all queries marked as "Show on Main View" as interactive boxes.

**What you can do:**
- See a grid of your tagged queries
- Tap any box to execute that query
- View the response status immediately (green = success, red = error)
- Watch loading indicators while requests execute

**Empty State:**
If you see "No tagged queries yet", go to the Explore tab to create and tag some queries.

#### 2. **Explore Screen** (Second Tab)
This is where you manage all your REST queries.

**What you can do:**
- View a list of all saved queries
- Create new queries with the "+ New Query" button
- Edit existing queries by tapping on them
- Delete queries you no longer need
- Toggle which queries appear on the home screen

## Creating Your First Query

1. **Navigate to Explore Tab**
   - Tap the second tab icon at the bottom

2. **Create a New Query**
   - Tap "+ New Query" button
   - You'll see a form with several sections

3. **Fill in Basic Information**
   - **Query Name**: Give your request a meaningful name (e.g., "Get Users", "Create Post")
   - **Method**: Select HTTP method:
     - GET: Retrieve data
     - POST: Create new data
     - PUT: Update entire resource
     - PATCH: Update partial resource
     - DELETE: Remove data
     - HEAD: Like GET but without response body
     - OPTIONS: Get allowed methods

4. **Enter the URL**
   - Full URL including protocol (http:// or https://)
   - Example: `https://api.example.com/users`

5. **Add Headers (Optional)**
   - Tap "+ Add Header" to add custom headers
   - Common headers:
     - `Content-Type: application/json`
     - `Authorization: Bearer YOUR_TOKEN`
   - Remove headers by tapping the ✕ button

6. **Add Request Body (For POST/PUT/PATCH)**
   - Paste your JSON payload
   - Example:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com"
   }
   ```

7. **Add Tags (Optional)**
   - Type a tag name and tap "Add"
   - Use tags to organize queries (e.g., "users", "public", "auth")
   - Remove tags by tapping ✕

8. **Test Your Query**
   - Tap "Test Request" button
   - Wait for response to appear below
   - Check status code and response body
   - Response shows:
     - Status code (e.g., 200, 404, 500)
     - Response headers
     - Response body (formatted as JSON)
     - Duration in milliseconds

9. **Show on Main View**
   - Toggle "Show on Main View" switch to display on home screen
   - This makes quick access to frequently used queries

10. **Save the Query**
    - Tap "Save Query" button
    - You'll get a success confirmation

## Example Queries to Try

### JSONPlaceholder API (Free Test API)

**1. Get All Posts**
```
Method: GET
URL: https://jsonplaceholder.typicode.com/posts
Headers: (none needed)
Body: (empty)
```

**2. Get Single Post**
```
Method: GET
URL: https://jsonplaceholder.typicode.com/posts/1
Headers: (none needed)
Body: (empty)
```

**3. Create a Post**
```
Method: POST
URL: https://jsonplaceholder.typicode.com/posts
Headers:
  - Key: Content-Type
    Value: application/json
Body:
{
  "title": "My Post",
  "body": "This is my post content",
  "userId": 1
}
```

**4. Update a Post**
```
Method: PATCH
URL: https://jsonplaceholder.typicode.com/posts/1
Headers:
  - Key: Content-Type
    Value: application/json
Body:
{
  "title": "Updated Title"
}
```

**5. Delete a Post**
```
Method: DELETE
URL: https://jsonplaceholder.typicode.com/posts/1
Headers: (none needed)
Body: (empty)
```

## Tips & Tricks

### Managing Large Responses
- If the response body is very long, scroll within the response box
- JSON responses are automatically formatted for readability

### Organizing Queries
- Use meaningful names and tags
- Group related queries with the same tags
- Use "Show on Main View" for frequently used queries

### Testing with Authentication
- Add Authorization header with your token
- Format: `Authorization: Bearer YOUR_TOKEN`
- For Basic Auth: `Authorization: Basic BASE64_ENCODED_CREDENTIALS`

### Common HTTP Status Codes
- **2xx (Success)**: Request succeeded
  - 200: OK
  - 201: Created
  - 204: No Content
- **3xx (Redirection)**: Further action needed
  - 301/302: Redirect
- **4xx (Client Error)**: Request problem
  - 400: Bad Request
  - 401: Unauthorized
  - 404: Not Found
- **5xx (Server Error)**: Server problem
  - 500: Internal Server Error

## Data Persistence

All your queries are saved locally on your device using AsyncStorage. Your queries will:
- ✅ Persist when you close and reopen the app
- ✅ Be backed up in your device's local storage
- ✅ Sync across app instances on the same device

Your queries will NOT:
- ❌ Sync across different devices
- ❌ Be backed up to the cloud
- ❌ Be restored if you uninstall the app

## Troubleshooting

### "Network Error" or "Unknown Error"
- Check your internet connection
- Verify the URL is correct and accessible
- Try the same URL in your browser first

### "Cannot fetch" with CORS error
- The API might have CORS restrictions
- Some public APIs don't allow mobile requests
- Try a different API endpoint

### Responses not displaying
- Try a simpler endpoint first
- Ensure your JSON is valid (use Test Request)
- Check response headers in the response section

### Changes not saving
- Ensure you tapped "Save Query"
- Wait for success confirmation
- Check device storage permissions

## Advanced Features to Explore

1. **Multiple Queries**: Create variations of the same endpoint with different parameters
2. **Rapid Testing**: Tag multiple related queries to appear on home screen for quick testing
3. **Headers**: Reuse the same headers across multiple queries
4. **Tag Organization**: Use tags to categorize queries by API, purpose, or status

## Need Help?

- Check the response panel for error details
- Verify your URL and method are correct
- Test the endpoint in another API client first (like Postman)
- Check that the API doesn't require authentication

Enjoy building with your REST Client! 🚀
