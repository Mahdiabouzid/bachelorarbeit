// parser.js
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const filePath = process.argv[2];

if (!filePath) {
    console.error(JSON.stringify({ error: "No file path provided." }));
    process.exit(1);
}

try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const ast = parser.parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'], // Enable JSX and TypeScript syntax
    });

    const imports = new Set();
    const exports = new Set();

    traverse(ast, {
        ImportDeclaration(path) {
            if (path.node.source) {
                imports.add(path.node.source.value);
            }
        },
        CallExpression(path) {
            if (path.node.callee.name === 'require' && path.node.arguments.length > 0) {
                 if (path.node.arguments[0].type === 'StringLiteral') {
                    imports.add(path.node.arguments[0].value);
                }
            }
        },
        ExportNamedDeclaration(path) {
            if (path.node.specifiers.length > 0) {
                path.node.specifiers.forEach(spec => exports.add(spec.exported.name));
            }
            if (path.node.declaration) {
                if (path.node.declaration.id) {
                     exports.add(path.node.declaration.id.name);
                } else if (path.node.declaration.declarations) {
                    path.node.declaration.declarations.forEach(d => exports.add(d.id.name));
                }
            }
        },
        ExportDefaultDeclaration() {
            exports.add('default');
        },
        ExportAllDeclaration(path) {
            exports.add(`* from ${path.node.source.value}`);
        }
    });

    console.log(JSON.stringify({
        imports: [...imports],
        exports: [...exports],
        error: null
    }));

} catch (e) {
    console.error(JSON.stringify({ error: e.message, imports: [], exports: [] }));
    process.exit(1);
}