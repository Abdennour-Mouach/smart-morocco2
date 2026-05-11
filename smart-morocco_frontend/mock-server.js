const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5006;

// Middleware
app.use(cors());
app.use(express.json());

// Mock user storage
const users = [];

// Registration endpoint
app.post('/api/utilisateurs', (req, res) => {
  try {
    const { nom, prenom, email, telephone, mot_de_passe, role } = req.body;
    
    // Basic validation
    if (!nom || !prenom || !email || !telephone || !mot_de_passe) {
      return res.status(400).json({ 
        message: 'Tous les champs sont obligatoires' 
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Un utilisateur avec cet email existe déjà' 
      });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      nom,
      prenom,
      email,
      telephone,
      mot_de_passe, // In production, this should be hashed
      role: role || "ROLE_USER",
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    console.log('New user registered:', newUser);
    
    res.status(201).json({ 
      message: 'Inscription réussie!',
      user: {
        id: newUser.id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email,
        telephone: newUser.telephone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de l\'inscription' 
    });
  }
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      res.json({ 
        message: 'Connexion réussie!',
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone
        }
      });
    } else {
      res.status(401).json({ 
        message: 'Email ou mot de passe incorrect' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la connexion' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', users: users.length });
});

app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
