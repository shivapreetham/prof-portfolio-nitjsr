import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Student, STUDENT_TYPES } from '@/models/models';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get('type');

    const filter = {};
    if (typeParam) {
      const normalizedType = typeParam.toLowerCase();
      if (!STUDENT_TYPES.includes(normalizedType)) {
        return NextResponse.json({ error: 'Invalid student type' }, { status: 400 });
      }
      filter.student_type = normalizedType;
    }

    const students = await Student.find(filter).sort({ completion_year: -1, createdAt: -1 });
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

    const rawType = data.student_type;
    const normalizedType = typeof rawType === 'string' ? rawType.toLowerCase() : null;
    if (!normalizedType || !STUDENT_TYPES.includes(normalizedType)) {
      return NextResponse.json({ error: 'Invalid student type' }, { status: 400 });
    }

    const newStudent = new Student({
      ...data,
      student_type: normalizedType
    });
    await newStudent.save();

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
