# library(speedglm)
# library(parglm)

# Data
melee = read.csv("all_data.csv")
melee_clean = within(melee, rm(X, frame))
melee_clean = na.omit(melee_clean)



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
#
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
                 data = melee_clean,
                 family = binomial)
logit_full = glm(formula = winner ~ .,
                 data = melee_clean,
                 family = binomial)
logit_interact = glm(formula = winner ~ . + . ^ 2,
                     data = melee_clean,
                     family = binomial)



# Step
step_full = step(
  object = logit_null,
  scope = formula(logit_full),
  direction = "both",
  k = log(nrow(melee_clean))
)
step_interact = step(
  object = step_full,
  scope = formula(logit_interact),
  direction = "both",
  k = log(nrow(melee_clean))
)

# BIC
models = list(
  Null = logit_null,
  Full = logit_full,
  Interact = logit_interact,
  StepFull = step_full,
  StepInteract = step_interact
)
bic = sapply(models, extractAIC, k = log(nrow(melee_clean)))[2,]
ebic = exp(-.5 * (bic - min(bic)))
round(ebic / sum(ebic), 8)

# Summary
summary(step_interact)
summary(logit_interact)
