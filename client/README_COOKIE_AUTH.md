# Cookie-Based Authentication Implementation

This document describes the implementation of cookie-based authentication using the JavaScript Cookie library to persist user credentials and maintain authenticated state across page refreshes.

## Overview

The application now uses HTTP cookies to store user authentication state, allowing users to remain logged in even after closing and reopening their browser or refreshing the page. This provides a better user experience while maintaining security.

## Features

- **Persistent Authentication**: User login state persists across browser sessions
- **Secure Cookie Storage**: Credentials are stored securely with appropriate flags
- **Automatic State Restoration**: User state is automatically restored from cookies on page load
- **Credential Validation**: Stored credentials are validated against the API on restoration
- **Automatic Cleanup**: Invalid or expired cookies are automatically removed

## Implementation Details

### Cookie Configuration

Cookies are configured with the following security options:

```javascript
const COOKIE_OPTIONS = {
  expires: 7,                    // Cookie expires in 7 days
  secure: process.env.NODE_ENV === 'production', // Secure in production
  sameSite: 'strict'             // Protect against CSRF attacks
};
```

### Cookie Storage

Two cookies are used to store user information:

1. **`user_credentials`**: Stores the Base64-encoded Basic Auth credentials
2. **`user_state`**: Stores user profile information (ID, email, first name, last name)

**Note**: The actual password is never stored in cookies - only the encoded Basic Auth header.

### Security Features

- **SameSite=strict**: Prevents CSRF attacks
- **Secure flag**: Ensures cookies are only sent over HTTPS in production
- **Automatic expiration**: Cookies expire after 7 days
- **Credential validation**: Stored credentials are validated against the API on restoration

## Components Updated

### UserContext (`src/context/UserContext.jsx`)

- Added cookie persistence for user authentication
- Implements automatic state restoration from cookies
- Provides `isInitialized` state to prevent premature rendering

### Header (`src/components/Header.jsx`)

- Waits for user state initialization before rendering navigation
- Shows loading state while cookies are being restored

### PrivateRoute (`src/components/PrivateRoute.jsx`)

- Prevents premature redirects while user state is being restored
- Shows loading state during authentication restoration

### Cookie Utilities (`src/utils/cookieUtils.js`)

- Centralized cookie management functions
- Consistent error handling and logging
- Type-safe cookie operations

## How It Works

### 1. User Sign In

1. User enters credentials and submits sign-in form
2. Credentials are validated against the API
3. If valid, user data and encoded credentials are stored in cookies
4. User state is updated in React context

### 2. Page Refresh/Restore

1. On component mount, UserContext checks for existing cookies
2. If cookies exist, stored credentials are validated against the API
3. If valid, user state is restored from cookies
4. If invalid, cookies are automatically cleared
5. `isInitialized` flag is set to true

### 3. User Sign Out

1. User clicks sign out
2. User state is cleared from React context
3. All authentication cookies are removed

### 4. API Calls

- Components use `user.credentials` from UserContext for authenticated API calls
- Credentials are automatically included in Authorization headers
- No changes needed to existing API call implementations

## Usage Examples

### Checking Authentication Status

```javascript
const { user, isInitialized } = useContext(UserContext);

if (!isInitialized) {
  // Still loading/restoring from cookies
  return <LoadingSpinner />;
}

if (user) {
  // User is authenticated
  return <AuthenticatedContent />;
} else {
  // User is not authenticated
  return <SignInForm />;
}
```

### Making Authenticated API Calls

```javascript
const { user } = useContext(UserContext);

const response = await fetch('/api/courses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${user.credentials}`
  },
  body: JSON.stringify(courseData)
});
```

## Browser Compatibility

The implementation uses the `js-cookie` library which provides:

- Cross-browser compatibility
- Consistent API across different browsers
- Automatic handling of cookie encoding/decoding
- Support for modern cookie features (SameSite, Secure flags)

## Testing

To test the cookie-based authentication:

1. Sign in to the application
2. Refresh the page - you should remain signed in
3. Close the browser and reopen - you should remain signed in
4. Sign out - cookies should be cleared
5. Refresh the page - you should be signed out

## Security Considerations

- **Never store passwords in cookies**: Only encoded Basic Auth headers are stored
- **Automatic validation**: Stored credentials are validated against the API on restoration
- **Automatic cleanup**: Invalid or expired cookies are automatically removed
- **Secure flags**: Cookies use appropriate security flags in production
- **SameSite protection**: CSRF protection through SameSite=strict

## Troubleshooting

### Cookies Not Persisting

- Check browser cookie settings
- Ensure cookies are enabled
- Check for browser privacy extensions that block cookies

### Authentication Not Restoring

- Check browser console for errors
- Verify API endpoint is accessible
- Check network tab for failed API calls

### Security Warnings

- Ensure HTTPS is used in production
- Check that SameSite and Secure flags are properly set
- Monitor for any console warnings about cookie security
