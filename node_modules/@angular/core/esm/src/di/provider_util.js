import { Provider } from './provider';
export function isProviderLiteral(obj) {
    return obj && typeof obj == 'object' && obj.provide;
}
export function createProvider(obj) {
    return new Provider(obj.provide, obj);
}
//# sourceMappingURL=provider_util.js.map