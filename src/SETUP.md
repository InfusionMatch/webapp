# IV Infusion Job Portal - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation Steps

1. **Clone/Download the project**
   ```bash
   # Create new directory
   mkdir iv-infusion-portal
   cd iv-infusion-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open browser**
   - Navigate to `http://localhost:5173`
   - The application will be running!

## 📁 Project Structure

```
src/
├── App.tsx              # Main application component
├── main.tsx             # React entry point
├── lib/utils.ts         # Utility functions
├── styles/globals.css   # Tailwind V4 global styles
└── components/          # All React components
    ├── ui/              # shadcn/ui components
    ├── figma/           # Figma-specific components
    └── [other components]
```

## 🎨 Key Features

### ✅ **Three User Portals**
- **Nurse Portal**: Job browsing, onboarding, visit management
- **Supplier Portal**: Visit posting, nurse management, monitoring
- **Admin Portal**: System oversight, user management

### ✅ **Complete Workflow**
- Nurse onboarding with credential verification
- Visit acceptance with terms & conditions
- Real-time messaging system
- Comprehensive notification center
- Mobile-optimized responsive design

### ✅ **IV Infusion Focus**
- Specialized for IV therapy and home medical care
- Medication-specific visit types (Remicade, PICC care, etc.)
- Professional healthcare workflow

## 🔧 Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

## 🎯 Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS V4** for styling
- **shadcn/ui** component library
- **Vite** for development and building
- **Lucide React** for icons
- **Radix UI** primitives

## 📱 Mobile Optimization

The application is fully responsive and optimized for mobile use, particularly targeting healthcare professionals using phones during patient visits.

## 🔐 Security Note

This is a prototype focusing on UI/UX design. For production use, implement:
- Authentication system
- API integrations
- Database connections
- HIPAA compliance measures
- Real-time data synchronization

## 🤝 Support

For questions or modifications, refer to the component documentation within each file or create issues in your project repository.