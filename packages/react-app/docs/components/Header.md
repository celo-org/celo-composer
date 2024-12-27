# Header Component

The Header component is a responsive navigation bar that provides essential navigation and wallet connectivity features for the Celo Composer application.

## Features

- Responsive design (mobile and desktop layouts)
- Wallet connection integration using RainbowKit
- Navigation links to key sections
- Mobile menu with smooth transitions
- Network status indicator

## Usage

```tsx
import Header from '@/components/Header';

// Use within your layout
<Header />
```

## Component Structure

### Desktop View
- Logo and brand name (left)
- Navigation links (center)
  - Home
  - Faucet
  - ScoutGame
- Wallet connection button (right)

### Mobile View
- Logo and brand name (left)
- Hamburger menu button (right)
- Collapsible menu panel with navigation links

## Props

This component doesn't accept any props as it's designed to be a standalone navigation component.

## Dependencies

- `@headlessui/react`: For accessible dropdown menus
- `@heroicons/react/24/outline`: For icons
- `@rainbow-me/rainbowkit`: For wallet connection
- `next/image`: For optimized image loading
- `next/link`: For client-side navigation

## Styling

The component uses Tailwind CSS for styling with a custom color scheme:
- Background: `bg-[#FCFF52]` (Yellow)
- Text: `text-black`
- Hover states: `hover:bg-yellow-400`
- Mobile menu: Smooth transitions and hover effects

## Example

```tsx
// Layout.tsx
import Header from '@/components/Header';

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}
```

## Customization

To customize the Header component:

1. **Navigation Links**: Modify the links in the desktop and mobile menu sections
2. **Styling**: Adjust the Tailwind classes for colors and spacing
3. **Wallet Button**: Configure the ConnectButton props for different display options

## Best Practices

1. Keep the Header component at the top level of your application layout
2. Ensure all navigation links are consistent between desktop and mobile views
3. Test the responsive behavior across different screen sizes
4. Verify wallet connection functionality on supported networks 