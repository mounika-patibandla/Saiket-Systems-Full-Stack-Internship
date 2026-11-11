const API_URL = '/users';

const userForm = document.getElementById('user-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');

const usersTable = document.getElementById('users-table');
const message = document.getElementById('message');

const formTitle = document.getElementById('form-title');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');
const refreshButton = document.getElementById('refresh-button');

let editingUserId = null;

function showMessage(text, type = 'success') {
    message.textContent = text;
    message.className = type;
}

function clearMessage() {
    message.textContent = '';
    message.className = '';
}

function resetForm() {
    userForm.reset();
    editingUserId = null;

    formTitle.textContent = 'Add New User';
    submitButton.textContent = 'Add User';
    cancelButton.hidden = true;

    clearMessage();
}

async function loadUsers() {
    usersTable.replaceChildren();

    const loadingRow = document.createElement('tr');
    const loadingCell = document.createElement('td');

    loadingCell.colSpan = 5;
    loadingCell.textContent = 'Loading users...';

    loadingRow.appendChild(loadingCell);
    usersTable.appendChild(loadingRow);

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Unable to retrieve users.');
        }

        const users = await response.json();

        usersTable.replaceChildren();

        if (users.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');

            cell.colSpan = 5;
            cell.textContent = 'No users found. Add your first user!';

            row.appendChild(cell);
            usersTable.appendChild(row);
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');

            [user.id, user.name, user.email, user.age].forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionsCell = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit';
            editButton.addEventListener('click', () => editUser(user));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
            deleteButton.addEventListener('click', () => deleteUser(user.id));

            actionsCell.append(editButton, deleteButton);
            row.appendChild(actionsCell);

            usersTable.appendChild(row);
        });
    } catch (error) {
        usersTable.replaceChildren();

        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = 5;
        cell.textContent = error.message;

        row.appendChild(cell);
        usersTable.appendChild(row);

        showMessage(
            'Could not load users. Check that the server and database are running.',
            'error'
        );
    }
}

userForm.addEventListener('submit', async event => {
    event.preventDefault();
    clearMessage();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const age = Number(ageInput.value);

    if (
        !name ||
        !email ||
        ageInput.value.trim() === '' ||
        !Number.isInteger(age) ||
        age < 0
    ) {
        showMessage(
            'Enter a valid name, email, and non-negative whole-number age.',
            'error'
        );
        return;
    }

    const user = { name, email, age };

    const isEditing = editingUserId !== null;
    const url = isEditing
        ? `${API_URL}/${editingUserId}`
        : API_URL;

    const method = isEditing ? 'PUT' : 'POST';

    submitButton.disabled = true;

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Request failed.');
        }

        resetForm();

        showMessage(
            isEditing
                ? 'User updated successfully!'
                : 'User created successfully!',
            'success'
        );

        await loadUsers();
    } catch (error) {
        showMessage(error.message, 'error');
    } finally {
        submitButton.disabled = false;
    }
});

function editUser(user) {
    editingUserId = user.id;

    nameInput.value = user.name;
    emailInput.value = user.email;
    ageInput.value = user.age;

    formTitle.textContent = 'Edit User';
    submitButton.textContent = 'Update User';
    cancelButton.hidden = false;

    clearMessage();

    nameInput.focus();
    userForm.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

async function deleteUser(id) {
    const confirmed = window.confirm(
        `Are you sure you want to delete user ${id}?`
    );

    if (!confirmed) {
        return;
    }

    clearMessage();

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to delete user.');
        }

        if (editingUserId === id) {
            resetForm();
        }

        showMessage('User deleted successfully!', 'success');

        await loadUsers();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

cancelButton.addEventListener('click', resetForm);
refreshButton.addEventListener('click', loadUsers);

loadUsers();