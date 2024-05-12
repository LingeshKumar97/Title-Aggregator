"use strict";
const utils_1 = require("@typescript-eslint/utils");
const usingSymbols = ['ElementHandle', 'JSHandle'];
const createRule = utils_1.ESLintUtils.RuleCreator(name => {
    return `https://github.com/puppeteer/puppeteer/tree/main/tools/eslint/${name}.js`;
});
const useUsingRule = createRule({
    name: 'use-using',
    meta: {
        docs: {
            description: "Requires 'using' for element/JS handles.",
            requiresTypeChecking: true,
        },
        hasSuggestions: true,
        messages: {
            useUsing: "Use 'using'.",
            useUsingFix: "Replace with 'using' to ignore.",
        },
        schema: [],
        type: 'problem',
    },
    defaultOptions: [],
    create(context) {
        const services = utils_1.ESLintUtils.getParserServices(context);
        const checker = services.program.getTypeChecker();
        return {
            VariableDeclaration(node) {
                if (['using', 'await using'].includes(node.kind) || node.declare) {
                    return;
                }
                for (const declaration of node.declarations) {
                    if (declaration.id.type === utils_1.TSESTree.AST_NODE_TYPES.Identifier) {
                        const tsNode = services.esTreeNodeToTSNodeMap.get(declaration.id);
                        const type = checker.getTypeAtLocation(tsNode);
                        let isElementHandleReference = false;
                        if (type.isUnionOrIntersection()) {
                            for (const member of type.types) {
                                if (member.symbol !== undefined &&
                                    usingSymbols.includes(member.symbol.escapedName)) {
                                    isElementHandleReference = true;
                                    break;
                                }
                            }
                        }
                        else {
                            isElementHandleReference =
                                type.symbol !== undefined
                                    ? usingSymbols.includes(type.symbol.escapedName)
                                    : false;
                        }
                        if (isElementHandleReference) {
                            context.report({
                                node: declaration.id,
                                messageId: 'useUsing',
                                suggest: [
                                    {
                                        messageId: 'useUsingFix',
                                        fix(fixer) {
                                            return fixer.replaceTextRange([node.range[0], node.range[0] + node.kind.length], 'using');
                                        },
                                    },
                                ],
                            });
                        }
                    }
                }
            },
        };
    },
});
module.exports = useUsingRule;
//# sourceMappingURL=use-using.js.map