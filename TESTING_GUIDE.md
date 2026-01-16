# Testing Guide - Authentication & Notification System

## Quick Test Scenarios

### Test 1: Creating a New Account
**Steps:**
1. Click on the profile icon (👤) in the top-right
2. You should see the auth modal with "Welcome to StudySync"
3. Click "Sign up" link at the bottom
4. The form will switch to registration mode
5. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
6. Click "Create Account"
7. You should be redirected to the profile page
8. Check the profile displays your name and email

**Expected Results:**
- ✅ Auth modal appears
- ✅ Form toggles to register view
- ✅ Validation works (try submitting with blank fields)
- ✅ Password confirmation validation works
- ✅ User is redirected to profile page on success

---

### Test 2: Logging In
**Steps:**
1. From profile page, click "🚪 Logout" button
2. You'll return to the home page
3. Click profile icon again
4. Enter credentials:
   - Email: john@example.com
   - Password: password123
5. Click "Sign In"

**Expected Results:**
- ✅ Auth modal appears with login form
- ✅ Login validation works
- ✅ Successful login redirects to profile page
- ✅ Profile displays correct user info

---

### Test 3: Notification Panel
**Steps:**
1. Click the bell icon (🔔) in the header
2. A panel should slide in from the right
3. You'll see 3 sample notifications:
   - "🎯 Study Goal Achieved"
   - "📈 Progress Update"
   - "👥 Group Invitation"
4. Click the ✕ button on one notification
5. That notification disappears and badge count decreases
6. Click "Clear All" to remove all notifications
7. Click the bell again to see empty panel

**Expected Results:**
- ✅ Panel slides in from right
- ✅ Notifications display correctly
- ✅ Individual dismiss works
- ✅ Badge updates properly
- ✅ Clear All removes all notifications
- ✅ Panel closes when clicking outside

---

### Test 4: Profile Page Features
**Steps:**
1. From profile page, scroll down to see:
   - Account Information card
   - Learning Progress section
   - Weekly Activity section
   - Sidebar with stats and settings
2. Check that all sections display correctly
3. Verify user data matches what was registered
4. Check that progress bars display (though data will be 0 for new users)

**Expected Results:**
- ✅ All sections render correctly
- ✅ User name and email display
- ✅ Progress bars are visible
- ✅ Settings and stats are present
- ✅ Page is responsive on mobile

---

### Test 5: Session Persistence
**Steps:**
1. Create/login to an account
2. Close the browser tab completely
3. Reopen StudySync in new tab
4. Click profile icon
5. Should go directly to profile page (not showing login)

**Expected Results:**
- ✅ User data persists in localStorage
- ✅ No need to login again
- ✅ Profile loads with stored user data

---

### Test 6: Form Validation
**Steps:**
1. Click profile icon to open auth modal
2. Try these scenarios:

**Scenario A: Empty Email**
- Leave email blank
- Click "Sign In"
- Should see browser validation

**Scenario B: Password Too Short**
- Register with password "123"
- Should show error: "Password must be at least 6 characters"

**Scenario C: Mismatched Passwords**
- Register with password: "password123"
- Confirm password: "password456"
- Should show error: "Passwords do not match"

**Scenario D: Duplicate Email**
- Register with same email twice
- Second attempt should show: "Email already registered"

**Expected Results:**
- ✅ All validations work
- ✅ Error messages display appropriately
- ✅ Form doesn't submit on validation failure

---

### Test 7: Responsive Design
**Steps:**
1. Open the website on desktop
2. Use browser DevTools to test mobile view:
   - Click hamburger menu (☰)
   - Navigation appears in dropdown
3. Test tablet view:
   - Profile page layout adjusts to single column
   - Notification panel still accessible
4. Test desktop:
   - Full two-column layout
   - All features visible

**Expected Results:**
- ✅ Mobile navigation works
- ✅ Responsive layouts adjust properly
- ✅ All features accessible on all screen sizes

---

### Test 8: Progress Tracking Display
**Steps:**
1. Login and go to profile page
2. Look at "Learning Progress" section
3. Check three progress bars:
   - Tasks Completed (0/0 initially)
   - Study Streak (0 days initially)
   - Average Score (0% initially)

**Expected Results:**
- ✅ Progress bars display with correct percentages
- ✅ Gradient colors are visible
- ✅ Text labels match bar values
- ✅ Bars respond to progress data

---

## Testing Modal Interactions

### Auth Modal
- ✅ Opens when clicking profile icon (if not logged in)
- ✅ Closes when clicking ✕ button
- ✅ Closes when clicking outside overlay
- ✅ Toggle between login/register forms works
- ✅ Form submission works correctly
- ✅ Validation prevents invalid submissions

### Notification Panel
- ✅ Slides in from right when clicking bell
- ✅ Slides out when clicking bell again
- ✅ Closes when clicking outside
- ✅ Individual notifications can be dismissed
- ✅ Clear All button works
- ✅ Badge count updates correctly

---

## Sample Test Data

Use these credentials for testing:

**Account 1:**
- Email: test@example.com
- Password: test123456
- Name: Test User

**Account 2:**
- Email: admin@example.com
- Password: admin123456
- Name: Admin User

**Account 3:**
- Email: student@example.com
- Password: student123456
- Name: Student Account

---

## Browser Compatibility

Test in these browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Debugging Tips

### If notifications don't appear:
1. Check browser console for errors (F12)
2. Verify notification-panel element exists in HTML
3. Check that authManager.notifications array is not empty

### If auth modal doesn't show:
1. Check browser console for JavaScript errors
2. Verify auth-modal element exists in HTML
3. Check that profile-btn element has proper ID

### If localStorage not persisting:
1. Check if localStorage is enabled in browser settings
2. Look in DevTools Storage tab for 'studysync_user' key
3. Check for browser privacy/incognito mode

### If styles look wrong:
1. Verify Tailwind CDN link is loading: https://cdn.tailwindcss.com
2. Check browser console for CSP or CORS errors
3. Clear browser cache (Ctrl+Shift+Del)

---

## Performance Notes

- **Page Load**: Should be instant (no backend calls)
- **Modal Open/Close**: Should be smooth (CSS transitions)
- **Form Submission**: Should be immediate (client-side only)
- **Notification Panel**: Should slide smoothly

---

## Known Limitations (Demo Version)

1. ⚠️ Passwords stored in base64 (not production-safe)
2. ⚠️ No email verification
3. ⚠️ No password reset functionality
4. ⚠️ No two-factor authentication
5. ⚠️ Progress data is static (not connected to actual usage)
6. ⚠️ Notifications are sample only (not real-time)
7. ⚠️ No backend integration

These should be implemented in a production version.
