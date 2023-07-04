import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import db from "../../../app/lib/db";

export interface IPayload {
  email: string;
  exp: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(404).json({ message: "Invalid routes" });

  const token = req.headers["authorization"]?.split(" ")[1] as string;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const data = await jose.jwtVerify(token, secret);
  const payload = data.payload as unknown as IPayload;

  const user = await db.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      city: true,
    },
  });

  if (!user) {
    return res.status(401).json({
      errorMessage: "Invalid token",
    });
  }

  return res.status(200).json({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    city: user.city,
  });
}
