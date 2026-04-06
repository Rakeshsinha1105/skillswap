const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserSkills(req, res) {
  const skills = await prisma.skill.findMany({
    where: { userId: Number(req.params.userId) },
  });
  res.json(skills);
}

async function createSkill(req, res) {
  const { title, category, type, description } = req.body;
  if (!title || !category || !type) {
    return res.status(400).json({ error: 'title, category, and type are required' });
  }
  const skill = await prisma.skill.create({
    data: { userId: req.userId, title, category, type, description },
  });
  res.status(201).json(skill);
}

async function updateSkill(req, res) {
  const skill = await prisma.skill.findUnique({ where: { id: Number(req.params.id) } });
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  if (skill.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' });

  const { title, category, type, description } = req.body;
  const updated = await prisma.skill.update({
    where: { id: skill.id },
    data: { title, category, type, description },
  });
  res.json(updated);
}

async function deleteSkill(req, res) {
  const skill = await prisma.skill.findUnique({ where: { id: Number(req.params.id) } });
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  if (skill.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' });

  await prisma.skill.delete({ where: { id: skill.id } });
  res.status(204).send();
}

module.exports = { getUserSkills, createSkill, updateSkill, deleteSkill };
