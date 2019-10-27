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
var helper_1 = require("./helper");
var promisify = function (wx) {
    return function (method) {
        return function (option) {
            return new Promise(function (resolve, reject) {
                wx[method](__assign({}, option, { success: function (res) { resolve(res); }, fail: function (err) { reject(err); } }));
            });
        };
    };
};
var wxPromisify = promisify(wx);
var wxRequest = wxPromisify('request');
var globalEnum = require("../GlobalEnum");
var baseUrl = globalEnum.baseUrl;
function SetBaseUrl(url) {
    baseUrl = url;
}
exports.SetBaseUrl = SetBaseUrl;
var authToken = "token";
function SetAuthToken(token) {
    authToken = token;
}
exports.SetAuthToken = SetAuthToken;
function RetrieveUserProfile(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveUserProfile");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveUserProfile = RetrieveUserProfile;
function UpdateUserProfile(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "UpdateUserProfile");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.UpdateUserProfile = UpdateUserProfile;
function RetrieveFoodPreference(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveFoodPreference");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveFoodPreference = RetrieveFoodPreference;
function UpdateFoodPreference(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "UpdateFoodPreference");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.UpdateFoodPreference = UpdateFoodPreference;
function RetrieveMedicalProfile(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveMedicalProfile");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveMedicalProfile = RetrieveMedicalProfile;
function UpdateMedicalProfile(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "UpdateMedicalProfile");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.UpdateMedicalProfile = UpdateMedicalProfile;
function RetrieveRecommendedDailyAllowance(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveRecommendedDailyAllowance");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveRecommendedDailyAllowance = RetrieveRecommendedDailyAllowance;
function RetrieveWeightLog(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveWeightLog");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveWeightLog = RetrieveWeightLog;
function CreateWeightLog(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "CreateWeightLog");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.CreateWeightLog = CreateWeightLog;
function CreateTargetWeight(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "CreateTargetWeight");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.CreateTargetWeight = CreateTargetWeight;
function RetrieveNutritionKnowledge(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveNutritionKnowledge");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveNutritionKnowledge = RetrieveNutritionKnowledge;
function RetrieveUserRDA(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveUserRDA");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveUserRDA = RetrieveUserRDA;
function RetrieveUserReports(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveUserReports");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveUserReports = RetrieveUserReports;
function RetrieveOrCreateUserReport(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveOrCreateUserReport");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveOrCreateUserReport = RetrieveOrCreateUserReport;
function RetrieveHomePageInfo(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveHomePageInfo");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveHomePageInfo = RetrieveHomePageInfo;
function RetrieveHomePageFeed(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveHomePageFeed");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveHomePageFeed = RetrieveHomePageFeed;
function RetrieveCardList(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveCardList");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveCardList = RetrieveCardList;
function CreateQuestion(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "CreateQuestion");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.CreateQuestion = CreateQuestion;
function RetrieveSurvey(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveSurvey");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveSurvey = RetrieveSurvey;
function CreateSurveyAnswer(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "CreateSurveyAnswer");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.CreateSurveyAnswer = CreateSurveyAnswer;
function RetrieveFoodDiary(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveFoodDiary");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveFoodDiary = RetrieveFoodDiary;
function CreateOrUpdateMealLog(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "CreateOrUpdateMealLog");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.CreateOrUpdateMealLog = CreateOrUpdateMealLog;
function RetrieveMealLog(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveMealLog");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveMealLog = RetrieveMealLog;
function ConfirmMealLog(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "ConfirmMealLog");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.ConfirmMealLog = ConfirmMealLog;
function DestroyMealLog(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "DestroyMealLog");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.DestroyMealLog = DestroyMealLog;
function RetrieveTextSearch(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveTextSearch");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveTextSearch = RetrieveTextSearch;
function RetrieveRecognition(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveRecognition");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveRecognition = RetrieveRecognition;
function UpdateFoodLog(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "UpdateFoodLog");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.UpdateFoodLog = UpdateFoodLog;
function DestroyFoodLog(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "DestroyFoodLog");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.DestroyFoodLog = DestroyFoodLog;
function AddRecipeItem(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "AddRecipeItem");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.AddRecipeItem = AddRecipeItem;
function UpdateRecipeItem(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "UpdateRecipeItem");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.UpdateRecipeItem = UpdateRecipeItem;
function DestroyRecipeItem(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "DestroyRecipeItem");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.DestroyRecipeItem = DestroyRecipeItem;
function RetrieveMealLogShareURL(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "RetrieveMealLogShareURL");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.RetrieveMealLogShareURL = RetrieveMealLogShareURL;
function CreateUserEvent(params) {
    var url = helper_1.generateUrl(baseUrl, "AppService", "CreateUserEvent");
    return wxRequest({ url: url, data: params, method: 'POST', header: { 'Authorization': 'token ' + authToken } }).then(function (res) {
        if (typeof res.data === 'object' && res.statusCode >= 200 && res.statusCode < 300) {
            try {
                return Promise.resolve(res.data);
            }
            catch (e) {
                return Promise.reject(res.data);
            }
        }
        return Promise.reject(res.data);
    }).catch(function (err) {
        return helper_1.errorHandling(err);
    });
}
exports.CreateUserEvent = CreateUserEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkFwcFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQXNEQSxtQ0FBc0Q7QUFFdEQsSUFBTSxTQUFTLEdBQUcsVUFBQyxFQUFFO0lBQ25CLE9BQU8sVUFBQyxNQUFNO1FBQ1osT0FBTyxVQUFDLE1BQU07WUFDWixPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07Z0JBQ2pDLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FDTCxNQUFNLElBQ1QsT0FBTyxFQUFFLFVBQUMsR0FBRyxJQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDLENBQUMsRUFDbEMsSUFBSSxFQUFFLFVBQUMsR0FBRyxJQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDLENBQUMsSUFDOUIsQ0FBQTtZQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsSUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2pDLElBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUV4QyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDMUMsSUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztBQUdqQyxTQUFnQixVQUFVLENBQUMsR0FBVztJQUNwQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0FBQ2hCLENBQUM7QUFGRCxnQ0FFQztBQUdELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUV4QixTQUFnQixZQUFZLENBQUMsS0FBYTtJQUN4QyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBRXBCLENBQUM7QUFIRCxvQ0FHQztBQUVELFNBQWdCLG1CQUFtQixDQUFDLE1BQWE7SUFDL0MsSUFBSSxHQUFHLEdBQVcsb0JB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LE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsZUFBZSxFQUFFLFFBQVEsR0FBRyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztRQUN0SCxJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLEVBQUU7WUFDakYsSUFBSTtnQkFDRixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQWEsQ0FBQyxDQUFBO2FBQzFDO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqQztTQUNGO1FBQ0QsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxHQUFHO1FBRVYsT0FBTyxzQkFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWhCRCwwQ0FnQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiog6K+l5paH5Lu255Sf5oiQ5LqOcHJvdG9hcGlcbiog5paH5Lu25YyF5ZCr5YmN56uv6LCD55SoQVBJ55qE5Luj56CB77yM5L6b5b6u5L+h5bCP56iL5bqP5L2/55SoXG4qIOaWh+S7tuWGheS7o+eggeS9v+eUqFR5cGVTY3JpcHRcbiovXG5pbXBvcnQge1xuICBBZGRSZWNpcGVJdGVtUmVxLFxuICBDb25maXJtTWVhbExvZ1JlcSxcbiAgQ3JlYXRlT3JVcGRhdGVNZWFsTG9nUmVxLFxuICBDcmVhdGVRdWVzdGlvblJlcSxcbiAgQ3JlYXRlU3VydmV5QW5zd2VyUmVxLFxuICBDcmVhdGVUYXJnZXRXZWlnaHRSZXEsXG4gIENyZWF0ZVdlaWdodExvZ1JlcSxcbiAgRGVzdHJveUZvb2RMb2dSZXEsXG4gIERlc3Ryb3lNZWFsTG9nUmVxLFxuICBEZXN0cm95UmVjaXBlSXRlbVJlcSxcbiAgRW1wdHksXG4gIE1lYWxMb2dSZXNwLFxuICBSZXRyaWV2ZUZvb2REaWFyeVJlcSxcbiAgUmV0cmlldmVGb29kRGlhcnlSZXNwLFxuICBSZXRyaWV2ZUZvb2RQcmVmZXJlbmNlUmVzcCxcbiAgUmV0cmlldmVIb21lUGFnZUZlZWRSZXEsXG4gIFJldHJpZXZlSG9tZVBhZ2VGZWVkUmVzcCxcbiAgUmV0cmlldmVDYXJkTGlzdFJlc3AsXG4gIFJldHJpZXZlSG9tZVBhZ2VJbmZvUmVxLFxuICBSZXRyaWV2ZUhvbWVQYWdlSW5mb1Jlc3AsXG4gIFJldHJpZXZlTWVhbExvZ1JlcSxcbiAgUmV0cmlldmVNZWFsTG9nU2hhcmVVUkxSZXEsXG4gIFJldHJpZXZlTWVhbExvZ1NoYXJlVVJMUmVzcCxcbiAgUmV0cmlldmVNZWRpY2FsUHJvZmlsZVJlc3AsXG4gIFJldHJpZXZlTnV0cml0aW9uS25vd2xlZGdlUmVzcCxcbiAgUmV0cmlldmVPckNyZWF0ZVVzZXJSZXBvcnRSZXEsXG4gIFJldHJpZXZlT3JDcmVhdGVVc2VyUmVwb3J0UmVzcCxcbiAgUmV0cmlldmVSZWNvZ25pdGlvblJlcSxcbiAgUmV0cmlldmVSZWNvZ25pdGlvblJlc3AsXG4gIFJldHJpZXZlUmVjb21tZW5kZWREYWlseUFsbG93YW5jZVJlc3AsXG4gIFJldHJpZXZlU3VydmV5UmVxLFxuICBSZXRyaWV2ZVN1cnZleVJlc3AsXG4gIFJldHJpZXZlVGV4dFNlYXJjaFJlcSxcbiAgUmV0cmlldmVUZXh0U2VhcmNoUmVzcCxcbiAgUmV0cmlldmVVc2VyUHJvZmlsZVJlc3AsXG4gIFJldHJpZXZlVXNlclJEQVJlc3AsXG4gIFJldHJpZXZlVXNlclJlcG9ydHNSZXEsXG4gIFJldHJpZXZlVXNlclJlcG9ydHNSZXNwLFxuICBSZXRyaWV2ZVdlaWdodExvZ1JlcSxcbiAgUmV0cmlldmVXZWlnaHRMb2dSZXNwLFxuICBVcGRhdGVGb29kTG9nUmVxLFxuICBVcGRhdGVGb29kUHJlZmVyZW5jZVJlcSxcbiAgVXBkYXRlTWVkaWNhbFByb2ZpbGVSZXEsXG4gIFVwZGF0ZVJlY2lwZUl0ZW1SZXEsXG4gIFVwZGF0ZVVzZXJQcm9maWxlUmVxLFxuICBDcmVhdGVVc2VyRXZlbnRSZXFcblxufSBmcm9tICcuL0FwcFNlcnZpY2VPYmpzJztcbmltcG9ydCB7IGdlbmVyYXRlVXJsLCBlcnJvckhhbmRsaW5nIH0gZnJvbSAnLi9oZWxwZXInO1xuXG5jb25zdCBwcm9taXNpZnkgPSAod3gpID0+IHtcbiAgcmV0dXJuIChtZXRob2QpID0+IHtcbiAgICByZXR1cm4gKG9wdGlvbikgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgd3hbbWV0aG9kXSh7XG4gICAgICAgICAgLi4ub3B0aW9uLFxuICAgICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHsgcmVzb2x2ZShyZXMpIH0sXG4gICAgICAgICAgZmFpbDogKGVycikgPT4geyByZWplY3QoZXJyKSB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCB3eFByb21pc2lmeSA9IHByb21pc2lmeSh3eClcbmNvbnN0IHd4UmVxdWVzdCA9IHd4UHJvbWlzaWZ5KCdyZXF1ZXN0JylcblxudmFyIGdsb2JhbEVudW0gPSByZXF1aXJlKFwiLi4vR2xvYmFsRW51bVwiKTtcbnZhciBiYXNlVXJsID0gZ2xvYmFsRW51bS5iYXNlVXJsO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBTZXRCYXNlVXJsKHVybDogc3RyaW5nKSB7XG4gIGJhc2VVcmwgPSB1cmw7XG59XG5cbi8vdmFyIGF1dGhUb2tlbiA9IFwiYmtsZXVlcHE4cjBldnRxbjcyaGdcIjtcbnZhciBhdXRoVG9rZW4gPSBcInRva2VuXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXRBdXRoVG9rZW4odG9rZW46IHN0cmluZykge1xuICBhdXRoVG9rZW4gPSB0b2tlbjtcbiAgLy9hdXRoVG9rZW4gPSBcImJrbGV1ZXBxOHIwZXZ0cW43MmhnXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXRyaWV2ZVVzZXJQcm9maWxlKHBhcmFtczogRW1wdHkpOiBQcm9taXNlPFJldHJpZXZlVXNlclByb2ZpbGVSZXNwIHwgbmV2ZXI+IHtcbiAgbGV0IHVybDogc3RyaW5nID0gZ2VuZXJhdGVVcmwoYmFzZVVybCwgXCJBcHBTZXJ2aWNlXCIsIFwiUmV0cmlldmVVc2VyUHJvZmlsZVwiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBSZXRyaWV2ZVVzZXJQcm9maWxlUmVzcClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBVcGRhdGVVc2VyUHJvZmlsZShwYXJhbXM6IFVwZGF0ZVVzZXJQcm9maWxlUmVxKTogUHJvbWlzZTxFbXB0eSB8IG5ldmVyPiB7XG4gIGxldCB1cmw6IHN0cmluZyA9IGdlbmVyYXRlVXJsKGJhc2VVcmwsIFwiQXBwU2VydmljZVwiLCBcIlVwZGF0ZVVzZXJQcm9maWxlXCIpO1xuXG4gIHJldHVybiB3eFJlcXVlc3QoeyB1cmw6IHVybCwgZGF0YTogcGFyYW1zLCBtZXRob2Q6ICdQT1NUJywgaGVhZGVyOiB7ICdBdXRob3JpemF0aW9uJzogJ3Rva2VuICcgKyBhdXRoVG9rZW4gfSB9KS50aGVuKHJlcyA9PiB7XG4gICAgaWYgKHR5cGVvZiByZXMuZGF0YSA9PT0gJ29iamVjdCcgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwICYmIHJlcy5zdGF0dXNDb2RlIDwgMzAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5kYXRhIGFzIEVtcHR5KVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICB9KS5jYXRjaChlcnIgPT4ge1xuICAgIC8vIGhhbmRsZSBlcnJvciByZXNwb25zZVxuICAgIHJldHVybiBlcnJvckhhbmRsaW5nKGVycilcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIFJldHJpZXZlRm9vZFByZWZlcmVuY2UocGFyYW1zOiBFbXB0eSk6IFByb21pc2U8UmV0cmlldmVGb29kUHJlZmVyZW5jZVJlc3AgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJSZXRyaWV2ZUZvb2RQcmVmZXJlbmNlXCIpO1xuXG4gIHJldHVybiB3eFJlcXVlc3QoeyB1cmw6IHVybCwgZGF0YTogcGFyYW1zLCBtZXRob2Q6ICdQT1NUJywgaGVhZGVyOiB7ICdBdXRob3JpemF0aW9uJzogJ3Rva2VuICcgKyBhdXRoVG9rZW4gfSB9KS50aGVuKHJlcyA9PiB7XG4gICAgaWYgKHR5cGVvZiByZXMuZGF0YSA9PT0gJ29iamVjdCcgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwICYmIHJlcy5zdGF0dXNDb2RlIDwgMzAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5kYXRhIGFzIFJldHJpZXZlRm9vZFByZWZlcmVuY2VSZXNwKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICB9KS5jYXRjaChlcnIgPT4ge1xuICAgIC8vIGhhbmRsZSBlcnJvciByZXNwb25zZVxuICAgIHJldHVybiBlcnJvckhhbmRsaW5nKGVycilcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIFVwZGF0ZUZvb2RQcmVmZXJlbmNlKHBhcmFtczogVXBkYXRlRm9vZFByZWZlcmVuY2VSZXEpOiBQcm9taXNlPEVtcHR5IHwgbmV2ZXI+IHtcbiAgbGV0IHVybDogc3RyaW5nID0gZ2VuZXJhdGVVcmwoYmFzZVVybCwgXCJBcHBTZXJ2aWNlXCIsIFwiVXBkYXRlRm9vZFByZWZlcmVuY2VcIik7XG5cbiAgcmV0dXJuIHd4UmVxdWVzdCh7IHVybDogdXJsLCBkYXRhOiBwYXJhbXMsIG1ldGhvZDogJ1BPU1QnLCBoZWFkZXI6IHsgJ0F1dGhvcml6YXRpb24nOiAndG9rZW4gJyArIGF1dGhUb2tlbiB9IH0pLnRoZW4ocmVzID0+IHtcbiAgICBpZiAodHlwZW9mIHJlcy5kYXRhID09PSAnb2JqZWN0JyAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzLnN0YXR1c0NvZGUgPCAzMDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLmRhdGEgYXMgRW1wdHkpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gUmV0cmlldmVNZWRpY2FsUHJvZmlsZShwYXJhbXM6IEVtcHR5KTogUHJvbWlzZTxSZXRyaWV2ZU1lZGljYWxQcm9maWxlUmVzcCB8IG5ldmVyPiB7XG4gIGxldCB1cmw6IHN0cmluZyA9IGdlbmVyYXRlVXJsKGJhc2VVcmwsIFwiQXBwU2VydmljZVwiLCBcIlJldHJpZXZlTWVkaWNhbFByb2ZpbGVcIik7XG5cbiAgcmV0dXJuIHd4UmVxdWVzdCh7IHVybDogdXJsLCBkYXRhOiBwYXJhbXMsIG1ldGhvZDogJ1BPU1QnLCBoZWFkZXI6IHsgJ0F1dGhvcml6YXRpb24nOiAndG9rZW4gJyArIGF1dGhUb2tlbiB9IH0pLnRoZW4ocmVzID0+IHtcbiAgICBpZiAodHlwZW9mIHJlcy5kYXRhID09PSAnb2JqZWN0JyAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzLnN0YXR1c0NvZGUgPCAzMDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLmRhdGEgYXMgUmV0cmlldmVNZWRpY2FsUHJvZmlsZVJlc3ApXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gVXBkYXRlTWVkaWNhbFByb2ZpbGUocGFyYW1zOiBVcGRhdGVNZWRpY2FsUHJvZmlsZVJlcSk6IFByb21pc2U8RW1wdHkgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJVcGRhdGVNZWRpY2FsUHJvZmlsZVwiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBFbXB0eSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXRyaWV2ZVJlY29tbWVuZGVkRGFpbHlBbGxvd2FuY2UocGFyYW1zOiBFbXB0eSk6IFByb21pc2U8UmV0cmlldmVSZWNvbW1lbmRlZERhaWx5QWxsb3dhbmNlUmVzcCB8IG5ldmVyPiB7XG4gIGxldCB1cmw6IHN0cmluZyA9IGdlbmVyYXRlVXJsKGJhc2VVcmwsIFwiQXBwU2VydmljZVwiLCBcIlJldHJpZXZlUmVjb21tZW5kZWREYWlseUFsbG93YW5jZVwiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBSZXRyaWV2ZVJlY29tbWVuZGVkRGFpbHlBbGxvd2FuY2VSZXNwKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICB9KS5jYXRjaChlcnIgPT4ge1xuICAgIC8vIGhhbmRsZSBlcnJvciByZXNwb25zZVxuICAgIHJldHVybiBlcnJvckhhbmRsaW5nKGVycilcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIFJldHJpZXZlV2VpZ2h0TG9nKHBhcmFtczogUmV0cmlldmVXZWlnaHRMb2dSZXEpOiBQcm9taXNlPFJldHJpZXZlV2VpZ2h0TG9nUmVzcCB8IG5ldmVyPiB7XG4gIGxldCB1cmw6IHN0cmluZyA9IGdlbmVyYXRlVXJsKGJhc2VVcmwsIFwiQXBwU2VydmljZVwiLCBcIlJldHJpZXZlV2VpZ2h0TG9nXCIpO1xuXG4gIHJldHVybiB3eFJlcXVlc3QoeyB1cmw6IHVybCwgZGF0YTogcGFyYW1zLCBtZXRob2Q6ICdQT1NUJywgaGVhZGVyOiB7ICdBdXRob3JpemF0aW9uJzogJ3Rva2VuICcgKyBhdXRoVG9rZW4gfSB9KS50aGVuKHJlcyA9PiB7XG4gICAgaWYgKHR5cGVvZiByZXMuZGF0YSA9PT0gJ29iamVjdCcgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwICYmIHJlcy5zdGF0dXNDb2RlIDwgMzAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5kYXRhIGFzIFJldHJpZXZlV2VpZ2h0TG9nUmVzcClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVXZWlnaHRMb2cocGFyYW1zOiBDcmVhdGVXZWlnaHRMb2dSZXEpOiBQcm9taXNlPEVtcHR5IHwgbmV2ZXI+IHtcbiAgbGV0IHVybDogc3RyaW5nID0gZ2VuZXJhdGVVcmwoYmFzZVVybCwgXCJBcHBTZXJ2aWNlXCIsIFwiQ3JlYXRlV2VpZ2h0TG9nXCIpO1xuXG4gIHJldHVybiB3eFJlcXVlc3QoeyB1cmw6IHVybCwgZGF0YTogcGFyYW1zLCBtZXRob2Q6ICdQT1NUJywgaGVhZGVyOiB7ICdBdXRob3JpemF0aW9uJzogJ3Rva2VuICcgKyBhdXRoVG9rZW4gfSB9KS50aGVuKHJlcyA9PiB7XG4gICAgaWYgKHR5cGVvZiByZXMuZGF0YSA9PT0gJ29iamVjdCcgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwICYmIHJlcy5zdGF0dXNDb2RlIDwgMzAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5kYXRhIGFzIEVtcHR5KVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICB9KS5jYXRjaChlcnIgPT4ge1xuICAgIC8vIGhhbmRsZSBlcnJvciByZXNwb25zZVxuICAgIHJldHVybiBlcnJvckhhbmRsaW5nKGVycilcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZVRhcmdldFdlaWdodChwYXJhbXM6IENyZWF0ZVRhcmdldFdlaWdodFJlcSk6IFByb21pc2U8RW1wdHkgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJDcmVhdGVUYXJnZXRXZWlnaHRcIik7XG5cbiAgcmV0dXJuIHd4UmVxdWVzdCh7IHVybDogdXJsLCBkYXRhOiBwYXJhbXMsIG1ldGhvZDogJ1BPU1QnLCBoZWFkZXI6IHsgJ0F1dGhvcml6YXRpb24nOiAndG9rZW4gJyArIGF1dGhUb2tlbiB9IH0pLnRoZW4ocmVzID0+IHtcbiAgICBpZiAodHlwZW9mIHJlcy5kYXRhID09PSAnb2JqZWN0JyAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzLnN0YXR1c0NvZGUgPCAzMDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLmRhdGEgYXMgRW1wdHkpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gUmV0cmlldmVOdXRyaXRpb25Lbm93bGVkZ2UocGFyYW1zOiBFbXB0eSk6IFByb21pc2U8UmV0cmlldmVOdXRyaXRpb25Lbm93bGVkZ2VSZXNwIHwgbmV2ZXI+IHtcbiAgbGV0IHVybDogc3RyaW5nID0gZ2VuZXJhdGVVcmwoYmFzZVVybCwgXCJBcHBTZXJ2aWNlXCIsIFwiUmV0cmlldmVOdXRyaXRpb25Lbm93bGVkZ2VcIik7XG5cbiAgcmV0dXJuIHd4UmVxdWVzdCh7IHVybDogdXJsLCBkYXRhOiBwYXJhbXMsIG1ldGhvZDogJ1BPU1QnLCBoZWFkZXI6IHsgJ0F1dGhvcml6YXRpb24nOiAndG9rZW4gJyArIGF1dGhUb2tlbiB9IH0pLnRoZW4ocmVzID0+IHtcbiAgICBpZiAodHlwZW9mIHJlcy5kYXRhID09PSAnb2JqZWN0JyAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzLnN0YXR1c0NvZGUgPCAzMDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLmRhdGEgYXMgUmV0cmlldmVOdXRyaXRpb25Lbm93bGVkZ2VSZXNwKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICB9KS5jYXRjaChlcnIgPT4ge1xuICAgIC8vIGhhbmRsZSBlcnJvciByZXNwb25zZVxuICAgIHJldHVybiBlcnJvckhhbmRsaW5nKGVycilcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIFJldHJpZXZlVXNlclJEQShwYXJhbXM6IEVtcHR5KTogUHJvbWlzZTxSZXRyaWV2ZVVzZXJSREFSZXNwIHwgbmV2ZXI+IHtcbiAgbGV0IHVybDogc3RyaW5nID0gZ2VuZXJhdGVVcmwoYmFzZVVybCwgXCJBcHBTZXJ2aWNlXCIsIFwiUmV0cmlldmVVc2VyUkRBXCIpO1xuXG4gIHJldHVybiB3eFJlcXVlc3QoeyB1cmw6IHVybCwgZGF0YTogcGFyYW1zLCBtZXRob2Q6ICdQT1NUJywgaGVhZGVyOiB7ICdBdXRob3JpemF0aW9uJzogJ3Rva2VuICcgKyBhdXRoVG9rZW4gfSB9KS50aGVuKHJlcyA9PiB7XG4gICAgaWYgKHR5cGVvZiByZXMuZGF0YSA9PT0gJ29iamVjdCcgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwICYmIHJlcy5zdGF0dXNDb2RlIDwgMzAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5kYXRhIGFzIFJldHJpZXZlVXNlclJEQVJlc3ApXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gUmV0cmlldmVVc2VyUmVwb3J0cyhwYXJhbXM6IFJldHJpZXZlVXNlclJlcG9ydHNSZXEpOiBQcm9taXNlPFJldHJpZXZlVXNlclJlcG9ydHNSZXNwIHwgbmV2ZXI+IHtcbiAgbGV0IHVybDogc3RyaW5nID0gZ2VuZXJhdGVVcmwoYmFzZVVybCwgXCJBcHBTZXJ2aWNlXCIsIFwiUmV0cmlldmVVc2VyUmVwb3J0c1wiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBSZXRyaWV2ZVVzZXJSZXBvcnRzUmVzcClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXRyaWV2ZU9yQ3JlYXRlVXNlclJlcG9ydChwYXJhbXM6IFJldHJpZXZlT3JDcmVhdGVVc2VyUmVwb3J0UmVxKTogUHJvbWlzZTxSZXRyaWV2ZU9yQ3JlYXRlVXNlclJlcG9ydFJlc3AgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJSZXRyaWV2ZU9yQ3JlYXRlVXNlclJlcG9ydFwiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBSZXRyaWV2ZU9yQ3JlYXRlVXNlclJlcG9ydFJlc3ApXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gUmV0cmlldmVIb21lUGFnZUluZm8ocGFyYW1zOiBSZXRyaWV2ZUhvbWVQYWdlSW5mb1JlcSk6IFByb21pc2U8UmV0cmlldmVIb21lUGFnZUluZm9SZXNwIHwgbmV2ZXI+IHtcbiAgbGV0IHVybDogc3RyaW5nID0gZ2VuZXJhdGVVcmwoYmFzZVVybCwgXCJBcHBTZXJ2aWNlXCIsIFwiUmV0cmlldmVIb21lUGFnZUluZm9cIik7XG5cbiAgcmV0dXJuIHd4UmVxdWVzdCh7IHVybDogdXJsLCBkYXRhOiBwYXJhbXMsIG1ldGhvZDogJ1BPU1QnLCBoZWFkZXI6IHsgJ0F1dGhvcml6YXRpb24nOiAndG9rZW4gJyArIGF1dGhUb2tlbiB9IH0pLnRoZW4ocmVzID0+IHtcbiAgICBpZiAodHlwZW9mIHJlcy5kYXRhID09PSAnb2JqZWN0JyAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzLnN0YXR1c0NvZGUgPCAzMDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLmRhdGEgYXMgUmV0cmlldmVIb21lUGFnZUluZm9SZXNwKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICB9KS5jYXRjaChlcnIgPT4ge1xuICAgIC8vIGhhbmRsZSBlcnJvciByZXNwb25zZVxuICAgIHJldHVybiBlcnJvckhhbmRsaW5nKGVycilcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIFJldHJpZXZlSG9tZVBhZ2VGZWVkKHBhcmFtczogUmV0cmlldmVIb21lUGFnZUZlZWRSZXEpOiBQcm9taXNlPFJldHJpZXZlSG9tZVBhZ2VGZWVkUmVzcCB8IG5ldmVyPiB7XG4gIGxldCB1cmw6IHN0cmluZyA9IGdlbmVyYXRlVXJsKGJhc2VVcmwsIFwiQXBwU2VydmljZVwiLCBcIlJldHJpZXZlSG9tZVBhZ2VGZWVkXCIpO1xuXG4gIHJldHVybiB3eFJlcXVlc3QoeyB1cmw6IHVybCwgZGF0YTogcGFyYW1zLCBtZXRob2Q6ICdQT1NUJywgaGVhZGVyOiB7ICdBdXRob3JpemF0aW9uJzogJ3Rva2VuICcgKyBhdXRoVG9rZW4gfSB9KS50aGVuKHJlcyA9PiB7XG4gICAgaWYgKHR5cGVvZiByZXMuZGF0YSA9PT0gJ29iamVjdCcgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwICYmIHJlcy5zdGF0dXNDb2RlIDwgMzAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5kYXRhIGFzIFJldHJpZXZlSG9tZVBhZ2VGZWVkUmVzcClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmV0cmlldmVDYXJkTGlzdChwYXJhbXM6IEVtcHR5KTogUHJvbWlzZTxSZXRyaWV2ZUNhcmRMaXN0UmVzcCB8IG5ldmVyPiB7XG4gIGxldCB1cmw6IHN0cmluZyA9IGdlbmVyYXRlVXJsKGJhc2VVcmwsIFwiQXBwU2VydmljZVwiLCBcIlJldHJpZXZlQ2FyZExpc3RcIik7XG5cbiAgcmV0dXJuIHd4UmVxdWVzdCh7IHVybDogdXJsLCBkYXRhOiBwYXJhbXMsIG1ldGhvZDogJ1BPU1QnLCBoZWFkZXI6IHsgJ0F1dGhvcml6YXRpb24nOiAndG9rZW4gJyArIGF1dGhUb2tlbiB9IH0pLnRoZW4ocmVzID0+IHtcbiAgICBpZiAodHlwZW9mIHJlcy5kYXRhID09PSAnb2JqZWN0JyAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzLnN0YXR1c0NvZGUgPCAzMDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLmRhdGEgYXMgUmV0cmlldmVDYXJkTGlzdFJlc3ApXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlUXVlc3Rpb24ocGFyYW1zOiBDcmVhdGVRdWVzdGlvblJlcSk6IFByb21pc2U8RW1wdHkgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJDcmVhdGVRdWVzdGlvblwiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBFbXB0eSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXRyaWV2ZVN1cnZleShwYXJhbXM6IFJldHJpZXZlU3VydmV5UmVxKTogUHJvbWlzZTxSZXRyaWV2ZVN1cnZleVJlc3AgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJSZXRyaWV2ZVN1cnZleVwiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBSZXRyaWV2ZVN1cnZleVJlc3ApXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlU3VydmV5QW5zd2VyKHBhcmFtczogQ3JlYXRlU3VydmV5QW5zd2VyUmVxKTogUHJvbWlzZTxFbXB0eSB8IG5ldmVyPiB7XG4gIGxldCB1cmw6IHN0cmluZyA9IGdlbmVyYXRlVXJsKGJhc2VVcmwsIFwiQXBwU2VydmljZVwiLCBcIkNyZWF0ZVN1cnZleUFuc3dlclwiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBFbXB0eSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXRyaWV2ZUZvb2REaWFyeShwYXJhbXM6IFJldHJpZXZlRm9vZERpYXJ5UmVxKTogUHJvbWlzZTxSZXRyaWV2ZUZvb2REaWFyeVJlc3AgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJSZXRyaWV2ZUZvb2REaWFyeVwiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBSZXRyaWV2ZUZvb2REaWFyeVJlc3ApXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlT3JVcGRhdGVNZWFsTG9nKHBhcmFtczogQ3JlYXRlT3JVcGRhdGVNZWFsTG9nUmVxKTogUHJvbWlzZTxNZWFsTG9nUmVzcCB8IG5ldmVyPiB7XG4gIGxldCB1cmw6IHN0cmluZyA9IGdlbmVyYXRlVXJsKGJhc2VVcmwsIFwiQXBwU2VydmljZVwiLCBcIkNyZWF0ZU9yVXBkYXRlTWVhbExvZ1wiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBNZWFsTG9nUmVzcClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXRyaWV2ZU1lYWxMb2cocGFyYW1zOiBSZXRyaWV2ZU1lYWxMb2dSZXEpOiBQcm9taXNlPE1lYWxMb2dSZXNwIHwgbmV2ZXI+IHtcbiAgbGV0IHVybDogc3RyaW5nID0gZ2VuZXJhdGVVcmwoYmFzZVVybCwgXCJBcHBTZXJ2aWNlXCIsIFwiUmV0cmlldmVNZWFsTG9nXCIpO1xuXG4gIHJldHVybiB3eFJlcXVlc3QoeyB1cmw6IHVybCwgZGF0YTogcGFyYW1zLCBtZXRob2Q6ICdQT1NUJywgaGVhZGVyOiB7ICdBdXRob3JpemF0aW9uJzogJ3Rva2VuICcgKyBhdXRoVG9rZW4gfSB9KS50aGVuKHJlcyA9PiB7XG4gICAgaWYgKHR5cGVvZiByZXMuZGF0YSA9PT0gJ29iamVjdCcgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwICYmIHJlcy5zdGF0dXNDb2RlIDwgMzAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5kYXRhIGFzIE1lYWxMb2dSZXNwKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICB9KS5jYXRjaChlcnIgPT4ge1xuICAgIC8vIGhhbmRsZSBlcnJvciByZXNwb25zZVxuICAgIHJldHVybiBlcnJvckhhbmRsaW5nKGVycilcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIENvbmZpcm1NZWFsTG9nKHBhcmFtczogQ29uZmlybU1lYWxMb2dSZXEpOiBQcm9taXNlPEVtcHR5IHwgbmV2ZXI+IHtcbiAgbGV0IHVybDogc3RyaW5nID0gZ2VuZXJhdGVVcmwoYmFzZVVybCwgXCJBcHBTZXJ2aWNlXCIsIFwiQ29uZmlybU1lYWxMb2dcIik7XG5cbiAgcmV0dXJuIHd4UmVxdWVzdCh7IHVybDogdXJsLCBkYXRhOiBwYXJhbXMsIG1ldGhvZDogJ1BPU1QnLCBoZWFkZXI6IHsgJ0F1dGhvcml6YXRpb24nOiAndG9rZW4gJyArIGF1dGhUb2tlbiB9IH0pLnRoZW4ocmVzID0+IHtcbiAgICBpZiAodHlwZW9mIHJlcy5kYXRhID09PSAnb2JqZWN0JyAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzLnN0YXR1c0NvZGUgPCAzMDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLmRhdGEgYXMgRW1wdHkpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gRGVzdHJveU1lYWxMb2cocGFyYW1zOiBEZXN0cm95TWVhbExvZ1JlcSk6IFByb21pc2U8RW1wdHkgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJEZXN0cm95TWVhbExvZ1wiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBFbXB0eSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXRyaWV2ZVRleHRTZWFyY2gocGFyYW1zOiBSZXRyaWV2ZVRleHRTZWFyY2hSZXEpOiBQcm9taXNlPFJldHJpZXZlVGV4dFNlYXJjaFJlc3AgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJSZXRyaWV2ZVRleHRTZWFyY2hcIik7XG5cbiAgcmV0dXJuIHd4UmVxdWVzdCh7IHVybDogdXJsLCBkYXRhOiBwYXJhbXMsIG1ldGhvZDogJ1BPU1QnLCBoZWFkZXI6IHsgJ0F1dGhvcml6YXRpb24nOiAndG9rZW4gJyArIGF1dGhUb2tlbiB9IH0pLnRoZW4ocmVzID0+IHtcbiAgICBpZiAodHlwZW9mIHJlcy5kYXRhID09PSAnb2JqZWN0JyAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzLnN0YXR1c0NvZGUgPCAzMDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLmRhdGEgYXMgUmV0cmlldmVUZXh0U2VhcmNoUmVzcClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXRyaWV2ZVJlY29nbml0aW9uKHBhcmFtczogUmV0cmlldmVSZWNvZ25pdGlvblJlcSk6IFByb21pc2U8UmV0cmlldmVSZWNvZ25pdGlvblJlc3AgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJSZXRyaWV2ZVJlY29nbml0aW9uXCIpO1xuXG4gIHJldHVybiB3eFJlcXVlc3QoeyB1cmw6IHVybCwgZGF0YTogcGFyYW1zLCBtZXRob2Q6ICdQT1NUJywgaGVhZGVyOiB7ICdBdXRob3JpemF0aW9uJzogJ3Rva2VuICcgKyBhdXRoVG9rZW4gfSB9KS50aGVuKHJlcyA9PiB7XG4gICAgaWYgKHR5cGVvZiByZXMuZGF0YSA9PT0gJ29iamVjdCcgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwICYmIHJlcy5zdGF0dXNDb2RlIDwgMzAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5kYXRhIGFzIFJldHJpZXZlUmVjb2duaXRpb25SZXNwKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICB9KS5jYXRjaChlcnIgPT4ge1xuICAgIC8vIGhhbmRsZSBlcnJvciByZXNwb25zZVxuICAgIHJldHVybiBlcnJvckhhbmRsaW5nKGVycilcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIFVwZGF0ZUZvb2RMb2cocGFyYW1zOiBVcGRhdGVGb29kTG9nUmVxKTogUHJvbWlzZTxNZWFsTG9nUmVzcCB8IG5ldmVyPiB7XG4gIGxldCB1cmw6IHN0cmluZyA9IGdlbmVyYXRlVXJsKGJhc2VVcmwsIFwiQXBwU2VydmljZVwiLCBcIlVwZGF0ZUZvb2RMb2dcIik7XG5cbiAgcmV0dXJuIHd4UmVxdWVzdCh7IHVybDogdXJsLCBkYXRhOiBwYXJhbXMsIG1ldGhvZDogJ1BPU1QnLCBoZWFkZXI6IHsgJ0F1dGhvcml6YXRpb24nOiAndG9rZW4gJyArIGF1dGhUb2tlbiB9IH0pLnRoZW4ocmVzID0+IHtcbiAgICBpZiAodHlwZW9mIHJlcy5kYXRhID09PSAnb2JqZWN0JyAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzLnN0YXR1c0NvZGUgPCAzMDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLmRhdGEgYXMgTWVhbExvZ1Jlc3ApXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gRGVzdHJveUZvb2RMb2cocGFyYW1zOiBEZXN0cm95Rm9vZExvZ1JlcSk6IFByb21pc2U8TWVhbExvZ1Jlc3AgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJEZXN0cm95Rm9vZExvZ1wiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBNZWFsTG9nUmVzcClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBBZGRSZWNpcGVJdGVtKHBhcmFtczogQWRkUmVjaXBlSXRlbVJlcSk6IFByb21pc2U8TWVhbExvZ1Jlc3AgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJBZGRSZWNpcGVJdGVtXCIpO1xuXG4gIHJldHVybiB3eFJlcXVlc3QoeyB1cmw6IHVybCwgZGF0YTogcGFyYW1zLCBtZXRob2Q6ICdQT1NUJywgaGVhZGVyOiB7ICdBdXRob3JpemF0aW9uJzogJ3Rva2VuICcgKyBhdXRoVG9rZW4gfSB9KS50aGVuKHJlcyA9PiB7XG4gICAgaWYgKHR5cGVvZiByZXMuZGF0YSA9PT0gJ29iamVjdCcgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwICYmIHJlcy5zdGF0dXNDb2RlIDwgMzAwKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcy5kYXRhIGFzIE1lYWxMb2dSZXNwKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzLmRhdGEpO1xuICB9KS5jYXRjaChlcnIgPT4ge1xuICAgIC8vIGhhbmRsZSBlcnJvciByZXNwb25zZVxuICAgIHJldHVybiBlcnJvckhhbmRsaW5nKGVycilcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIFVwZGF0ZVJlY2lwZUl0ZW0ocGFyYW1zOiBVcGRhdGVSZWNpcGVJdGVtUmVxKTogUHJvbWlzZTxNZWFsTG9nUmVzcCB8IG5ldmVyPiB7XG4gIGxldCB1cmw6IHN0cmluZyA9IGdlbmVyYXRlVXJsKGJhc2VVcmwsIFwiQXBwU2VydmljZVwiLCBcIlVwZGF0ZVJlY2lwZUl0ZW1cIik7XG5cbiAgcmV0dXJuIHd4UmVxdWVzdCh7IHVybDogdXJsLCBkYXRhOiBwYXJhbXMsIG1ldGhvZDogJ1BPU1QnLCBoZWFkZXI6IHsgJ0F1dGhvcml6YXRpb24nOiAndG9rZW4gJyArIGF1dGhUb2tlbiB9IH0pLnRoZW4ocmVzID0+IHtcbiAgICBpZiAodHlwZW9mIHJlcy5kYXRhID09PSAnb2JqZWN0JyAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzLnN0YXR1c0NvZGUgPCAzMDApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzLmRhdGEgYXMgTWVhbExvZ1Jlc3ApXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gRGVzdHJveVJlY2lwZUl0ZW0ocGFyYW1zOiBEZXN0cm95UmVjaXBlSXRlbVJlcSk6IFByb21pc2U8TWVhbExvZ1Jlc3AgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJEZXN0cm95UmVjaXBlSXRlbVwiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBNZWFsTG9nUmVzcClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXRyaWV2ZU1lYWxMb2dTaGFyZVVSTChwYXJhbXM6IFJldHJpZXZlTWVhbExvZ1NoYXJlVVJMUmVxKTogUHJvbWlzZTxSZXRyaWV2ZU1lYWxMb2dTaGFyZVVSTFJlc3AgfCBuZXZlcj4ge1xuICBsZXQgdXJsOiBzdHJpbmcgPSBnZW5lcmF0ZVVybChiYXNlVXJsLCBcIkFwcFNlcnZpY2VcIiwgXCJSZXRyaWV2ZU1lYWxMb2dTaGFyZVVSTFwiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBSZXRyaWV2ZU1lYWxMb2dTaGFyZVVSTFJlc3ApXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZXMuZGF0YSk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgLy8gaGFuZGxlIGVycm9yIHJlc3BvbnNlXG4gICAgcmV0dXJuIGVycm9ySGFuZGxpbmcoZXJyKVxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlVXNlckV2ZW50KHBhcmFtczogQ3JlYXRlVXNlckV2ZW50UmVxKTogUHJvbWlzZTxFbXB0eSB8IG5ldmVyPiB7XG4gIGxldCB1cmw6IHN0cmluZyA9IGdlbmVyYXRlVXJsKGJhc2VVcmwsIFwiQXBwU2VydmljZVwiLCBcIkNyZWF0ZVVzZXJFdmVudFwiKTtcblxuICByZXR1cm4gd3hSZXF1ZXN0KHsgdXJsOiB1cmwsIGRhdGE6IHBhcmFtcywgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcjogeyAnQXV0aG9yaXphdGlvbic6ICd0b2tlbiAnICsgYXV0aFRva2VuIH0gfSkudGhlbihyZXMgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT09ICdvYmplY3QnICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXMuZGF0YSBhcyBFbXB0eSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlcy5kYXRhKTtcbiAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAvLyBoYW5kbGUgZXJyb3IgcmVzcG9uc2VcbiAgICByZXR1cm4gZXJyb3JIYW5kbGluZyhlcnIpXG4gIH0pO1xufSJdfQ==