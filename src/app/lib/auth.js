// lib/auth.js
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export function verifyToken(req) {
    const { token } = cookie.parse(req.headers.cookie || '');

    if (!token) {
        throw new Error('No token found');
    }

    try {
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET);
        return decodedValue;
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
}
/* Use case of above function
* lets say url comes for: dashboard
* So when dashboard try to fetch the data from server
    we will 1st run above code to verify The token
    if invalid or no token then we will send an error
    else we fetch the data acc. to decodedValue because it contains user's info
    and send to client.
*/
