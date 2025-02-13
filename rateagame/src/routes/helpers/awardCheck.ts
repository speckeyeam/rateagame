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
};
//rarities
//1 is common (any free one)
//2 is rare (any other one for now)
//3...
const startingInventory: any = {
  1: {
    quantity: 1,
  },
  2: {
    quantity: 5,
  },
};

const awardsForsSale = [2];

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
