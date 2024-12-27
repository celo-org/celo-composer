# Celo Composer Components

This directory contains documentation for all core components used in the Celo Composer application.

## Core Components

### Layout Components

| Component | Description | Documentation |
|-----------|-------------|---------------|
| [`Layout`](./Layout.md) | Main structural component that wraps the application | [View Docs](./Layout.md) |
| [`Header`](./Header.md) | Navigation bar with wallet connection | [View Docs](./Header.md) |
| [`Footer`](./Footer.md) | Bottom section with social links | [View Docs](./Footer.md) |

### Error Handling

| Component | Description | Documentation |
|-----------|-------------|---------------|
| [`ErrorBoundary`](./ErrorBoundary.md) | Catches and handles React errors gracefully | [View Docs](./ErrorBoundary.md) |

## Component Relationships

```
Layout
├── Header
│   ├── Navigation Links
│   └── Wallet Connection
├── Main Content
└── Footer
    └── Social Links

ErrorBoundary
└── (Wraps any component tree)
```

## Quick Start

To use these components in your application:

```tsx
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <YourContent />
      </Layout>
    </ErrorBoundary>
  );
}
```

## Common Features

- 🎨 Consistent styling with Tailwind CSS
- 📱 Responsive design for all screen sizes
- 🔗 Integrated wallet connectivity
- ⚠️ Error handling and recovery
- 🌐 Social media integration

## Best Practices

1. Always wrap your pages with the `Layout` component
2. Use `ErrorBoundary` at logical component boundaries
3. Keep responsive design in mind
4. Follow the established styling patterns 