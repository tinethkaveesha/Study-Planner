# 🎨 Visual Guide & UI Components

## Notification Panel Layout

```
┌─────────────────────────────────┐
│  StudySync  🔔  👤              │  ← Header
└─────────────────────────────────┘
                                ┌──────────────────────┐
                                │    Notifications     │  ← Panel slides in
                                ├──────────────────────┤
                                │ 🎯 Study Goal Achv.  │
                                │ You completed...     │
                                │ 2 hours ago      ✕   │
                                ├──────────────────────┤
                                │ 📈 Progress Update   │
                                │ Your performance...  │
                                │ 5 hours ago      ✕   │
                                ├──────────────────────┤
                                │ 👥 Group Invitation  │
                                │ John invited you...  │
                                │ 1 day ago        ✕   │
                                ├──────────────────────┤
                                │   Clear All          │
                                └──────────────────────┘
```

**Position**: Fixed right, slides from off-screen
**Width**: 320px (w-80)
**Animation**: translate-x-full → translate-x-0
**Z-index**: 40

---

## Authentication Modal Layout

```
         ┌────────────────────────┐
         │  ✕                     │
         │                        │
         │ Welcome to StudySync   │
         │ Sign in to continue... │
         │                        │
         │ ┌────────────────────┐ │
         │ │ Email              │ │
         │ │ [          ]       │ │
         │ ├────────────────────┤ │
         │ │ Password           │ │
         │ │ [          ]       │ │
         │ ├────────────────────┤ │
         │ │ Sign In            │ │
         │ └────────────────────┘ │
         │                        │
         │ Don't have account?    │
         │ Sign up →              │
         └────────────────────────┘
```

**Position**: Center of screen with 50% black overlay
**Width**: Max 448px (max-w-md)
**Animation**: Slide up from bottom
**Z-index**: 50

### Toggle Between Forms

```
LOGIN VIEW                  REGISTER VIEW
┌─────────────────┐        ┌─────────────────┐
│ Welcome         │        │ Create Account  │
│ to StudySync    │        │                 │
├─────────────────┤        ├─────────────────┤
│ Email:          │        │ Name:           │
│ [       ]       │        │ [       ]       │
│                 │        │                 │
│ Password:       │        │ Email:          │
│ [       ]       │        │ [       ]       │
│                 │        │                 │
│ [Sign In]       │        │ Password:       │
│                 │        │ [       ]       │
│ Sign up? →      │        │                 │
└─────────────────┘        │ Confirm:        │
                           │ [       ]       │
                           │                 │
                           │ [Create Acc]    │
                           │                 │
                           │ Sign in? →      │
                           └─────────────────┘
```

---

## Profile Page Layout

