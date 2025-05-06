import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import DBConnect from './db';
import Admin from '../models/Admin';


async function getToken(request) {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const { token } = cookie.parse(cookieHeader);

        if (!token) {
            return { error: 'No token found' };
        }

        const decodedValue = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedValue);
        await DBConnect();
        const user = await Admin.findOne({ _id: decodedValue.userId });

        // console.log("----------------------------------");
        // console.log(user);

        if (!user) {
            return { error: 'User not found' };
        }

        return { user };
    } catch (err) {
        return { error: 'Invalid or expired token' };
    }
}

export default getToken;




/* Use case of above function
* lets say url comes for: dashboard
* So when dashboard try to fetch the data from server
    we will 1st run above code to verify The token
    if invalid or no token then we will send an error
    else we fetch the data acc. to decodedValue because it contains user's info
    and send to client.
*/
