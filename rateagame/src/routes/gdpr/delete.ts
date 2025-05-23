import { Context } from "hono";

import { PrismaClient } from "@prisma/client";
import { createHmac } from "crypto";

import { playerCheck } from "../helpers/playerCheck";

const prisma = new PrismaClient();

export const deleteUser = async (c: Context) => {
  console.log("delete webhook test");
  const secret = process.env.ROBLOX_WEBHOOK_SECRETE;
  if (!secret) throw new Error("Webhook secret missing");
  // 1. Grab headers + raw body
  const sigHeader = c.req.header("Roblox-Signature") ?? "";
  const [tPart, v1Part] = sigHeader.split(",");
  const ts = Number(tPart?.split("=")[1]);
  const sig = v1Part?.split("=")[1] ?? "";
  if (!ts || !sig || Math.abs(Date.now() / 1000 - ts) > 600)
    return c.text("stale", 400);

  // 2. Verify signature (HMAC-SHA256 of `${timestamp}.${raw}`)
  const raw = await c.req.text();
  const h = createHmac("sha256", secret)
    .update(`${ts}.${raw}`)
    .digest("base64");
  if (h !== sig) return c.text("bad sig", 401);

  // 3. Parse out the userId
  let userId: string;

  try {
    const body = JSON.parse(raw);
    userId = body?.EventPayload?.UserId?.toString();
    if (!userId) {
      const m = body?.embeds?.[0]?.description?.match(/User Id:\s*(\d+)/);
      userId = m?.[1];
    }
  } catch (err) {
    return c.json({ error: "Malformed payload" }, 400);
  }
  if (!userId) return c.text("no uid", 400);

  // 4. Delete / anonymize all personal data in one transaction
  try {
    await prisma.$transaction([
      prisma.user.upsert({
        where: { userId: "ANONYMOUS" },
        update: {},
        create: {
          userId: "ANONYMOUS",
          dateJoined: new Date(),
          coins: 0,
          token: "anonymized-placeholder",
        },
      }),

      // 3b. Re-assign awards so no one is personally identifiable
      prisma.award.updateMany({
        where: {
          OR: [{ givenUserId: userId }, { receivedUserId: userId }],
        },
        data: {
          givenUserId: "ANONYMOUS",
          receivedUserId: "ANONYMOUS",
        },
      }),

      // --- 4. Remove everything else tied to the original user ---
      prisma.like.deleteMany({
        where: {
          OR: [
            { userId }, // their likes
            { recievedUserId: userId }, // likes on their reviews
          ],
        },
      }),
      prisma.viewed.deleteMany({ where: { userId } }),
      prisma.saved.deleteMany({ where: { userId } }),
      prisma.report.deleteMany({ where: { userId } }),
      prisma.awardInventory.deleteMany({ where: { userId } }),
      prisma.review.deleteMany({ where: { userId } }),
      // …and any other tables you track…

      // --- 5. Finally delete the user record itself ---
      prisma.user.delete({ where: { userId } }),
    ]);
    return c.json({ status: "erased" });
  } catch (err) {
    console.error("Error erasing user data:", err);
    return c.json({ error: "Deletion failed" }, 500);
  }
};
