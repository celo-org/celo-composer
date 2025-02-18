# **Adding UI Components to Your Next.js App**  

This guide explains how to add UI components to your Next.js app using [ShadCN](https://ui.shadcn.com/), a component library that provides a set of pre-built, easy-to-use components. We will demonstrate the installation of ShadCN and provide an example of adding and using a button component.  

## **Step 1: Initialize ShadCN in Your Project**  

To get started, install the ShadCN CLI and initialize it in your project:  

```bash
cd packages/react-app
npx shadcn@latest init -d
```  

This command initializes ShadCN and adds its configuration to your project.  

## **Step 2: Install the Button Component**  

[ShadCN](https://ui.shadcn.com/) provides a variety of components, including buttons, inputs, cards, and [more](https://ui.shadcn.com/). To install the button component, use:  

```bash
# Add a button component
npx shadcn add button
```  

This command adds the button component to your project’s `components/ui/` folder, making it available for use.  

## **Step 3: Import and Use the Button Component**  

Once the button component is installed, you can import and use it in your app.  

Open `app/page.tsx` and modify it as follows:  

```tsx
import { Button } from '@/components/ui/button';

export default function Home() {

  // Function to handle button click
  const handleClick = () => {
    console.log('I love the Celo Composer ❤️');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
        <Button onClick={handleClick}>Click Me</Button>
    </div>
  );
}
```  

This will render a button at the center of the page.  

## **Step 4: Additional Information**  

### **Customizing the Button**  
You can customize the button’s styles in the generated [`components/ui/button.tsx`](../packages/react-app/components/ui/button.tsx) file.  

### **Installing Other Components**  
ShadCN offers a wide range of components, such as cards, inputs, and more. To add other components, use:  

```bash
# Add a card component
npx shadcn add card

# Add an input component
npx shadcn add input
```  

### **Documentation**  
For more components and advanced usage, refer to the [ShadCN documentation](https://ui.shadcn.com/docs).  