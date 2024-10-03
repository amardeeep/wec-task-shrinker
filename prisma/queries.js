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
module.exports = {
  createLinks,
  readLinks,
};
