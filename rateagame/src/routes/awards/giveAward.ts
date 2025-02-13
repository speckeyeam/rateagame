//NOTE, THERE IS NO WAY TO LIMIT HOW MANY AWARDS ARE LOADED IN! THERE IS ALSO NO WAY TO GET TTHE MOST RARE AWARDS FIRST BUT THIS ISNT THAT IMPORTANT
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { awardCheck } from "../helpers/awardCheck";
import { awardIsForSale } from "../helpers/awardCheck";

const prisma = new PrismaClient();

export const giveAward = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token, awardId, buying, reviewId, recieverId } =
    await requestData;

  console.log(requestData);
  if (userId && token && awardId && reviewId) {
    let player: any = await playerCheck(userId, token);
    let award = await awardCheck(awardId);
    if (player && award) {
      if (buying) {
        const saleCheck = await awardIsForSale(award);
        if (saleCheck) {
          if (player.points >= award.price) {
            const updatedUser = await prisma.user.update({
              where: { userId: userId.toString() },
              data: {
                coins: {
                  increment: -award.price, // Increase coins by 500
                },
              },
            });
            if (updatedUser) {
              const givenAward = await prisma.award.create({
                data: {
                  givenUserId: userId.toString(),
                  receivedUserId: recieverId.toString(),
                  reviewId: reviewId.toString(),
                  awardId: award.id.toString(),
                  time: new Date(),
                },
              });
              if (givenAward) {
                return c.json({ success: true }, 200);
              }
            }
          }
        }
      } else {
        const hasAward = await prisma.awardInventory.findFirst({
          where: {
            userId: userId.toString(),
            awardId: award.id,
          },
        });
        if (hasAward) {
          const deleteAward = await prisma.awardInventory.delete({
            where: {
              userId: userId.toString(),
              id: hasAward.id,
            },
          });
          if (deleteAward) {
            const givenAward = await prisma.award.create({
              data: {
                givenUserId: userId.toString(),
                receivedUserId: recieverId.toString(),
                reviewId: reviewId.toString(),
                awardId: award.id.toString(),
                time: new Date(),
              },
            });
            if (givenAward) {
              return c.json({ success: true }, 200);
            }
          }
        }
      }
      //const recentlyReviewed = getRecentlyReviewed(c); get the rest with this, highest lowest, etc
      return c.json({ success: true }, 200);
    }
  }
  return c.json({ success: false }, 500);
};
