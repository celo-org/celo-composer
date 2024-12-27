# Layout Component

The Layout component serves as the main structural wrapper for the Celo Composer application, providing a consistent page structure with header, main content area, and footer.

## Features

- Consistent page structure across all routes
- Flexible content area with proper spacing
- Full viewport height management
- Responsive padding and margins
- Background styling

## Usage

```tsx
import Layout from '@/components/Layout';

export default function HomePage() {
  return (
    <Layout>
      <h1>Welcome to my page</h1>
      <p>This content will be properly laid out</p>
    </Layout>
  );
}
```

## Component Structure

```
Layout
├── Header
├── Main Content Area
│   └── {children}
└── Footer
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | The content to be rendered in the main area |

## Dependencies

- `Header`: Navigation component
- `Footer`: Bottom section component
- React's FC and ReactNode types
- Tailwind CSS for styling

## Styling

The component uses Tailwind CSS with the following key styles:
- Container: `bg-gypsum overflow-hidden flex flex-col min-h-screen`
- Content Area: `py-16 max-w-7xl mx-auto space-y-8 sm:px-6 lg:px-8`

## Example with TypeScript

```tsx
import { FC, ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="bg-gypsum overflow-hidden flex flex-col min-h-screen">
      <Header />
      <div className="py-16 max-w-7xl mx-auto space-y-8 sm:px-6 lg:px-8">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
```

## Best Practices

1. **Page Structure**
   - Use Layout as the top-level wrapper for all pages
   - Maintain consistent spacing with the provided padding classes
   - Ensure content stays within the max-width constraints

2. **Responsive Design**
   - Test the layout at different viewport sizes
   - Verify that padding adjusts properly on mobile devices
   - Ensure minimum height fills the viewport

3. **Content Management**
   - Keep main content properly spaced using `space-y-8`
   - Avoid overriding the layout's base styles unless necessary
   - Use the provided padding and margin utilities

4. **Performance**
   - Avoid unnecessary re-renders of the layout structure
   - Keep layout-level state to a minimum
   - Utilize React.memo if needed for complex child components

## Common Use Cases

1. **Page Wrapper**
```tsx
// pages/index.tsx
export default function Home() {
  return (
    <Layout>
      <div className="space-y-4">
        <h1>Welcome</h1>
        <p>Your content here</p>
      </div>
    </Layout>
  );
}
```

2. **Dashboard Layout**
```tsx
// pages/dashboard.tsx
export default function Dashboard() {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardWidget />
        <DashboardWidget />
      </div>
    </Layout>
  );
}
``` 