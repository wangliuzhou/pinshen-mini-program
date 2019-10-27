/**
* This file is generated by 'protoapi'
* This file contains all the data structure being used in the generated ts services
* -----------------------------------------------------
* 该文件生成于protoapi
* 文件包含API前端调用所引用的数据结构定义
*/

// enums
export enum ValidateErrorType {
  INVALID_EMAIL = 0,
  FIELD_REQUIRED = 1,
}
// data types
export interface CommonError {

  genericError: GenericError
  authError: AuthError
  validateError: ValidateError
  bindError: BindError
}

export interface GenericError {

  kind: "genericError"

  message: string
}

export interface AuthError {

  kind: "authError"

  message: string
}

export interface BindError {

  kind: "bindError"

  message: string
}

export interface ValidateError {

  kind: "validateError"

  errors: FieldError[]
}

export interface FieldError {

  fieldName: string
  errorType: ValidateErrorType
}

export interface Empty {

}

export interface RetrieveUserProfileResp {

  gender: number
  year_of_birth: number
  height: number
  weight: number
  weight_before_pregnancy: number
  activity_level: number
  pregnancy_stage: number
  expected_birth_date: number
}

export interface UpdateUserProfileReq {

  gender: number
  year_of_birth: number
  height: float32
  weight: float32
  weight_before_pregnancy: float32
  activity_level: number
  pregnancy_stage: number
  expected_birth_date: number
  nickname: string
  avatar_url: string
  times_of_pregnancy: number
}

export interface FoodPreference {

  food_preference_id: number
  name: string
  is_selected: boolean
}

export interface RetrieveFoodPreferenceResp {

  food_preferences: FoodPreference[]
}

export interface UpdateFoodPreferenceReq {

  food_preference_ids: number[]
}

export interface FoodAllergy {

  food_allergy_id: number
  name: string
  is_selected: boolean
}

export interface MedicalCondition {

  medical_condition_id: number
  name: string
  is_selected: boolean
}

export interface RetrieveMedicalProfileResp {

  food_allergies: FoodAllergy[]
  medical_conditions: MedicalCondition[]
}

export interface UpdateMedicalProfileReq {

  food_allergy_ids: number[]
  medical_condition_ids: number[]
}

export interface RetrieveRecommendedDailyAllowanceResp {

  energy: number
}

export interface WeightValueDate {

  value: number
  date: number
}

export interface WeightChangeRange {

  upper: number
  lower: number
}

export interface RetrieveWeightLogReq {

  date_from: number
  date_to: number
}

export interface RetrieveWeightLogResp {

  initial_weight: WeightValueDate
  latest_weight: WeightValueDate
  target_weight: WeightValueDate
  weight_logs: WeightValueDate[]
  weight_change_range: WeightChangeRange
  is_pregnant_lady: boolean
  expected_birth_date: number
  number_of_pregnant_weeks: number
  weight_upper_bound: number
  weight_lower_bound: number
}

export interface CreateWeightLogReq {

  weight_value: number
  date: number
}

export interface CreateTargetWeightReq {

  target_weight_value: number
  date: number
}

export interface ArticleInfo {

  title: string
  desc: string
  img_url: string
  article_url: string
}

export interface RetrieveNutritionKnowledgeResp {

  macro: ArticleInfo[]
  micro: ArticleInfo[]
}

export interface RetrieveUserRDAResp {

  rda_url: string
}

export interface RetrieveUserReportsReq {

  date_from: number
  date_to: number
}

export interface DailyReportCard {

  date: number
  is_report_generated: boolean
  is_food_log_empty: boolean
}

export interface WeeklyReportCard {  
  date: number
  date_from:number
  date_to:number
  is_read: boolean
  report_url: string
}

export interface RetrieveUserReportsResp {

  daily_report: DailyReportCard[]
  weekly_report: WeeklyReportCard[]
  num_of_new_weekly_report: number
}

export interface RetrieveOrCreateUserReportReq {

  date: number
}

export interface RetrieveOrCreateUserReportResp {

  report_url: string
  is_food_log_empty: boolean
}

export interface RetrieveHomePageInfoReq {

  date: number
}

export interface DailyIntake {

  value: number
  week: string
}

export interface RetrieveHomePageInfoResp {

  daily_avg_intake: number
  daily_target_intake: number
  daily_suggested_intake: number
  latest_weight: number
  daily_intakes: DailyIntake[]
}

export interface RetrieveHomePageFeedReq {

  offset: number
  limit: number
}

export interface FeedInfo {

  name: string
  description: string
  type: number
  icon_link: string
  link: string
  timestamp: number
}

export interface RetrieveHomePageFeedResp {

