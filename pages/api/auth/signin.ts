import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import db from "../../../app/lib/db";

function validatePayload(body: Record<string, any>) {
  const { email, password } = body;
  return [
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is invalid",
    },

    {
      valid: validator.isLength(password, { min: 6 }),
      errorMessage: "Password must have at least 6 characters",
    },
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(404).json({ message: "Invalid routes" });

  const errors: string[] = [];

  const validationSchema = validatePayload(req.body);

  validationSchema.forEach((check) => {
    if (!check.valid) errors.push(check.errorMessage);
  });

  if (errors.length) {
    return res.status(400).json({
      errorMessage: errors[0],
    });
  }

  const foundUser = await db.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!foundUser) {
    return res.status(401).json({ errorMessage: "Invalid credentials" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    foundUser.password
  );

  if (!isPasswordCorrect) {
    return res.status(401).json({ errorMessage: "Invalid credentials" });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new jose.SignJWT({ email: foundUser.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret);

  return res.status(200).send({
    token,
  });
}
