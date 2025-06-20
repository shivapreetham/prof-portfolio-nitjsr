import dbConnect from '@/utils/dbConnect';
import { Student } from '@/models/Student';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        return res.status(200).json(student);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch student' });
      }

    case 'PUT':
      try {
        const updated = await Student.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Student not found' });
        return res.status(200).json(updated);
      } catch (error) {
        return res.status(400).json({ error: 'Failed to update student' });
      }

    case 'DELETE':
      try {
        const deleted = await Student.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: 'Student not found' });
        return res.status(200).json({ message: 'Student deleted' });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete student' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
