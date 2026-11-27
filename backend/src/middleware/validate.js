const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function sendErrors(res, errors) {
  return res.status(400).json({ success: false, message: 'Invalid input', errors });
}

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body ?? {};
  const errors = [];

  if (!isText(name)) errors.push('Name is required');
  else if (name.trim().length > 50) errors.push('Name must be 50 characters or less');
  if (!isText(email) || !EMAIL_PATTERN.test(email.trim())) errors.push('A valid email is required');
  if (typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) return sendErrors(res, errors);
  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body ?? {};
  const errors = [];

  if (!isText(email)) errors.push('Email is required');
  if (!isText(password)) errors.push('Password is required');

  if (errors.length > 0) return sendErrors(res, errors);
  next();
}
