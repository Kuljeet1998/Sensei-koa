'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
exports.href = href;
exports.hasNextPages = hasNextPages;
exports.getArrayPages = getArrayPages;


var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _lodash = require('lodash.assign');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.clone');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isobject');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function href(ctx) {

  return function (prev, params) {

    var query = (0, _lodash4.default)(ctx.query);

    if ((typeof prev === 'undefined' ? 'undefined' : _typeof(prev)) === 'object') {
      params = prev;
      prev = false;
    } else {
      prev = typeof prev === 'boolean' ? prev : false;
      var page = query.page || 1;
      page = prev ? page -= 1 : page += 1;
      page = page < 1 ? 1 : page;
    }

    query.page = page
    // allow overriding querystring params
    // (useful for sorting and filtering)
    // another alias for `_.assign` is `_.extend`
    if ((0, _lodash6.default)(params)) query = (0, _lodash2.default)(query, params);

    return _url2.default.parse(ctx.originalUrl).pathname + '?' + _querystring2.default.stringify(query);
  };
}

function hasNextPages(ctx) {
  return function (pageCount) {
    if (typeof pageCount !== 'number' || pageCount < 0) throw new Error('koa-ctx-paginate: `pageCount` is not a number >= 0');
    return ctx.query.page < pageCount;
  };
}

function getArrayPages(ctx) {
  return function (limit, pageCount, currentPage) {

    // limit default is 3
    limit = limit || 3;

    if (typeof limit !== 'number' || limit < 0) throw new Error('koa-ctx-paginate: `limit` is not a number >= 0');

    if (typeof pageCount !== 'number' || pageCount < 0) throw new Error('koa-ctx-paginate: `pageCount` is not a number >= 0');

    if (typeof currentPage !== 'number' || currentPage < 0) throw new Error('koa-ctx-paginate: `currentPage` is not a number >= 0');

    if (limit > 0) {
      var end = Math.min(Math.max(currentPage + Math.floor(limit / 2), limit), pageCount);
      var start = Math.max(1, currentPage < limit - 1 ? 1 : end - limit + 1);
      var pages = [];
      for (var i = start; i <= end; i++) {
        
        if(ctx.query.page!==undefined)
        {
        pages.push({
          number: i,
          url: exports.href(ctx)().replace('page=' + currentPage + 1, 'page=' + i)
        });
        }
        else
        {
          pages.push({
          number: i,
          url: exports.href(ctx)().replace('page=' + (currentPage + 1), 'page=' + i)
        });
        }
      }
      return pages;
    }
  };
}