  feed_info: FeedInfo[]
}
export interface CardInfo {
  card_id: number
  title: string
  description: string
  card_type: string
  icon_link: string
  content_link: string
  is_checked: boolean
}

export interface RetrieveCardListResp {

  card_list: CardInfo[]
}

export interface CreateQuestionReq {

  date: number
  question: string
}

export interface RetrieveSurveyReq {

  survey_id: number
}

export interface RetrieveSurveyResp {

  question: string
}

export interface CreateSurveyAnswerReq {

  survey_id: number
  is_positive: boolean
}

export interface NutrientValue {

  percentage: number
  suggested_intake: number
  intake: number
}

export interface NutrientIntake {

  energy: NutrientValue
  protein: NutrientValue
  carbohydrate: NutrientValue
  fat: NutrientValue
}

export interface NutrientValueByMeal {

  percentage: number
  suggested_intake: number
  energy_intake: number
}

export interface MealInfo {

  meal_id: number
  img_key: string
}

export interface RetrieveFoodDiaryReq {

  date: number
}

export interface RetrieveFoodDiaryResp {

  daily_intake: NutrientIntake
  breakfast_suggestion: NutrientValueByMeal
  lunch_suggestion: NutrientValueByMeal
  dinner_suggestion: NutrientValueByMeal
  addition_suggestion: NutrientValueByMeal
  breakfast: MealInfo[]
  lunch: MealInfo[]
  dinner: MealInfo[]
  addition: MealInfo[]
  is_report_generated: number
}

export interface UnitOption {

  unit_id: number
  unit_name: string
  weight: number
}

export interface IngredientList {

  recipe_details_id: number
  ingredient_name: string
  amount: number
  unit_id: number
  unit_name: string
  weight: number
  unit_option: UnitOption[]
}

export interface RecognitionResults {

  food_id: number
  food_type: number
  food_name: string
  score: number
}

export interface FoodLogInfo {

  food_log_id: number
  food_name: string
  food_type: number
  energy: number
  tag_x: number
  tag_y: number
  amount: number
  unit_id: number
  unit_name: string
  weight: number
  unit_option: UnitOption[]
  ingredient_list: IngredientList[]
  recognition_results: RecognitionResults[]
}

export interface MealLogFoodList {

  food_id: number
  food_type: number
  input_type: number
  tag_x: number
  tag_y: number
  bbox_x: number
  bbox_y: number
  bbox_w: number
  bbox_h: number
  recognition_results: RecognitionResults[]
}

export interface CreateOrUpdateMealLogReq {

  meal_id: number
  meal_date: number
  meal_type: number
  food_list: MealLogFoodList[]
}

export interface MealLogResp {

  meal_id: number
  meal_name: string
  meal_date: number
  meal_type: number
  total_intake: NutrientIntake
  food_log: FoodLogInfo[]
}

export interface RetrieveMealLogReq {

  meal_id: number
}

export interface ConfirmMealLogReq {

  meal_id: number
}

export interface DestroyMealLogReq {

  meal_id: number
}

export interface TextSearchResult {

  food_id: number
  food_name: string
  food_type: number
  amount: number
  unit_name: string
  energy: number
}

export interface RetrieveTextSearchReq {

  query: string
  filter_type: number
  limit: number
  offset: number
  food_type: number
  meal_type: number
  lat: number
  long: number
}

export interface RetrieveTextSearchResp {

  total_num: number
  result_list: TextSearchResult[]
}

export interface PredictionResult {

  tag_x: number
  tag_y: number
  bbox_x: number
  bbox_y: number
  bbox_w: number
  bbox_h: number
  food_id: number
  food_type: number
  food_name: string
  result_list: RecognitionResults[]
}

export interface RetrieveRecognitionReq {

  img_key: string
  meal_date: number
  meal_type: number
  lat: number
  long: number
}

export interface RetrieveRecognitionResp {

  meal_id: number
  img_key: string
  prediction: PredictionResult[]
}

export interface UpdateFoodLogReq {

  food_log_id: number
  unit_id: number
  amount: number
}

export interface DestroyFoodLogReq {

  food_log_id: number
}

export interface AddRecipeItemReq {

  food_log_id: number
  ingredient_id: number
}

export interface UpdateRecipeItemReq {

  recipe_item_id: number
  unit_id: number
  amount: number
}

export interface DestroyRecipeItemReq {

  recipe_item_id: number
}

export interface RetrieveMealLogShareURLReq {

  meal_log_id: number
}

export interface RetrieveMealLogShareURLResp {

  sharing_img_link: string
}

export interface CreateUserEventReq {
  event_type: string
  event_value: string
}