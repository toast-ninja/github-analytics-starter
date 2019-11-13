module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
	},
	extends: [
		'airbnb',
		'plugin:prettier/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:ramda/recommended',
		'plugin:unicorn/recommended',
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	// parser: '@babel/parser',
	parserOptions: {
		ecmaFeatures: {},
		ecmaVersion: 2018,
	},
	settings: {
		'import/core-modules': ['toast'],
	},
	plugins: ['ramda', 'unicorn'],
	rules: {
		'no-console': 'error',

		'max-len': [0, 120, 2, { ignoreComments: true }],
		'no-unused-vars': [2, { vars: 'local', args: 'none' }],
		'prefer-template': 'off',

		'import/order': [
			'error',
			{
				'newlines-between': 'ignore',
				groups: ['external', 'builtin', 'internal', 'sibling', 'parent'],
			},
		],
		'no-nested-ternary': 'off',
		'no-use-before-define': ['error', { functions: false, classes: true }],

		// because idk why this is useful
		'unicorn/explicit-length-check': 'off',
		// conflicts with prettier
		'unicorn/number-literal-case': 'off',
		'unicorn/catch-error-name': 'off',
		'no-await-in-loop': 'off',

		'arrow-body-style': ['error', 'as-needed'],
		'prefer-destructuring': [
			'error',
			{
				VariableDeclarator: { array: true, object: true },
				AssignmentExpression: { array: true, object: false },
			},
			{ enforceForRenamedProperties: false },
		],
	},
}
