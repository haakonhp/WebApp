import {addSport} from "@/features/Sports/sports.repository";

import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()


async function main() {
  /*await wipeDatabase();*/
  // prepopulated database, included in project.
  //const sports = ['running', 'cycling', 'skiing', 'triathlon', 'swimming', 'strength', 'other', 'Unknown'];
  //await Promise.all(sports.map(async (sport) => addSport(prisma, sport)))

  // Use when calling API point
  // await requestJSON("https://webapp-api.vercel.app/api/users");
  // Use when defaulting to downloaded data, we don't want to be bothering the API point now.
  /*await requestJSON("");*/

}

await main()

