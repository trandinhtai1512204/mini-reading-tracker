import { access } from 'node:fs/promises';
import { resolve } from 'node:path';

const requiredPaths = [
  '.gitignore',
  '.env.example',
  'README.md',
  'package.json',
  'apps/api/package.json',
  'apps/web/package.json',
  'docs/architecture.md',
  'docs/api-contract.md',
  'docs/mysql-schema.md',
  'docs/requirements-traceability.md',
];

await Promise.all(requiredPaths.map((file) => access(resolve(file))));
console.log(`Foundation structure is present (${requiredPaths.length} required files).`);
