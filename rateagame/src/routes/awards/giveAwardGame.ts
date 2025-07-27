//NOTE, THERE IS NO WAY TO LIMIT HOW MANY AWARDS ARE LOADED IN! THERE IS ALSO NO WAY TO GET TTHE MOST RARE AWARDS FIRST BUT THIS ISNT THAT IMPORTANT
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { awardCheck } from "../helpers/awardCheck";
import { awardIsForSale } from "../helpers/awardCheck";

const prisma = new PrismaClient();

export const giveAwardGame = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token, awardId, buying, gamePass, gameId } =
    await requestData;

  console.log(requestData);
  if (userId && token && awardId && gameId) {
    let player: any = await playerCheck(c);
    let award = await awardCheck(awardId);
    if (player && award) {
      let game;
      if (gamePass) {
        game = await prisma.gamePass.findFirst({
          where: {
            gamePassId: gameId.toString(),
          },
        });
      } else {
        game = await prisma.game.findFirst({
          where: {
            gameId: gameId.toString(),
          },
        });
      }

      if (game) {
        console.log("test1");
        if (buying) {
          console.log("test3");

          const saleCheck = await awardIsForSale(award.id);
          if (saleCheck) {
            console.log("test4");

            if (player.coins >= award.price) {
              const updatedUser = await prisma.user.update({
                where: { userId: userId.toString() },
                data: {
                  coins: {
                    increment: -award.price, // decrease coins by the amount that the award cost
                  },
                },
              });
              if (updatedUser) {
                const givenAward = await prisma.award.create({
                  data: {
                    givenUserId: userId.toString(),
                    [gamePass ? "gamePassId" : "gameId"]: gameId.toString(),
                    awardId: award.id.toString(),
                    time: new Date(),
                  },
                });
                if (givenAward) {
                  return c.json(
                    {
                      success: true,
                      updatedPoints: player.coins - award.price,
                    },
                    200
                  );
                }
              }
            }
          }
        } else {
          console.log("test2");
          const hasAward = await prisma.awardInventory.findFirst({
            where: {
              userId: userId.toString(),
              awardId: award.id.toString(),
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
                  [gamePass ? "gamePassId" : "gameId"]: gameId.toString(),
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
      }
    }
  }
  return c.json({ success: false }, 500);
};
