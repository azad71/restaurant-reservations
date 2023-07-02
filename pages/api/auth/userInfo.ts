import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import db from "../../../app/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(404).json({ message: "Invalid routes" });

  const bearerToken = req.headers["authorization"] as string;

  if (!bearerToken) {
    return res.status(401).json({
      errorMessage: "Unauthorized request",
    });
  }

  const token = bearerToken.split(" ")[1];
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  let data: any;
  try {
    data = await jose.jwtVerify(token, secret);
  } catch (error) {
    return res.status(401).json({
      errorMessage: "Unauthorized request",
    });
  }

  const user = await db.user.findUnique({
    where: {
      email: data.payload.email,
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
    return res.status(404).json({
      errorMessage: "Invalid token",
    });
  }

  return res.status(200).json({ userInfo: user });
}
