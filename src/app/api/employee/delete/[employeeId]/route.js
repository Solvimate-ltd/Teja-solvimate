import { NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { ADMIN } from '@/app/database/constants/role.js';
import DBConnect from '@/app/database/lib/db.js';
import Candidate from '@/app/database/models/Candidate.js';
import QA from '@/app/database/models/QA.js';
import getUserFromToken from "@/app/database/lib/auth";

export async function DELETE(request, context) {
  const { user, error } = await getUserFromToken(request);

  if (error) {
    const status = error === 'No token found' ? 401 : 403;
    return NextResponse.json({ message: error }, { status });
  }

  if (user.role !== ADMIN) {
    return NextResponse.json(
      { message: `Access denied. Only '${ADMIN}' can delete employees.` },
      { status: 403 }
    );
  }

  try {
    const { employeeId } = await context.params;

    if (!isValidObjectId(employeeId)) {
      return NextResponse.json({ message: 'Invalid employee ID format' }, { status: 400 });
    }

    await DBConnect();

    let employee = await QA.findByIdAndDelete(employeeId);

    if (!employee) {
      employee = await Candidate.findByIdAndDelete(employeeId);
      if (!employee) {
        return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
      }
    }

    return NextResponse.json(
      { message: 'Employee deleted successfully', employee },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/employee/delete/:employeeId API', error.message);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
