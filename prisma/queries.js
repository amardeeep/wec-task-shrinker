const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createLinks = async (fullURL, shortURL) => {
  await prisma.link.create({
    data: {
      fullURL,
      shortURL,
    },
  });
};
const readLinks = async () => {
  const links = await prisma.link.findMany();
  return links;
};
const findLinkWhereShortURL = async (shortURl) => {
  try {
    const link = await prisma.link.findFirst({
      where: {
        shortURL: shortURl,
      },
    });
    return link;
  } catch (error) {
    console.error("Error retrieving full URL");
  }
};
const updateClicks = async (link) => {
  let clicks = link.clicks;
  clicks++;
  await prisma.link.update({
    where: {
      id: link.id,
    },
    data: {
      clicks: clicks,
    },
  });
};
module.exports = {
  createLinks,
  readLinks,
  findLinkWhereShortURL,
  updateClicks,
};
