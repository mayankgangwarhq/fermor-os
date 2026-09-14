import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function lodashVirtualPlugin(): Plugin {
  const implementations: Record<string, string> = {
    isFunction: `export default function(v) { return typeof v === 'function'; }`,
    isNil: `export default function(v) { return v === null || v === undefined; }`,
    isString: `export default function(v) { return typeof v === 'string'; }`,
    isNumber: `export default function(v) { return typeof v === 'number' && !isNaN(v); }`,
    isObject: `export default function(v) { return v !== null && typeof v === 'object'; }`,
    isPlainObject: `export default function(v) { return v !== null && typeof v === 'object' && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null); }`,
    isEqual: `export default function(a, b) { return JSON.stringify(a) === JSON.stringify(b); }`,
    isBoolean: `export default function(v) { return typeof v === 'boolean'; }`,
    isNaN: `export default function(v) { return Number.isNaN(v); }`,
    get: `export default function(obj, path, def) { const p = Array.isArray(path) ? path : String(path).replace(/\\[(\\w+)\\]/g, '.$1').replace(/^\\./, '').split('.'); let cur = obj; for (const k of p) { if (cur == null) return def; cur = cur[k]; } return cur === undefined ? def : cur; }`,
    set: `export default function(obj, path, val) { const p = Array.isArray(path) ? path : String(path).split('.'); let cur = obj; for (let i = 0; i < p.length - 1; i++) { if (!cur[p[i]]) cur[p[i]] = {}; cur = cur[p[i]]; } cur[p[p.length - 1]] = val; return obj; }`,
    max: `export default function(arr) { return arr && arr.length ? Math.max(...arr) : undefined; }`,
    min: `export default function(arr) { return arr && arr.length ? Math.min(...arr) : undefined; }`,
    maxBy: `export default function(arr, fn) { if (!arr || !arr.length) return undefined; const f = typeof fn === 'function' ? fn : (x => x?.[fn]); return arr.reduce((max, x) => (f(x) > f(max) ? x : max), arr[0]); }`,
    minBy: `export default function(arr, fn) { if (!arr || !arr.length) return undefined; const f = typeof fn === 'function' ? fn : (x => x?.[fn]); return arr.reduce((min, x) => (f(x) < f(min) ? x : min), arr[0]); }`,
    range: `export default function(start, end, step = 1) { if (end === undefined) { end = start; start = 0; } const res = []; for (let i = start; i < end; i += step) res.push(i); return res; }`,
    throttle: `export default function(fn, wait = 0) { let t = null; return function(...args) { if (!t) { fn.apply(this, args); t = setTimeout(() => { t = null; }, wait); } }; }`,
    sortBy: `export default function(arr, fns) { const a = [...(arr || [])]; const fn = Array.isArray(fns) ? fns[0] : fns; const getter = typeof fn === 'function' ? fn : (x => x?.[fn]); return a.sort((x, y) => (getter(x) > getter(y) ? 1 : -1)); }`,
    uniqBy: `export default function(arr, fn) { const seen = new Set(); const getter = typeof fn === 'function' ? fn : (x => x?.[fn]); return (arr || []).filter(x => { const key = getter(x); if (seen.has(key)) return false; seen.add(key); return true; }); }`,
    flatMap: `export default function(arr, fn) { return (arr || []).flatMap(typeof fn === 'function' ? fn : (x => x?.[fn])); }`,
    mapValues: `export default function(obj, fn) { const res = {}; const f = typeof fn === 'function' ? fn : (x => x?.[fn]); for (const k in obj) res[k] = f(obj[k], k, obj); return res; }`,
    upperFirst: `export default function(s) { return typeof s === 'string' && s.length ? s[0].toUpperCase() + s.slice(1) : ''; }`,
    lowerFirst: `export default function(s) { return typeof s === 'string' && s.length ? s[0].toLowerCase() + s.slice(1) : ''; }`,
    find: `export default function(arr, fn) { return (arr || []).find(typeof fn === 'function' ? fn : (x => typeof fn === 'object' ? Object.keys(fn).every(k => x?.[k] === fn[k]) : false)); }`,
    every: `export default function(arr, fn) { return (arr || []).every(typeof fn === 'function' ? fn : (x => !!x)); }`,
    some: `export default function(arr, fn) { return (arr || []).some(typeof fn === 'function' ? fn : (x => !!x)); }`,
    memoize: `export default function(fn) { const cache = new Map(); return function(...args) { const k = JSON.stringify(args); if (cache.has(k)) return cache.get(k); const res = fn.apply(this, args); cache.set(k, res); return res; }; }`,
    last: `export default function(arr) { return arr && arr.length ? arr[arr.length - 1] : undefined; }`,
    sumBy: `export default function(arr, fn) { const f = typeof fn === 'function' ? fn : (x => x?.[fn]); return (arr || []).reduce((acc, x) => acc + (Number(f(x)) || 0), 0); }`,
    identity: `export default function(v) { return v; }`,
    cloneDeep: `export default function(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }`,
  };

  return {
    name: 'vite-plugin-lodash-virtual',
    resolveId(source) {
      if (source.startsWith('lodash/')) {
        return '\0virtual:' + source;
      }
      return null;
    },
    load(id) {
      if (id.startsWith('\0virtual:lodash/')) {
        const fnName = id.replace('\0virtual:lodash/', '');
        return implementations[fnName] || `export default function() { return undefined; }`;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [lodashVirtualPlugin(), react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
  },
});
