<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';

	export let onclick: VoidFunction;
	// $: onclick();

	export let isLoading: boolean = false;
	export let variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' =
		'default';
	export let size: 'default' | 'sm' | 'lg' | 'icon' = 'default';

	const buttonVariants = cva(
		`inline-flex items-center
  justify-center rounded-md
  text-sm font-medium transition-colors
  focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-ring
  focus-visible:ring-offset-2 disabled:opacity-50
  disabled:pointer-events-none ring-offset-background w-fit`,
		{
			variants: {
				variant: {
					default: 'bg-primary text-primary-foreground hover:bg-primary/60 hover:border-secondary',
					destructive: 'bg-red-500 text-white hover:bg-destructive/90',
					outline:
						'border border-input border-primary hover:bg-accent hover:text-accent-foreground',
					secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
					ghost: 'hover:bg-accent hover:text-accent-foreground',
					link: 'underline-offset-4 hover:underline text-primary'
				},
				size: {
					default: 'h-10 py-2 px-4',
					sm: 'h-9 px-3 rounded-md',
					lg: 'h-11 px-8 rounded-md',
					icon: 'h-10 w-10'
				}
			},
			defaultVariants: {
				variant: 'default',
				size: 'default'
			}
		}
	);
	//
</script>

<button disabled={isLoading} class={buttonVariants({ variant, size })} on:click={onclick}>
	{#if isLoading}
		<!-- <Spinner color="#fff" size={40} />  -->
		<p>...</p>
	{:else}
		<slot />
	{/if}
</button>
