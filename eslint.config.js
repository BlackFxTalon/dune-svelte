import js from '@eslint/js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sveltePlugin from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import svelteConfig from './svelte.config.js';

export default tseslint.config(
	{
		ignores: ['.svelte-kit/**', 'build/**', 'dist/**', 'node_modules/**']
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...sveltePlugin.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				svelteConfig
			}
		}
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,svelte}'],
		plugins: {
			'simple-import-sort': simpleImportSort
		},
		rules: {
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						['^\\u0000'],
						['^svelte', '^@?\\w'],
						['^\\$lib(?:$|/)'],
						['^\\$app(?:$|/)'],
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
						['^.+\\.s?css$']
					]
				}
			],
			'simple-import-sort/exports': 'error',
			'no-duplicate-imports': 'error'
		}
	}
);
