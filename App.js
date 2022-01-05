const express = require('express');
const connection = require('./db');
const Joi = require('joi');
const port = 8000;

const serverPort = process.env.PORT || 8000;
const app = express();

connection.connect((err) => {
  if (err) {
    console.error('error connecting to db', err);
  } else {
    console.log('connected to db');
  }
});

app.use(express.json())

/*app.get('/users/:email', (req, res) => {
    const { email } = req.params;
    connection.promise()
      .query('SELECT * FROM users WHERE email = ?', [email])
      .then(([results]) => {
        if (results.length) {
          res.json(results[0]);
        } else {
          res.sendStatus(404);
        }
      });
  }); 
*/

/*create*/
app.post('/users', (req, res) => {
    const { lastname, firstname, email } = req.body;
   
    const { error: validationErrors } = Joi.object({
      lastname: Joi.string().max(100).required(),
      firstname: Joi.string().max(100).required(),
      email: Joi.string().max(100).required(),
    }).validate({ lastname, firstname, email }, { abortEarly: false });

    if (validationErrors) {
        res.status(422).json({ errors: validationErrors.details });
      } else {
        connection.promise()
          .query('INSERT INTO users (lastname, firstname, email) VALUES (?, ?, ?)', [lastname, firstname, email])
          .then(([result]) => {
            const createdUser = { id: result.insertId, lastname, firstname, email };
            res.json(createdUser);
          }).catch((err) => { console.error(err); res.sendStatus(500); });
      }
     });
/*read*/
app.get('/users', (req, res) => {
    const { email } = req.query;
    let sql = 'SELECT * FROM users';
    const valuesToEscape = [];
    if (email) {
    sql += ' WHERE email = ?';
    valuesToEscape.push(email);
    }
    
    connection.promise().query(sql, valuesToEscape)
    .then(([results]) => {
    res.json(results);
    })
    .catch((error) => {
    console.error(error);
    res.status(500).send('Error retrieving users from db.');
    });
    });

/*update*/
    app.patch('/users/:id', (req, res) => {
        const { error: validationErrors } = Joi.object({
          lastname: Joi.string().max(100).required(),
          firstname: Joi.string().max(100).required(),
          email: Joi.string().max(100).required(),
        }).validate(req.body, { abortEarly: false });

        if (validationErrors)
   return res.status(422).json({ errors: validationErrors.details });

 connection.promise()
   .query('UPDATE users SET ? WHERE id = ?', [req.body, req.params.id])
   .then(([result]) => {
     res.sendStatus(200);
   })
   .catch((err) => {
     console.error(err);
     res.sendStatus(500);
   });
});

/*delete*/
app.delete('/users/:id', (req, res) => {
	connection.promise()
		.query('DELETE FROM users WHERE id = ?', [req.params.id])
		.then(([result]) => {
			if (result.affectedRows) res.sendStatus(204);
			else res.sendStatus(404);
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
});

/*create
app.post('/users', (req, res) => {
    const { lastname, firstname, email } = req.body;
   
    const { error: validationErrors } = Joi.object({
      lastname: Joi.string().max(100).required(),
      firstname: Joi.string().max(100).required(),
      email: Joi.string().max(100).required(),
    }).validate({ lastname, firstname, email }, { abortEarly: false });

    if (validationErrors) {
        res.status(422).json({ errors: validationErrors.details });
      } else {
        connection.promise()
          .query('INSERT INTO users (lastname, firstname, email) VALUES (?, ?, ?)', [lastname, firstname, email])
          .then(([result]) => {
            const createdUser = { id: result.insertId, lastname, firstname, email };
            res.json(createdUser);
          }).catch((err) => { console.error(err); res.sendStatus(500); });
      }
     });*/

/*read product*/

    app.get('/products/:id', (req, res) => {
        const { id } = req.params;
        connection.promise()
          .query('SELECT * FROM products WHERE id = ?', [id])
          .then(([results]) => {
            if (results.length) {
              res.json(results[0]);
            } else {
              res.sendStatus(404);
            }
          });
      }); 

      app.get('/products', (req, res) => {
        const { category } = req.query;
        let sql = 'SELECT * FROM products WHERE category = ?';
        connection.promise().query(sql, [category])
          .then(([results]) => {
            res.json(results);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error retrieving products from db.');
          });
       });

      
/*update product*/
    app.patch('/products/:id', (req, res) => {
        const { error: validationErrors } = Joi.object({
          name: Joi.string().max(100).required(),
          category: Joi.string().max(100).required(),
          price: Joi.number().min(0).required(),
        }).validate(req.body, { abortEarly: false });

        if (validationErrors)
   return res.status(422).json({ errors: validationErrors.details });

 connection.promise()
   .query('UPDATE products SET ? WHERE id = ?', [req.body, req.params.id])
   .then(([result]) => {
     res.sendStatus(200);
   })
   .catch((err) => {
     console.error(err);
     res.sendStatus(500);
   });
});

/*delete product*/
app.delete('/products/:id', (req, res) => {
	connection.promise()
		.query('DELETE FROM products WHERE id = ?', [req.params.id])
		.then(([result]) => {
			if (result.affectedRows) res.sendStatus(204);
			else res.sendStatus(404);
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
});

/*create product*/
app.post('/products', (req, res) => {
    const { name, category, price } = req.body;
   
    const { error: validationErrors } = Joi.object({
      name: Joi.string().max(100).required(),
      category: Joi.string().max(100).required(),
      price: Joi.string().max(100).required(),
    }).validate({ name, category, price }, { abortEarly: false });

    if (validationErrors) {
        res.status(422).json({ errors: validationErrors.details });
      } else {
        connection.promise()
          .query('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', [name, category, price])
          .then(([result]) => {
            const createdProduct = { id: result.insertId, name, category, price };
            res.json(createdProduct);
          }).catch((err) => { console.error(err); res.sendStatus(500); });
      }
     });

 

       //in postman: http://localhost:8000/products?clothes

app.listen(serverPort, () => {
	console.log(`Server is running on ${port}`);
	});