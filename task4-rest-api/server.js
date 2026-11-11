
const express = require('express');

const app = express();
const PORT = 3000;
app.use(express.json());
let users = [];
let nextId = 1;
function validateUser(name, email, age) {
    if (
        typeof name !== 'string' ||
        !name.trim() ||
        typeof email !== 'string' ||
        !email.trim() ||
        typeof age !== 'number' ||
        !Number.isFinite(age) ||
        age < 0
    ) {
        return false;
    }

    return true;
}
app.post('/test', (req, res) => {
    res.send('POST route is working!');
});
app.get('/', (req, res) => {
    res.send('User Management REST API is running!');
});
app.get('/users', (req, res) => {
    res.status(200).json(users);
});
console.log('Bulk route registered');
app.post('/users/bulk', (req, res) => {
    console.log('Bulk endpoint reached');
    const newUsers = req.body;

    if (!Array.isArray(newUsers) || newUsers.length === 0) {
        return res.status(400).json({
            message: 'Please provide a non-empty array of users.'
        });
    }

    const allUsersValid = newUsers.every((user) => {
        return user &&
            validateUser(user.name, user.email, user.age);
    });

    if (!allUsersValid) {
        return res.status(400).json({
            message: 'Every user must have a valid name, email, and non-negative numeric age.'
        });
    }

    const createdUsers = newUsers.map((user) => {
        const newUser = {
            id: nextId++,
            name: user.name.trim(),
            email: user.email.trim(),
            age: user.age
        };

        users.push(newUser);
        return newUser;
    });

    res.status(201).json({
        message: 'Users created successfully',
        count: createdUsers.length,
        users: createdUsers
    });
});
app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    res.status(200).json(user);
});
app.post('/users', (req, res) => {
    const { name, email, age } = req.body;

    if (!validateUser(name, email, age)) {
        return res.status(400).json({
            message: 'Please provide a valid name, email, and non-negative numeric age.'
        });
    }

    const newUser = {
        id: nextId++,
        name: name.trim(),
        email: email.trim(),
        age: age
    };

    users.push(newUser);

    res.status(201).json({
        message: 'User created successfully',
        user: newUser
    });
});
app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    const { name, email, age } = req.body;

    if (!validateUser(name, email, age)) {
        return res.status(400).json({
            message: 'Please provide a valid name, email, and non-negative numeric age.'
        });
    }

    user.name = name.trim();
    user.email = email.trim();
    user.age = age;

    res.status(200).json({
        message: 'User updated successfully',
        user: user
    });
});
app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    res.status(200).json({
        message: 'User deleted successfully',
        user: deletedUser
    });
});
app.use((err, req, res, next) => {
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        'body' in err
    ) {
        return res.status(400).json({
            message: 'Invalid JSON request body'
        });
    }

    next(err);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
