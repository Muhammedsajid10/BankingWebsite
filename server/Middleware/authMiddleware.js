const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(403).send('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Token in authRequire:', token);

    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Data in authRequire:', decode);

    req.user = decode;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(403).send('Invalid token');
  }
};

const admin = (req, res, next) => {
  console.log('User in admin middleware:', req.user);
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { authenticateToken, admin };








// const jwt = require('jsonwebtoken');

// const authenticateToken = async (req, res, next) => {
//   try {
//     const authHeader = req.header('Authorization');
//     if (!authHeader) {
//       return res.status(403).send('No token provided');
//     }
    
//     const token = authHeader.split(' ')[1];
//     console.log('Token in authRequire:', token);

//     const decode = await jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded Data in authRequire:', decode);

//     req.user = decode;

//     // Check if the user is an admin based on the decoded token
//     if (decode && decode.isAdmin) {
//       // If the user is an admin, set isAdmin property in req.user to true
//       req.user.isAdmin = true;
//     }

//     next();
//   } catch (err) {
//     console.error('Token verification error:', err);
//     res.status(403).send('Invalid token');
//   }
// };

// module.exports = { authenticateToken };
