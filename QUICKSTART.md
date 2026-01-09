# Quick Start Guide

## Installation

```bash
# Navigate to project directory
cd /home/fushuan/repos/restfoss

# Install dependencies
npm install

# Start the development server
npm start
```

## Running the App

After `npm start`, you'll see options:

### Option 1: Expo Go App (Easiest)
1. Download Expo Go app from App Store/Play Store
2. Scan the QR code shown in terminal
3. App loads in Expo Go

### Option 2: iOS Simulator
```bash
npm run ios
# Requires Xcode
```

### Option 3: Android Emulator
```bash
npm run android
# Requires Android Studio
```

### Option 4: Web Browser
```bash
npm run web
# Opens in browser (limited functionality)
```

## First Steps in the App

1. **Home Screen** - Shows tagged queries (empty at first)
2. **Tap "Explore" tab** - Go to query management
3. **Tap "+ New Query"** - Create your first query
4. **Fill in details**:
   - Name: "Test Query"
   - Method: GET
   - URL: `https://jsonplaceholder.typicode.com/posts/1`
5. **Tap "Test Request"** - See it work!
6. **Toggle "Show on Main View"** - Make it appear on home
7. **Tap "Save Query"** - Save it
8. **Return to Home** - See your query appear as a box
9. **Tap the box** - Execute it instantly

## Project Features

✅ **Two-Tab Interface**
- Home: Quick access to favorite queries
- Explore: Manage all queries

✅ **Full REST Client**
- All HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- Custom headers
- Request body support
- Response display with status

✅ **Query Management**
- Create, edit, delete queries
- Tag queries for organization
- Save to device storage
- Persistent across app restarts

✅ **Testing**
- Execute requests directly
- View status code and response
- See request duration
- Display response headers

## Key Files

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | App structure and navigation |
| `app/index.tsx` | Home screen with tagged queries |
| `app/explore.tsx` | Query list and management |
| `components/query-detail-panel.tsx` | Query editor (Postman-like) |
| `hooks/use-queries.tsx` | Query state management |
| `services/storage.ts` | Local data persistence |
| `services/http.ts` | HTTP request execution |

## Documentation

- **`APP_DOCUMENTATION.md`** - Complete feature overview
- **`USAGE_GUIDE.md`** - Step-by-step user guide
- **`ARCHITECTURE.md`** - Technical architecture details

## Tips

1. **Save Often** - Always tap "Save Query" after changes
2. **Test First** - Use "Test Request" before saving
3. **Use Tags** - Organize queries with meaningful tags
4. **Tag Favorites** - Toggle "Show on Main View" for quick access
5. **Start Simple** - Test with JSONPlaceholder API first

## Example API to Try

```
Method: GET
URL: https://jsonplaceholder.typicode.com/posts
```

This returns a list of 100 posts. Perfect for testing!

## Troubleshooting

**App won't start?**
- Clear cache: `rm -rf .expo/cache`
- Reinstall: `rm -rf node_modules && npm install`

**Queries not saving?**
- Check device storage permissions
- Try saving again
- Restart app

**Network errors?**
- Check internet connection
- Verify URL is correct
- Try in browser first

## Next Steps

1. ✅ Create a few test queries
2. ✅ Tag your favorites
3. ✅ Test different HTTP methods
4. ✅ Try with your own API
5. ✅ Share feedback!

Enjoy building! 🚀
