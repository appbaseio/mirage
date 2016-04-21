var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ListWrapper, StringMapWrapper, SetWrapper } from 'angular2/src/facade/collection';
import { RegExpWrapper, isPresent, StringWrapper, isBlank } from 'angular2/src/facade/lang';
import { Injectable, Inject, OpaqueToken, Optional } from 'angular2/core';
import { CONST_EXPR } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { Parser } from 'angular2/src/core/change_detection/change_detection';
import { HtmlParser } from './html_parser';
import { splitNsName, mergeNsAndName } from './html_tags';
import { ParseError } from './parse_util';
import { RecursiveAstVisitor } from 'angular2/src/core/change_detection/parser/ast';
import { ElementAst, BoundElementPropertyAst, BoundEventAst, VariableAst, templateVisitAll, TextAst, BoundTextAst, EmbeddedTemplateAst, AttrAst, NgContentAst, PropertyBindingType, DirectiveAst, BoundDirectivePropertyAst } from './template_ast';
import { CssSelector, SelectorMatcher } from 'angular2/src/compiler/selector';
import { ElementSchemaRegistry } from 'angular2/src/compiler/schema/element_schema_registry';
import { preparseElement, PreparsedElementType } from './template_preparser';
import { isStyleUrlResolvable } from './style_url_resolver';
import { htmlVisitAll } from './html_ast';
import { splitAtColon } from './util';
// Group 1 = "bind-"
// Group 2 = "var-" or "#"
// Group 3 = "on-"
// Group 4 = "bindon-"
// Group 5 = the identifier after "bind-", "var-/#", or "on-"
// Group 6 = identifier inside [()]
// Group 7 = identifier inside []
// Group 8 = identifier inside ()
var BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(var-|#)|(on-)|(bindon-))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/g;
const TEMPLATE_ELEMENT = 'template';
const TEMPLATE_ATTR = 'template';
const TEMPLATE_ATTR_PREFIX = '*';
const CLASS_ATTR = 'class';
var PROPERTY_PARTS_SEPARATOR = '.';
const ATTRIBUTE_PREFIX = 'attr';
const CLASS_PREFIX = 'class';
const STYLE_PREFIX = 'style';
var TEXT_CSS_SELECTOR = CssSelector.parse('*')[0];
/**
 * Provides an array of {@link TemplateAstVisitor}s which will be used to transform
 * parsed templates before compilation is invoked, allowing custom expression syntax
 * and other advanced transformations.
 *
 * This is currently an internal-only feature and not meant for general use.
 */
export const TEMPLATE_TRANSFORMS = CONST_EXPR(new OpaqueToken('TemplateTransforms'));
export class TemplateParseError extends ParseError {
    constructor(message, span) {
        super(span, message);
    }
}
export class TemplateParseResult {
    constructor(templateAst, errors) {
        this.templateAst = templateAst;
        this.errors = errors;
    }
}
export let TemplateParser = class TemplateParser {
    constructor(_exprParser, _schemaRegistry, _htmlParser, transforms) {
        this._exprParser = _exprParser;
        this._schemaRegistry = _schemaRegistry;
        this._htmlParser = _htmlParser;
        this.transforms = transforms;
    }
    parse(template, directives, pipes, templateUrl) {
        var result = this.tryParse(template, directives, pipes, templateUrl);
        if (isPresent(result.errors)) {
            var errorString = result.errors.join('\n');
            throw new BaseException(`Template parse errors:\n${errorString}`);
        }
        return result.templateAst;
    }
    tryParse(template, directives, pipes, templateUrl) {
        var parseVisitor = new TemplateParseVisitor(directives, pipes, this._exprParser, this._schemaRegistry);
        var htmlAstWithErrors = this._htmlParser.parse(template, templateUrl);
        var result = htmlVisitAll(parseVisitor, htmlAstWithErrors.rootNodes, EMPTY_COMPONENT);
        var errors = htmlAstWithErrors.errors.concat(parseVisitor.errors);
        if (errors.length > 0) {
            return new TemplateParseResult(result, errors);
        }
        if (isPresent(this.transforms)) {
            this.transforms.forEach((transform) => { result = templateVisitAll(transform, result); });
        }
        return new TemplateParseResult(result);
    }
};
TemplateParser = __decorate([
    Injectable(),
    __param(3, Optional()),
    __param(3, Inject(TEMPLATE_TRANSFORMS)), 
    __metadata('design:paramtypes', [Parser, ElementSchemaRegistry, HtmlParser, Array])
], TemplateParser);
class TemplateParseVisitor {
    constructor(directives, pipes, _exprParser, _schemaRegistry) {
        this._exprParser = _exprParser;
        this._schemaRegistry = _schemaRegistry;
        this.errors = [];
        this.directivesIndex = new Map();
        this.ngContentCount = 0;
        this.selectorMatcher = new SelectorMatcher();
        ListWrapper.forEachWithIndex(directives, (directive, index) => {
            var selector = CssSelector.parse(directive.selector);
            this.selectorMatcher.addSelectables(selector, directive);
            this.directivesIndex.set(directive, index);
        });
        this.pipesByName = new Map();
        pipes.forEach(pipe => this.pipesByName.set(pipe.name, pipe));
    }
    _reportError(message, sourceSpan) {
        this.errors.push(new TemplateParseError(message, sourceSpan));
    }
    _parseInterpolation(value, sourceSpan) {
        var sourceInfo = sourceSpan.start.toString();
        try {
            var ast = this._exprParser.parseInterpolation(value, sourceInfo);
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    }
    _parseAction(value, sourceSpan) {
        var sourceInfo = sourceSpan.start.toString();
        try {
            var ast = this._exprParser.parseAction(value, sourceInfo);
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    }
    _parseBinding(value, sourceSpan) {
        var sourceInfo = sourceSpan.start.toString();
        try {
            var ast = this._exprParser.parseBinding(value, sourceInfo);
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    }
    _parseTemplateBindings(value, sourceSpan) {
        var sourceInfo = sourceSpan.start.toString();
        try {
            var bindings = this._exprParser.parseTemplateBindings(value, sourceInfo);
            bindings.forEach((binding) => {
                if (isPresent(binding.expression)) {
                    this._checkPipes(binding.expression, sourceSpan);
                }
            });
            return bindings;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return [];
        }
    }
    _checkPipes(ast, sourceSpan) {
        if (isPresent(ast)) {
            var collector = new PipeCollector();
            ast.visit(collector);
            collector.pipes.forEach((pipeName) => {
                if (!this.pipesByName.has(pipeName)) {
                    this._reportError(`The pipe '${pipeName}' could not be found`, sourceSpan);
                }
            });
        }
    }
    visitText(ast, component) {
        var ngContentIndex = component.findNgContentIndex(TEXT_CSS_SELECTOR);
        var expr = this._parseInterpolation(ast.value, ast.sourceSpan);
        if (isPresent(expr)) {
            return new BoundTextAst(expr, ngContentIndex, ast.sourceSpan);
        }
        else {
            return new TextAst(ast.value, ngContentIndex, ast.sourceSpan);
        }
    }
    visitAttr(ast, contex) {
        return new AttrAst(ast.name, ast.value, ast.sourceSpan);
    }
    visitComment(ast, context) { return null; }
    visitElement(element, component) {
        var nodeName = element.name;
        var preparsedElement = preparseElement(element);
        if (preparsedElement.type === PreparsedElementType.SCRIPT ||
            preparsedElement.type === PreparsedElementType.STYLE) {
            // Skipping <script> for security reasons
            // Skipping <style> as we already processed them
            // in the StyleCompiler
            return null;
        }
        if (preparsedElement.type === PreparsedElementType.STYLESHEET &&
            isStyleUrlResolvable(preparsedElement.hrefAttr)) {
            // Skipping stylesheets with either relative urls or package scheme as we already processed
            // them in the StyleCompiler
            return null;
        }
        var matchableAttrs = [];
        var elementOrDirectiveProps = [];
        var vars = [];
        var events = [];
        var templateElementOrDirectiveProps = [];
        var templateVars = [];
        var templateMatchableAttrs = [];
        var hasInlineTemplates = false;
        var attrs = [];
        element.attrs.forEach(attr => {
            var hasBinding = this._parseAttr(attr, matchableAttrs, elementOrDirectiveProps, events, vars);
            var hasTemplateBinding = this._parseInlineTemplateBinding(attr, templateMatchableAttrs, templateElementOrDirectiveProps, templateVars);
            if (!hasBinding && !hasTemplateBinding) {
                // don't include the bindings as attributes as well in the AST
                attrs.push(this.visitAttr(attr, null));
                matchableAttrs.push([attr.name, attr.value]);
            }
            if (hasTemplateBinding) {
                hasInlineTemplates = true;
            }
        });
        var lcElName = splitNsName(nodeName.toLowerCase())[1];
        var isTemplateElement = lcElName == TEMPLATE_ELEMENT;
        var elementCssSelector = createElementCssSelector(nodeName, matchableAttrs);
        var directives = this._createDirectiveAsts(element.name, this._parseDirectives(this.selectorMatcher, elementCssSelector), elementOrDirectiveProps, isTemplateElement ? [] : vars, element.sourceSpan);
        var elementProps = this._createElementPropertyAsts(element.name, elementOrDirectiveProps, directives);
        var children = htmlVisitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children, Component.create(directives));
        // Override the actual selector when the `ngProjectAs` attribute is provided
        var projectionSelector = isPresent(preparsedElement.projectAs) ?
            CssSelector.parse(preparsedElement.projectAs)[0] :
            elementCssSelector;
        var ngContentIndex = component.findNgContentIndex(projectionSelector);
        var parsedElement;
        if (preparsedElement.type === PreparsedElementType.NG_CONTENT) {
            if (isPresent(element.children) && element.children.length > 0) {
                this._reportError(`<ng-content> element cannot have content. <ng-content> must be immediately followed by </ng-content>`, element.sourceSpan);
            }
            parsedElement = new NgContentAst(this.ngContentCount++, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan);
        }
        else if (isTemplateElement) {
            this._assertAllEventsPublishedByDirectives(directives, events);
            this._assertNoComponentsNorElementBindingsOnTemplate(directives, elementProps, element.sourceSpan);
            parsedElement =
                new EmbeddedTemplateAst(attrs, events, vars, directives, children, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan);
        }
        else {
            this._assertOnlyOneComponent(directives, element.sourceSpan);
            var elementExportAsVars = vars.filter(varAst => varAst.value.length === 0);
            let ngContentIndex = hasInlineTemplates ? null : component.findNgContentIndex(projectionSelector);
            parsedElement =
                new ElementAst(nodeName, attrs, elementProps, events, elementExportAsVars, directives, children, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan);
        }
        if (hasInlineTemplates) {
            var templateCssSelector = createElementCssSelector(TEMPLATE_ELEMENT, templateMatchableAttrs);
            var templateDirectives = this._createDirectiveAsts(element.name, this._parseDirectives(this.selectorMatcher, templateCssSelector), templateElementOrDirectiveProps, [], element.sourceSpan);
            var templateElementProps = this._createElementPropertyAsts(element.name, templateElementOrDirectiveProps, templateDirectives);
            this._assertNoComponentsNorElementBindingsOnTemplate(templateDirectives, templateElementProps, element.sourceSpan);
            parsedElement = new EmbeddedTemplateAst([], [], templateVars, templateDirectives, [parsedElement], ngContentIndex, element.sourceSpan);
        }
        return parsedElement;
    }
    _parseInlineTemplateBinding(attr, targetMatchableAttrs, targetProps, targetVars) {
        var templateBindingsSource = null;
        if (attr.name == TEMPLATE_ATTR) {
            templateBindingsSource = attr.value;
        }
        else if (attr.name.startsWith(TEMPLATE_ATTR_PREFIX)) {
            var key = attr.name.substring(TEMPLATE_ATTR_PREFIX.length); // remove the star
            templateBindingsSource = (attr.value.length == 0) ? key : key + ' ' + attr.value;
        }
        if (isPresent(templateBindingsSource)) {
            var bindings = this._parseTemplateBindings(templateBindingsSource, attr.sourceSpan);
            for (var i = 0; i < bindings.length; i++) {
                var binding = bindings[i];
                if (binding.keyIsVar) {
                    targetVars.push(new VariableAst(binding.key, binding.name, attr.sourceSpan));
                    targetMatchableAttrs.push([binding.key, binding.name]);
                }
                else if (isPresent(binding.expression)) {
                    this._parsePropertyAst(binding.key, binding.expression, attr.sourceSpan, targetMatchableAttrs, targetProps);
                }
                else {
                    targetMatchableAttrs.push([binding.key, '']);
                    this._parseLiteralAttr(binding.key, null, attr.sourceSpan, targetProps);
                }
            }
            return true;
        }
        return false;
    }
    _parseAttr(attr, targetMatchableAttrs, targetProps, targetEvents, targetVars) {
        var attrName = this._normalizeAttributeName(attr.name);
        var attrValue = attr.value;
        var bindParts = RegExpWrapper.firstMatch(BIND_NAME_REGEXP, attrName);
        var hasBinding = false;
        if (isPresent(bindParts)) {
            hasBinding = true;
            if (isPresent(bindParts[1])) {
                this._parseProperty(bindParts[5], attrValue, attr.sourceSpan, targetMatchableAttrs, targetProps);
            }
            else if (isPresent(bindParts[2])) {
                var identifier = bindParts[5];
                this._parseVariable(identifier, attrValue, attr.sourceSpan, targetVars);
            }
            else if (isPresent(bindParts[3])) {
                this._parseEvent(bindParts[5], attrValue, attr.sourceSpan, targetMatchableAttrs, targetEvents);
            }
            else if (isPresent(bindParts[4])) {
                this._parseProperty(bindParts[5], attrValue, attr.sourceSpan, targetMatchableAttrs, targetProps);
                this._parseAssignmentEvent(bindParts[5], attrValue, attr.sourceSpan, targetMatchableAttrs, targetEvents);
            }
            else if (isPresent(bindParts[6])) {
                this._parseProperty(bindParts[6], attrValue, attr.sourceSpan, targetMatchableAttrs, targetProps);
                this._parseAssignmentEvent(bindParts[6], attrValue, attr.sourceSpan, targetMatchableAttrs, targetEvents);
            }
            else if (isPresent(bindParts[7])) {
                this._parseProperty(bindParts[7], attrValue, attr.sourceSpan, targetMatchableAttrs, targetProps);
            }
            else if (isPresent(bindParts[8])) {
                this._parseEvent(bindParts[8], attrValue, attr.sourceSpan, targetMatchableAttrs, targetEvents);
            }
        }
        else {
            hasBinding = this._parsePropertyInterpolation(attrName, attrValue, attr.sourceSpan, targetMatchableAttrs, targetProps);
        }
        if (!hasBinding) {
            this._parseLiteralAttr(attrName, attrValue, attr.sourceSpan, targetProps);
        }
        return hasBinding;
    }
    _normalizeAttributeName(attrName) {
        return attrName.toLowerCase().startsWith('data-') ? attrName.substring(5) : attrName;
    }
    _parseVariable(identifier, value, sourceSpan, targetVars) {
        if (identifier.indexOf('-') > -1) {
            this._reportError(`"-" is not allowed in variable names`, sourceSpan);
        }
        targetVars.push(new VariableAst(identifier, value, sourceSpan));
    }
    _parseProperty(name, expression, sourceSpan, targetMatchableAttrs, targetProps) {
        this._parsePropertyAst(name, this._parseBinding(expression, sourceSpan), sourceSpan, targetMatchableAttrs, targetProps);
    }
    _parsePropertyInterpolation(name, value, sourceSpan, targetMatchableAttrs, targetProps) {
        var expr = this._parseInterpolation(value, sourceSpan);
        if (isPresent(expr)) {
            this._parsePropertyAst(name, expr, sourceSpan, targetMatchableAttrs, targetProps);
            return true;
        }
        return false;
    }
    _parsePropertyAst(name, ast, sourceSpan, targetMatchableAttrs, targetProps) {
        targetMatchableAttrs.push([name, ast.source]);
        targetProps.push(new BoundElementOrDirectiveProperty(name, ast, false, sourceSpan));
    }
    _parseAssignmentEvent(name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        this._parseEvent(`${name}Change`, `${expression}=$event`, sourceSpan, targetMatchableAttrs, targetEvents);
    }
    _parseEvent(name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        // long format: 'target: eventName'
        var parts = splitAtColon(name, [null, name]);
        var target = parts[0];
        var eventName = parts[1];
        var ast = this._parseAction(expression, sourceSpan);
        targetMatchableAttrs.push([name, ast.source]);
        targetEvents.push(new BoundEventAst(eventName, target, ast, sourceSpan));
        // Don't detect directives for event names for now,
        // so don't add the event name to the matchableAttrs
    }
    _parseLiteralAttr(name, value, sourceSpan, targetProps) {
        targetProps.push(new BoundElementOrDirectiveProperty(name, this._exprParser.wrapLiteralPrimitive(value, ''), true, sourceSpan));
    }
    _parseDirectives(selectorMatcher, elementCssSelector) {
        var directives = [];
        selectorMatcher.match(elementCssSelector, (selector, directive) => { directives.push(directive); });
        // Need to sort the directives so that we get consistent results throughout,
        // as selectorMatcher uses Maps inside.
        // Also need to make components the first directive in the array
        ListWrapper.sort(directives, (dir1, dir2) => {
            var dir1Comp = dir1.isComponent;
            var dir2Comp = dir2.isComponent;
            if (dir1Comp && !dir2Comp) {
                return -1;
            }
            else if (!dir1Comp && dir2Comp) {
                return 1;
            }
            else {
                return this.directivesIndex.get(dir1) - this.directivesIndex.get(dir2);
            }
        });
        return directives;
    }
    _createDirectiveAsts(elementName, directives, props, possibleExportAsVars, sourceSpan) {
        var matchedVariables = new Set();
        var directiveAsts = directives.map((directive) => {
            var hostProperties = [];
            var hostEvents = [];
            var directiveProperties = [];
            this._createDirectiveHostPropertyAsts(elementName, directive.hostProperties, sourceSpan, hostProperties);
            this._createDirectiveHostEventAsts(directive.hostListeners, sourceSpan, hostEvents);
            this._createDirectivePropertyAsts(directive.inputs, props, directiveProperties);
            var exportAsVars = [];
            possibleExportAsVars.forEach((varAst) => {
                if ((varAst.value.length === 0 && directive.isComponent) ||
                    (directive.exportAs == varAst.value)) {
                    exportAsVars.push(varAst);
                    matchedVariables.add(varAst.name);
                }
            });
            return new DirectiveAst(directive, directiveProperties, hostProperties, hostEvents, exportAsVars, sourceSpan);
        });
        possibleExportAsVars.forEach((varAst) => {
            if (varAst.value.length > 0 && !SetWrapper.has(matchedVariables, varAst.name)) {
                this._reportError(`There is no directive with "exportAs" set to "${varAst.value}"`, varAst.sourceSpan);
            }
        });
        return directiveAsts;
    }
    _createDirectiveHostPropertyAsts(elementName, hostProps, sourceSpan, targetPropertyAsts) {
        if (isPresent(hostProps)) {
            StringMapWrapper.forEach(hostProps, (expression, propName) => {
                var exprAst = this._parseBinding(expression, sourceSpan);
                targetPropertyAsts.push(this._createElementPropertyAst(elementName, propName, exprAst, sourceSpan));
            });
        }
    }
    _createDirectiveHostEventAsts(hostListeners, sourceSpan, targetEventAsts) {
        if (isPresent(hostListeners)) {
            StringMapWrapper.forEach(hostListeners, (expression, propName) => {
                this._parseEvent(propName, expression, sourceSpan, [], targetEventAsts);
            });
        }
    }
    _createDirectivePropertyAsts(directiveProperties, boundProps, targetBoundDirectiveProps) {
        if (isPresent(directiveProperties)) {
            var boundPropsByName = new Map();
            boundProps.forEach(boundProp => {
                var prevValue = boundPropsByName.get(boundProp.name);
                if (isBlank(prevValue) || prevValue.isLiteral) {
                    // give [a]="b" a higher precedence than a="b" on the same element
                    boundPropsByName.set(boundProp.name, boundProp);
                }
            });
            StringMapWrapper.forEach(directiveProperties, (elProp, dirProp) => {
                var boundProp = boundPropsByName.get(elProp);
                // Bindings are optional, so this binding only needs to be set up if an expression is given.
                if (isPresent(boundProp)) {
                    targetBoundDirectiveProps.push(new BoundDirectivePropertyAst(dirProp, boundProp.name, boundProp.expression, boundProp.sourceSpan));
                }
            });
        }
    }
    _createElementPropertyAsts(elementName, props, directives) {
        var boundElementProps = [];
        var boundDirectivePropsIndex = new Map();
        directives.forEach((directive) => {
            directive.inputs.forEach((prop) => {
                boundDirectivePropsIndex.set(prop.templateName, prop);
            });
        });
        props.forEach((prop) => {
            if (!prop.isLiteral && isBlank(boundDirectivePropsIndex.get(prop.name))) {
                boundElementProps.push(this._createElementPropertyAst(elementName, prop.name, prop.expression, prop.sourceSpan));
            }
        });
        return boundElementProps;
    }
    _createElementPropertyAst(elementName, name, ast, sourceSpan) {
        var unit = null;
        var bindingType;
        var boundPropertyName;
        var parts = name.split(PROPERTY_PARTS_SEPARATOR);
        if (parts.length === 1) {
            boundPropertyName = this._schemaRegistry.getMappedPropName(parts[0]);
            bindingType = PropertyBindingType.Property;
            if (!this._schemaRegistry.hasProperty(elementName, boundPropertyName)) {
                this._reportError(`Can't bind to '${boundPropertyName}' since it isn't a known native property`, sourceSpan);
            }
        }
        else {
            if (parts[0] == ATTRIBUTE_PREFIX) {
                boundPropertyName = parts[1];
                let nsSeparatorIdx = boundPropertyName.indexOf(':');
                if (nsSeparatorIdx > -1) {
                    let ns = boundPropertyName.substring(0, nsSeparatorIdx);
                    let name = boundPropertyName.substring(nsSeparatorIdx + 1);
                    boundPropertyName = mergeNsAndName(ns, name);
                }
                bindingType = PropertyBindingType.Attribute;
            }
            else if (parts[0] == CLASS_PREFIX) {
                boundPropertyName = parts[1];
                bindingType = PropertyBindingType.Class;
            }
            else if (parts[0] == STYLE_PREFIX) {
                unit = parts.length > 2 ? parts[2] : null;
                boundPropertyName = parts[1];
                bindingType = PropertyBindingType.Style;
            }
            else {
                this._reportError(`Invalid property name '${name}'`, sourceSpan);
                bindingType = null;
            }
        }
        return new BoundElementPropertyAst(boundPropertyName, bindingType, ast, unit, sourceSpan);
    }
    _findComponentDirectiveNames(directives) {
        var componentTypeNames = [];
        directives.forEach(directive => {
            var typeName = directive.directive.type.name;
            if (directive.directive.isComponent) {
                componentTypeNames.push(typeName);
            }
        });
        return componentTypeNames;
    }
    _assertOnlyOneComponent(directives, sourceSpan) {
        var componentTypeNames = this._findComponentDirectiveNames(directives);
        if (componentTypeNames.length > 1) {
            this._reportError(`More than one component: ${componentTypeNames.join(',')}`, sourceSpan);
        }
    }
    _assertNoComponentsNorElementBindingsOnTemplate(directives, elementProps, sourceSpan) {
        var componentTypeNames = this._findComponentDirectiveNames(directives);
        if (componentTypeNames.length > 0) {
            this._reportError(`Components on an embedded template: ${componentTypeNames.join(',')}`, sourceSpan);
        }
        elementProps.forEach(prop => {
            this._reportError(`Property binding ${prop.name} not used by any directive on an embedded template`, sourceSpan);
        });
    }
    _assertAllEventsPublishedByDirectives(directives, events) {
        var allDirectiveEvents = new Set();
        directives.forEach(directive => {
            StringMapWrapper.forEach(directive.directive.outputs, (eventName, _) => { allDirectiveEvents.add(eventName); });
        });
        events.forEach(event => {
            if (isPresent(event.target) || !SetWrapper.has(allDirectiveEvents, event.name)) {
                this._reportError(`Event binding ${event.fullName} not emitted by any directive on an embedded template`, event.sourceSpan);
            }
        });
    }
}
class NonBindableVisitor {
    visitElement(ast, component) {
        var preparsedElement = preparseElement(ast);
        if (preparsedElement.type === PreparsedElementType.SCRIPT ||
            preparsedElement.type === PreparsedElementType.STYLE ||
            preparsedElement.type === PreparsedElementType.STYLESHEET) {
            // Skipping <script> for security reasons
            // Skipping <style> and stylesheets as we already processed them
            // in the StyleCompiler
            return null;
        }
        var attrNameAndValues = ast.attrs.map(attrAst => [attrAst.name, attrAst.value]);
        var selector = createElementCssSelector(ast.name, attrNameAndValues);
        var ngContentIndex = component.findNgContentIndex(selector);
        var children = htmlVisitAll(this, ast.children, EMPTY_COMPONENT);
        return new ElementAst(ast.name, htmlVisitAll(this, ast.attrs), [], [], [], [], children, ngContentIndex, ast.sourceSpan);
    }
    visitComment(ast, context) { return null; }
    visitAttr(ast, context) {
        return new AttrAst(ast.name, ast.value, ast.sourceSpan);
    }
    visitText(ast, component) {
        var ngContentIndex = component.findNgContentIndex(TEXT_CSS_SELECTOR);
        return new TextAst(ast.value, ngContentIndex, ast.sourceSpan);
    }
}
class BoundElementOrDirectiveProperty {
    constructor(name, expression, isLiteral, sourceSpan) {
        this.name = name;
        this.expression = expression;
        this.isLiteral = isLiteral;
        this.sourceSpan = sourceSpan;
    }
}
export function splitClasses(classAttrValue) {
    return StringWrapper.split(classAttrValue.trim(), /\s+/g);
}
class Component {
    constructor(ngContentIndexMatcher, wildcardNgContentIndex) {
        this.ngContentIndexMatcher = ngContentIndexMatcher;
        this.wildcardNgContentIndex = wildcardNgContentIndex;
    }
    static create(directives) {
        if (directives.length === 0 || !directives[0].directive.isComponent) {
            return EMPTY_COMPONENT;
        }
        var matcher = new SelectorMatcher();
        var ngContentSelectors = directives[0].directive.template.ngContentSelectors;
        var wildcardNgContentIndex = null;
        for (var i = 0; i < ngContentSelectors.length; i++) {
            var selector = ngContentSelectors[i];
            if (StringWrapper.equals(selector, '*')) {
                wildcardNgContentIndex = i;
            }
            else {
                matcher.addSelectables(CssSelector.parse(ngContentSelectors[i]), i);
            }
        }
        return new Component(matcher, wildcardNgContentIndex);
    }
    findNgContentIndex(selector) {
        var ngContentIndices = [];
        this.ngContentIndexMatcher.match(selector, (selector, ngContentIndex) => { ngContentIndices.push(ngContentIndex); });
        ListWrapper.sort(ngContentIndices);
        if (isPresent(this.wildcardNgContentIndex)) {
            ngContentIndices.push(this.wildcardNgContentIndex);
        }
        return ngContentIndices.length > 0 ? ngContentIndices[0] : null;
    }
}
function createElementCssSelector(elementName, matchableAttrs) {
    var cssSelector = new CssSelector();
    let elNameNoNs = splitNsName(elementName)[1];
    cssSelector.setElement(elNameNoNs);
    for (var i = 0; i < matchableAttrs.length; i++) {
        let attrName = matchableAttrs[i][0];
        let attrNameNoNs = splitNsName(attrName)[1];
        let attrValue = matchableAttrs[i][1];
        cssSelector.addAttribute(attrNameNoNs, attrValue);
        if (attrName.toLowerCase() == CLASS_ATTR) {
            var classes = splitClasses(attrValue);
            classes.forEach(className => cssSelector.addClassName(className));
        }
    }
    return cssSelector;
}
var EMPTY_COMPONENT = new Component(new SelectorMatcher(), null);
var NON_BINDABLE_VISITOR = new NonBindableVisitor();
export class PipeCollector extends RecursiveAstVisitor {
    constructor(...args) {
        super(...args);
        this.pipes = new Set();
    }
    visitPipe(ast) {
        this.pipes.add(ast.name);
        ast.exp.visit(this);
        this.visitAll(ast.args);
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1vWERPNHAydi50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3RlbXBsYXRlX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7T0FBTyxFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDakYsRUFBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUMsTUFBTSwwQkFBMEI7T0FDbEYsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlO09BQ2hFLEVBQUMsVUFBVSxFQUFDLE1BQU0sMEJBQTBCO09BQzVDLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BQ3JELEVBQUMsTUFBTSxFQUFxQixNQUFNLHFEQUFxRDtPQUd2RixFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWU7T0FDakMsRUFBQyxXQUFXLEVBQUUsY0FBYyxFQUFDLE1BQU0sYUFBYTtPQUNoRCxFQUFrQixVQUFVLEVBQWdCLE1BQU0sY0FBYztPQUNoRSxFQUFDLG1CQUFtQixFQUFjLE1BQU0sK0NBQStDO09BRXZGLEVBQ0wsVUFBVSxFQUNWLHVCQUF1QixFQUN2QixhQUFhLEVBQ2IsV0FBVyxFQUdYLGdCQUFnQixFQUNoQixPQUFPLEVBQ1AsWUFBWSxFQUNaLG1CQUFtQixFQUNuQixPQUFPLEVBQ1AsWUFBWSxFQUNaLG1CQUFtQixFQUNuQixZQUFZLEVBQ1oseUJBQXlCLEVBQzFCLE1BQU0sZ0JBQWdCO09BQ2hCLEVBQUMsV0FBVyxFQUFFLGVBQWUsRUFBQyxNQUFNLGdDQUFnQztPQUVwRSxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0RBQXNEO09BQ25GLEVBQUMsZUFBZSxFQUFvQixvQkFBb0IsRUFBQyxNQUFNLHNC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R0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksV0FBVyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUNyQixDQUFDO0FBRUQsSUFBSSxlQUFlLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxlQUFlLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNqRSxJQUFJLG9CQUFvQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztBQUdwRCxtQ0FBbUMsbUJBQW1CO0lBQXREO1FBQW1DLGVBQW1CO1FBQ3BELFVBQUssR0FBZ0IsSUFBSSxHQUFHLEVBQVUsQ0FBQztJQU96QyxDQUFDO0lBTkMsU0FBUyxDQUFDLEdBQWdCO1FBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdFdyYXBwZXIsIFN0cmluZ01hcFdyYXBwZXIsIFNldFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1JlZ0V4cFdyYXBwZXIsIGlzUHJlc2VudCwgU3RyaW5nV3JhcHBlciwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7SW5qZWN0YWJsZSwgSW5qZWN0LCBPcGFxdWVUb2tlbiwgT3B0aW9uYWx9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtDT05TVF9FWFBSfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtQYXJzZXIsIEFTVCwgQVNUV2l0aFNvdXJjZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uJztcbmltcG9ydCB7VGVtcGxhdGVCaW5kaW5nfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL3BhcnNlci9hc3QnO1xuaW1wb3J0IHtDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsIENvbXBpbGVQaXBlTWV0YWRhdGF9IGZyb20gJy4vZGlyZWN0aXZlX21ldGFkYXRhJztcbmltcG9ydCB7SHRtbFBhcnNlcn0gZnJvbSAnLi9odG1sX3BhcnNlcic7XG5pbXBvcnQge3NwbGl0TnNOYW1lLCBtZXJnZU5zQW5kTmFtZX0gZnJvbSAnLi9odG1sX3RhZ3MnO1xuaW1wb3J0IHtQYXJzZVNvdXJjZVNwYW4sIFBhcnNlRXJyb3IsIFBhcnNlTG9jYXRpb259IGZyb20gJy4vcGFyc2VfdXRpbCc7XG5pbXBvcnQge1JlY3Vyc2l2ZUFzdFZpc2l0b3IsIEJpbmRpbmdQaXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL3BhcnNlci9hc3QnO1xuXG5pbXBvcnQge1xuICBFbGVtZW50QXN0LFxuICBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCxcbiAgQm91bmRFdmVudEFzdCxcbiAgVmFyaWFibGVBc3QsXG4gIFRlbXBsYXRlQXN0LFxuICBUZW1wbGF0ZUFzdFZpc2l0b3IsXG4gIHRlbXBsYXRlVmlzaXRBbGwsXG4gIFRleHRBc3QsXG4gIEJvdW5kVGV4dEFzdCxcbiAgRW1iZWRkZWRUZW1wbGF0ZUFzdCxcbiAgQXR0ckFzdCxcbiAgTmdDb250ZW50QXN0LFxuICBQcm9wZXJ0eUJpbmRpbmdUeXBlLFxuICBEaXJlY3RpdmVBc3QsXG4gIEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3Rcbn0gZnJvbSAnLi90ZW1wbGF0ZV9hc3QnO1xuaW1wb3J0IHtDc3NTZWxlY3RvciwgU2VsZWN0b3JNYXRjaGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvc2VsZWN0b3InO1xuXG5pbXBvcnQge0VsZW1lbnRTY2hlbWFSZWdpc3RyeX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3NjaGVtYS9lbGVtZW50X3NjaGVtYV9yZWdpc3RyeSc7XG5pbXBvcnQge3ByZXBhcnNlRWxlbWVudCwgUHJlcGFyc2VkRWxlbWVudCwgUHJlcGFyc2VkRWxlbWVudFR5cGV9IGZyb20gJy4vdGVtcGxhdGVfcHJlcGFyc2VyJztcblxuaW1wb3J0IHtpc1N0eWxlVXJsUmVzb2x2YWJsZX0gZnJvbSAnLi9zdHlsZV91cmxfcmVzb2x2ZXInO1xuXG5pbXBvcnQge1xuICBIdG1sQXN0VmlzaXRvcixcbiAgSHRtbEFzdCxcbiAgSHRtbEVsZW1lbnRBc3QsXG4gIEh0bWxBdHRyQXN0LFxuICBIdG1sVGV4dEFzdCxcbiAgSHRtbENvbW1lbnRBc3QsXG4gIGh0bWxWaXNpdEFsbFxufSBmcm9tICcuL2h0bWxfYXN0JztcblxuaW1wb3J0IHtzcGxpdEF0Q29sb259IGZyb20gJy4vdXRpbCc7XG5cbi8vIEdyb3VwIDEgPSBcImJpbmQtXCJcbi8vIEdyb3VwIDIgPSBcInZhci1cIiBvciBcIiNcIlxuLy8gR3JvdXAgMyA9IFwib24tXCJcbi8vIEdyb3VwIDQgPSBcImJpbmRvbi1cIlxuLy8gR3JvdXAgNSA9IHRoZSBpZGVudGlmaWVyIGFmdGVyIFwiYmluZC1cIiwgXCJ2YXItLyNcIiwgb3IgXCJvbi1cIlxuLy8gR3JvdXAgNiA9IGlkZW50aWZpZXIgaW5zaWRlIFsoKV1cbi8vIEdyb3VwIDcgPSBpZGVudGlmaWVyIGluc2lkZSBbXVxuLy8gR3JvdXAgOCA9IGlkZW50aWZpZXIgaW5zaWRlICgpXG52YXIgQklORF9OQU1FX1JFR0VYUCA9XG4gICAgL14oPzooPzooPzooYmluZC0pfCh2YXItfCMpfChvbi0pfChiaW5kb24tKSkoLispKXxcXFtcXCgoW15cXCldKylcXClcXF18XFxbKFteXFxdXSspXFxdfFxcKChbXlxcKV0rKVxcKSkkL2c7XG5cbmNvbnN0IFRFTVBMQVRFX0VMRU1FTlQgPSAndGVtcGxhdGUnO1xuY29uc3QgVEVNUExBVEVfQVRUUiA9ICd0ZW1wbGF0ZSc7XG5jb25zdCBURU1QTEFURV9BVFRSX1BSRUZJWCA9ICcqJztcbmNvbnN0IENMQVNTX0FUVFIgPSAnY2xhc3MnO1xuXG52YXIgUFJPUEVSVFlfUEFSVFNfU0VQQVJBVE9SID0gJy4nO1xuY29uc3QgQVRUUklCVVRFX1BSRUZJWCA9ICdhdHRyJztcbmNvbnN0IENMQVNTX1BSRUZJWCA9ICdjbGFzcyc7XG5jb25zdCBTVFlMRV9QUkVGSVggPSAnc3R5bGUnO1xuXG52YXIgVEVYVF9DU1NfU0VMRUNUT1IgPSBDc3NTZWxlY3Rvci5wYXJzZSgnKicpWzBdO1xuXG4vKipcbiAqIFByb3ZpZGVzIGFuIGFycmF5IG9mIHtAbGluayBUZW1wbGF0ZUFzdFZpc2l0b3J9cyB3aGljaCB3aWxsIGJlIHVzZWQgdG8gdHJhbnNmb3JtXG4gKiBwYXJzZWQgdGVtcGxhdGVzIGJlZm9yZSBjb21waWxhdGlvbiBpcyBpbnZva2VkLCBhbGxvd2luZyBjdXN0b20gZXhwcmVzc2lvbiBzeW50YXhcbiAqIGFuZCBvdGhlciBhZHZhbmNlZCB0cmFuc2Zvcm1hdGlvbnMuXG4gKlxuICogVGhpcyBpcyBjdXJyZW50bHkgYW4gaW50ZXJuYWwtb25seSBmZWF0dXJlIGFuZCBub3QgbWVhbnQgZm9yIGdlbmVyYWwgdXNlLlxuICovXG5leHBvcnQgY29uc3QgVEVNUExBVEVfVFJBTlNGT1JNUyA9IENPTlNUX0VYUFIobmV3IE9wYXF1ZVRva2VuKCdUZW1wbGF0ZVRyYW5zZm9ybXMnKSk7XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBhcnNlRXJyb3IgZXh0ZW5kcyBQYXJzZUVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBzcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHsgc3VwZXIoc3BhbiwgbWVzc2FnZSk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlUGFyc2VSZXN1bHQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVBc3Q/OiBUZW1wbGF0ZUFzdFtdLCBwdWJsaWMgZXJyb3JzPzogUGFyc2VFcnJvcltdKSB7fVxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVQYXJzZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9leHByUGFyc2VyOiBQYXJzZXIsIHByaXZhdGUgX3NjaGVtYVJlZ2lzdHJ5OiBFbGVtZW50U2NoZW1hUmVnaXN0cnksXG4gICAgICAgICAgICAgIHByaXZhdGUgX2h0bWxQYXJzZXI6IEh0bWxQYXJzZXIsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoVEVNUExBVEVfVFJBTlNGT1JNUykgcHVibGljIHRyYW5zZm9ybXM6IFRlbXBsYXRlQXN0VmlzaXRvcltdKSB7fVxuXG4gIHBhcnNlKHRlbXBsYXRlOiBzdHJpbmcsIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLCBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdLFxuICAgICAgICB0ZW1wbGF0ZVVybDogc3RyaW5nKTogVGVtcGxhdGVBc3RbXSB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMudHJ5UGFyc2UodGVtcGxhdGUsIGRpcmVjdGl2ZXMsIHBpcGVzLCB0ZW1wbGF0ZVVybCk7XG4gICAgaWYgKGlzUHJlc2VudChyZXN1bHQuZXJyb3JzKSkge1xuICAgICAgdmFyIGVycm9yU3RyaW5nID0gcmVzdWx0LmVycm9ycy5qb2luKCdcXG4nKTtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBUZW1wbGF0ZSBwYXJzZSBlcnJvcnM6XFxuJHtlcnJvclN0cmluZ31gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdC50ZW1wbGF0ZUFzdDtcbiAgfVxuXG4gIHRyeVBhcnNlKHRlbXBsYXRlOiBzdHJpbmcsIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLCBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdLFxuICAgICAgICAgICB0ZW1wbGF0ZVVybDogc3RyaW5nKTogVGVtcGxhdGVQYXJzZVJlc3VsdCB7XG4gICAgdmFyIHBhcnNlVmlzaXRvciA9XG4gICAgICAgIG5ldyBUZW1wbGF0ZVBhcnNlVmlzaXRvcihkaXJlY3RpdmVzLCBwaXBlcywgdGhpcy5fZXhwclBhcnNlciwgdGhpcy5fc2NoZW1hUmVnaXN0cnkpO1xuICAgIHZhciBodG1sQXN0V2l0aEVycm9ycyA9IHRoaXMuX2h0bWxQYXJzZXIucGFyc2UodGVtcGxhdGUsIHRlbXBsYXRlVXJsKTtcbiAgICB2YXIgcmVzdWx0ID0gaHRtbFZpc2l0QWxsKHBhcnNlVmlzaXRvciwgaHRtbEFzdFdpdGhFcnJvcnMucm9vdE5vZGVzLCBFTVBUWV9DT01QT05FTlQpO1xuICAgIHZhciBlcnJvcnM6IFBhcnNlRXJyb3JbXSA9IGh0bWxBc3RXaXRoRXJyb3JzLmVycm9ycy5jb25jYXQocGFyc2VWaXNpdG9yLmVycm9ycyk7XG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gbmV3IFRlbXBsYXRlUGFyc2VSZXN1bHQocmVzdWx0LCBlcnJvcnMpO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHRoaXMudHJhbnNmb3JtcykpIHtcbiAgICAgIHRoaXMudHJhbnNmb3Jtcy5mb3JFYWNoKFxuICAgICAgICAgICh0cmFuc2Zvcm06IFRlbXBsYXRlQXN0VmlzaXRvcikgPT4geyByZXN1bHQgPSB0ZW1wbGF0ZVZpc2l0QWxsKHRyYW5zZm9ybSwgcmVzdWx0KTsgfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVtcGxhdGVQYXJzZVJlc3VsdChyZXN1bHQpO1xuICB9XG59XG5cbmNsYXNzIFRlbXBsYXRlUGFyc2VWaXNpdG9yIGltcGxlbWVudHMgSHRtbEFzdFZpc2l0b3Ige1xuICBzZWxlY3Rvck1hdGNoZXI6IFNlbGVjdG9yTWF0Y2hlcjtcbiAgZXJyb3JzOiBUZW1wbGF0ZVBhcnNlRXJyb3JbXSA9IFtdO1xuICBkaXJlY3RpdmVzSW5kZXggPSBuZXcgTWFwPENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgbnVtYmVyPigpO1xuICBuZ0NvbnRlbnRDb3VudDogbnVtYmVyID0gMDtcbiAgcGlwZXNCeU5hbWU6IE1hcDxzdHJpbmcsIENvbXBpbGVQaXBlTWV0YWRhdGE+O1xuXG4gIGNvbnN0cnVjdG9yKGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLCBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICBwcml2YXRlIF9leHByUGFyc2VyOiBQYXJzZXIsIHByaXZhdGUgX3NjaGVtYVJlZ2lzdHJ5OiBFbGVtZW50U2NoZW1hUmVnaXN0cnkpIHtcbiAgICB0aGlzLnNlbGVjdG9yTWF0Y2hlciA9IG5ldyBTZWxlY3Rvck1hdGNoZXIoKTtcbiAgICBMaXN0V3JhcHBlci5mb3JFYWNoV2l0aEluZGV4KGRpcmVjdGl2ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZGlyZWN0aXZlOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gQ3NzU2VsZWN0b3IucGFyc2UoZGlyZWN0aXZlLnNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rvck1hdGNoZXIuYWRkU2VsZWN0YWJsZXMoc2VsZWN0b3IsIGRpcmVjdGl2ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aXZlc0luZGV4LnNldChkaXJlY3RpdmUsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgIHRoaXMucGlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgQ29tcGlsZVBpcGVNZXRhZGF0YT4oKTtcbiAgICBwaXBlcy5mb3JFYWNoKHBpcGUgPT4gdGhpcy5waXBlc0J5TmFtZS5zZXQocGlwZS5uYW1lLCBwaXBlKSk7XG4gIH1cblxuICBwcml2YXRlIF9yZXBvcnRFcnJvcihtZXNzYWdlOiBzdHJpbmcsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge1xuICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IFRlbXBsYXRlUGFyc2VFcnJvcihtZXNzYWdlLCBzb3VyY2VTcGFuKSk7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZUludGVycG9sYXRpb24odmFsdWU6IHN0cmluZywgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKTogQVNUV2l0aFNvdXJjZSB7XG4gICAgdmFyIHNvdXJjZUluZm8gPSBzb3VyY2VTcGFuLnN0YXJ0LnRvU3RyaW5nKCk7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBhc3QgPSB0aGlzLl9leHByUGFyc2VyLnBhcnNlSW50ZXJwb2xhdGlvbih2YWx1ZSwgc291cmNlSW5mbyk7XG4gICAgICB0aGlzLl9jaGVja1BpcGVzKGFzdCwgc291cmNlU3Bhbik7XG4gICAgICByZXR1cm4gYXN0O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKGAke2V9YCwgc291cmNlU3Bhbik7XG4gICAgICByZXR1cm4gdGhpcy5fZXhwclBhcnNlci53cmFwTGl0ZXJhbFByaW1pdGl2ZSgnRVJST1InLCBzb3VyY2VJbmZvKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZUFjdGlvbih2YWx1ZTogc3RyaW5nLCBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pOiBBU1RXaXRoU291cmNlIHtcbiAgICB2YXIgc291cmNlSW5mbyA9IHNvdXJjZVNwYW4uc3RhcnQudG9TdHJpbmcoKTtcbiAgICB0cnkge1xuICAgICAgdmFyIGFzdCA9IHRoaXMuX2V4cHJQYXJzZXIucGFyc2VBY3Rpb24odmFsdWUsIHNvdXJjZUluZm8pO1xuICAgICAgdGhpcy5fY2hlY2tQaXBlcyhhc3QsIHNvdXJjZVNwYW4pO1xuICAgICAgcmV0dXJuIGFzdDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihgJHtlfWAsIHNvdXJjZVNwYW4pO1xuICAgICAgcmV0dXJuIHRoaXMuX2V4cHJQYXJzZXIud3JhcExpdGVyYWxQcmltaXRpdmUoJ0VSUk9SJywgc291cmNlSW5mbyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcGFyc2VCaW5kaW5nKHZhbHVlOiBzdHJpbmcsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbik6IEFTVFdpdGhTb3VyY2Uge1xuICAgIHZhciBzb3VyY2VJbmZvID0gc291cmNlU3Bhbi5zdGFydC50b1N0cmluZygpO1xuICAgIHRyeSB7XG4gICAgICB2YXIgYXN0ID0gdGhpcy5fZXhwclBhcnNlci5wYXJzZUJpbmRpbmcodmFsdWUsIHNvdXJjZUluZm8pO1xuICAgICAgdGhpcy5fY2hlY2tQaXBlcyhhc3QsIHNvdXJjZVNwYW4pO1xuICAgICAgcmV0dXJuIGFzdDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihgJHtlfWAsIHNvdXJjZVNwYW4pO1xuICAgICAgcmV0dXJuIHRoaXMuX2V4cHJQYXJzZXIud3JhcExpdGVyYWxQcmltaXRpdmUoJ0VSUk9SJywgc291cmNlSW5mbyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcGFyc2VUZW1wbGF0ZUJpbmRpbmdzKHZhbHVlOiBzdHJpbmcsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbik6IFRlbXBsYXRlQmluZGluZ1tdIHtcbiAgICB2YXIgc291cmNlSW5mbyA9IHNvdXJjZVNwYW4uc3RhcnQudG9TdHJpbmcoKTtcbiAgICB0cnkge1xuICAgICAgdmFyIGJpbmRpbmdzID0gdGhpcy5fZXhwclBhcnNlci5wYXJzZVRlbXBsYXRlQmluZGluZ3ModmFsdWUsIHNvdXJjZUluZm8pO1xuICAgICAgYmluZGluZ3MuZm9yRWFjaCgoYmluZGluZykgPT4ge1xuICAgICAgICBpZiAoaXNQcmVzZW50KGJpbmRpbmcuZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICB0aGlzLl9jaGVja1BpcGVzKGJpbmRpbmcuZXhwcmVzc2lvbiwgc291cmNlU3Bhbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGJpbmRpbmdzO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKGAke2V9YCwgc291cmNlU3Bhbik7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tQaXBlcyhhc3Q6IEFTVFdpdGhTb3VyY2UsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge1xuICAgIGlmIChpc1ByZXNlbnQoYXN0KSkge1xuICAgICAgdmFyIGNvbGxlY3RvciA9IG5ldyBQaXBlQ29sbGVjdG9yKCk7XG4gICAgICBhc3QudmlzaXQoY29sbGVjdG9yKTtcbiAgICAgIGNvbGxlY3Rvci5waXBlcy5mb3JFYWNoKChwaXBlTmFtZSkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMucGlwZXNCeU5hbWUuaGFzKHBpcGVOYW1lKSkge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKGBUaGUgcGlwZSAnJHtwaXBlTmFtZX0nIGNvdWxkIG5vdCBiZSBmb3VuZGAsIHNvdXJjZVNwYW4pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB2aXNpdFRleHQoYXN0OiBIdG1sVGV4dEFzdCwgY29tcG9uZW50OiBDb21wb25lbnQpOiBhbnkge1xuICAgIHZhciBuZ0NvbnRlbnRJbmRleCA9IGNvbXBvbmVudC5maW5kTmdDb250ZW50SW5kZXgoVEVYVF9DU1NfU0VMRUNUT1IpO1xuICAgIHZhciBleHByID0gdGhpcy5fcGFyc2VJbnRlcnBvbGF0aW9uKGFzdC52YWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICAgIGlmIChpc1ByZXNlbnQoZXhwcikpIHtcbiAgICAgIHJldHVybiBuZXcgQm91bmRUZXh0QXN0KGV4cHIsIG5nQ29udGVudEluZGV4LCBhc3Quc291cmNlU3Bhbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgVGV4dEFzdChhc3QudmFsdWUsIG5nQ29udGVudEluZGV4LCBhc3Quc291cmNlU3Bhbik7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRBdHRyKGFzdDogSHRtbEF0dHJBc3QsIGNvbnRleDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IEF0dHJBc3QoYXN0Lm5hbWUsIGFzdC52YWx1ZSwgYXN0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRDb21tZW50KGFzdDogSHRtbENvbW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IEh0bWxFbGVtZW50QXN0LCBjb21wb25lbnQ6IENvbXBvbmVudCk6IGFueSB7XG4gICAgdmFyIG5vZGVOYW1lID0gZWxlbWVudC5uYW1lO1xuICAgIHZhciBwcmVwYXJzZWRFbGVtZW50ID0gcHJlcGFyc2VFbGVtZW50KGVsZW1lbnQpO1xuICAgIGlmIChwcmVwYXJzZWRFbGVtZW50LnR5cGUgPT09IFByZXBhcnNlZEVsZW1lbnRUeXBlLlNDUklQVCB8fFxuICAgICAgICBwcmVwYXJzZWRFbGVtZW50LnR5cGUgPT09IFByZXBhcnNlZEVsZW1lbnRUeXBlLlNUWUxFKSB7XG4gICAgICAvLyBTa2lwcGluZyA8c2NyaXB0PiBmb3Igc2VjdXJpdHkgcmVhc29uc1xuICAgICAgLy8gU2tpcHBpbmcgPHN0eWxlPiBhcyB3ZSBhbHJlYWR5IHByb2Nlc3NlZCB0aGVtXG4gICAgICAvLyBpbiB0aGUgU3R5bGVDb21waWxlclxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChwcmVwYXJzZWRFbGVtZW50LnR5cGUgPT09IFByZXBhcnNlZEVsZW1lbnRUeXBlLlNUWUxFU0hFRVQgJiZcbiAgICAgICAgaXNTdHlsZVVybFJlc29sdmFibGUocHJlcGFyc2VkRWxlbWVudC5ocmVmQXR0cikpIHtcbiAgICAgIC8vIFNraXBwaW5nIHN0eWxlc2hlZXRzIHdpdGggZWl0aGVyIHJlbGF0aXZlIHVybHMgb3IgcGFja2FnZSBzY2hlbWUgYXMgd2UgYWxyZWFkeSBwcm9jZXNzZWRcbiAgICAgIC8vIHRoZW0gaW4gdGhlIFN0eWxlQ29tcGlsZXJcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBtYXRjaGFibGVBdHRyczogc3RyaW5nW11bXSA9IFtdO1xuICAgIHZhciBlbGVtZW50T3JEaXJlY3RpdmVQcm9wczogQm91bmRFbGVtZW50T3JEaXJlY3RpdmVQcm9wZXJ0eVtdID0gW107XG4gICAgdmFyIHZhcnM6IFZhcmlhYmxlQXN0W10gPSBbXTtcbiAgICB2YXIgZXZlbnRzOiBCb3VuZEV2ZW50QXN0W10gPSBbXTtcblxuICAgIHZhciB0ZW1wbGF0ZUVsZW1lbnRPckRpcmVjdGl2ZVByb3BzOiBCb3VuZEVsZW1lbnRPckRpcmVjdGl2ZVByb3BlcnR5W10gPSBbXTtcbiAgICB2YXIgdGVtcGxhdGVWYXJzOiBWYXJpYWJsZUFzdFtdID0gW107XG4gICAgdmFyIHRlbXBsYXRlTWF0Y2hhYmxlQXR0cnM6IHN0cmluZ1tdW10gPSBbXTtcbiAgICB2YXIgaGFzSW5saW5lVGVtcGxhdGVzID0gZmFsc2U7XG4gICAgdmFyIGF0dHJzID0gW107XG5cbiAgICBlbGVtZW50LmF0dHJzLmZvckVhY2goYXR0ciA9PiB7XG4gICAgICB2YXIgaGFzQmluZGluZyA9IHRoaXMuX3BhcnNlQXR0cihhdHRyLCBtYXRjaGFibGVBdHRycywgZWxlbWVudE9yRGlyZWN0aXZlUHJvcHMsIGV2ZW50cywgdmFycyk7XG4gICAgICB2YXIgaGFzVGVtcGxhdGVCaW5kaW5nID0gdGhpcy5fcGFyc2VJbmxpbmVUZW1wbGF0ZUJpbmRpbmcoXG4gICAgICAgICAgYXR0ciwgdGVtcGxhdGVNYXRjaGFibGVBdHRycywgdGVtcGxhdGVFbGVtZW50T3JEaXJlY3RpdmVQcm9wcywgdGVtcGxhdGVWYXJzKTtcbiAgICAgIGlmICghaGFzQmluZGluZyAmJiAhaGFzVGVtcGxhdGVCaW5kaW5nKSB7XG4gICAgICAgIC8vIGRvbid0IGluY2x1ZGUgdGhlIGJpbmRpbmdzIGFzIGF0dHJpYnV0ZXMgYXMgd2VsbCBpbiB0aGUgQVNUXG4gICAgICAgIGF0dHJzLnB1c2godGhpcy52aXNpdEF0dHIoYXR0ciwgbnVsbCkpO1xuICAgICAgICBtYXRjaGFibGVBdHRycy5wdXNoKFthdHRyLm5hbWUsIGF0dHIudmFsdWVdKTtcbiAgICAgIH1cbiAgICAgIGlmIChoYXNUZW1wbGF0ZUJpbmRpbmcpIHtcbiAgICAgICAgaGFzSW5saW5lVGVtcGxhdGVzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBsY0VsTmFtZSA9IHNwbGl0TnNOYW1lKG5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpWzFdO1xuICAgIHZhciBpc1RlbXBsYXRlRWxlbWVudCA9IGxjRWxOYW1lID09IFRFTVBMQVRFX0VMRU1FTlQ7XG4gICAgdmFyIGVsZW1lbnRDc3NTZWxlY3RvciA9IGNyZWF0ZUVsZW1lbnRDc3NTZWxlY3Rvcihub2RlTmFtZSwgbWF0Y2hhYmxlQXR0cnMpO1xuICAgIHZhciBkaXJlY3RpdmVzID0gdGhpcy5fY3JlYXRlRGlyZWN0aXZlQXN0cyhcbiAgICAgICAgZWxlbWVudC5uYW1lLCB0aGlzLl9wYXJzZURpcmVjdGl2ZXModGhpcy5zZWxlY3Rvck1hdGNoZXIsIGVsZW1lbnRDc3NTZWxlY3RvciksXG4gICAgICAgIGVsZW1lbnRPckRpcmVjdGl2ZVByb3BzLCBpc1RlbXBsYXRlRWxlbWVudCA/IFtdIDogdmFycywgZWxlbWVudC5zb3VyY2VTcGFuKTtcbiAgICB2YXIgZWxlbWVudFByb3BzOiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdFtdID1cbiAgICAgICAgdGhpcy5fY3JlYXRlRWxlbWVudFByb3BlcnR5QXN0cyhlbGVtZW50Lm5hbWUsIGVsZW1lbnRPckRpcmVjdGl2ZVByb3BzLCBkaXJlY3RpdmVzKTtcbiAgICB2YXIgY2hpbGRyZW4gPSBodG1sVmlzaXRBbGwocHJlcGFyc2VkRWxlbWVudC5ub25CaW5kYWJsZSA/IE5PTl9CSU5EQUJMRV9WSVNJVE9SIDogdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jaGlsZHJlbiwgQ29tcG9uZW50LmNyZWF0ZShkaXJlY3RpdmVzKSk7XG5cbiAgICAvLyBPdmVycmlkZSB0aGUgYWN0dWFsIHNlbGVjdG9yIHdoZW4gdGhlIGBuZ1Byb2plY3RBc2AgYXR0cmlidXRlIGlzIHByb3ZpZGVkXG4gICAgdmFyIHByb2plY3Rpb25TZWxlY3RvciA9IGlzUHJlc2VudChwcmVwYXJzZWRFbGVtZW50LnByb2plY3RBcykgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3NzU2VsZWN0b3IucGFyc2UocHJlcGFyc2VkRWxlbWVudC5wcm9qZWN0QXMpWzBdIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRDc3NTZWxlY3RvcjtcbiAgICB2YXIgbmdDb250ZW50SW5kZXggPSBjb21wb25lbnQuZmluZE5nQ29udGVudEluZGV4KHByb2plY3Rpb25TZWxlY3Rvcik7XG4gICAgdmFyIHBhcnNlZEVsZW1lbnQ7XG5cbiAgICBpZiAocHJlcGFyc2VkRWxlbWVudC50eXBlID09PSBQcmVwYXJzZWRFbGVtZW50VHlwZS5OR19DT05URU5UKSB7XG4gICAgICBpZiAoaXNQcmVzZW50KGVsZW1lbnQuY2hpbGRyZW4pICYmIGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICAgIGA8bmctY29udGVudD4gZWxlbWVudCBjYW5ub3QgaGF2ZSBjb250ZW50LiA8bmctY29udGVudD4gbXVzdCBiZSBpbW1lZGlhdGVseSBmb2xsb3dlZCBieSA8L25nLWNvbnRlbnQ+YCxcbiAgICAgICAgICAgIGVsZW1lbnQuc291cmNlU3Bhbik7XG4gICAgICB9XG5cbiAgICAgIHBhcnNlZEVsZW1lbnQgPSBuZXcgTmdDb250ZW50QXN0KFxuICAgICAgICAgIHRoaXMubmdDb250ZW50Q291bnQrKywgaGFzSW5saW5lVGVtcGxhdGVzID8gbnVsbCA6IG5nQ29udGVudEluZGV4LCBlbGVtZW50LnNvdXJjZVNwYW4pO1xuICAgIH0gZWxzZSBpZiAoaXNUZW1wbGF0ZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2Fzc2VydEFsbEV2ZW50c1B1Ymxpc2hlZEJ5RGlyZWN0aXZlcyhkaXJlY3RpdmVzLCBldmVudHMpO1xuICAgICAgdGhpcy5fYXNzZXJ0Tm9Db21wb25lbnRzTm9yRWxlbWVudEJpbmRpbmdzT25UZW1wbGF0ZShkaXJlY3RpdmVzLCBlbGVtZW50UHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc291cmNlU3Bhbik7XG5cbiAgICAgIHBhcnNlZEVsZW1lbnQgPVxuICAgICAgICAgIG5ldyBFbWJlZGRlZFRlbXBsYXRlQXN0KGF0dHJzLCBldmVudHMsIHZhcnMsIGRpcmVjdGl2ZXMsIGNoaWxkcmVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0lubGluZVRlbXBsYXRlcyA/IG51bGwgOiBuZ0NvbnRlbnRJbmRleCwgZWxlbWVudC5zb3VyY2VTcGFuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYXNzZXJ0T25seU9uZUNvbXBvbmVudChkaXJlY3RpdmVzLCBlbGVtZW50LnNvdXJjZVNwYW4pO1xuICAgICAgdmFyIGVsZW1lbnRFeHBvcnRBc1ZhcnMgPSB2YXJzLmZpbHRlcih2YXJBc3QgPT4gdmFyQXN0LnZhbHVlLmxlbmd0aCA9PT0gMCk7XG4gICAgICBsZXQgbmdDb250ZW50SW5kZXggPVxuICAgICAgICAgIGhhc0lubGluZVRlbXBsYXRlcyA/IG51bGwgOiBjb21wb25lbnQuZmluZE5nQ29udGVudEluZGV4KHByb2plY3Rpb25TZWxlY3Rvcik7XG5cbiAgICAgIHBhcnNlZEVsZW1lbnQgPVxuICAgICAgICAgIG5ldyBFbGVtZW50QXN0KG5vZGVOYW1lLCBhdHRycywgZWxlbWVudFByb3BzLCBldmVudHMsIGVsZW1lbnRFeHBvcnRBc1ZhcnMsIGRpcmVjdGl2ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4sIGhhc0lubGluZVRlbXBsYXRlcyA/IG51bGwgOiBuZ0NvbnRlbnRJbmRleCwgZWxlbWVudC5zb3VyY2VTcGFuKTtcbiAgICB9XG4gICAgaWYgKGhhc0lubGluZVRlbXBsYXRlcykge1xuICAgICAgdmFyIHRlbXBsYXRlQ3NzU2VsZWN0b3IgPSBjcmVhdGVFbGVtZW50Q3NzU2VsZWN0b3IoVEVNUExBVEVfRUxFTUVOVCwgdGVtcGxhdGVNYXRjaGFibGVBdHRycyk7XG4gICAgICB2YXIgdGVtcGxhdGVEaXJlY3RpdmVzID0gdGhpcy5fY3JlYXRlRGlyZWN0aXZlQXN0cyhcbiAgICAgICAgICBlbGVtZW50Lm5hbWUsIHRoaXMuX3BhcnNlRGlyZWN0aXZlcyh0aGlzLnNlbGVjdG9yTWF0Y2hlciwgdGVtcGxhdGVDc3NTZWxlY3RvciksXG4gICAgICAgICAgdGVtcGxhdGVFbGVtZW50T3JEaXJlY3RpdmVQcm9wcywgW10sIGVsZW1lbnQuc291cmNlU3Bhbik7XG4gICAgICB2YXIgdGVtcGxhdGVFbGVtZW50UHJvcHM6IEJvdW5kRWxlbWVudFByb3BlcnR5QXN0W10gPSB0aGlzLl9jcmVhdGVFbGVtZW50UHJvcGVydHlBc3RzKFxuICAgICAgICAgIGVsZW1lbnQubmFtZSwgdGVtcGxhdGVFbGVtZW50T3JEaXJlY3RpdmVQcm9wcywgdGVtcGxhdGVEaXJlY3RpdmVzKTtcbiAgICAgIHRoaXMuX2Fzc2VydE5vQ29tcG9uZW50c05vckVsZW1lbnRCaW5kaW5nc09uVGVtcGxhdGUodGVtcGxhdGVEaXJlY3RpdmVzLCB0ZW1wbGF0ZUVsZW1lbnRQcm9wcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zb3VyY2VTcGFuKTtcblxuICAgICAgcGFyc2VkRWxlbWVudCA9IG5ldyBFbWJlZGRlZFRlbXBsYXRlQXN0KFtdLCBbXSwgdGVtcGxhdGVWYXJzLCB0ZW1wbGF0ZURpcmVjdGl2ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3BhcnNlZEVsZW1lbnRdLCBuZ0NvbnRlbnRJbmRleCwgZWxlbWVudC5zb3VyY2VTcGFuKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZEVsZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZUlubGluZVRlbXBsYXRlQmluZGluZyhhdHRyOiBIdG1sQXR0ckFzdCwgdGFyZ2V0TWF0Y2hhYmxlQXR0cnM6IHN0cmluZ1tdW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFByb3BzOiBCb3VuZEVsZW1lbnRPckRpcmVjdGl2ZVByb3BlcnR5W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFZhcnM6IFZhcmlhYmxlQXN0W10pOiBib29sZWFuIHtcbiAgICB2YXIgdGVtcGxhdGVCaW5kaW5nc1NvdXJjZSA9IG51bGw7XG4gICAgaWYgKGF0dHIubmFtZSA9PSBURU1QTEFURV9BVFRSKSB7XG4gICAgICB0ZW1wbGF0ZUJpbmRpbmdzU291cmNlID0gYXR0ci52YWx1ZTtcbiAgICB9IGVsc2UgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKFRFTVBMQVRFX0FUVFJfUFJFRklYKSkge1xuICAgICAgdmFyIGtleSA9IGF0dHIubmFtZS5zdWJzdHJpbmcoVEVNUExBVEVfQVRUUl9QUkVGSVgubGVuZ3RoKTsgIC8vIHJlbW92ZSB0aGUgc3RhclxuICAgICAgdGVtcGxhdGVCaW5kaW5nc1NvdXJjZSA9IChhdHRyLnZhbHVlLmxlbmd0aCA9PSAwKSA/IGtleSA6IGtleSArICcgJyArIGF0dHIudmFsdWU7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQodGVtcGxhdGVCaW5kaW5nc1NvdXJjZSkpIHtcbiAgICAgIHZhciBiaW5kaW5ncyA9IHRoaXMuX3BhcnNlVGVtcGxhdGVCaW5kaW5ncyh0ZW1wbGF0ZUJpbmRpbmdzU291cmNlLCBhdHRyLnNvdXJjZVNwYW4pO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiaW5kaW5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYmluZGluZyA9IGJpbmRpbmdzW2ldO1xuICAgICAgICBpZiAoYmluZGluZy5rZXlJc1Zhcikge1xuICAgICAgICAgIHRhcmdldFZhcnMucHVzaChuZXcgVmFyaWFibGVBc3QoYmluZGluZy5rZXksIGJpbmRpbmcubmFtZSwgYXR0ci5zb3VyY2VTcGFuKSk7XG4gICAgICAgICAgdGFyZ2V0TWF0Y2hhYmxlQXR0cnMucHVzaChbYmluZGluZy5rZXksIGJpbmRpbmcubmFtZV0pO1xuICAgICAgICB9IGVsc2UgaWYgKGlzUHJlc2VudChiaW5kaW5nLmV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgdGhpcy5fcGFyc2VQcm9wZXJ0eUFzdChiaW5kaW5nLmtleSwgYmluZGluZy5leHByZXNzaW9uLCBhdHRyLnNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRNYXRjaGFibGVBdHRycywgdGFyZ2V0UHJvcHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldE1hdGNoYWJsZUF0dHJzLnB1c2goW2JpbmRpbmcua2V5LCAnJ10pO1xuICAgICAgICAgIHRoaXMuX3BhcnNlTGl0ZXJhbEF0dHIoYmluZGluZy5rZXksIG51bGwsIGF0dHIuc291cmNlU3BhbiwgdGFyZ2V0UHJvcHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfcGFyc2VBdHRyKGF0dHI6IEh0bWxBdHRyQXN0LCB0YXJnZXRNYXRjaGFibGVBdHRyczogc3RyaW5nW11bXSxcbiAgICAgICAgICAgICAgICAgICAgIHRhcmdldFByb3BzOiBCb3VuZEVsZW1lbnRPckRpcmVjdGl2ZVByb3BlcnR5W10sIHRhcmdldEV2ZW50czogQm91bmRFdmVudEFzdFtdLFxuICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VmFyczogVmFyaWFibGVBc3RbXSk6IGJvb2xlYW4ge1xuICAgIHZhciBhdHRyTmFtZSA9IHRoaXMuX25vcm1hbGl6ZUF0dHJpYnV0ZU5hbWUoYXR0ci5uYW1lKTtcbiAgICB2YXIgYXR0clZhbHVlID0gYXR0ci52YWx1ZTtcbiAgICB2YXIgYmluZFBhcnRzID0gUmVnRXhwV3JhcHBlci5maXJzdE1hdGNoKEJJTkRfTkFNRV9SRUdFWFAsIGF0dHJOYW1lKTtcbiAgICB2YXIgaGFzQmluZGluZyA9IGZhbHNlO1xuICAgIGlmIChpc1ByZXNlbnQoYmluZFBhcnRzKSkge1xuICAgICAgaGFzQmluZGluZyA9IHRydWU7XG4gICAgICBpZiAoaXNQcmVzZW50KGJpbmRQYXJ0c1sxXSkpIHsgIC8vIG1hdGNoOiBiaW5kLXByb3BcbiAgICAgICAgdGhpcy5fcGFyc2VQcm9wZXJ0eShiaW5kUGFydHNbNV0sIGF0dHJWYWx1ZSwgYXR0ci5zb3VyY2VTcGFuLCB0YXJnZXRNYXRjaGFibGVBdHRycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRQcm9wcyk7XG5cbiAgICAgIH0gZWxzZSBpZiAoaXNQcmVzZW50KFxuICAgICAgICAgICAgICAgICAgICAgYmluZFBhcnRzWzJdKSkgeyAgLy8gbWF0Y2g6IHZhci1uYW1lIC8gdmFyLW5hbWU9XCJpZGVuXCIgLyAjbmFtZSAvICNuYW1lPVwiaWRlblwiXG4gICAgICAgIHZhciBpZGVudGlmaWVyID0gYmluZFBhcnRzWzVdO1xuICAgICAgICB0aGlzLl9wYXJzZVZhcmlhYmxlKGlkZW50aWZpZXIsIGF0dHJWYWx1ZSwgYXR0ci5zb3VyY2VTcGFuLCB0YXJnZXRWYXJzKTtcblxuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQoYmluZFBhcnRzWzNdKSkgeyAgLy8gbWF0Y2g6IG9uLWV2ZW50XG4gICAgICAgIHRoaXMuX3BhcnNlRXZlbnQoYmluZFBhcnRzWzVdLCBhdHRyVmFsdWUsIGF0dHIuc291cmNlU3BhbiwgdGFyZ2V0TWF0Y2hhYmxlQXR0cnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RXZlbnRzKTtcblxuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQoYmluZFBhcnRzWzRdKSkgeyAgLy8gbWF0Y2g6IGJpbmRvbi1wcm9wXG4gICAgICAgIHRoaXMuX3BhcnNlUHJvcGVydHkoYmluZFBhcnRzWzVdLCBhdHRyVmFsdWUsIGF0dHIuc291cmNlU3BhbiwgdGFyZ2V0TWF0Y2hhYmxlQXR0cnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0UHJvcHMpO1xuICAgICAgICB0aGlzLl9wYXJzZUFzc2lnbm1lbnRFdmVudChiaW5kUGFydHNbNV0sIGF0dHJWYWx1ZSwgYXR0ci5zb3VyY2VTcGFuLCB0YXJnZXRNYXRjaGFibGVBdHRycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RXZlbnRzKTtcblxuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQoYmluZFBhcnRzWzZdKSkgeyAgLy8gbWF0Y2g6IFsoZXhwcildXG4gICAgICAgIHRoaXMuX3BhcnNlUHJvcGVydHkoYmluZFBhcnRzWzZdLCBhdHRyVmFsdWUsIGF0dHIuc291cmNlU3BhbiwgdGFyZ2V0TWF0Y2hhYmxlQXR0cnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0UHJvcHMpO1xuICAgICAgICB0aGlzLl9wYXJzZUFzc2lnbm1lbnRFdmVudChiaW5kUGFydHNbNl0sIGF0dHJWYWx1ZSwgYXR0ci5zb3VyY2VTcGFuLCB0YXJnZXRNYXRjaGFibGVBdHRycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RXZlbnRzKTtcblxuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQoYmluZFBhcnRzWzddKSkgeyAgLy8gbWF0Y2g6IFtleHByXVxuICAgICAgICB0aGlzLl9wYXJzZVByb3BlcnR5KGJpbmRQYXJ0c1s3XSwgYXR0clZhbHVlLCBhdHRyLnNvdXJjZVNwYW4sIHRhcmdldE1hdGNoYWJsZUF0dHJzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFByb3BzKTtcblxuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQoYmluZFBhcnRzWzhdKSkgeyAgLy8gbWF0Y2g6IChldmVudClcbiAgICAgICAgdGhpcy5fcGFyc2VFdmVudChiaW5kUGFydHNbOF0sIGF0dHJWYWx1ZSwgYXR0ci5zb3VyY2VTcGFuLCB0YXJnZXRNYXRjaGFibGVBdHRycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRFdmVudHMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBoYXNCaW5kaW5nID0gdGhpcy5fcGFyc2VQcm9wZXJ0eUludGVycG9sYXRpb24oYXR0ck5hbWUsIGF0dHJWYWx1ZSwgYXR0ci5zb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE1hdGNoYWJsZUF0dHJzLCB0YXJnZXRQcm9wcyk7XG4gICAgfVxuICAgIGlmICghaGFzQmluZGluZykge1xuICAgICAgdGhpcy5fcGFyc2VMaXRlcmFsQXR0cihhdHRyTmFtZSwgYXR0clZhbHVlLCBhdHRyLnNvdXJjZVNwYW4sIHRhcmdldFByb3BzKTtcbiAgICB9XG4gICAgcmV0dXJuIGhhc0JpbmRpbmc7XG4gIH1cblxuICBwcml2YXRlIF9ub3JtYWxpemVBdHRyaWJ1dGVOYW1lKGF0dHJOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBhdHRyTmFtZS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ2RhdGEtJykgPyBhdHRyTmFtZS5zdWJzdHJpbmcoNSkgOiBhdHRyTmFtZTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlVmFyaWFibGUoaWRlbnRpZmllcjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VmFyczogVmFyaWFibGVBc3RbXSkge1xuICAgIGlmIChpZGVudGlmaWVyLmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihgXCItXCIgaXMgbm90IGFsbG93ZWQgaW4gdmFyaWFibGUgbmFtZXNgLCBzb3VyY2VTcGFuKTtcbiAgICB9XG4gICAgdGFyZ2V0VmFycy5wdXNoKG5ldyBWYXJpYWJsZUFzdChpZGVudGlmaWVyLCB2YWx1ZSwgc291cmNlU3BhbikpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcGFyc2VQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIGV4cHJlc3Npb246IHN0cmluZywgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE1hdGNoYWJsZUF0dHJzOiBzdHJpbmdbXVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFByb3BzOiBCb3VuZEVsZW1lbnRPckRpcmVjdGl2ZVByb3BlcnR5W10pIHtcbiAgICB0aGlzLl9wYXJzZVByb3BlcnR5QXN0KG5hbWUsIHRoaXMuX3BhcnNlQmluZGluZyhleHByZXNzaW9uLCBzb3VyY2VTcGFuKSwgc291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE1hdGNoYWJsZUF0dHJzLCB0YXJnZXRQcm9wcyk7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZVByb3BlcnR5SW50ZXJwb2xhdGlvbihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TWF0Y2hhYmxlQXR0cnM6IHN0cmluZ1tdW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFByb3BzOiBCb3VuZEVsZW1lbnRPckRpcmVjdGl2ZVByb3BlcnR5W10pOiBib29sZWFuIHtcbiAgICB2YXIgZXhwciA9IHRoaXMuX3BhcnNlSW50ZXJwb2xhdGlvbih2YWx1ZSwgc291cmNlU3Bhbik7XG4gICAgaWYgKGlzUHJlc2VudChleHByKSkge1xuICAgICAgdGhpcy5fcGFyc2VQcm9wZXJ0eUFzdChuYW1lLCBleHByLCBzb3VyY2VTcGFuLCB0YXJnZXRNYXRjaGFibGVBdHRycywgdGFyZ2V0UHJvcHMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlUHJvcGVydHlBc3QobmFtZTogc3RyaW5nLCBhc3Q6IEFTVFdpdGhTb3VyY2UsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRNYXRjaGFibGVBdHRyczogc3RyaW5nW11bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRQcm9wczogQm91bmRFbGVtZW50T3JEaXJlY3RpdmVQcm9wZXJ0eVtdKSB7XG4gICAgdGFyZ2V0TWF0Y2hhYmxlQXR0cnMucHVzaChbbmFtZSwgYXN0LnNvdXJjZV0pO1xuICAgIHRhcmdldFByb3BzLnB1c2gobmV3IEJvdW5kRWxlbWVudE9yRGlyZWN0aXZlUHJvcGVydHkobmFtZSwgYXN0LCBmYWxzZSwgc291cmNlU3BhbikpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcGFyc2VBc3NpZ25tZW50RXZlbnQobmFtZTogc3RyaW5nLCBleHByZXNzaW9uOiBzdHJpbmcsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TWF0Y2hhYmxlQXR0cnM6IHN0cmluZ1tdW10sIHRhcmdldEV2ZW50czogQm91bmRFdmVudEFzdFtdKSB7XG4gICAgdGhpcy5fcGFyc2VFdmVudChgJHtuYW1lfUNoYW5nZWAsIGAke2V4cHJlc3Npb259PSRldmVudGAsIHNvdXJjZVNwYW4sIHRhcmdldE1hdGNoYWJsZUF0dHJzLFxuICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RXZlbnRzKTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlRXZlbnQobmFtZTogc3RyaW5nLCBleHByZXNzaW9uOiBzdHJpbmcsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRNYXRjaGFibGVBdHRyczogc3RyaW5nW11bXSwgdGFyZ2V0RXZlbnRzOiBCb3VuZEV2ZW50QXN0W10pIHtcbiAgICAvLyBsb25nIGZvcm1hdDogJ3RhcmdldDogZXZlbnROYW1lJ1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0QXRDb2xvbihuYW1lLCBbbnVsbCwgbmFtZV0pO1xuICAgIHZhciB0YXJnZXQgPSBwYXJ0c1swXTtcbiAgICB2YXIgZXZlbnROYW1lID0gcGFydHNbMV07XG4gICAgdmFyIGFzdCA9IHRoaXMuX3BhcnNlQWN0aW9uKGV4cHJlc3Npb24sIHNvdXJjZVNwYW4pO1xuICAgIHRhcmdldE1hdGNoYWJsZUF0dHJzLnB1c2goW25hbWUsIGFzdC5zb3VyY2VdKTtcbiAgICB0YXJnZXRFdmVudHMucHVzaChuZXcgQm91bmRFdmVudEFzdChldmVudE5hbWUsIHRhcmdldCwgYXN0LCBzb3VyY2VTcGFuKSk7XG4gICAgLy8gRG9uJ3QgZGV0ZWN0IGRpcmVjdGl2ZXMgZm9yIGV2ZW50IG5hbWVzIGZvciBub3csXG4gICAgLy8gc28gZG9uJ3QgYWRkIHRoZSBldmVudCBuYW1lIHRvIHRoZSBtYXRjaGFibGVBdHRyc1xuICB9XG5cbiAgcHJpdmF0ZSBfcGFyc2VMaXRlcmFsQXR0cihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRQcm9wczogQm91bmRFbGVtZW50T3JEaXJlY3RpdmVQcm9wZXJ0eVtdKSB7XG4gICAgdGFyZ2V0UHJvcHMucHVzaChuZXcgQm91bmRFbGVtZW50T3JEaXJlY3RpdmVQcm9wZXJ0eShcbiAgICAgICAgbmFtZSwgdGhpcy5fZXhwclBhcnNlci53cmFwTGl0ZXJhbFByaW1pdGl2ZSh2YWx1ZSwgJycpLCB0cnVlLCBzb3VyY2VTcGFuKSk7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZURpcmVjdGl2ZXMoc2VsZWN0b3JNYXRjaGVyOiBTZWxlY3Rvck1hdGNoZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Q3NzU2VsZWN0b3I6IENzc1NlbGVjdG9yKTogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10ge1xuICAgIHZhciBkaXJlY3RpdmVzID0gW107XG4gICAgc2VsZWN0b3JNYXRjaGVyLm1hdGNoKGVsZW1lbnRDc3NTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlbGVjdG9yLCBkaXJlY3RpdmUpID0+IHsgZGlyZWN0aXZlcy5wdXNoKGRpcmVjdGl2ZSk7IH0pO1xuICAgIC8vIE5lZWQgdG8gc29ydCB0aGUgZGlyZWN0aXZlcyBzbyB0aGF0IHdlIGdldCBjb25zaXN0ZW50IHJlc3VsdHMgdGhyb3VnaG91dCxcbiAgICAvLyBhcyBzZWxlY3Rvck1hdGNoZXIgdXNlcyBNYXBzIGluc2lkZS5cbiAgICAvLyBBbHNvIG5lZWQgdG8gbWFrZSBjb21wb25lbnRzIHRoZSBmaXJzdCBkaXJlY3RpdmUgaW4gdGhlIGFycmF5XG4gICAgTGlzdFdyYXBwZXIuc29ydChkaXJlY3RpdmVzLFxuICAgICAgICAgICAgICAgICAgICAgKGRpcjE6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgZGlyMjogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXIxQ29tcCA9IGRpcjEuaXNDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXIyQ29tcCA9IGRpcjIuaXNDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXIxQ29tcCAmJiAhZGlyMkNvbXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWRpcjFDb21wICYmIGRpcjJDb21wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlyZWN0aXZlc0luZGV4LmdldChkaXIxKSAtIHRoaXMuZGlyZWN0aXZlc0luZGV4LmdldChkaXIyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgcmV0dXJuIGRpcmVjdGl2ZXM7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVEaXJlY3RpdmVBc3RzKGVsZW1lbnROYW1lOiBzdHJpbmcsIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiBCb3VuZEVsZW1lbnRPckRpcmVjdGl2ZVByb3BlcnR5W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zc2libGVFeHBvcnRBc1ZhcnM6IFZhcmlhYmxlQXN0W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKTogRGlyZWN0aXZlQXN0W10ge1xuICAgIHZhciBtYXRjaGVkVmFyaWFibGVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgdmFyIGRpcmVjdGl2ZUFzdHMgPSBkaXJlY3RpdmVzLm1hcCgoZGlyZWN0aXZlOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpID0+IHtcbiAgICAgIHZhciBob3N0UHJvcGVydGllczogQm91bmRFbGVtZW50UHJvcGVydHlBc3RbXSA9IFtdO1xuICAgICAgdmFyIGhvc3RFdmVudHM6IEJvdW5kRXZlbnRBc3RbXSA9IFtdO1xuICAgICAgdmFyIGRpcmVjdGl2ZVByb3BlcnRpZXM6IEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3RbXSA9IFtdO1xuICAgICAgdGhpcy5fY3JlYXRlRGlyZWN0aXZlSG9zdFByb3BlcnR5QXN0cyhlbGVtZW50TmFtZSwgZGlyZWN0aXZlLmhvc3RQcm9wZXJ0aWVzLCBzb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3N0UHJvcGVydGllcyk7XG4gICAgICB0aGlzLl9jcmVhdGVEaXJlY3RpdmVIb3N0RXZlbnRBc3RzKGRpcmVjdGl2ZS5ob3N0TGlzdGVuZXJzLCBzb3VyY2VTcGFuLCBob3N0RXZlbnRzKTtcbiAgICAgIHRoaXMuX2NyZWF0ZURpcmVjdGl2ZVByb3BlcnR5QXN0cyhkaXJlY3RpdmUuaW5wdXRzLCBwcm9wcywgZGlyZWN0aXZlUHJvcGVydGllcyk7XG4gICAgICB2YXIgZXhwb3J0QXNWYXJzID0gW107XG4gICAgICBwb3NzaWJsZUV4cG9ydEFzVmFycy5mb3JFYWNoKCh2YXJBc3QpID0+IHtcbiAgICAgICAgaWYgKCh2YXJBc3QudmFsdWUubGVuZ3RoID09PSAwICYmIGRpcmVjdGl2ZS5pc0NvbXBvbmVudCkgfHxcbiAgICAgICAgICAgIChkaXJlY3RpdmUuZXhwb3J0QXMgPT0gdmFyQXN0LnZhbHVlKSkge1xuICAgICAgICAgIGV4cG9ydEFzVmFycy5wdXNoKHZhckFzdCk7XG4gICAgICAgICAgbWF0Y2hlZFZhcmlhYmxlcy5hZGQodmFyQXN0Lm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgRGlyZWN0aXZlQXN0KGRpcmVjdGl2ZSwgZGlyZWN0aXZlUHJvcGVydGllcywgaG9zdFByb3BlcnRpZXMsIGhvc3RFdmVudHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRBc1ZhcnMsIHNvdXJjZVNwYW4pO1xuICAgIH0pO1xuICAgIHBvc3NpYmxlRXhwb3J0QXNWYXJzLmZvckVhY2goKHZhckFzdCkgPT4ge1xuICAgICAgaWYgKHZhckFzdC52YWx1ZS5sZW5ndGggPiAwICYmICFTZXRXcmFwcGVyLmhhcyhtYXRjaGVkVmFyaWFibGVzLCB2YXJBc3QubmFtZSkpIHtcbiAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoYFRoZXJlIGlzIG5vIGRpcmVjdGl2ZSB3aXRoIFwiZXhwb3J0QXNcIiBzZXQgdG8gXCIke3ZhckFzdC52YWx1ZX1cImAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhckFzdC5zb3VyY2VTcGFuKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGlyZWN0aXZlQXN0cztcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZURpcmVjdGl2ZUhvc3RQcm9wZXJ0eUFzdHMoZWxlbWVudE5hbWU6IHN0cmluZywgaG9zdFByb3BzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0UHJvcGVydHlBc3RzOiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdFtdKSB7XG4gICAgaWYgKGlzUHJlc2VudChob3N0UHJvcHMpKSB7XG4gICAgICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2goaG9zdFByb3BzLCAoZXhwcmVzc2lvbjogc3RyaW5nLCBwcm9wTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHZhciBleHByQXN0ID0gdGhpcy5fcGFyc2VCaW5kaW5nKGV4cHJlc3Npb24sIHNvdXJjZVNwYW4pO1xuICAgICAgICB0YXJnZXRQcm9wZXJ0eUFzdHMucHVzaChcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUVsZW1lbnRQcm9wZXJ0eUFzdChlbGVtZW50TmFtZSwgcHJvcE5hbWUsIGV4cHJBc3QsIHNvdXJjZVNwYW4pKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZURpcmVjdGl2ZUhvc3RFdmVudEFzdHMoaG9zdExpc3RlbmVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50QXN0czogQm91bmRFdmVudEFzdFtdKSB7XG4gICAgaWYgKGlzUHJlc2VudChob3N0TGlzdGVuZXJzKSkge1xuICAgICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKGhvc3RMaXN0ZW5lcnMsIChleHByZXNzaW9uOiBzdHJpbmcsIHByb3BOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5fcGFyc2VFdmVudChwcm9wTmFtZSwgZXhwcmVzc2lvbiwgc291cmNlU3BhbiwgW10sIHRhcmdldEV2ZW50QXN0cyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVEaXJlY3RpdmVQcm9wZXJ0eUFzdHMoZGlyZWN0aXZlUHJvcGVydGllczoge1trZXk6IHN0cmluZ106IHN0cmluZ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3VuZFByb3BzOiBCb3VuZEVsZW1lbnRPckRpcmVjdGl2ZVByb3BlcnR5W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCb3VuZERpcmVjdGl2ZVByb3BzOiBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0W10pIHtcbiAgICBpZiAoaXNQcmVzZW50KGRpcmVjdGl2ZVByb3BlcnRpZXMpKSB7XG4gICAgICB2YXIgYm91bmRQcm9wc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBCb3VuZEVsZW1lbnRPckRpcmVjdGl2ZVByb3BlcnR5PigpO1xuICAgICAgYm91bmRQcm9wcy5mb3JFYWNoKGJvdW5kUHJvcCA9PiB7XG4gICAgICAgIHZhciBwcmV2VmFsdWUgPSBib3VuZFByb3BzQnlOYW1lLmdldChib3VuZFByb3AubmFtZSk7XG4gICAgICAgIGlmIChpc0JsYW5rKHByZXZWYWx1ZSkgfHwgcHJldlZhbHVlLmlzTGl0ZXJhbCkge1xuICAgICAgICAgIC8vIGdpdmUgW2FdPVwiYlwiIGEgaGlnaGVyIHByZWNlZGVuY2UgdGhhbiBhPVwiYlwiIG9uIHRoZSBzYW1lIGVsZW1lbnRcbiAgICAgICAgICBib3VuZFByb3BzQnlOYW1lLnNldChib3VuZFByb3AubmFtZSwgYm91bmRQcm9wKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChkaXJlY3RpdmVQcm9wZXJ0aWVzLCAoZWxQcm9wOiBzdHJpbmcsIGRpclByb3A6IHN0cmluZykgPT4ge1xuICAgICAgICB2YXIgYm91bmRQcm9wID0gYm91bmRQcm9wc0J5TmFtZS5nZXQoZWxQcm9wKTtcblxuICAgICAgICAvLyBCaW5kaW5ncyBhcmUgb3B0aW9uYWwsIHNvIHRoaXMgYmluZGluZyBvbmx5IG5lZWRzIHRvIGJlIHNldCB1cCBpZiBhbiBleHByZXNzaW9uIGlzIGdpdmVuLlxuICAgICAgICBpZiAoaXNQcmVzZW50KGJvdW5kUHJvcCkpIHtcbiAgICAgICAgICB0YXJnZXRCb3VuZERpcmVjdGl2ZVByb3BzLnB1c2gobmV3IEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QoXG4gICAgICAgICAgICAgIGRpclByb3AsIGJvdW5kUHJvcC5uYW1lLCBib3VuZFByb3AuZXhwcmVzc2lvbiwgYm91bmRQcm9wLnNvdXJjZVNwYW4pKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlRWxlbWVudFByb3BlcnR5QXN0cyhlbGVtZW50TmFtZTogc3RyaW5nLCBwcm9wczogQm91bmRFbGVtZW50T3JEaXJlY3RpdmVQcm9wZXJ0eVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IERpcmVjdGl2ZUFzdFtdKTogQm91bmRFbGVtZW50UHJvcGVydHlBc3RbXSB7XG4gICAgdmFyIGJvdW5kRWxlbWVudFByb3BzOiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdFtdID0gW107XG4gICAgdmFyIGJvdW5kRGlyZWN0aXZlUHJvcHNJbmRleCA9IG5ldyBNYXA8c3RyaW5nLCBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0PigpO1xuICAgIGRpcmVjdGl2ZXMuZm9yRWFjaCgoZGlyZWN0aXZlOiBEaXJlY3RpdmVBc3QpID0+IHtcbiAgICAgIGRpcmVjdGl2ZS5pbnB1dHMuZm9yRWFjaCgocHJvcDogQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdCkgPT4ge1xuICAgICAgICBib3VuZERpcmVjdGl2ZVByb3BzSW5kZXguc2V0KHByb3AudGVtcGxhdGVOYW1lLCBwcm9wKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb3BzLmZvckVhY2goKHByb3A6IEJvdW5kRWxlbWVudE9yRGlyZWN0aXZlUHJvcGVydHkpID0+IHtcbiAgICAgIGlmICghcHJvcC5pc0xpdGVyYWwgJiYgaXNCbGFuayhib3VuZERpcmVjdGl2ZVByb3BzSW5kZXguZ2V0KHByb3AubmFtZSkpKSB7XG4gICAgICAgIGJvdW5kRWxlbWVudFByb3BzLnB1c2godGhpcy5fY3JlYXRlRWxlbWVudFByb3BlcnR5QXN0KGVsZW1lbnROYW1lLCBwcm9wLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3AuZXhwcmVzc2lvbiwgcHJvcC5zb3VyY2VTcGFuKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGJvdW5kRWxlbWVudFByb3BzO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlRWxlbWVudFByb3BlcnR5QXN0KGVsZW1lbnROYW1lOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgYXN0OiBBU1QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pOiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCB7XG4gICAgdmFyIHVuaXQgPSBudWxsO1xuICAgIHZhciBiaW5kaW5nVHlwZTtcbiAgICB2YXIgYm91bmRQcm9wZXJ0eU5hbWU7XG4gICAgdmFyIHBhcnRzID0gbmFtZS5zcGxpdChQUk9QRVJUWV9QQVJUU19TRVBBUkFUT1IpO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGJvdW5kUHJvcGVydHlOYW1lID0gdGhpcy5fc2NoZW1hUmVnaXN0cnkuZ2V0TWFwcGVkUHJvcE5hbWUocGFydHNbMF0pO1xuICAgICAgYmluZGluZ1R5cGUgPSBQcm9wZXJ0eUJpbmRpbmdUeXBlLlByb3BlcnR5O1xuICAgICAgaWYgKCF0aGlzLl9zY2hlbWFSZWdpc3RyeS5oYXNQcm9wZXJ0eShlbGVtZW50TmFtZSwgYm91bmRQcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKFxuICAgICAgICAgICAgYENhbid0IGJpbmQgdG8gJyR7Ym91bmRQcm9wZXJ0eU5hbWV9JyBzaW5jZSBpdCBpc24ndCBhIGtub3duIG5hdGl2ZSBwcm9wZXJ0eWAsXG4gICAgICAgICAgICBzb3VyY2VTcGFuKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBhcnRzWzBdID09IEFUVFJJQlVURV9QUkVGSVgpIHtcbiAgICAgICAgYm91bmRQcm9wZXJ0eU5hbWUgPSBwYXJ0c1sxXTtcbiAgICAgICAgbGV0IG5zU2VwYXJhdG9ySWR4ID0gYm91bmRQcm9wZXJ0eU5hbWUuaW5kZXhPZignOicpO1xuICAgICAgICBpZiAobnNTZXBhcmF0b3JJZHggPiAtMSkge1xuICAgICAgICAgIGxldCBucyA9IGJvdW5kUHJvcGVydHlOYW1lLnN1YnN0cmluZygwLCBuc1NlcGFyYXRvcklkeCk7XG4gICAgICAgICAgbGV0IG5hbWUgPSBib3VuZFByb3BlcnR5TmFtZS5zdWJzdHJpbmcobnNTZXBhcmF0b3JJZHggKyAxKTtcbiAgICAgICAgICBib3VuZFByb3BlcnR5TmFtZSA9IG1lcmdlTnNBbmROYW1lKG5zLCBuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBiaW5kaW5nVHlwZSA9IFByb3BlcnR5QmluZGluZ1R5cGUuQXR0cmlidXRlO1xuICAgICAgfSBlbHNlIGlmIChwYXJ0c1swXSA9PSBDTEFTU19QUkVGSVgpIHtcbiAgICAgICAgYm91bmRQcm9wZXJ0eU5hbWUgPSBwYXJ0c1sxXTtcbiAgICAgICAgYmluZGluZ1R5cGUgPSBQcm9wZXJ0eUJpbmRpbmdUeXBlLkNsYXNzO1xuICAgICAgfSBlbHNlIGlmIChwYXJ0c1swXSA9PSBTVFlMRV9QUkVGSVgpIHtcbiAgICAgICAgdW5pdCA9IHBhcnRzLmxlbmd0aCA+IDIgPyBwYXJ0c1syXSA6IG51bGw7XG4gICAgICAgIGJvdW5kUHJvcGVydHlOYW1lID0gcGFydHNbMV07XG4gICAgICAgIGJpbmRpbmdUeXBlID0gUHJvcGVydHlCaW5kaW5nVHlwZS5TdHlsZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3JlcG9ydEVycm9yKGBJbnZhbGlkIHByb3BlcnR5IG5hbWUgJyR7bmFtZX0nYCwgc291cmNlU3Bhbik7XG4gICAgICAgIGJpbmRpbmdUeXBlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEJvdW5kRWxlbWVudFByb3BlcnR5QXN0KGJvdW5kUHJvcGVydHlOYW1lLCBiaW5kaW5nVHlwZSwgYXN0LCB1bml0LCBzb3VyY2VTcGFuKTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBfZmluZENvbXBvbmVudERpcmVjdGl2ZU5hbWVzKGRpcmVjdGl2ZXM6IERpcmVjdGl2ZUFzdFtdKTogc3RyaW5nW10ge1xuICAgIHZhciBjb21wb25lbnRUeXBlTmFtZXM6IHN0cmluZ1tdID0gW107XG4gICAgZGlyZWN0aXZlcy5mb3JFYWNoKGRpcmVjdGl2ZSA9PiB7XG4gICAgICB2YXIgdHlwZU5hbWUgPSBkaXJlY3RpdmUuZGlyZWN0aXZlLnR5cGUubmFtZTtcbiAgICAgIGlmIChkaXJlY3RpdmUuZGlyZWN0aXZlLmlzQ29tcG9uZW50KSB7XG4gICAgICAgIGNvbXBvbmVudFR5cGVOYW1lcy5wdXNoKHR5cGVOYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY29tcG9uZW50VHlwZU5hbWVzO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0T25seU9uZUNvbXBvbmVudChkaXJlY3RpdmVzOiBEaXJlY3RpdmVBc3RbXSwgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7XG4gICAgdmFyIGNvbXBvbmVudFR5cGVOYW1lcyA9IHRoaXMuX2ZpbmRDb21wb25lbnREaXJlY3RpdmVOYW1lcyhkaXJlY3RpdmVzKTtcbiAgICBpZiAoY29tcG9uZW50VHlwZU5hbWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKGBNb3JlIHRoYW4gb25lIGNvbXBvbmVudDogJHtjb21wb25lbnRUeXBlTmFtZXMuam9pbignLCcpfWAsIHNvdXJjZVNwYW4pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydE5vQ29tcG9uZW50c05vckVsZW1lbnRCaW5kaW5nc09uVGVtcGxhdGUoZGlyZWN0aXZlczogRGlyZWN0aXZlQXN0W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFByb3BzOiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge1xuICAgIHZhciBjb21wb25lbnRUeXBlTmFtZXM6IHN0cmluZ1tdID0gdGhpcy5fZmluZENvbXBvbmVudERpcmVjdGl2ZU5hbWVzKGRpcmVjdGl2ZXMpO1xuICAgIGlmIChjb21wb25lbnRUeXBlTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoYENvbXBvbmVudHMgb24gYW4gZW1iZWRkZWQgdGVtcGxhdGU6ICR7Y29tcG9uZW50VHlwZU5hbWVzLmpvaW4oJywnKX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlU3Bhbik7XG4gICAgfVxuICAgIGVsZW1lbnRQcm9wcy5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoXG4gICAgICAgICAgYFByb3BlcnR5IGJpbmRpbmcgJHtwcm9wLm5hbWV9IG5vdCB1c2VkIGJ5IGFueSBkaXJlY3RpdmUgb24gYW4gZW1iZWRkZWQgdGVtcGxhdGVgLFxuICAgICAgICAgIHNvdXJjZVNwYW4pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0QWxsRXZlbnRzUHVibGlzaGVkQnlEaXJlY3RpdmVzKGRpcmVjdGl2ZXM6IERpcmVjdGl2ZUFzdFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiBCb3VuZEV2ZW50QXN0W10pIHtcbiAgICB2YXIgYWxsRGlyZWN0aXZlRXZlbnRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZGlyZWN0aXZlcy5mb3JFYWNoKGRpcmVjdGl2ZSA9PiB7XG4gICAgICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2goZGlyZWN0aXZlLmRpcmVjdGl2ZS5vdXRwdXRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChldmVudE5hbWU6IHN0cmluZywgXykgPT4geyBhbGxEaXJlY3RpdmVFdmVudHMuYWRkKGV2ZW50TmFtZSk7IH0pO1xuICAgIH0pO1xuICAgIGV2ZW50cy5mb3JFYWNoKGV2ZW50ID0+IHtcbiAgICAgIGlmIChpc1ByZXNlbnQoZXZlbnQudGFyZ2V0KSB8fCAhU2V0V3JhcHBlci5oYXMoYWxsRGlyZWN0aXZlRXZlbnRzLCBldmVudC5uYW1lKSkge1xuICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihcbiAgICAgICAgICAgIGBFdmVudCBiaW5kaW5nICR7ZXZlbnQuZnVsbE5hbWV9IG5vdCBlbWl0dGVkIGJ5IGFueSBkaXJlY3RpdmUgb24gYW4gZW1iZWRkZWQgdGVtcGxhdGVgLFxuICAgICAgICAgICAgZXZlbnQuc291cmNlU3Bhbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgTm9uQmluZGFibGVWaXNpdG9yIGltcGxlbWVudHMgSHRtbEFzdFZpc2l0b3Ige1xuICB2aXNpdEVsZW1lbnQoYXN0OiBIdG1sRWxlbWVudEFzdCwgY29tcG9uZW50OiBDb21wb25lbnQpOiBFbGVtZW50QXN0IHtcbiAgICB2YXIgcHJlcGFyc2VkRWxlbWVudCA9IHByZXBhcnNlRWxlbWVudChhc3QpO1xuICAgIGlmIChwcmVwYXJzZWRFbGVtZW50LnR5cGUgPT09IFByZXBhcnNlZEVsZW1lbnRUeXBlLlNDUklQVCB8fFxuICAgICAgICBwcmVwYXJzZWRFbGVtZW50LnR5cGUgPT09IFByZXBhcnNlZEVsZW1lbnRUeXBlLlNUWUxFIHx8XG4gICAgICAgIHByZXBhcnNlZEVsZW1lbnQudHlwZSA9PT0gUHJlcGFyc2VkRWxlbWVudFR5cGUuU1RZTEVTSEVFVCkge1xuICAgICAgLy8gU2tpcHBpbmcgPHNjcmlwdD4gZm9yIHNlY3VyaXR5IHJlYXNvbnNcbiAgICAgIC8vIFNraXBwaW5nIDxzdHlsZT4gYW5kIHN0eWxlc2hlZXRzIGFzIHdlIGFscmVhZHkgcHJvY2Vzc2VkIHRoZW1cbiAgICAgIC8vIGluIHRoZSBTdHlsZUNvbXBpbGVyXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgYXR0ck5hbWVBbmRWYWx1ZXMgPSBhc3QuYXR0cnMubWFwKGF0dHJBc3QgPT4gW2F0dHJBc3QubmFtZSwgYXR0ckFzdC52YWx1ZV0pO1xuICAgIHZhciBzZWxlY3RvciA9IGNyZWF0ZUVsZW1lbnRDc3NTZWxlY3Rvcihhc3QubmFtZSwgYXR0ck5hbWVBbmRWYWx1ZXMpO1xuICAgIHZhciBuZ0NvbnRlbnRJbmRleCA9IGNvbXBvbmVudC5maW5kTmdDb250ZW50SW5kZXgoc2VsZWN0b3IpO1xuICAgIHZhciBjaGlsZHJlbiA9IGh0bWxWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4sIEVNUFRZX0NPTVBPTkVOVCk7XG4gICAgcmV0dXJuIG5ldyBFbGVtZW50QXN0KGFzdC5uYW1lLCBodG1sVmlzaXRBbGwodGhpcywgYXN0LmF0dHJzKSwgW10sIFtdLCBbXSwgW10sIGNoaWxkcmVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZ0NvbnRlbnRJbmRleCwgYXN0LnNvdXJjZVNwYW4pO1xuICB9XG4gIHZpc2l0Q29tbWVudChhc3Q6IEh0bWxDb21tZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdEF0dHIoYXN0OiBIdG1sQXR0ckFzdCwgY29udGV4dDogYW55KTogQXR0ckFzdCB7XG4gICAgcmV0dXJuIG5ldyBBdHRyQXN0KGFzdC5uYW1lLCBhc3QudmFsdWUsIGFzdC5zb3VyY2VTcGFuKTtcbiAgfVxuICB2aXNpdFRleHQoYXN0OiBIdG1sVGV4dEFzdCwgY29tcG9uZW50OiBDb21wb25lbnQpOiBUZXh0QXN0IHtcbiAgICB2YXIgbmdDb250ZW50SW5kZXggPSBjb21wb25lbnQuZmluZE5nQ29udGVudEluZGV4KFRFWFRfQ1NTX1NFTEVDVE9SKTtcbiAgICByZXR1cm4gbmV3IFRleHRBc3QoYXN0LnZhbHVlLCBuZ0NvbnRlbnRJbmRleCwgYXN0LnNvdXJjZVNwYW4pO1xuICB9XG59XG5cbmNsYXNzIEJvdW5kRWxlbWVudE9yRGlyZWN0aXZlUHJvcGVydHkge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgZXhwcmVzc2lvbjogQVNULCBwdWJsaWMgaXNMaXRlcmFsOiBib29sZWFuLFxuICAgICAgICAgICAgICBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRDbGFzc2VzKGNsYXNzQXR0clZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBTdHJpbmdXcmFwcGVyLnNwbGl0KGNsYXNzQXR0clZhbHVlLnRyaW0oKSwgL1xccysvZyk7XG59XG5cbmNsYXNzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBjcmVhdGUoZGlyZWN0aXZlczogRGlyZWN0aXZlQXN0W10pOiBDb21wb25lbnQge1xuICAgIGlmIChkaXJlY3RpdmVzLmxlbmd0aCA9PT0gMCB8fCAhZGlyZWN0aXZlc1swXS5kaXJlY3RpdmUuaXNDb21wb25lbnQpIHtcbiAgICAgIHJldHVybiBFTVBUWV9DT01QT05FTlQ7XG4gICAgfVxuICAgIHZhciBtYXRjaGVyID0gbmV3IFNlbGVjdG9yTWF0Y2hlcigpO1xuICAgIHZhciBuZ0NvbnRlbnRTZWxlY3RvcnMgPSBkaXJlY3RpdmVzWzBdLmRpcmVjdGl2ZS50ZW1wbGF0ZS5uZ0NvbnRlbnRTZWxlY3RvcnM7XG4gICAgdmFyIHdpbGRjYXJkTmdDb250ZW50SW5kZXggPSBudWxsO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmdDb250ZW50U2VsZWN0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc2VsZWN0b3IgPSBuZ0NvbnRlbnRTZWxlY3RvcnNbaV07XG4gICAgICBpZiAoU3RyaW5nV3JhcHBlci5lcXVhbHMoc2VsZWN0b3IsICcqJykpIHtcbiAgICAgICAgd2lsZGNhcmROZ0NvbnRlbnRJbmRleCA9IGk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXRjaGVyLmFkZFNlbGVjdGFibGVzKENzc1NlbGVjdG9yLnBhcnNlKG5nQ29udGVudFNlbGVjdG9yc1tpXSksIGkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IENvbXBvbmVudChtYXRjaGVyLCB3aWxkY2FyZE5nQ29udGVudEluZGV4KTtcbiAgfVxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmdDb250ZW50SW5kZXhNYXRjaGVyOiBTZWxlY3Rvck1hdGNoZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyB3aWxkY2FyZE5nQ29udGVudEluZGV4OiBudW1iZXIpIHt9XG5cbiAgZmluZE5nQ29udGVudEluZGV4KHNlbGVjdG9yOiBDc3NTZWxlY3Rvcik6IG51bWJlciB7XG4gICAgdmFyIG5nQ29udGVudEluZGljZXMgPSBbXTtcbiAgICB0aGlzLm5nQ29udGVudEluZGV4TWF0Y2hlci5tYXRjaChcbiAgICAgICAgc2VsZWN0b3IsIChzZWxlY3RvciwgbmdDb250ZW50SW5kZXgpID0+IHsgbmdDb250ZW50SW5kaWNlcy5wdXNoKG5nQ29udGVudEluZGV4KTsgfSk7XG4gICAgTGlzdFdyYXBwZXIuc29ydChuZ0NvbnRlbnRJbmRpY2VzKTtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMud2lsZGNhcmROZ0NvbnRlbnRJbmRleCkpIHtcbiAgICAgIG5nQ29udGVudEluZGljZXMucHVzaCh0aGlzLndpbGRjYXJkTmdDb250ZW50SW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gbmdDb250ZW50SW5kaWNlcy5sZW5ndGggPiAwID8gbmdDb250ZW50SW5kaWNlc1swXSA6IG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudENzc1NlbGVjdG9yKGVsZW1lbnROYW1lOiBzdHJpbmcsIG1hdGNoYWJsZUF0dHJzOiBzdHJpbmdbXVtdKTogQ3NzU2VsZWN0b3Ige1xuICB2YXIgY3NzU2VsZWN0b3IgPSBuZXcgQ3NzU2VsZWN0b3IoKTtcbiAgbGV0IGVsTmFtZU5vTnMgPSBzcGxpdE5zTmFtZShlbGVtZW50TmFtZSlbMV07XG5cbiAgY3NzU2VsZWN0b3Iuc2V0RWxlbWVudChlbE5hbWVOb05zKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG1hdGNoYWJsZUF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGF0dHJOYW1lID0gbWF0Y2hhYmxlQXR0cnNbaV1bMF07XG4gICAgbGV0IGF0dHJOYW1lTm9OcyA9IHNwbGl0TnNOYW1lKGF0dHJOYW1lKVsxXTtcbiAgICBsZXQgYXR0clZhbHVlID0gbWF0Y2hhYmxlQXR0cnNbaV1bMV07XG5cbiAgICBjc3NTZWxlY3Rvci5hZGRBdHRyaWJ1dGUoYXR0ck5hbWVOb05zLCBhdHRyVmFsdWUpO1xuICAgIGlmIChhdHRyTmFtZS50b0xvd2VyQ2FzZSgpID09IENMQVNTX0FUVFIpIHtcbiAgICAgIHZhciBjbGFzc2VzID0gc3BsaXRDbGFzc2VzKGF0dHJWYWx1ZSk7XG4gICAgICBjbGFzc2VzLmZvckVhY2goY2xhc3NOYW1lID0+IGNzc1NlbGVjdG9yLmFkZENsYXNzTmFtZShjbGFzc05hbWUpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNzc1NlbGVjdG9yO1xufVxuXG52YXIgRU1QVFlfQ09NUE9ORU5UID0gbmV3IENvbXBvbmVudChuZXcgU2VsZWN0b3JNYXRjaGVyKCksIG51bGwpO1xudmFyIE5PTl9CSU5EQUJMRV9WSVNJVE9SID0gbmV3IE5vbkJpbmRhYmxlVmlzaXRvcigpO1xuXG5cbmV4cG9ydCBjbGFzcyBQaXBlQ29sbGVjdG9yIGV4dGVuZHMgUmVjdXJzaXZlQXN0VmlzaXRvciB7XG4gIHBpcGVzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICB2aXNpdFBpcGUoYXN0OiBCaW5kaW5nUGlwZSk6IGFueSB7XG4gICAgdGhpcy5waXBlcy5hZGQoYXN0Lm5hbWUpO1xuICAgIGFzdC5leHAudmlzaXQodGhpcyk7XG4gICAgdGhpcy52aXNpdEFsbChhc3QuYXJncyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==