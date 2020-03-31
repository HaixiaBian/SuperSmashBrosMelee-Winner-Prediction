library(ROCR)
# library(speedglm)
# library(parglm)



# Data
# melee = read.csv("all_data.csv")
# melee_clean = within(melee, rm(frame, game_id, tourn_id))
# melee_clean = na.omit(melee_clean)
train = read.csv("train.csv")
train = within(train, rm(frame, game_id, tourn_id))
train = na.omit(train)

test = read.csv("test.csv")
test = within(test, rm(frame, game_id, tourn_id))
test = na.omit(test)

# # Position^2
# train$p1_X2 = train$p1_post_positionX^2
# train$p1_Y2 = train$p1_post_positionY^2
# train$p2_X2 = train$p2_post_positionX^2
# train$p2_Y2 = train$p2_post_positionY^2
# 
# test$p1_X2 = test$p1_post_positionX^2
# test$p1_Y2 = test$p1_post_positionY^2
# test$p2_X2 = test$p2_post_positionX^2
# test$p2_Y2 = test$p2_post_positionY^2



# # Speedglm
# logit_null = speedglm(formula = winner ~ 1,
#                       data = melee_clean,
#                       family = binomial())
# logit_full = speedglm(formula = winner ~ .,
#                       data = melee_clean,
#                       family = binomial())
# logit_interact = speedglm(formula = winner ~ . + . ^ 2,
#                           data = melee_clean,
#                           family = binomial())



# # Parglm
# logit_null = parglm(formula = winner ~ 1,
#                     data = melee_clean,
#                     family = binomial)
# logit_full = parglm(formula = winner ~ .,
#                     data = melee_clean,
#                     family = binomial)
# logit_interact = parglm(formula = winner ~ . + . ^ 2,
#                         data = melee_clean,
#                         family = binomial)



# Glm
logit_null = glm(formula = winner ~ 1,
                 data = train,
                 family = binomial)
logit_full = glm(formula = winner ~ .,
                 data = train,
                 family = binomial)
logit_interact = glm(formula = winner ~ . + . ^ 2,
                     data = train,
                     family = binomial)



# Step
step_full = step(
  object = logit_null,
  scope = formula(logit_full),
  direction = "both",
  k = log(nrow(train))
)
step_interact = step(
  object = step_full,
  scope = formula(logit_interact),
  direction = "both",
  k = log(nrow(train))
)



# BIC
models = list(
  Null = logit_null,
  Full = logit_full,
  Interact = logit_interact,
  StepFull = step_full,
  StepInteract = step_interact
)
bic = sapply(models, extractAIC, k = log(nrow(train)))[2, ]
ebic = exp(-.5 * (bic - min(bic)))
round(ebic / sum(ebic), 8)



# Summary
summary(step_interact)
summary(logit_interact)


# Prediction
threshold = 0.5

# Train data
predictTrain = predict(step_interact, type = "response")
ROCRpred = prediction(predictTrain, train$winner)
ROCRperf = performance(ROCRpred, "tpr", "fpr")
plot(
  ROCRperf,
  colorize = TRUE,
  print.cutoffs.at = threshold,
  text.adj = c(-0.5, 0.5)
)
table(train$winner, predictTrain >= threshold)
(136048 + 126532)/365572

# Test data
predictTest = predict(step_interact, type = "response", newdata = test)
ROCRpred = prediction(predictTest, test$winner)
ROCRperf = performance(ROCRpred, "tpr", "fpr")
plot(
  ROCRperf,
  colorize = TRUE,
  print.cutoffs.at = threshold,
  text.adj = c(-0.5, 0.5)
)
table(test$winner, predictTest >= threshold)
(39847 + 37265)/104048