```
DESKTOP VIEW (2-COLUMN)
┌────────────────────────────────────────────────────────────┐
│ Header                                                      │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  PROFILE HEADER (GRADIENT BACKGROUND)                      │
│  ┌──────┐                                    ┌──────────┐  │
│  │ Avatar│  Name                             │ Logout   │  │
│  │   J   │  john@example.com                 └──────────┘  │
│  │       │  Member since Jan 15, 2026                      │
│  └──────┘                                                  │
└────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┬─────────────────────┐
│                                      │                     │
│  MAIN CONTENT (2/3 width)            │  SIDEBAR (1/3)      │
│                                      │                     │
│  ┌──────────────────────────────┐   │ ┌─────────────────┐ │
│  │ Account Information          │   │ │ Quick Stats     │ │
│  │ ├─ Name: John Doe           │   │ │ ├─ Study Hours  │ │
│  │ ├─ Email: john@example.com  │   │ │ ├─ Quizzes     │ │
│  │ └─ [Edit Profile]           │   │ │ └─ Groups      │ │
│  └──────────────────────────────┘   │ └─────────────────┘ │
│                                      │                     │
│  ┌──────────────────────────────┐   │ ┌─────────────────┐ │
│  │ Learning Progress            │   │ │ Recent Activity │ │
│  │ ├─ Tasks: ████░░░░ 0/0      │   │ │ ├─ Started Math│ │
│  │ ├─ Streak: ░░░░░░░░ 0 days  │   │ │ ├─ Joined Phys│ │
│  │ └─ Score: ░░░░░░░░ 0%       │   │ │ └─ Completed  │ │
│  └──────────────────────────────┘   │ └─────────────────┘ │
│                                      │                     │
│  ┌──────────────────────────────┐   │ ┌─────────────────┐ │
│  │ Weekly Activity              │   │ │ Settings        │ │
│  │ ├─ Monday:   3h [75%]        │   │ │ ├─ Notifs      │ │
│  │ ├─ Tuesday:  2.5h [85%]      │   │ │ ├─ Privacy     │ │
│  │ └─ Wednesday: 1.5h [60%]     │   │ │ ├─ Data        │ │
│  └──────────────────────────────┘   │ │ └─ Delete      │ │
│                                      │ └─────────────────┘ │
│                                      │                     │
└──────────────────────────────────────┴─────────────────────┘

MOBILE VIEW (1-COLUMN)
┌────────────────────┐
│ Header             │
└────────────────────┘
┌────────────────────┐
│ PROFILE HEADER     │
│ Avatar             │
│ Name, Email        │
│ Logout             │
└────────────────────┘
┌────────────────────┐
│ ACCOUNT INFO       │
└────────────────────┘
┌────────────────────┐
│ PROGRESS           │
└────────────────────┘
┌────────────────────┐
│ QUICK STATS        │
└────────────────────┘
┌────────────────────┐
│ ACTIVITY           │
└────────────────────┘
┌────────────────────┐
│ SETTINGS           │
└────────────────────┘
```

---

## Progress Bar Examples

```
TASKS COMPLETED
Tasks Completed                              0/0
████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 75%
[Amber to Orange Gradient]


STUDY STREAK
🔥 Study Streak                               0 days
████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 15%
[Orange to Red Gradient]


AVERAGE SCORE
⭐ Average Score                              0%
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%
[Green to Emerald Gradient]
```

---

## Color Palette

```
PRIMARY COLORS
├─ Amber-700 (#b45309) - Main accent
│  └─ Used for: Buttons, links, highlights
│
├─ Orange-600 (#ea580c) - Secondary accent
│  └─ Used for: Gradients, hover states
│
└─ Orange-700 (#c2410c) - Dark variant
   └─ Used for: CTA buttons, emphasis

TEXT COLORS
├─ Gray-900 (#111827) - Primary text
├─ Gray-600 (#4b5563) - Secondary text
├─ Gray-500 (#6b7280) - Tertiary text
└─ Gray-400 (#9ca3af) - Placeholder text

BACKGROUND COLORS
├─ White (#ffffff) - Card backgrounds
├─ Gray-50 (#f9fafb) - Page background
├─ Gray-100 (#f3f4f6) - Input backgrounds
└─ Gray-200 (#e5e7eb) - Border color

STATUS COLORS
├─ Green (#16a34a) - Completed, success
├─ Yellow (#eab308) - In-progress, warning
├─ Red (#dc2626) - Error, important
└─ Blue (#3b82f6) - Info
```

---

## Typography System

```
HEADINGS
├─ H1: 48px (3rem) Bold - Main page titles
├─ H2: 36px (2.25rem) Bold - Section headings
├─ H3: 24px (1.5rem) Bold - Card headings
└─ H4: 18px (1.125rem) Semibold - Subsection

BODY TEXT
├─ Large: 18px Regular - Intro text
├─ Default: 16px Regular - Body text
├─ Small: 14px Regular - Captions
└─ Tiny: 12px Regular - Labels

WEIGHTS
├─ Regular: 400 - Body text
├─ Medium: 500 - Emphasis
├─ Semibold: 600 - Labels, small headings
└─ Bold: 700 - Headings

FONT: DM Sans (system font fallback: -apple-system, BlinkMacSystemFont)
```

---

## Button Styles

