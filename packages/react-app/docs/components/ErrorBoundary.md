# ErrorBoundary Component

The ErrorBoundary component is a class-based React component that catches JavaScript errors anywhere in its child component tree and displays a fallback UI instead of crashing the application.

## Features

- Catches runtime errors in child components
- Displays user-friendly error messages
- Provides a reload option for recovery
- Preserves application state outside the error boundary
- TypeScript support with proper error typing

## Usage

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | The components to be wrapped by the error boundary |

## Component State

```tsx
interface State {
  hasError: boolean;
  error: Error | null;
}
```

## Error UI

The component displays a user-friendly error message with:
- Error title in red
- Specific error message if available
- Reload button for recovery

## Example Implementation

```tsx
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Oops, something went wrong!
          </h1>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Best Practices

1. **Strategic Placement**
   - Place ErrorBoundary at key points in your component tree
   - Don't wrap every component, focus on logical boundaries
   - Consider separate boundaries for different features

2. **Error Handling**
   - Log errors appropriately for debugging
   - Provide clear, user-friendly error messages
   - Include recovery options when possible

3. **Performance**
   - Only catches errors in the render phase and lifecycle methods
   - Does not catch errors in event handlers (use try/catch there)
   - Minimal performance impact when no errors occur

## Common Use Cases

1. **App-wide Error Boundary**
```tsx
// pages/_app.tsx
export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
```

2. **Feature-specific Error Boundary**
```tsx
// features/Dashboard/index.tsx
export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
```

## Limitations

- Only works with class components (React requirement)
- Does not catch errors in:
  - Event handlers
  - Asynchronous code
  - Server-side rendering
  - The error boundary itself 