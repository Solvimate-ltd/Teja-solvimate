import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import DBConnect from '@/app/database/lib/db';
import Admin from '@/app/database/models/Admin';
import Candidate from '@/app/database/models/Candidate';
import QualityAssurance from '@/app/database/models/QA';

async function getUserFromToken(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const { token } = cookie.parse(cookieHeader);

    if (!token) {
      return { error: 'No token found' };
    }

    const decodedValue = jwt.verify(token, process.env.JWT_SECRET);

    await DBConnect();


    let user = (await Admin.findById(decodedValue.userId)) || (await Candidate.findById(decodedValue.userId)) || (await QualityAssurance.findById(decodedValue.userId));

    if (!user) {
      return { error: 'User not found' };
    }

    return { user };
  } catch (err) {
    return { error: 'Invalid or expired token' };
  }
}

export default getUserFromToken;


/* Use case of above function
* lets say url comes for: dashboard
* So when dashboard try to fetch the data from server
    we will 1st run above code to verify The token
    if invalid or no token then we will send an error
    else we fetch the data acc. to decodedValue because it contains user's info
    and send to client.
*/