```
PRIMARY BUTTON
┌──────────────────────┐
│  Sign In             │
└──────────────────────┘
bg-amber-700
hover:bg-amber-800
text-white
font-semibold
py-2 px-8

SECONDARY BUTTON (OUTLINE)
┌──────────────────────┐
│  Cancel              │
└──────────────────────┘
border-2 border-gray-200
text-gray-700
bg-transparent
hover:bg-gray-50
font-medium

TERTIARY BUTTON (TEXT)
┌──────────────────────┐
│  Sign up →           │
└──────────────────────┘
text-amber-700
hover:text-amber-800
font-medium
no background
```

---

## Form Input Styles

```
TEXT INPUT
┌────────────────────────────────────┐
│ you@example.com                    │  Focus: ring-2 ring-amber-700
└────────────────────────────────────┘
border-1 border-gray-300
px-4 py-2
rounded-lg
focus:outline-none
focus:ring-2 ring-amber-700
focus:border-transparent

VALID STATE
┌────────────────────────────────────┐
│ john@example.com              ✓    │  Green checkmark
└────────────────────────────────────┘

ERROR STATE
┌────────────────────────────────────┐
│ invalid@                      ✗    │  Red X
└────────────────────────────────────┘
Error: Invalid email format
```

---

## Animation Keyframes

```
SLIDE UP
from: opacity 0, translateY(30px)
to: opacity 1, translateY(0)
duration: 0.6s
timing: ease-out
↑ ↑ ↑ appears here ↑ ↑ ↑

FADE IN
from: opacity 0
to: opacity 1
duration: 0.8s
timing: ease-out
● ● ● ● ● fades in ● ● ●

SLIDE LEFT (Notification Panel)
from: translateX(100%)
to: translateX(0)
duration: 0.3s
timing: ease-in-out
→ → → slides in ← ← ←
```

---

## Responsive Breakpoints

```
MOBILE (< 768px)
└─ Single column
└─ Full width padding 1rem
└─ Hamburger menu
└─ Stack all components vertically

TABLET (768px - 1024px)
└─ Transitional layouts
└─ Can show 2 columns
└─ Simplified sidebars

DESKTOP (> 1024px)
└─ Full 2-column layouts
└─ Extended sidebars
└─ More spacing
└─ Hover effects
```

---

## Icon Set Used

```
EMOJI ICONS
├─ 📚 App logo
├─ 🔔 Notifications
├─ 👤 Profile/User
├─ 🚪 Logout
├─ ⚙️ Settings
├─ 📊 Analytics
├─ 📈 Progress
├─ 🔥 Streak
├─ ⭐ Rating
├─ 🎯 Goals
├─ 📅 Schedule
├─ 💬 Chat
├─ 📝 Notes
├─ 🎓 Learning
└─ ✕ Close/Delete
```

---

## Shadow & Border System

```
SHADOWS
├─ shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
├─ shadow: 0 1px 3px rgba(0,0,0,0.1)
├─ shadow-md: 0 4px 6px rgba(0,0,0,0.1)
├─ shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
└─ shadow-xl: 0 20px 25px rgba(0,0,0,0.1)

BORDERS
├─ border: 1px solid #e5e7eb
├─ border-2: 2px solid #e5e7eb
├─ rounded: 0.25rem
├─ rounded-lg: 0.5rem
├─ rounded-xl: 0.75rem
└─ rounded-2xl: 1rem
```

---

## Spacing System (Tailwind)

```
PADDING
├─ p-2: 0.5rem (8px)
├─ p-4: 1rem (16px)
├─ p-6: 1.5rem (24px)
├─ p-8: 2rem (32px)
└─ p-20: 5rem (80px)

MARGIN
├─ m-2: 0.5rem
├─ m-4: 1rem
├─ m-6: 1.5rem
└─ m-8: 2rem

GAP
├─ gap-2: 0.5rem
├─ gap-3: 0.75rem
├─ gap-4: 1rem
└─ gap-6: 1.5rem
```

---

**Design System Version**: 1.0
**Last Updated**: January 15, 2026
**Status**: Complete & Production Ready
