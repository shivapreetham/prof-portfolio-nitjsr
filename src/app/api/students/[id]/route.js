import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Student, STUDENT_TYPES } from '@/models/models';
import { ObjectId } from 'mongodb';

// PUT - Update a student by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();

    const payload = { ...data };
    if (payload.student_type !== undefined) {
      if (typeof payload.student_type !== 'string') {
        return NextResponse.json({ error: 'Invalid student type' }, { status: 400 });
      }
      payload.student_type = payload.student_type.toLowerCase();
      if (!STUDENT_TYPES.includes(payload.student_type)) {
        return NextResponse.json({ error: 'Invalid student type' }, { status: 400 });
      }
    }

    const studentId = new ObjectId(id);
    const updated = await Student.findByIdAndUpdate(studentId, payload, { new: true, runValidators: true });
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
    const { id } = await params;

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
