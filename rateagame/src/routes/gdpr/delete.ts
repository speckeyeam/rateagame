import { Context } from "hono";

import { PrismaClient } from "@prisma/client";
import { createHmac } from "crypto";

import { playerCheck } from "../helpers/playerCheck";

const prisma = new PrismaClient();

export const deleteUser = async (c: Context) => {
  // 1. Grab headers + raw body
  const sig = c.req.header("Roblox-Signature") || "";
  const timestamp = c.req.header("Timestamp") || "";
  const raw = await c.req.text();

  // 2. Verify signature (HMAC-SHA256 of `${timestamp}.${raw}`)
  const hmac = createHmac("sha256", process.env.ROBUX_WEBHOOK_SECRET!);
  hmac.update(`${timestamp}.${raw}`);
  if (hmac.digest("base64") !== sig) {
    return c.json({ error: "Invalid signature" }, 401);
  }

  // 3. Parse out the userId
  let userId: string;
  try {
    const payload = JSON.parse(raw);
    const desc: string = payload.embeds?.[0]?.description || "";
    const match = desc.match(/User Id:\s*(\d+)/);
    if (!match) throw new Error("UserId not found in payload");
    userId = match[1];
  } catch (err) {
    return c.json({ error: "Malformed payload" }, 400);
  }

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
