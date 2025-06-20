import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Student } from '@/models/models';

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find({}).sort({ createdAt: -1 });
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const newStudent = new Student({
      ...data
    });
    await newStudent.save();

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
