const joi = require("joi");
const validateUser = (user) => {
  const schema = joi.object({
    username: joi.string().required().min(8),
    email: joi.string().email().required(),
    password: joi.string().required().min(8),
  });

  const val = schema.validate(user);
  if (val.error) return val.error.message;
};

console.log(
  validateUser({
    username: "sulai#1",
    email: "sulaiman@gmail.com",
    password: "sulman#1",
  })
);
