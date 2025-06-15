const awards: any = {
  1: {
    Name: "Chopped Chin",
    Icon: "rbxassetid://126596200814658",
    effect: null,
    price: 0,
    id: 1,
    rarity: 1,
  },
  2: {
    Name: "Skull",
    Icon: "rbxassetid://77948887278502",
    effect: null,
    price: 50,
    id: 2,
    rarity: 2,
  },
  3: {
    Name: "Helpful",
    Icon: "rbxassetid://72820104991618",
    effect: null,
    price: 50,
    id: 3,
    rarity: 2,
  },
  4: {
    Name: "Copper",
    Icon: "rbxassetid://134212491338570",
    effect: null,
    price: 50,
    id: 4,
    rarity: 4,
  },
  5: {
    Name: "Silver",
    Icon: "rbxassetid://86357361809963",
    effect: null,
    price: 100,
    id: 5,
    rarity: 3,
  },
  [6]: {
    Name: "Gold",
    Icon: "rbxassetid://101817950504348",
    effect: null,
    price: 1000,
    id: 6,
    rarity: 2,
  },
  [7]: {
    Name: "Diamond",
    Icon: "rbxassetid://134726500695606",
    effect: null,
    price: 10000,
    id: 7,
    rarity: 1,
  },
};
//rarities
//1 is common (any free one)
//2 is rare (any other one for now)
//3...
const startingInventory: any = {
  // 2: {
  //   quantity: 5,
  // },
};

const awardsForsSale = [2, 3, 4, 5, 6, 7];

export async function awardCheck(awardId: number) {
  return awards[awardId] || null;
}

export async function awardIsForSale(awardId: number) {
  return awardsForsSale.includes(awardId) || null;
}

export async function getInventory() {
  return startingInventory;
  //here we will check if the award is for sale, and if the user actually owns it
}
