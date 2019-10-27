"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var httpCode;
(function (httpCode) {
    httpCode[httpCode["DEFAULT"] = 0] = "DEFAULT";
    httpCode[httpCode["NORMAL"] = 200] = "NORMAL";
    httpCode[httpCode["BIZ_ERROR"] = 400] = "BIZ_ERROR";
    httpCode[httpCode["COMMON_ERROR"] = 420] = "COMMON_ERROR";
    httpCode[httpCode["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
})(httpCode = exports.httpCode || (exports.httpCode = {}));
function mapCommonErrorType(commonErr) {
    for (var key in commonErr) {
        if (commonErr.hasOwnProperty(key) && commonErr[key]) {
            var err = __assign({}, commonErr[key], { kind: key });
            switch (key) {
                case 'genericError':
                    return err;
                case 'authError':
                    return err;
                case 'validateError':
                    return err;
                case 'bindError':
                    return err;
                default:
                    return null;
            }
        }
    }
    return null;
}
exports.mapCommonErrorType = mapCommonErrorType;
function errorHandling(err) {
    if (!err || err.response === undefined) {
        throw err;
    }
    var data;
    try {
        data = JSON.parse(err.response.data);
    }
    catch (e) {
        data = err.response.data;
    }
    switch (err.response.status) {
        case httpCode.BIZ_ERROR:
            return Promise.reject(__assign({}, err, { message: data.message }));
        case httpCode.COMMON_ERROR:
            var returnErr = mapCommonErrorType(data);
            if (!returnErr) {
                throw err;
            }
            return Promise.reject(__assign({}, err.response, returnErr));
        default:
            return Promise.reject(err);
    }
}
exports.errorHandling = errorHandling;
function encode(val) {
    return encodeURIComponent(val).
        replace(/%40/gi, '@').
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
}
exports.encode = encode;
function generateQueryUrl(url, params) {
    if (!params) {
        return url;
    }
    var parts = [];
    var _loop_1 = function (key) {
        var val = void 0;
        if (Object.prototype.hasOwnProperty(key)) {
            val = params[key];
        }
        if (val === null || typeof val === 'undefined') {
            return { value: '' };
        }
        var k, vals = void 0;
        if (val.toString() === '[object Array]') {
            k = key + '[]';
        }
        else {
            k = key;
            vals = [val];
        }
        vals.forEach(function (v) {
            if (v.toString() === '[object File]') {
                v = v.toISOString();
            }
            else if (typeof v === 'object') {
                v = JSON.stringify(v);
            }
            parts.push(encode(k) + '=' + encode(v));
        });
    };
    for (var key in params) {
        var state_1 = _loop_1(key);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    var serializedParams = parts.join('&');
    if (serializedParams) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }
    return url;
}
exports.generateQueryUrl = generateQueryUrl;
function generateUrl(url, serviceName, functionName) {
    return url + "/" + serviceName + "." + functionName;
}
exports.generateUrl = generateUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFjQSxJQUFZLFFBTVg7QUFORCxXQUFZLFFBQVE7SUFDaEIsNkNBQVcsQ0FBQTtJQUNYLDZDQUFZLENBQUE7SUFDWixtREFBZSxDQUFBO0lBQ2YseURBQWtCLENBQUE7SUFDbEIsNkRBQW9CLENBQUE7QUFDeEIsQ0FBQyxFQU5XLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBTW5CO0FBS0QsU0FBZ0Isa0JBQWtCLENBQUMsU0FBc0I7SUFDckQsS0FBSyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUU7UUFDdkIsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNqRCxJQUFJLEdBQUcsZ0JBQU8sU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFFLElBQUksRUFBRSxHQUFHLEdBQUMsQ0FBQTtZQUN4QyxRQUFRLEdBQUcsRUFBRTtnQkFDVCxLQUFLLGNBQWM7b0JBQ2YsT0FBTyxHQUFtQixDQUFBO2dCQUM5QixLQUFLLFdBQVc7b0JBQ1osT0FBTyxHQUFnQixDQUFBO2dCQUMzQixLQUFLLGVBQWU7b0JBQ2hCLE9BQU8sR0FBb0IsQ0FBQTtnQkFDL0IsS0FBSyxXQUFXO29CQUNaLE9BQU8sR0FBZ0IsQ0FBQTtnQkFDM0I7b0JBQ0ksT0FBTyxJQUFJLENBQUE7YUFDbEI7U0FFSjtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUE7QUFDZixDQUFDO0FBcEJELGdEQW9CQztBQUtELFNBQWdCLGFBQWEsQ0FBQyxHQUFHO0lBQzdCLElBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7UUFDbkMsTUFBTSxHQUFHLENBQUM7S0FDYjtJQUNELElBQUksSUFBSSxDQUFDO0lBQ1QsSUFBSTtRQUNBLElBQUksR0FBRyxJQUFJ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RCxJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFdkMsSUFBSSxnQkFBZ0IsRUFBRTtRQUNsQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGdCQUFnQixDQUFDO0tBQ25FO0lBQ0QsT0FBTyxHQUFHLENBQUE7QUFDZCxDQUFDO0FBNUNELDRDQTRDQztBQWFELFNBQWdCLFdBQVcsQ0FBSSxHQUFXLEVBQUUsV0FBbUIsRUFBRSxZQUFvQjtJQUNqRixPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsV0FBVyxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUM7QUFDeEQsQ0FBQztBQUZELGtDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgYnkgJ3Byb3RvYXBpJ1xuKiBUaGUgZmlsZSBjb250YWlucyBoZWxwZXIgZnVuY3Rpb25zIHRoYXQgd291bGQgYmUgdXNlZCBpbiBnZW5lcmF0ZWQgYXBpIGZpbGUsIHVzdWFsbHkgaW4gJy4vYXBpLnRzJyBvciAnLi94eHhTZXJ2aWNlLnRzJ1xuKiBUaGUgZ2VuZXJhdGVkIGNvZGUgaXMgd3JpdHRlbiBpbiBUeXBlU2NyaXB0XG4qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiog6K+l5paH5Lu255Sf5oiQ5LqOcHJvdG9hcGlcbiog5paH5Lu25YyF5ZCr5LiA5Lqb5Ye95pWw5Y2P5Yqp55Sf5oiQ55qE5YmN56uv6LCD55SoQVBJXG4qIOaWh+S7tuWGheS7o+eggeS9v+eUqFR5cGVTY3JpcHRcbiovXG5pbXBvcnQgeyBDb21tb25FcnJvciwgR2VuZXJpY0Vycm9yLCBBdXRoRXJyb3IsIFZhbGlkYXRlRXJyb3IsIEJpbmRFcnJvciB9IGZyb20gJy4vQXBwU2VydmljZU9ianMnXG5leHBvcnQgdHlwZSBDb21tb25FcnJvclR5cGUgPSBHZW5lcmljRXJyb3IgfCBBdXRoRXJyb3IgfCBCaW5kRXJyb3IgfCBWYWxpZGF0ZUVycm9yXG4vKipcbiAqIERlZmluZWQgSHR0cCBDb2RlIGZvciByZXNwb25zZSBoYW5kbGluZ1xuICovXG5leHBvcnQgZW51bSBodHRwQ29kZSB7XG4gICAgREVGQVVMVCA9IDAsXG4gICAgTk9STUFMID0gMjAwLFxuICAgIEJJWl9FUlJPUiA9IDQwMCxcbiAgICBDT01NT05fRVJST1IgPSA0MjAsXG4gICAgSU5URVJOQUxfRVJST1IgPSA1MDAsXG59XG4vKipcbiAqXG4gKiBAcGFyYW0ge0NvbW1vbkVycm9yfSBjb21tb25FcnIgdGhlIGVycm9yIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwQ29tbW9uRXJyb3JUeXBlKGNvbW1vbkVycjogQ29tbW9uRXJyb3IpOiBDb21tb25FcnJvclR5cGUgfCBudWxsIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gY29tbW9uRXJyKSB7XG4gICAgICAgIGlmIChjb21tb25FcnIuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBjb21tb25FcnJba2V5XSkge1xuICAgICAgICAgICAgbGV0IGVyciA9IHsuLi5jb21tb25FcnJba2V5XSwga2luZDoga2V5fVxuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdnZW5lcmljRXJyb3InOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJyIGFzIEdlbmVyaWNFcnJvclxuICAgICAgICAgICAgICAgIGNhc2UgJ2F1dGhFcnJvcic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlcnIgYXMgQXV0aEVycm9yXG4gICAgICAgICAgICAgICAgY2FzZSAndmFsaWRhdGVFcnJvcic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlcnIgYXMgVmFsaWRhdGVFcnJvclxuICAgICAgICAgICAgICAgIGNhc2UgJ2JpbmRFcnJvcic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlcnIgYXMgQmluZEVycm9yXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICAgIH1cbiAgXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbn1cbi8qKlxuICpcbiAqIEBwYXJhbSB7cmVzcG9uc2V9IHJlc3BvbnNlIHRoZSBlcnJvciByZXNwb25zZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXJyb3JIYW5kbGluZyhlcnIpOiBQcm9taXNlPG5ldmVyPiB7XG4gICAgaWYoIWVyciB8fCBlcnIucmVzcG9uc2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICAgIGxldCBkYXRhO1xuICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGVyci5yZXNwb25zZS5kYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRhdGEgPSBlcnIucmVzcG9uc2UuZGF0YTtcbiAgICB9XG4gICAgc3dpdGNoIChlcnIucmVzcG9uc2Uuc3RhdHVzKSB7XG4gICAgICAgIGNhc2UgaHR0cENvZGUuQklaX0VSUk9SOlxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHsuLi5lcnIsIG1lc3NhZ2U6IGRhdGEubWVzc2FnZX0pO1xuXG4gICAgICAgIGNhc2UgaHR0cENvZGUuQ09NTU9OX0VSUk9SOlxuICAgICAgICAgICAgbGV0IHJldHVybkVyciA9IG1hcENvbW1vbkVycm9yVHlwZShkYXRhKTtcbiAgICAgICAgICAgIGlmKCFyZXR1cm5FcnIpe1xuICAgICAgICAgICAgICAgIHRocm93IGVyclxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHsuLi5lcnIucmVzcG9uc2UsIC4uLnJldHVybkVycn0pO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycilcblxuICAgIH1cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHZhbCBhIHN0cmluZ1xuICogQHJldHVybnMgYW4gZW5jb2RlZCBzdHJpbmcgdGhhdCBjYW4gYmUgYXBwZW5kIHRvIGFwaSB1cmxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZSh2YWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgICAgICByZXBsYWNlKC8lNDAvZ2ksICdAJykuXG4gICAgICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICAgICAgcmVwbGFjZSgvJTI0L2csICckJykuXG4gICAgICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICAgICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgICAgIHJlcGxhY2UoLyU1Qi9naSwgJ1snKS5cbiAgICAgICAgcmVwbGFjZSgvJTVEL2dpLCAnXScpO1xufVxuXG4vKipcbiAqIEJ1aWxkIGEgVVJMIGJ5IGFwcGVuZGluZyBwYXJhbXMgdG8gdGhlIGVuZFxuICogQHBhcmFtIHVybCA6IHRoZSBiYXNlIHVybCBmb3IgdGhlIHNlcnZpY2VcbiAqIEBwYXJhbSBwYXJhbXMgOiB0aGUgcmVxdWVzdCBvYmplY3QuIGUuZy4gZm9yIEhlbGxvUmVxdWVzdCB3b3VsZCBiZSB0aGUgb2JqZWN0IG9mIHR5cGUgSGVsbG9SZXF1ZXN0XG4gKiBAcmV0dXJuczogcmV0dXJucyBhIGZ1bGwgVXJsIHN0cmluZyAtIGZvciBHRVQgYnkga2V5L3ZhbHVlIHBhaXJzXG4gKiBAZXhhbXBsZTpcbiAqIGJhc2VVcmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MFwiXG4gKiBhcmcgPSB7bmFtZTogXCJ3ZW5nd2VpXCIsIG5pY2s6IFwid2VudGlhblwifVxuICogcmV0dXJucyA9PiBodHRwOi8vbG9jYWxob3N0OjgwODA/bmFtZT1cIndlbmd3ZWlcIiZuaWNrPVwid2VudGlhblwiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVF1ZXJ5VXJsPFQ+KHVybDogc3RyaW5nLCBwYXJhbXM6IFQpOiBzdHJpbmcge1xuICAgIGlmICghcGFyYW1zKSB7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgbGV0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuXG5cbiAgICBmb3IgKGxldCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgIGxldCB2YWw7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhbCA9IHBhcmFtc1trZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGssIHZhbHM7XG4gICAgICAgIC8vIGlmIGlzIGFycmF5XG4gICAgICAgIGlmICh2YWwudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICAgICAgayA9IGtleSArICdbXSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBrID0ga2V5XG4gICAgICAgICAgICB2YWxzID0gW3ZhbF07XG4gICAgICAgIH1cblxuICAgICAgICB2YWxzLmZvckVhY2godiA9PiB7XG4gICAgICAgICAgICAvLyBpZiBpcyBkYXRlXG4gICAgICAgICAgICBpZiAodi50b1N0cmluZygpID09PSAnW29iamVjdCBGaWxlXScpIHtcbiAgICAgICAgICAgICAgICB2ID0gdi50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgICAgIC8vIGlmIGlzIG9iamVjdFxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZShrKSArICc9JyArIGVuY29kZSh2KSlcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxldCBzZXJpYWxpemVkUGFyYW1zID0gcGFydHMuam9pbignJicpO1xuXG4gICAgaWYgKHNlcmlhbGl6ZWRQYXJhbXMpIHtcbiAgICAgICAgdXJsICs9ICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBzZXJpYWxpemVkUGFyYW1zO1xuICAgIH1cbiAgICByZXR1cm4gdXJsXG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB1cmwgdGhlIGJhc2UgdXJsIGZvciB0aGUgc2VydmljZVxuICogQHBhcmFtIHNlcnZpY2VOYW1lIHRoZSBzZXJ2aWNlIG5hbWVcbiAqIEBwYXJhbSBmdW5jdGlvbk5hbWUgdGhlIGZ1bmN0aW9uIG5hbWVcbiAqIEBleGFtcGxlXG4gKiBiYXNlVXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjgwODBcIlxuICogc2VydmljZU5hbWUgPSBcIkhlbGxvU2VydmljZVwiXG4gKiBmdW5jdGlvbk5hbWUgPSBcIlNheUhlbGxvXCJcbiAqIHJldHVybnMgPT4gaHR0cDovL2xvY2FsaG9zdDo4MDgwL0hlbGxvU2VydmljZS5TYXlIZWxsb1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVVcmw8VD4odXJsOiBzdHJpbmcsIHNlcnZpY2VOYW1lOiBzdHJpbmcsIGZ1bmN0aW9uTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJsICsgXCIvXCIgKyBzZXJ2aWNlTmFtZSArIFwiLlwiICsgZnVuY3Rpb25OYW1lO1xufVxuIl19