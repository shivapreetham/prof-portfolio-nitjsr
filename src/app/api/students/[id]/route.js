import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Student } from '@/models/models';
import { ObjectId } from 'mongodb';

// PUT - Update a student by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const studentId = new ObjectId(id);
    const updated = await Student.findByIdAndUpdate(studentId, data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

// DELETE - Remove a student by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const studentId = new ObjectId(id);
    const deleted = await Student.findByIdAndDelete(studentId);
    if (!deleted) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
