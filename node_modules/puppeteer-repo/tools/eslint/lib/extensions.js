"use strict";
const utils_1 = require("@typescript-eslint/utils");
const createRule = utils_1.ESLintUtils.RuleCreator(name => {
    return `https://github.com/puppeteer/puppeteer/tree/main/tools/eslint/${name}.js`;
});
const enforceExtensionRule = createRule({
    name: 'extensions',
    meta: {
        docs: {
            description: 'Requires `.js` for imports',
            requiresTypeChecking: false,
        },
        messages: {
            extensionsRule: 'Add `.js` to import.',
        },
        schema: [],
        fixable: 'code',
        type: 'problem',
    },
    defaultOptions: [],
    create(context) {
        return {
            ImportDeclaration(node) {
                const file = node.source.value.split('/').pop();
                if (!node.source.value.startsWith('.') || file?.includes('.')) {
                    return;
                }
                context.report({
                    node: node.source,
                    messageId: 'extensionsRule',
                    fix(fixer) {
                        return fixer.replaceText(node.source, `'${node.source.value}.js'`);
                    },
                });
            },
        };
    },
});
module.exports = enforceExtensionRule;
//# sourceMappingURL=extensions.js.map