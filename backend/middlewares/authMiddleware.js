const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'u7$!kPz9@1bX#4qLw2eR8sV0zF3cT6hJ';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token ausente' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId; // salva no req para usar nas rotas
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;
