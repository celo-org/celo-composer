# Footer Component

The Footer component provides a consistent bottom section for the Celo Composer application, featuring social media links and copyright information.

## Features

- Social media integration with icon links
- Responsive layout (mobile and desktop)
- Dynamic copyright year
- Customizable social navigation
- Clean, minimal design

## Usage

```tsx
import Footer from '@/components/Footer';

// Use within your layout
<Footer />
```

## Component Structure

### Desktop View
- Social media links (right side)
- Copyright text (left side)

### Mobile View
- Stacked layout
- Social media links on top
- Copyright text below

## Social Navigation

The component uses a predefined array of social links:
```tsx
const navigation = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/CeloDevs',
    icon: TwitterIcon
  },
  {
    name: 'GitHub',
    href: 'https://github.com/celo-org/celo-composer',
    icon: GitHubIcon
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/celo',
    icon: DiscordIcon
  }
];
```

## Dependencies

- `@heroicons/react/24/outline`: For social media icons
- Tailwind CSS: For styling and responsive design

## Styling

The component uses Tailwind CSS with the following key styles:
- Background: `bg-gypsum`
- Border: `border-black border-t`
- Text: `text-black`
- Hover: `hover:text-forest`
- Icons: `h-6 w-6`

## Example

```tsx
// Layout.tsx
import Footer from '@/components/Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
```

## Customization

To customize the Footer component:

1. **Social Links**: Modify the `navigation` array to add/remove social media links
2. **Styling**: Adjust the Tailwind classes for colors and spacing
3. **Copyright Text**: Update the copyright text in the render section
4. **Icons**: Replace or modify the social media icons

## Best Practices

1. Place the Footer at the bottom of your layout using `mt-auto`
2. Ensure all social links open in new tabs using `target="_blank"`
3. Include proper accessibility attributes for icons
4. Test the responsive layout on different screen sizes
5. Keep social media links up to date 