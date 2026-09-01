import fs from 'node:fs';
const read = (name) => Object.freeze(JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8')));
export const SPEC = read('./spec.v1.json');
export const PACKAGE = read('./package.v1.json');
export const EXECUTION_TUPLE = read('./execution-tuple.v1.json');
const checkoutUrl = new URL('./declared-checkout.v1.json', import.meta.url);
export const DECLARED_CHECKOUT = fs.existsSync(checkoutUrl) ? read('./declared-checkout.v1.json') : null;
