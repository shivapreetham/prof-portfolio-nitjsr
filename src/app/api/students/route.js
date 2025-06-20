import dbConnect from '@/utils/dbConnect';
import { Student } from '@/models/Student';

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const students = await Student.find({});
        return res.status(200).json(students);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch students' });
      }

    case 'POST':
      try {
        const newStudent = await Student.create(req.body);
        return res.status(201).json(newStudent);
      } catch (error) {
        return res.status(400).json({ error: 'Failed to create student' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
