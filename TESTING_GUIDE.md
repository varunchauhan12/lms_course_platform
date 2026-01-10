# Testing Guide: Admin & Security Features

## Prerequisites: Setting User Role in Database

### IMPORTANT: Role Value in Prisma
In your Prisma schema, the `role` field is defined as `String?` (nullable string).

**To make a user an admin, you need to set the role to: `"ADMIN"` (all uppercase)**

### How to Set a User as Admin

#### Option 1: Using Prisma Studio (Recommended)
```bash
npx prisma studio
```
1. Open the `User` table
2. Find your user by email
3. Edit the `role` field and set it to: `ADMIN` (uppercase)
4. Save the changes

#### Option 2: Using SQL (PostgreSQL)
```sql
UPDATE "user" 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```

#### Option 3: Using Prisma in a script
```typescript
await prisma.user.update({
  where: { email: 'your-email@example.com' },
  data: { role: 'ADMIN' }
});
```

---

## Test Cases

### 1. ✅ Arcjet Bot Detection Test

**Location:** Create Course Action (`/app/admin/courses/actions.ts`)

**What it does:**
- Detects if a bot is trying to create a course
- Applies rate limiting (5 requests per 2 minutes)
- Blocks requests if bot is detected

**How to test:**

1. **Normal User Test:**
   - Log in as an admin user
   - Try to create a course
   - Should work normally
   - Check console logs for: `Arcjet Decision: { ... }`

2. **Bot Detection Test:**
   - Arcjet automatically detects bots based on user agent and behavior
   - If detected, you'll get: "Bot detected. Access denied."

3. **Rate Limit Test:**
   - Try creating courses rapidly (more than 5 times in 2 minutes)
   - Should see: "Rate limit exceeded. Please try again later."

**Expected Console Output:**
```
Arcjet Decision: {
  id: "...",
  conclusion: "ALLOW" or "DENY",
  reason: { isBot: ..., isRateLimit: ... }
}
```

---

### 2. ✅ requireAdmin() Redirect Test

**Location:** Server Actions (`/app/admin/courses/actions.ts`)

**What it does:**
- Checks if user is logged in
- Checks if user has role === "ADMIN"
- Redirects to `/not-admin` page if not admin
- Redirects to `/login` if not logged in

**How to test:**

1. **As Non-Admin User:**
   - Log in with a regular user (role !== "ADMIN")
   - Navigate to `/admin/courses/create`
   - Try to create a course
   - Should redirect to `/not-admin` page with nice error message

2. **As Non-Logged In User:**
   - Log out completely
   - Navigate to `/admin/courses/create`
   - Should redirect to `/login` page

3. **As Admin User:**
   - Set your user role to "ADMIN" in database
   - Navigate to `/admin/courses/create`
   - Should be able to see the page and create courses

**Important Notes:**
- `requireAdmin()` works in SERVER ACTIONS and PAGE COMPONENTS
- It uses Next.js `redirect()` which is allowed in these contexts
- You can still see the dashboard/create course page UI before submitting
- The redirect only happens when you try to submit the form

---

### 3. ✅ File Upload Admin Check

**Location:** Upload API Route (`/app/api/s3/upload/route.ts`)

**What it does:**
- Checks session before allowing file upload
- Returns JSON errors (not redirects, because it's an API route)
- Applies rate limiting (10 uploads per minute)

**How to test:**

1. **As Admin User:**
   - Upload a file in the course creation form
   - Should work normally
   - Check Network tab: Status 200

2. **As Non-Admin User:**
   - Try to upload a file
   - Should see toast: "Admin access required to upload files"
   - Check Network tab: Status 403

3. **As Non-Logged In User:**
   - Try to upload a file
   - Should see toast: "Please log in to upload files"
   - Check Network tab: Status 401

4. **Rate Limit Test:**
   - Upload files rapidly (more than 10 in 1 minute)
   - Should see toast: "Too many upload requests. Please try again later."
   - Check Network tab: Status 429

**Expected API Responses:**
```json
// Success
{ "preSignedUrl": "...", "key": "..." }

// Not logged in
{ "error": "Unauthorized. Please log in." }

// Not admin
{ "error": "Forbidden. Admin access required." }

// Rate limited
{ "error": "Too many upload requests. Please try again later." }
```

---

### 4. ✅ File Delete Admin Check

**Location:** Delete API Route (`/app/api/s3/delete/route.ts`)

**What it does:**
- Same as upload route - checks admin status
- Returns JSON errors
- Applies rate limiting

**How to test:**

1. **As Admin User:**
   - Delete a file in the course creation form
   - Should work normally
   - File should be removed from S3

2. **As Non-Admin User:**
   - Try to delete a file
   - Should see error message
   - Check Network tab: Status 403

3. **As Non-Logged In User:**
   - Try to delete a file
   - Should see error message
   - Check Network tab: Status 401

---

### 5. ✅ Not-Admin Page Display

**Location:** `/app/not-admin/page.tsx`

**What it does:**
- Shows a nice error page when non-admin tries to access admin resources
- Provides buttons to go home or login with different account

**How to test:**

1. **Direct Navigation:**
   - Go to: `http://localhost:3000/not-admin`
   - Should see a nice card with:
     - Red alert icon
     - "Access Denied" title
     - Message about admin privileges
     - "Go to Home" button
     - "Sign in with different account" button

2. **Via requireAdmin() Redirect:**
   - Log in as non-admin user
   - Try to create a course
   - Should be redirected to this page automatically

---

## Summary of Status Codes

| Route | Not Logged In | Not Admin | Admin | Rate Limited |
|-------|--------------|-----------|-------|--------------|
| `/api/s3/upload` | 401 | 403 | 200 | 429 |
| `/api/s3/delete` | 401 | 403 | 200 | 429 |
| Server Actions | Redirect `/login` | Redirect `/not-admin` | ✅ Success | Error Message |

---

## Database Role Values

❌ **WRONG:**
- `role: "admin"` (lowercase)
- `role: "Admin"` (mixed case)
- `role: null` (no role set)

✅ **CORRECT:**
- `role: "ADMIN"` (uppercase)

---

## Quick Verification Checklist

- [ ] Set user role to "ADMIN" in database (uppercase)
- [ ] Can upload files as admin
- [ ] Can delete files as admin
- [ ] Cannot upload files as non-admin (gets 403 error)
- [ ] Cannot delete files as non-admin (gets 403 error)
- [ ] Cannot upload without login (gets 401 error)
- [ ] See proper error messages in toast notifications
- [ ] Bot detection logs appear in console
- [ ] Rate limiting works when hitting endpoints rapidly
- [ ] `/not-admin` page displays correctly
- [ ] Can access dashboard/create page UI (before submitting)
- [ ] Redirect to `/not-admin` when non-admin submits form

---

## Troubleshooting

### "Upload failed" - Check:
1. User role is "ADMIN" (uppercase)
2. User is logged in
3. Check browser console for errors
4. Check Network tab for API response status

### "Bot detected" - This is normal if:
- Using automation tools
- Making rapid requests
- Using certain browser extensions
- In development, you can set mode to "DRY_RUN" in arcjet.ts to test

### Not redirecting to /not-admin:
- Make sure you're submitting the form (not just viewing the page)
- Check that `requireAdmin()` is called in the server action
- Verify user role in database


