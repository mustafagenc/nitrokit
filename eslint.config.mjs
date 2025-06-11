import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginStorybook from 'eslint-plugin-storybook';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import eslintParserTypescript from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    {
        ignores: ['node_modules/**', '.next/**', 'coverage/**', 'dist/**', 'build/**'],
    },
    ...compat.extends('next/core-web-vitals'),
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: eslintParserTypescript,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            '@typescript-eslint': eslintPluginTypescript,
            'prettier': eslintPluginPrettier,
        },
        rules: {
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'argsIgnorePattern': '^_',
                    'varsIgnorePattern': '^_',
                },
            ],
            'prefer-const': 'error',
            'react-hooks/exhaustive-deps': 'error',
            'prettier/prettier': 'error',
        },
    },
    {
        files: ['**/*.stories.{ts,tsx}'],
        plugins: {
            'storybook': eslintPluginStorybook,
        },
        rules: {
            'storybook/hierarchy-separator': 'error',
            'storybook/default-exports': 'error',
        },
    },
];

export default eslintConfig;
