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
    console.error("Error retrieving short URL");
  }
};
const findLinkWhereFullURL = async (fullURL) => {
  try {
    const link = await prisma.link.findFirst({
      where: {
        fullURL,
      },
    });
    return link;
  } catch (error) {
    console.error("Error retrieving full url");
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
const deleteLink = async (id) => {
  await prisma.link.delete({
    where: {
      id: parseInt(id),
    },
  });
};
const getUser = async (userName) => {
  const user = await prisma.user.findUnique({
    where: {
      userName,
    },
  });
  return user;
};
const getUserId = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};
const createUser = async (userName, password) => {
  await prisma.user.create({
    data: {
      userName,
      password,
    },
  });
};
const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};
module.exports = {
  createLinks,
  readLinks,
  findLinkWhereShortURL,
  findLinkWhereFullURL,
  updateClicks,
  deleteLink,
  getUser,
  getUserId,
  createUser,
  getUsers,
};
