import { UrlTree, RouteTree } from './segments';
import { Type } from './facade/lang';
import { ComponentResolver } from '@angular/core';
export declare function recognize(componentResolver: ComponentResolver, type: Type, url: UrlTree): Promise<RouteTree>;
