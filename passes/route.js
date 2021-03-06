// mark route objects

var lint = require('../lib/lint');
var deepApply = require('../lib/deep-apply');

var routeAnnotatorPass = module.exports = {};
routeAnnotatorPass.name = 'angular:annotator:route';
routeAnnotatorPass.prereqs = [
  'angular:annotator:mark'
];

routeAnnotatorPass.run = function (ast, info) {
  deepApply(ast, [{
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": {
        "ngModule": true
      },
      "property": {
        "type": "Identifier",
        "name": "config"
      }
    }
  }], function (routeChunk) {
    deepApply(routeChunk, [{
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "property": {
          "type": "Identifier",
          "name": "when"
        }
      },
      "arguments": [ {},
        {
          "type": "ObjectExpression"
        }
      ]
    }],function (whenChunk) {
      deepApply(whenChunk, [{
        "type": "Property",
        "key": {
          "type": "Identifier",
          "name": "controller"
        },
        "value": {
          "type": "FunctionExpression"
        }
      }], function (controllerChunk) {
        controllerChunk.value = lint('controller route', controllerChunk.value);
      });

      deepApply(whenChunk, [{
        "type": "Property",
        "key": {
          "type": "Identifier",
          "name": "resolve"
        },
        "value": {
          "type": "ObjectExpression"
        }
      }], function (resolveChunk) {
        deepApply(resolveChunk, [{
          "type": "Property",
          "key": {
            "type": "Identifier"
          },
          "value": {
            "type": "FunctionExpression"
          }
        }], function (resolveIdentifierChunk) {
          resolveIdentifierChunk.value = lint(resolveIdentifierChunk.value);
        });
      });
    });
  });
};
