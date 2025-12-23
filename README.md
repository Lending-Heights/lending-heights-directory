# Lending Heights Team Directory - Gallery View Prototype

A beautifully branded team directory application built with Next.js, featuring a gallery view with filtering, search, and department grouping.

## 🎨 Features

- **Gallery View** - Beautiful card-based layout with teammate photos
- **Department Grouping** - Teammates organized by Leadership, Sales, and Operations
- **Advanced Filtering** - Filter by department, branch, onboarding status
- **Real-time Search** - Search by name, position, branch, or email
- **Responsive Design** - Fully mobile-friendly and responsive
- **Lending Heights Branding** - Complete brand consistency with colors, fonts, and design
- **Smooth Animations** - Engaging transitions and hover effects
- **Contact Actions** - Direct email, phone, calendar, and LinkedIn links

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd team-directory
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Filtering & Search

- **Search Bar** - Type to search across names, positions, and branches
- **Department Filter** - Select Leadership, Sales, or Operations
- **Branch Filter** - Filter by specific office locations
- **Status Filter** - Show active, new members, or all teammates
- **Clear Filters** - Reset all filters with one click

### Viewing Teammates

- Teammates are grouped by department
- Each card shows:
  - Professional headshot or initials
  - Full name and position
  - Department and NMLS (if applicable)
  - Branch location
  - Reporting manager
  - Quick contact actions (email, phone, calendar, LinkedIn)
  - Role-specific tags

### Interactions

- **Hover** - Cards animate and reveal gradient overlays
- **Email** - Click to compose email
- **Phone** - Click to initiate call
- **Calendar** - Schedule meetings via Calendly
- **LinkedIn** - View professional profiles

## 📁 Project Structure

```
team-directory/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main team directory page
├── components/
│   ├── DepartmentGroup.tsx   # Department section component
│   ├── Filters.tsx           # Search and filter controls
│   └── TeammateCard.tsx      # Individual teammate card
├── data/
│   └── teammates.ts          # Sample teammate data
├── lib/
│   └── utils.ts              # Utility functions
├── types/
│   └── index.ts              # TypeScript type definitions
├── package.json
├── tailwind.config.js        # Tailwind with LH branding
└── tsconfig.json
```

## 🎨 Lending Heights Branding

### Colors Used

- **Primary Blue**: `#0058A9` - Headers, CTAs, primary elements
- **Primary Red**: `#FF2260` - Accents and highlights
- **Primary Yellow**: `#E2C20A` - Badges and callouts
- **Light Blue**: `#00B0FF` - Backgrounds and secondary elements
- **Dark Blue**: `#002547` - Footers and dark sections

### Typography

- **Font Family**: Poppins (all weights)
- **Headings**: Bold/Extrabold (700/800)
- **Body**: Regular/Semibold (400/600)

### Gradients

- **Primary Gradient**: Blue → Red (Leadership cards)
- **Sales Gradient**: Red → Yellow (Sales cards)
- **Operations Gradient**: Light Blue → Blue (Operations cards)

## 🔧 Customization

### Adding Teammates

Edit `/data/teammates.ts` and add new teammate objects:

```typescript
{
  id: 'unique-id',
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  email: 'john.doe@lendingheights.com',
  position: 'Loan Officer',
  department: 'Sales',
  branch: '🌉 Pittsburgh (HQ)',
  headshotUrl: 'https://...',
  // ... more fields
}
```

### Modifying Filters

Edit `/components/Filters.tsx` to add or remove filter options.

### Styling Changes

All Lending Heights brand colors are defined in `tailwind.config.js`. Modify there for global changes.

## 🚀 Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📦 Dependencies

- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons
- **clsx & tailwind-merge** - Class management

## 🎯 Next Steps

This prototype demonstrates the gallery view. Future enhancements:

1. **Table View** - Comprehensive data table
2. **Calendar View** - Birthday and anniversary calendars
3. **Profile Pages** - Detailed individual profiles
4. **Add/Edit Forms** - Admin functionality
5. **Database Integration** - Connect to Supabase
6. **Authentication** - Microsoft Entra ID SSO
7. **Real-time Updates** - Live data synchronization

## 📝 Notes

- Sample data uses Unsplash images for demonstration
- All contact actions are functional (email, phone, external links)
- Responsive design tested on mobile, tablet, and desktop
- Animations are CSS-based for optimal performance

## 🎉 YOU + LH = ACCOMPLISH

Built with ❤️ for Lending Heights Mortgage
