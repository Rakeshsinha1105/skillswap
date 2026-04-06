const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function browseUsers(req, res) {
  const { category, type, search } = req.query;

  const users = await prisma.user.findMany({
    where: search
      ? { name: { contains: search, mode: 'insensitive' } }
      : undefined,
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      bio: true,
      location: true,
      skills: {
        where: {
          ...(category && { category }),
          ...(type && { type }),
        },
      },
    },
  });

  // Only return users who have at least one matching skill
  const filtered = category || type
    ? users.filter((u) => u.skills.length > 0)
    : users;

  res.json(filtered);
}

async function getUser(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      bio: true,
      location: true,
      createdAt: true,
      skills: true,
      reviewsReceived: {
        include: { reviewer: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

async function updateUser(req, res) {
  if (req.userId !== Number(req.params.id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { name, bio, location, avatarUrl } = req.body;
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { name, bio, location, avatarUrl },
    select: { id: true, name: true, avatarUrl: true, bio: true, location: true },
  });
  res.json(user);
}

module.exports = { browseUsers, getUser, updateUser };
