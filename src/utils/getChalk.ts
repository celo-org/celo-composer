// Lightweight dynamic loader for ESM-only 'chalk'.
// Returns the chalk default export (or a minimal no-op shim if import fails).
export default async function getChalk(): Promise<any> {
  try {
    const mod = await import('chalk');
    return mod && (mod.default || mod);
  } catch (err) {
    // Minimal shim preserving common style functions.
    const noop = (s: any) => String(s);
    const base = {
      bold: noop, dim: noop, red: noop, green: noop, yellow: noop,
      blue: noop, cyan: noop, magenta: noop, white: noop, gray: noop
    };
    return new Proxy(base, {
      get(target: any, prop: string) {
        if (prop in target) return target[prop];
        // allow chalk.green.bold('x') — return function that returns the string
        return (s: any) => String(s);
      }
    });
  }
}
