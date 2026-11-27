import User from '../models/User.js';
import { verifyToken } from '../utils/token.js';

function unauthorized(res, message) {
  return res.status(401).json({ success: false, message });
}

export async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return unauthorized(res, 'Not logged in');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return unauthorized(res, 'Invalid or expired token');
  }

  try {
    const user = await User.findById(payload.id);
    if (!user) {
      return unauthorized(res, 'User no longer exists');
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
