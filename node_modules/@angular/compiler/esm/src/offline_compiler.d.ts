import { CompileDirectiveMetadata, CompilePipeMetadata } from './compile_metadata';
import { StyleCompiler } from './style_compiler';
import { ViewCompiler } from './view_compiler/view_compiler';
import { TemplateParser } from './template_parser';
import { DirectiveNormalizer } from './directive_normalizer';
import { OutputEmitter } from './output/abstract_emitter';
import { XHR } from './xhr';
export declare class SourceModule {
    moduleUrl: string;
    source: string;
    constructor(moduleUrl: string, source: string);
}
export declare class StyleSheetSourceWithImports {
    source: SourceModule;
    importedUrls: string[];
    constructor(source: SourceModule, importedUrls: string[]);
}
export declare class NormalizedComponentWithViewDirectives {
    component: CompileDirectiveMetadata;
    directives: CompileDirectiveMetadata[];
    pipes: CompilePipeMetadata[];
    constructor(component: CompileDirectiveMetadata, directives: CompileDirectiveMetadata[], pipes: CompilePipeMetadata[]);
}
export declare class OfflineCompiler {
    private _directiveNormalizer;
    private _templateParser;
    private _styleCompiler;
    private _viewCompiler;
    private _outputEmitter;
    private _xhr;
    constructor(_directiveNormalizer: DirectiveNormalizer, _templateParser: TemplateParser, _styleCompiler: StyleCompiler, _viewCompiler: ViewCompiler, _outputEmitter: OutputEmitter, _xhr: XHR);
    normalizeDirectiveMetadata(directive: CompileDirectiveMetadata): Promise<CompileDirectiveMetadata>;
    compileTemplates(components: NormalizedComponentWithViewDirectives[]): SourceModule;
    loadAndCompileStylesheet(stylesheetUrl: string, shim: boolean, suffix: string): Promise<StyleSheetSourceWithImports>;
    private _compileComponent(compMeta, directives, pipes, targetStatements);
    private _codgenStyles(inputUrl, shim, suffix, stylesCompileResult);
    private _codegenSourceModule(moduleUrl, statements, exportedVars);
}
