const { z } = require("zod");

const registerApiSchema = z.object({

  name: z.string().min(2, "API name must be at least 2 characters"),

  payTo: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum wallet address"),

  amount: z.number().positive("Amount must be greater than 0"),

  endpoint: z.string().url("Endpoint must be a valid URL"),
});

function validateRegisterApi(req, res, next) {
  try {
    registerApiSchema.parse(req.body);
    next();
  } catch (err) {
    const message = err.issues?.[0]?.message || "Invalid input";

    return res.status(400).json({
      error: message,
    });
  }
}

module.exports = {
  registerApiSchema,
  validateRegisterApi,
};
