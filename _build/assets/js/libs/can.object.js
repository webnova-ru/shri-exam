/*!
 * CanJS - 1.1.8
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 24 Sep 2013 21:59:56 GMT
 * Licensed MIT
 * Includes: can/util/object
 * Download from: http://canjs.com
 */

!function(t){var e=t.isArray,n=function(t){var e=0;for(var n in t)e++;return e};t.Object={};var i=t.Object.same=function(n,a,o,s,u,c){var l,d=typeof n,h=e(n),f=typeof o;if(("string"==f||null===o)&&(o=r[o],f="function"),"function"==f)return o(n,a,s,u);if(o=o||{},n instanceof Date)return n===a;if(-1===c)return"object"===d||n===a;if(d!==typeof a||h!==e(a))return!1;if(n===a)return!0;if(h){if(n.length!==a.length)return!1;for(var p=0;p<n.length;p++)if(l=void 0===o[p]?o["*"]:o[p],!i(n[p],a[p],n,a,l))return!1;return!0}if("object"===d||"function"===d){var m=t.extend({},a);for(var g in n){if(l=void 0===o[g]?o["*"]:o[g],!i(n[g],a[g],l,n,a,c===!1?-1:void 0))return!1;delete m[g]}for(g in m)if(void 0===o[g]||!i(void 0,a[g],o[g],n,a,c===!1?-1:void 0))return!1;return!0}return!1};t.Object.subsets=function(e,i,r){var a=i.length,o=[];n(e);for(var s=0;a>s;s++){var u=i[s];t.Object.subset(e,u,r)&&o.push(u)}return o},t.Object.subset=function(t,e,n){var n=n||{};for(var r in e)if(!i(t[r],e[r],n[r],t,e))return!1;return!0};var r={"null":function(){return!0},i:function(t,e){return(""+t).toLowerCase()==(""+e).toLowerCase()}};return t.Object}(can);