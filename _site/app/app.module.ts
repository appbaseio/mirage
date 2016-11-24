import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { QueryBlocksComponent } from "./queryBlocks/queryBlocks.component";
import { JsonEditorComponent } from "./jsonEditor/jsonEditor.component";
import { ResultComponent } from "./result/result.component";
import { SaveQueryComponent } from './features/save/save.query.component';
import { ListQueryComponent } from './features/list/list.query.component';
import { ShareUrlComponent } from './features/share/share.url.component';
import { ErrorModalComponent } from "./features/modal/error-modal.component";
import { ConfirmModalComponent } from "./features/confirm/confirm-modal.component";
import { AppselectComponent } from "./features/appselect/appselect.component";
import { DocSidebarComponent } from "./features/docSidebar/docsidebar.component";
import { LearnModalComponent } from "./features/learn/learn.component";
// queryBlocks
import { BoolqueryComponent } from "./queryBlocks/boolquery/boolquery.component";
import { TypesComponent } from "./queryBlocks/types/types.component";
// boolquery
import { SinglequeryComponent } from "./queryBlocks/singlequery/singlequery.component";
import { EditableComponent } from './queryBlocks/editable/editable.component';
// editable
import { select2Component } from './queryBlocks/select2/select2.component';
// subscribe modal
import { SubscribeModalComponent } from './features/subscribe/subscribe.component';
import { AuthOperation } from './features/subscribe/AuthOperation';
// singlequery
import { MatchQuery } from './queryBlocks/singlequery/queries/match.query';
import { Match_phraseQuery } from './queryBlocks/singlequery/queries/match_phrase.query';
import { Match_phase_prefixQuery } from './queryBlocks/singlequery/queries/match_phase_prefix.query';
import { RangeQuery } from './queryBlocks/singlequery/queries/range.query';
import { GtQuery } from './queryBlocks/singlequery/queries/gt.query';
import { LtQuery } from './queryBlocks/singlequery/queries/lt.query';
import { TermQuery } from './queryBlocks/singlequery/queries/term.query';
import { ExistsQuery } from './queryBlocks/singlequery/queries/exists.query';
import { TermsQuery } from './queryBlocks/singlequery/queries/terms.query';
import { PrefixQuery } from './queryBlocks/singlequery/queries/prefix.query';
import { MultiMatchQuery } from './queryBlocks/singlequery/queries/multi-match.query';
import { QueryStringQuery } from './queryBlocks/singlequery/queries/query_string.query';
import { SimpleQueryStringQuery } from './queryBlocks/singlequery/queries/simple_query_string.query';
import { MissingQuery } from './queryBlocks/singlequery/queries/missing.query';
import { WildcardQuery } from './queryBlocks/singlequery/queries/wildcard.query';
import { RegexpQuery } from './queryBlocks/singlequery/queries/regexp.query';
import { FuzzyQuery } from './queryBlocks/singlequery/queries/fuzzy.query';
import { IdsQuery } from './queryBlocks/singlequery/queries/ids.query';
import { CommonQuery } from './queryBlocks/singlequery/queries/common.query';
import { GeoDistanceQuery } from './queryBlocks/singlequery/queries/geodistance.query';
import { GeoBoundingBoxQuery } from './queryBlocks/singlequery/queries/geoboundingbox.query';
import { GeoDistanceRangeQuery } from './queryBlocks/singlequery/queries/geodistancerange.query';
import { GeoPolygonQuery } from './queryBlocks/singlequery/queries/geopolygon.query';
import { GeoHashCellQuery } from './queryBlocks/singlequery/queries/geohashcell.query';
import { GeoShapeQuery } from './queryBlocks/singlequery/queries/geoshape.query';
import { SpanTermQuery } from './queryBlocks/singlequery/queries/span_term.query';
import { SpanFirstQuery } from './queryBlocks/singlequery/queries/span_first.query';
// Pipes
import { prettyJson } from "./shared/pipes/prettyJson";
import { prettyTime } from "./shared/pipes/prettyTime";
// list
import { TimeComponent } from "./features/list/time/time.component";
// sort
import { SortBlockComponent } from "./queryBlocks/sortBlock/sortBlock.component";

@NgModule({
  imports: [ 
  	BrowserModule,
  	FormsModule,
    HttpModule
  ],
  declarations: [ 
  	AppComponent,
  	QueryBlocksComponent, 
  	JsonEditorComponent, 
  	ResultComponent, 
  	SaveQueryComponent, 
  	ListQueryComponent, 
  	ShareUrlComponent, 
  	AppselectComponent, 
  	ErrorModalComponent, 
  	DocSidebarComponent, 
  	ConfirmModalComponent, 
  	LearnModalComponent,
  	BoolqueryComponent,
  	TypesComponent,
    SortBlockComponent,
  	SinglequeryComponent, 
  	EditableComponent,
  	select2Component,
    SubscribeModalComponent,
    AuthOperation,
  	EditableComponent,
  	SinglequeryComponent,
  	select2Component,
  	MatchQuery,
  	Match_phraseQuery,
  	Match_phase_prefixQuery,
  	RangeQuery,
  	GtQuery,
  	LtQuery,
  	TermQuery,
  	TermsQuery,
  	ExistsQuery,
  	MultiMatchQuery,
  	QueryStringQuery,
  	SimpleQueryStringQuery,
  	MissingQuery,
  	PrefixQuery,
  	WildcardQuery,
  	RegexpQuery,
  	FuzzyQuery,
  	IdsQuery,
    GeoDistanceQuery,
    GeoBoundingBoxQuery,
    GeoDistanceRangeQuery,
    GeoPolygonQuery,
    GeoHashCellQuery,
    GeoShapeQuery,
    CommonQuery,
    SpanTermQuery,
  	SpanFirstQuery,
  	prettyJson,
  	TimeComponent,
  	prettyTime
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
