const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 5000;
const SECRET = "votre_secret_jwt";
// Middleware
app.use(cors());
app.use(bodyParser.json());


app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des tâches:', err.message);
            return res.status(500).send('Erreur interne du serveur');
        }
        res.json(rows);
    });
});


app.post('/tasks', (req, res) => {
    const { title, description } = req.body;

    // Validation des données
    if (!title || !description) {
        return res.status(400).send('Le titre et la description sont requis');
    }

    db.run('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description], function (err) {
        if (err) {
            console.error('Erreur lors de l\'ajout de la tâche:', err.message);
            return res.status(500).send('Erreur interne du serveur');
        }
        res.json({ id: this.lastID, title, description });
    });
});


app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, description } = req.body;


    if (!title || !description) {
        return res.status(400).send("Le titre et la description sont requis");
    }

    db.run(
        'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
        [title, description, taskId],
        function (err) {
            if (err) {
                console.error('Erreur lors de la modification de la tâche:', err.message);
                return res.status(500).send('Erreur interne du serveur');
            }
            if (this.changes === 0) {
                return res.status(404).send('Tâche non trouvée');
            }
            res.send('Tâche mise à jour avec succès');
        }
    );
});


app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;

    db.run('DELETE FROM tasks WHERE id = ?', [taskId], function (err) {
        if (err) {
            console.error('Erreur lors de la suppression de la tâche:', err.message);
            return res.status(500).send('Erreur interne du serveur');
        }
        if (this.changes === 0) {
            return res.status(404).send('Tâche non trouvée');
        }
        res.send('Tâche supprimée');
    });
});



app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
