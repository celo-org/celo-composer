/**
 * The project name as it belongs in a package.json `name` field.
 *
 * npm has refused uppercase in new package names since 2017, so the directory
 * the user typed cannot be reused verbatim. The directory keeps their casing;
 * only the manifest field is normalised.
 *
 * Lives next to `validateProjectName` on purpose: that function has already
 * restricted the input to `[a-zA-Z0-9_-]` starting with an alphanumeric by the
 * time this runs, which is what makes lowercasing sufficient to produce a legal
 * name. Loosen the charset there and this stops being enough.
 *
 * Both the Plop path (the `kebabCase` helper) and the ai-chat raw-copy path
 * call this. They rendered the name separately before, and drifted.
 */
export function toPackageName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function validateProjectName(name: string): string | true {
  if (!name || name.trim().length === 0) {
    return 'Project name cannot be empty';
  }

  const trimmedName = name.trim();

  // Check for valid characters (alphanumeric, hyphens, underscores)
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedName)) {
    return 'Project name can only contain letters, numbers, hyphens, and underscores';
  }

  // Check if it starts with a letter or number
  if (!/^[a-zA-Z0-9]/.test(trimmedName)) {
    return 'Project name must start with a letter or number';
  }

  // Check length
  if (trimmedName.length < 2) {
    return 'Project name must be at least 2 characters long';
  }

  if (trimmedName.length > 50) {
    return 'Project name must be less than 50 characters long';
  }

  // Check for reserved names
  const reservedNames = [
    'node_modules',
    'package.json',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.git',
    '.gitignore',
    'dist',
    'build',
    'src',
    'public',
    'assets',
    'components',
    'pages',
    'api',
    'lib',
    'utils',
    'types',
    'styles',
    'config',
    'test',
    'tests',
    '__tests__',
    'spec',
    'docs',
    'documentation',
  ];

  if (reservedNames.includes(trimmedName.toLowerCase())) {
    return `"${trimmedName}" is a reserved name and cannot be used as a project name`;
  }

  return true;
}
