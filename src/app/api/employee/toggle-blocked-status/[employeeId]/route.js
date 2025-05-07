import { NextResponse } from 'next/server';
import { ADMIN } from '@/app/database/constants/role.js';
import DBConnect from '@/app/database/lib/db.js';
import Candidate from '@/app/database/models/Candidate.js';
import QA from '@/app/database/models/QA.js';
import getUserFromToken from "@/app/database/lib/auth";
import { isValidObjectId } from 'mongoose';

export async function GET(request, context) {
  const { user, error } = await getUserFromToken(request);

  if (error) {
    const status = error === 'No token found' ? 401 : 403;
    return NextResponse.json({ message: error }, { status });
  }

  if (user.role !== ADMIN) {
    return NextResponse.json(
      { message: `Access denied. Only '${ADMIN}' can block / unblock employees.` },
      { status: 403 }
    );
  }

  try {
    const { employeeId } = await context.params;

    if (!isValidObjectId(employeeId)) {
      return NextResponse.json({ message: 'Invalid employee ID format' }, { status: 400 });
    }

    await DBConnect();

    let employee = await QA.findById(employeeId);

    if (!employee) {
      employee = await Candidate.findById(employeeId);
      if (!employee) {
        return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
      }
    }

    employee.isBlocked = !employee.isBlocked;
    await employee.save();

    return NextResponse.json({ message: 'Blocked status toggled' }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/employee/toggle-block-status/[employeeId]:', error.message);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
