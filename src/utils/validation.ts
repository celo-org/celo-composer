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
