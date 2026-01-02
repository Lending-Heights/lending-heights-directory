# Microsoft Entra ID + Supabase Auth Setup Guide

This guide walks you through setting up Microsoft Entra ID (Azure AD) authentication with Supabase for the Lending Heights Hub.

---

## Part 1: Microsoft Entra ID App Registration

### Step 1: Access Azure Portal
1. Go to [portal.azure.com](https://portal.azure.com)
2. Sign in with your Microsoft admin account (likely your @lhloans.com account)

### Step 2: Navigate to Entra ID
1. In the search bar at the top, type "Microsoft Entra ID"
2. Click on "Microsoft Entra ID" in the results

### Step 3: Create App Registration
1. In the left sidebar, click **"App registrations"**
2. Click **"+ New registration"** at the top

### Step 4: Configure the App
Fill in the registration form:

| Field | Value |
|-------|-------|
| **Name** | `Lending Heights Hub` |
| **Supported account types** | Select **"Accounts in this organizational directory only (Lending Heights only - Single tenant)"** |
| **Redirect URI** | Select **"Web"** from dropdown, then enter: `https://ppywhyoxuiucwsgiyqzx.supabase.co/auth/v1/callback` |

3. Click **"Register"**

### Step 5: Note Your IDs
After registration, you'll see the app overview. **Copy these values** (you'll need them later):

- **Application (client) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Directory (tenant) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Step 6: Create Client Secret
1. In the left sidebar, click **"Certificates & secrets"**
2. Under "Client secrets", click **"+ New client secret"**
3. Add a description: `Supabase Auth`
4. Select expiration: **24 months** (recommended)
5. Click **"Add"**
6. **IMPORTANT**: Copy the **"Value"** immediately (not the Secret ID). You won't be able to see it again!

### Step 7: Configure API Permissions (Optional but Recommended)
1. In the left sidebar, click **"API permissions"**
2. You should see `Microsoft Graph > User.Read` already added
3. This is sufficient for basic SSO

### Step 8: Enable Email Verification Claim (Security Best Practice)
1. In the left sidebar, click **"Manifest"**
2. Find the `"optionalClaims"` section (around line 24)
3. Replace it with:

```json
"optionalClaims": {
    "idToken": [
        {
            "name": "email",
            "essential": false
        },
        {
            "name": "xms_edov",
            "essential": false
        }
    ],
    "accessToken": [],
    "saml2Token": []
},
```

4. Click **"Save"** at the top

---

## Part 2: Supabase Auth Configuration

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **ppywhyoxuiucwsgiyqzx**

### Step 2: Navigate to Auth Providers
1. In the left sidebar, click **"Authentication"**
2. Click **"Providers"** tab

### Step 3: Configure Azure (Microsoft) Provider
1. Find **"Azure (Microsoft)"** in the list
2. Click on it to expand
3. Toggle it **ON**

### Step 4: Enter Your Credentials
Fill in these fields with values from Part 1:

| Field | Value |
|-------|-------|
| **Azure Tenant URL** | `https://login.microsoftonline.com/{YOUR_TENANT_ID}` (replace with your Directory (tenant) ID) |
| **Client ID** | Your Application (client) ID from Step 5 |
| **Client Secret** | The secret Value from Step 6 |

**Example Azure Tenant URL:**
```
https://login.microsoftonline.com/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Step 5: Save Configuration
Click **"Save"** at the bottom

---

## Part 3: Update RLS Policies for Authenticated Access

Since you already ran the initial SQL, run this additional SQL to restrict loan data to authenticated users:

```sql
-- Update loans table to require authentication
DROP POLICY IF EXISTS "Allow public read on loans" ON loans;
DROP POLICY IF EXISTS "Allow anon insert on loans" ON loans;
DROP POLICY IF EXISTS "Allow anon update on loans" ON loans;

-- Only authenticated users can read loans
CREATE POLICY "Allow authenticated read on loans" ON loans
  FOR SELECT TO authenticated USING (true);

-- Service role can still do everything (for Edge Functions)
-- This policy should already exist from initial setup

-- Update sync_logs similarly
DROP POLICY IF EXISTS "Allow public read on sync_logs" ON sync_logs;
DROP POLICY IF EXISTS "Allow anon insert on sync_logs" ON sync_logs;
DROP POLICY IF EXISTS "Allow anon update on sync_logs" ON sync_logs;

CREATE POLICY "Allow authenticated read on sync_logs" ON sync_logs
  FOR SELECT TO authenticated USING (true);
```

---

## Part 4: Test the Integration

### Local Testing
1. Create a `.env.local` file with your Supabase credentials
2. Run `npm run dev`
3. Navigate to `http://localhost:3000/closings`
4. You should be redirected to `/login`
5. Click "Sign in with Microsoft"
6. Complete Microsoft login
7. You should be redirected back to `/closings`

### Production Testing
1. Deploy to Vercel (auto-deploys on push to main)
2. Navigate to your production URL + `/closings`
3. Test the same login flow

---

## Troubleshooting

### "AADSTS50011: The redirect URI specified in the request does not match"
- Go back to Azure Portal > App registration > Authentication
- Verify the redirect URI exactly matches: `https://ppywhyoxuiucwsgiyqzx.supabase.co/auth/v1/callback`

### "Invalid client secret"
- Secrets expire! Check if you need to create a new one
- Make sure you copied the "Value", not the "Secret ID"

### User gets 401 after login
- Check that the user has an @lhloans.com account
- Verify the app registration is set to "Single tenant"

### Login works but user sees no data
- RLS policies may be too restrictive
- Check Supabase Dashboard > Database > Policies

---

## Summary of Values Needed

| Where | What | Example |
|-------|------|---------|
| Azure Portal | Application (client) ID | `a1b2c3d4-...` |
| Azure Portal | Directory (tenant) ID | `e5f6g7h8-...` |
| Azure Portal | Client Secret Value | `abc123~...` |
| Supabase | Azure Tenant URL | `https://login.microsoftonline.com/e5f6g7h8-...` |
| Supabase | Client ID | Same as Application (client) ID |
| Supabase | Client Secret | Same as Client Secret Value |
