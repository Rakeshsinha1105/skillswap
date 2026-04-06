const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserReviews(req, res) {
  const reviews = await prisma.review.findMany({
    where: { revieweeId: Number(req.params.userId) },
    include: {
      reviewer: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(reviews);
}

async function createReview(req, res) {
  const { swapId, revieweeId, rating, comment } = req.body;
  if (!swapId || !revieweeId || !rating) {
    return res.status(400).json({ error: 'swapId, revieweeId, and rating are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be between 1 and 5' });
  }

  // Verify the swap exists, is accepted, and the reviewer was part of it
  const swap = await prisma.swapRequest.findUnique({ where: { id: Number(swapId) } });
  if (!swap) return res.status(404).json({ error: 'Swap not found' });
  if (swap.status !== 'accepted') return res.status(400).json({ error: 'Can only review accepted swaps' });
  if (swap.senderId !== req.userId && swap.receiverId !== req.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const review = await prisma.review.create({
    data: {
      reviewerId: req.userId,
      revieweeId: Number(revieweeId),
      swapId: Number(swapId),
      rating: Number(rating),
      comment,
    },
  });
  res.status(201).json(review);
}

module.exports = { getUserReviews, createReview };
