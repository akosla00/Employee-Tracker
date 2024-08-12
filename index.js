const { Pool } = require("pg");
const inquirer = require("inquirer");

const pool = new Pool(
  {
    user: "postgres",
    password: "akosla00",
    host: "localhost",
    database: "employees_db",
  },
  console.log("Connected to employees_db database")
);

pool.connect();

const initialPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose what you would like to do!",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Quit",
        ],
      },
    ])
    .then((choices) => {
      handleSubmit(choices);
    });
};

const init = () => {
  initialPrompt();
};

init();

const handleSubmit = (choices) => {
  if (choices.choice === "View All Departments") {
    pool.query("SELECT * FROM department;", (err, { rows }) => {
      if (err) {
        console.log(err);
      }
      console.table(rows);
      initialPrompt();
    });
  }
  if (choices.choice === "View All Roles") {
    pool.query(
      "SELECT role.id, role.title, role.salary, department.name FROM role JOIN department ON role.department_id = department.id;",
      (err, { rows }) => {
        if (err) {
          console.log(err);
        }
        console.table(rows);
        initialPrompt();
      }
    );
  }
  if (choices.choice === "View All Employees") {
    pool.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
      (err, { rows }) => {
        if (err) {
          console.log(err);
        }
        console.table(rows);
        initialPrompt();
      }
    );
  }
  if (choices.choice === "Add a Department") {
    inquirer
      .prompt([
        {
          type: "input",
          name: "department",
          message: "Enter the name of the department you would like to add!",
        },
      ])
      .then((answer) => {
        let newDepartment = answer.department;
        pool.query(
          "INSERT INTO department (name) VALUES ($1)",
          [newDepartment],
          (err) => {
            if (err) {
              console.log(err);
            }
            console.log(`${newDepartment} added to departments!`);
            initialPrompt();
          }
        );
      });
  }
  if (choices.choice === "Add a Role") {
    let departments = () => {
      return pool.query("SELECT * FROM department");
    };

    departments().then(({ rows }) => {
      const departmentChoices = rows.map(({ id, name }) => ({
        name: name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "Enter the name of the role you would like to add!",
          },
          {
            type: "input",
            name: "salary",
            message: "Enter the salary of the role you would like to add!",
          },
          {
            type: "list",
            name: "department_id",
            message: "Which department would you like to add your role to?",
            choices: departmentChoices,
          },
        ])
        .then((answer) => {
          let newTitle = answer.title;
          let newSalary = answer.salary;
          let newDepartment = answer.department_id;
          pool.query(
            "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
            [newTitle, newSalary, newDepartment],
            (err) => {
              if (err) {
                console.log(err);
              }
              console.log(`${newTitle} added to roles!`);
              initialPrompt();
            }
          );
        });
    });
  }
  if (choices.choice === "Add an Employee") {
    let roles = () => {
      return pool.query(
        "SELECT role.id, role.title, role.salary, department.name FROM role JOIN department ON role.department_id = department.id;"
      );
    };

    roles().then(({ rows }) => {
      const roleChoices = rows.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message:
              "Enter the first name of the employee you would like to add!",
          },
          {
            type: "input",
            name: "last_name",
            message:
              "Enter the last name of the employee you would like to add!",
          },
          {
            type: "list",
            name: "role_id",
            message: "Which role would you like to add your employee to?",
            choices: roleChoices,
          },
        ])
        .then((answer) => {
          let firstName = answer.first_name;
          let lastName = answer.last_name;
          let newRole = answer.role_id;
          pool.query(
            "INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)",
            [firstName, lastName, newRole],
            (err) => {
              if (err) {
                console.log(err);
              }
              console.log(`${firstName} ${lastName} added to employees!`);
              initialPrompt();
            }
          );
        });
    });
  }
  if (choices.choice === "Update an Employee Role") {
    let employees = () => {
      return pool.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
      );
    };

    let roles = () => {
      return pool.query(
        "SELECT role.id, role.title, role.salary, department.name FROM role JOIN department ON role.department_id = department.id;"
      );
    };

    employees().then(({ rows }) => {
      const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee_id",
            message: "Which employee would you like to update?",
            choices: employeeChoices,
          },
        ])
        .then((answers) => {
          let employeeId = answers.employee_id;
          roles().then(({ rows }) => {
            const roleChoices = rows.map(({ id, title }) => ({
              name: title,
              value: id,
            }));

            inquirer
              .prompt([
                {
                  type: "list",
                  name: "role_id",
                  message: `Pick a new role to assign to employee`,
                  choices: roleChoices,
                },
              ])
              .then((answers) => {
                let newRole = answers.role_id;
                let roleTitle = answers.title;
                pool.query(
                  "UPDATE employee SET role_id =$1 WHERE id =$2",
                  [newRole, employeeId],
                  (err) => {
                    if (err) {
                      console.log(err);
                    }
                    console.log(`Role has been changed!`);
                    initialPrompt();
                  }
                );
              });
          });
        });
    });
  }
  if (choices.choice === "Quit") {
    console.log("Thank you for using Employee Tracker!");
    process.exit();
  }
};
