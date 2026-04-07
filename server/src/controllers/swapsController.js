const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMyRequests(req, res) {
  const requests = await prisma.swapRequest.findMany({
    where: {
      OR: [{ senderId: req.userId }, { receiverId: req.userId }],
    },
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true, email: true } },
      receiver: { select: { id: true, name: true, avatarUrl: true, email: true } },
      offeredSkill: true,
      wantedSkill: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(requests);
}

async function sendRequest(req, res) {
  const { receiverId, offeredSkillId, wantedSkillId } = req.body;
  if (!receiverId || !offeredSkillId || !wantedSkillId) {
    return res.status(400).json({ error: 'receiverId, offeredSkillId, and wantedSkillId are required' });
  }
  if (receiverId === req.userId) {
    return res.status(400).json({ error: 'Cannot send a swap request to yourself' });
  }

  const request = await prisma.swapRequest.create({
    data: {
      senderId: req.userId,
      receiverId: Number(receiverId),
      offeredSkillId: Number(offeredSkillId),
      wantedSkillId: Number(wantedSkillId),
    },
    include: {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
      offeredSkill: true,
      wantedSkill: true,
    },
  });
  res.status(201).json(request);
}

async function respondToRequest(req, res) {
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be accepted or rejected' });
  }

  const swap = await prisma.swapRequest.findUnique({ where: { id: Number(req.params.id) } });
  if (!swap) return res.status(404).json({ error: 'Swap request not found' });
  if (swap.receiverId !== req.userId) return res.status(403).json({ error: 'Forbidden' });
  if (swap.status !== 'pending') return res.status(400).json({ error: 'Request already resolved' });

  const updated = await prisma.swapRequest.update({
    where: { id: swap.id },
    data: { status },
  });
  res.json(updated);
}

module.exports = { getMyRequests, sendRequest, respondToRequest };
