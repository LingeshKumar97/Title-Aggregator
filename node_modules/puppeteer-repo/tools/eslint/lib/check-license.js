"use strict";
const utils_1 = require("@typescript-eslint/utils");
const createRule = utils_1.ESLintUtils.RuleCreator(name => {
    return `https://github.com/puppeteer/puppeteer/tree/main/tools/eslint/${name}.ts`;
});
const currentYear = new Date().getFullYear();
const licenseHeader = `
/**
 * @license
 * Copyright ${currentYear} Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
`;
const enforceLicenseRule = createRule({
    name: 'check-license',
    meta: {
        type: 'layout',
        docs: {
            description: 'Validate existence of license header',
            requiresTypeChecking: false,
        },
        fixable: 'code',
        schema: [],
        messages: {
            licenseRule: 'Add license header.',
        },
    },
    defaultOptions: [],
    create(context) {
        const sourceCode = context.sourceCode;
        const comments = sourceCode.getAllComments();
        let insertAfter = [0, 0];
        let header = null;
        for (let index = 0; index < 2; index++) {
            const comment = comments[index];
            if (!comment) {
                break;
            }
            if (comment.type === 'Shebang' ||
                (comment.type === 'Line' && comment.value.startsWith('#!'))) {
                insertAfter = comment.range;
                continue;
            }
            if (comment.type === 'Block') {
                header = comment;
                break;
            }
        }
        return {
            Program(node) {
                if (context.filename.endsWith('.json')) {
                    return;
                }
                if (header &&
                    (header.value.includes('@license') ||
                        header.value.includes('License') ||
                        header.value.includes('Copyright'))) {
                    return;
                }
                if (!header || !header.value.includes('@license')) {
                    context.report({
                        node: node,
                        messageId: 'licenseRule',
                        fix(fixer) {
                            return fixer.insertTextAfterRange(insertAfter, licenseHeader);
                        },
                    });
                }
            },
        };
    },
});
module.exports = enforceLicenseRule;
//# sourceMappingURL=check-license.js.map