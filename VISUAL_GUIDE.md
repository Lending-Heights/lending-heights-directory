# Lending Heights Team Directory - Visual Guide

## 🎨 What You'll See

### Header Section
- **Bold gradient background** using LH Blue → Red gradient
- **Large "Team Directory" title** in white Poppins font (extrabold, 4xl-6xl)
- **Mission statement** in a frosted glass card with white text
- **Team icon** in a rounded white/translucent backdrop

### Filter Section
- **Large search bar** with search icon and placeholder text
- **Three dropdown filters** side-by-side:
  - Department (Leadership, Sales, Operations)
  - Branch (All office locations)
  - Status (Active, New Members, etc.)
- **Results counter** showing "X of Y teammates"
- **Clear Filters button** (red, appears when filters are active)

### Department Groups

Each department has:
- **Decorative header** with emoji icon (💡 Leadership, 🎯 Sales, ⚙ Operations)
- **Gradient accent lines** on both sides of the header
- **Team count** in parentheses

### Teammate Cards

Each card features:
- **Large headshot area** (272px height) with gradient background
  - If no photo: Shows large initials on gradient
  - Gradient colors match department (blue for Leadership, red for Sales, light blue for Operations)
- **Hover effect**: Image scales up, dark gradient overlay appears
- **"New Member" badge** for in-progress onboarding (yellow)

**Card Information Section:**
- Full name in bold (20px, LH blue on hover)
- Position in smaller, gray text
- Department badge (rounded pill, white text on LH blue)
- NMLS badge (if applicable, gray border)
- Branch location with 📍 emoji
- Manager name (if applicable)

**Contact Actions Row:**
- Blue "Email" button with envelope icon
- Light blue phone button with icon (if phone available)
- Light blue calendar button (if Calendly available)
- Light blue LinkedIn button (if LinkedIn available)
- All buttons have hover effects (scale icons, change colors)

**Tags Section:**
- Small gray pills showing roles/specialties
- Maximum 3 visible, "+X more" indicator if more tags

### Responsive Grid
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns
- **Large Desktop**: 4 columns

### Animations
- Cards **fade in and scale up** on page load (staggered)
- Smooth **slide-up animation** for filters
- **Hover transitions** on all interactive elements
- Icon **scale effects** on button hover

### Footer
- **Dark blue background** (LH Dark Blue)
- Copyright text in white
- **"YOU + LH = ACCOMPLISH"** tagline in yellow

## 🎨 Color Palette in Action

| Element | Color | Usage |
|---------|-------|-------|
| Header Background | Blue → Red Gradient | Hero section |
| Primary Buttons | #0058A9 (LH Blue) | CTAs, badges |
| Accent Badges | #FF2260 (LH Red) | Clear filters |
| Status Indicators | #E2C20A (LH Yellow) | New member badges |
| Card Backgrounds | White | Teammate cards |
| Section Backgrounds | #F8FAFC (LH BG) | Page background gradient |
| Text Primary | #1E1E1E | Headlines, names |
| Text Secondary | #667085 | Descriptions, metadata |
| Borders | #E5E7EB | Card outlines, inputs |

## 📱 Mobile Experience

On mobile devices:
- Header title reduces to 42px (from 64px)
- Filters stack vertically
- Cards display in single column
- Contact buttons show icons only (no text)
- Touch-friendly 44px minimum tap targets
- Smooth scrolling with momentum

## ✨ Interactive Features

1. **Search** - Type to filter in real-time
2. **Department Filter** - Select to view specific department
3. **Branch Filter** - Select to view specific office
4. **Status Filter** - Toggle between active/new members
5. **Clear All** - Reset filters with animation
6. **Email Links** - Opens default mail client
7. **Phone Links** - Initiates call on mobile
8. **External Links** - Opens in new tab (Calendly, LinkedIn)

## 🎯 Key Design Decisions

### Why This Design?
- **Card-based layout** feels modern and approachable
- **Large headshots** help with name recognition
- **Department grouping** provides natural organization
- **Gradient overlays** add depth and visual interest
- **Instant contact actions** reduce friction
- **Responsive grid** ensures great experience on all devices

### Brand Consistency
- **Poppins font** used throughout (matching brand guide)
- **Exact brand colors** from Lending Heights palette
- **Professional mortgage industry** aesthetic
- **Clean, trustworthy** design language
- **Team-focused** messaging and values

## 🚀 Performance Features

- **CSS animations** (no JavaScript) for smooth 60fps
- **Lazy loading** potential for images
- **Optimized font loading** from Google Fonts
- **Minimal bundle size** with tree-shaking
- **Fast filtering** with React useMemo
- **Responsive images** with Next.js Image optimization

---

**Built with modern web standards and Lending Heights brand guidelines**
