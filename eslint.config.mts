import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import nPlugin from 'eslint-plugin-n';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default defineConfig([
	// Global ignores
	globalIgnores([
		'node_modules/**',
		'dist/**',
		'build/**',
		'coverage/**',
		'drizzle/**',
		'db_backups/**',
	]),

	// Base JS + TypeScript rules
	eslint.configs.recommended, // cover .js, .cjs, and .mjs files
	tseslint.configs.recommended, // cover .ts files

	// Override specific TypeScript rules
	{
		files: ['**/*.ts'],
		rules: {
			// Ignore no-unused-vars rule for function with _ e.g. _next on middleware
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	},

	// Node.js rules, globals and CommonJS support
	{
		files: ['**/*.{js,cjs,ts}'],
		extends: [nPlugin.configs['flat/recommended']], // Node.js specific rules
		languageOptions: {
			globals: globals.node,
			sourceType: 'commonjs',
		},
		settings: {
			n: {
				tryExtensions: ['.ts', '.d.ts', '.tsx', '.js', '.jsx', '.json', '.node'],
			},
		},
	},

	// Allow devDependency imports in config files
	{
		files: ['*.config.ts', '*.config.js', 'tests/**/*.ts', '**/*.test.ts'],
		rules: {
			'n/no-unpublished-import': 'off',
		},
	},

	// Allow process.exit() in script/CLI files
	{
		files: ['scripts/**/*.ts', 'seed.ts', '**/*.seed.ts'],
		rules: {
			'n/no-process-exit': 'off',
		},
	},

	// Prettier — must be last
	prettierConfig,
	prettierPlugin,
]);
