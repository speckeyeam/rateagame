const awards: any = {
  1: {
    Name: "Chopped Chin",
    Icon: "rbxassetid://126596200814658",
    effect: null,
    price: 0,
    id: 1,
  },
  2: {
    Name: "Skull",
    Icon: "rbxassetid://77948887278502",
    effect: null,
    price: 50,
    id: 2,
  },
};

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
  if (awardsForsSale.includes(awardId)) {
    return awards[awardId];
  }
}

export async function getInventory() {
  return startingInventory;
  //here we will check if the award is for sale, and if the user actually owns it
}
