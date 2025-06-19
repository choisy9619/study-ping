import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // 전역 무시 패턴
  {
    ignores: ['dist', 'build', 'coverage', 'node_modules', '*.min.js', '.env*'],
  },

  // JavaScript/TypeScript 파일 설정
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier, // Prettier와 충돌하는 규칙 비활성화
    ],
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React Hooks 규칙
      ...reactHooks.configs.recommended.rules,

      // React Refresh 규칙
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // TypeScript 관련 규칙
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'off',

      // 일반 JavaScript/TypeScript 규칙
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-unused-expressions': 'off', // throw 문을 허용하기 위해 비활성화
      'prefer-const': 'error',
      'no-var': 'error',

      // Import/Export 규칙
      'no-duplicate-imports': 'error',

      // 코드 품질 규칙
      eqeqeq: ['error', 'always'],
      curly: 'off', // if (!user) throw new Error() 형태를 허용하기 위해 비활성화
      'no-eval': 'error',
      'no-implied-eval': 'error',

      // React 관련 추가 규칙
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // 특정 파일들에 대한 특별 규칙
  {
    files: ['**/*.config.{js,ts}', '**/vite.config.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // 테스트 파일들에 대한 특별 규칙
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
