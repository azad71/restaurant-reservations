import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import db from "../../../app/lib/db";

function validatePayload(body: Record<string, any>) {
  const { firstName, lastName, email, phone, city, password } = body;
  return [
    {
      valid: validator.isLength(firstName, {
        min: 1,
        max: 20,
      }),
      errorMessage: "First name is invalid",
    },
    {
      valid: validator.isLength(lastName, {
        min: 1,
        max: 20,
      }),
      errorMessage: "Last name is invalid",
    },
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is invalid",
    },
    {
      valid: validator.isMobilePhone(phone),
      errorMessage: "Phone number is invalid",
    },
    {
      valid: validator.isLength(city, {
        min: 1,
      }),
      errorMessage: "City name is required",
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

  if (foundUser) {
    return res.status(400).json({
      errorMessage: "Email already associated with an account",
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = await db.user.create({
    data: {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      city: req.body.city,
    },
  });

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new jose.SignJWT({ email: newUser.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret);

  return res.status(200).send({
    token,
  });
}
