const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser'); 

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

// Connect to SQLite database
var db = new sqlite3.Database('todo.db');

// Create a table for tasks if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, description TEXT, completed BOOLEAN)');



app.get('/', function (req, res) {
    html = fs.readFileSync('index.html');
    res.writeHead(200);
    res.write(html);
    res.end();
});

// Endpoint to return all todos
app.get('/all', function (req, res) {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.post('/add', function (req, res) {
    console.log(req.body)
    var name = req.body.name;
    var date = req.body.date;
    var description = req.body.description;

    // Insert task into the database
    db.run('INSERT INTO tasks (name, date, description, completed) VALUES (?, ?, ?, ?)', [name, date, description, 0], function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.json({ id: this.lastID, name, date, description, completed: false });
    });

});

app.post('/complete', function (req, res) {
    var taskId = req.body.id;

    // Update the 'completed' column for the specified task
    db.run('UPDATE tasks SET completed = ? WHERE id = ?', [true, taskId], function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`Task with id ${taskId} marked as completed`);
        res.json({ success: true });
    });

});

// Delete task
app.delete('/delete/:id', (req, res) => {
    const taskId = req.params.id;

    db.run('DELETE FROM tasks WHERE id = ?', [taskId], function (err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json({ success: true });
    });
});


// Define the static directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:%s', port);
});
