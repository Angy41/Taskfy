const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à SQLite:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite');
    }
});


db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
    )`, (err) => {
        if (err) {
            console.error('Erreur lors de la création de la table "tasks":', err.message);
        } else {
            console.log('Table "tasks" prête');


            db.get('SELECT COUNT(*) AS count FROM tasks', (err, row) => {
                if (err) {
                    console.error('Erreur lors de la vérification des tâches:', err.message);
                } else if (row.count === 0) {
                    db.run(`INSERT INTO tasks (title, description) VALUES ('Tâche par défaut', 'Description par défaut')`, (err) => {
                        if (err) {
                            console.error('Erreur lors de l\'ajout de la tâche par défaut:', err.message);
                        } else {
                            console.log('Tâche par défaut ajoutée');
                        }
                    });
                }
            });
        }
    });
});

module.exports = db;
