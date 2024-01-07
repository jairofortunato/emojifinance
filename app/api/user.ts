import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id, name, email } = req.body;
      
      // Check if the user already exists
      const exists = await prisma.user.findUnique({ where: { id } });
      
      if (!exists) {
        // Create new user
        const newUser = await prisma.user.create({ 
          data: { 
            id,
            name: name || null, 
            email: email || null,
          }
        });
        res.status(201).json(newUser);
      } else {
        // Update existing user
        const updatedUser = await prisma.user.update({
          where: { id },
          data: {
            name: name || exists.name,
            email: email || exists.email,
          },
        });
        res.status(200).json(updatedUser);
      }
    } catch (error) {
      console.error('Error in user API:', error);
      res.status(500).json({ error: 'An error occurred while creating/updating the user' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed for other methods
  }
}