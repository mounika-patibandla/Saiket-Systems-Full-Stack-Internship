const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;
app.use(express.static('public'));

app.use(express.json());
function validateUser(name, email, age) {
    return (
        typeof name === 'string' &&
        name.trim().length > 0 &&
        typeof email === 'string' &&
        email.trim().length > 0 &&
        Number.isInteger(age) &&
        age >= 0
    );
}
app.get('/', (req, res) => {
    res.send('Task 5 Database Integration API is running!');
});
app.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, age FROM users'
        );

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to retrieve users'
        });
    }
});
app.get('/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        const [users] = await pool.execute(
            'SELECT id, name, email, age FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to retrieve user'
        });
    }
});
app.post('/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;

        if (!validateUser(name, email, age)) {
            return res.status(400).json({
                message: 'Provide a valid name, email, and non-negative integer age'
            });
        }

        const [result] = await pool.execute(
            'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
            [name.trim(), email.trim(), age]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: result.insertId,
                name: name.trim(),
                email: email.trim(),
                age
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to create user'
        });
    }
});
app.post('/users/bulk', async (req, res) => {
    const users = req.body;

    if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({
            message: 'Provide a non-empty array of users'
        });
    }

    const allUsersValid = users.every(user =>
        user &&
        validateUser(user.name, user.email, user.age)
    );

    if (!allUsersValid) {
        return res.status(400).json({
            message: 'Every user must have a valid name, email, and non-negative integer age'
        });
    }

    let connection;

    try {
        connection = await pool.getConnection();

        await connection.beginTransaction();

        const createdUsers = [];

        for (const user of users) {
            const [result] = await connection.execute(
                'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
                [user.name.trim(), user.email.trim(), user.age]
            );

            createdUsers.push({
                id: result.insertId,
                name: user.name.trim(),
                email: user.email.trim(),
                age: user.age
            });
        }

        await connection.commit();

        res.status(201).json({
            message: 'Users created successfully',
            count: createdUsers.length,
            users: createdUsers
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error(error);
        res.status(500).json({
            message: 'Failed to create users'
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});
app.put('/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, email, age } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        if (!validateUser(name, email, age)) {
            return res.status(400).json({
                message: 'Provide a valid name, email, and non-negative integer age'
            });
        }

        const [result] = await pool.execute(
            'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
            [name.trim(), email.trim(), age, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: {
                id,
                name: name.trim(),
                email: email.trim(),
                age
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update user'
        });
    }
});
app.delete('/users/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        const [result] = await pool.execute(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            message: 'User deleted successfully',
            id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete user'
        });
    }
});
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON request body'
        });
    }

    next(err);
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});