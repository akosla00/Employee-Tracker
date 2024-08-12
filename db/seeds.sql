INSERT INTO department (name)
VALUES
    ('Accounting'),
    ('IT'),
    ('Customer Service'),
    ('Floor Reps');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Accountant', 75000, 1),
    ('Jr. Accountant', 50000, 1),
    ('IT Man', 50000, 2),
    ('IT Woman', 55000, 2),
    ('Service Rep', 40000, 3),
    ('Jr. Service Rep', 30000, 3),
    ('Floor Guy', 25000, 4),
    ('Floor Gal', 25000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Marilyn', 'Snyder', 1, NULL),
    ('Brian', 'Grace', 2, 1),
    ('Rick', 'Smith', 3, NULL),
    ('Mary', 'Glover', 4, NULL),
    ('Rickie', 'Collins', 5, NULL),
    ('Robin', 'Cartwright', 6, 5),
    ('Samuel', 'Julien', 7, NULL),
    ('Tiffani', 'Wedel', 8, NULL);
