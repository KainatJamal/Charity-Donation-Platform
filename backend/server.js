const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aidcircle',
  password: 'kainat123',
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Helper function to hash sensitive data
const hashSensitiveData = async (data) => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(data, saltRounds);
  } catch (error) {
    console.error("Error hashing data:", error);
    throw new Error("Error hashing sensitive data.");
  }
};

// Helper function to compare hashed data
const compareHashedData = async (data, hash) => {
  try {
    return await bcrypt.compare(data, hash);
  } catch (error) {
    console.error("Error comparing data:", error);
    throw new Error("Error comparing hashed data.");
  }
};

// Check if email exists in donors or admins
const isEmailExists = async (email) => {
  try {
    const query = `
      SELECT email FROM donors WHERE email = $1
      UNION
      SELECT email FROM admins WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw new Error("Error checking email existence.");
  }
};

// Endpoint to handle donor form submission
app.post('/submit-donor', async (req, res) => {
  const { fullName, phone, email, creditCardNumber, expiry, cvv, password, address } = req.body;

  try {
    // Check if the email already exists in the database
    if (await isEmailExists(email)) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the sensitive data before storing it
    const hashedCVV = await hashSensitiveData(cvv);
    const hashedPassword = await hashSensitiveData(password);

    // SQL query to insert the donor into the database
    const query = `
      INSERT INTO donors (full_name, phone, email, credit_card_number, expiry, cvv, password, address) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`;  // This returns the entire donor object including the generated id
    
    const values = [fullName, phone, email, creditCardNumber, expiry, hashedCVV, hashedPassword, address];

    // Execute the query
    const result = await pool.query(query, values);

    // Log the inserted donor data (this is for debugging purposes)
    console.log('Inserted donor:', result.rows[0]);

    // Respond with success and the donor data (including the id)
    res.status(200).json({ 
      message: 'Donor submitted successfully', 
      donor: result.rows[0]  // This contains the donor_id and other information
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while submitting your form' });
  }
});

// Endpoint to handle admin form submission
app.post('/submit-admin', async (req, res) => {
  const { fullName, phone, email, password, uniqueCode } = req.body;
  try {
    if (await isEmailExists(email)) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await hashSensitiveData(password);
    const serverHashedCode = await hashSensitiveData('2917');
    const isCodeValid = await compareHashedData(uniqueCode, serverHashedCode);

    if (!isCodeValid) {
      return res.status(400).json({ error: 'Invalid Admin Code' });
    }

    const hashedUniqueCode = await hashSensitiveData(uniqueCode);

    const query = `
      INSERT INTO admins (full_name, phone, email, password, unique_code) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [fullName, phone, email, hashedPassword, hashedUniqueCode];
    const result = await pool.query(query, values);
    res.status(200).json({ message: 'Admin submitted successfully', admin: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while submitting your form' });
  }
});

// Endpoint to handle login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let query = `SELECT * FROM donors WHERE email = $1`;
    let result = await pool.query(query, [email]);
    let userType = 'donor';

    if (result.rows.length === 0) {
      query = `SELECT * FROM admins WHERE email = $1`;
      result = await pool.query(query, [email]);
      userType = 'admin';
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const isPasswordMatch = await compareHashedData(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login time
    const updateQuery = `UPDATE ${userType}s SET last_login = NOW() WHERE ${userType === 'donor' ? 'donor_id' : 'admin_id'} = $1`;
    await pool.query(updateQuery, [user[userType === 'donor' ? 'donor_id' : 'admin_id']]);

    // Include user details in the response, including the donor_id or admin_id
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user[userType === 'donor' ? 'donor_id' : 'admin_id'], // Ensure you're getting donor_id or admin_id
        full_name: user.full_name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        userType
      }
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});


// Fetch admin data by ID
app.get('/admin/:id', async (req, res) => {
  const adminId = req.params.id;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM fetch_admin_by_id($1)', [adminId]);
    if (result.rows.length > 0) {
      res.json({ admin: result.rows[0] });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
});


// Example of fetching donor data by ID (Express.js)
app.get('/donor/:id', async (req, res) => {
  const donorId = req.params.id;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM fetch_donor_by_id($1)', [donorId]);
    if (result.rows.length > 0) {
      res.json({ donor: result.rows[0] });
    } else {
      res.status(404).json({ message: 'Donor not found' });
    }
  } catch (error) {
    console.error('Error fetching donor data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
});


// Update admin data by ID (PUT request)
app.put('/admin/:id', async (req, res) => {
  const adminId = req.params.id;
  const { full_name, email, phone, unique_code } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      'CALL update_admin_data($1, $2, $3, $4, $5)',
      [adminId, full_name, email, phone, unique_code]
    );
    res.json({ message: 'Admin updated successfully', admin: result.rows[0] });
  } catch (error) {
    console.error('Error updating admin data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

// Update donor data by ID (PUT request)
app.put('/donor/:id', async (req, res) => {
  const donorId = req.params.id;
  const { full_name, email, phone, address, credit_card_number, expiry, cvv } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      'CALL update_donor_data($1, $2, $3, $4, $5, $6, $7, $8)',
      [donorId, full_name, email, phone, address, credit_card_number, expiry, cvv]
    );
    res.json({ message: 'Donor updated successfully', donor: result.rows[0] });
  } catch (error) {
    console.error('Error updating donor data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

// Delete admin by ID
app.delete('/admin/:id', async (req, res) => {
  const adminId = req.params.id;
  const client = await pool.connect();
  try {
    const result = await client.query('CALL delete_admin_by_id($1)', [adminId]);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
});


// Delete donor by ID
app.delete('/donor/:id', async (req, res) => {
  const donorId = req.params.id;
  const client = await pool.connect();
  try {
    const result = await client.query('CALL delete_donor_by_id($1)', [donorId]);
    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
});


// Save donation details
app.post('/submit-donation', async (req, res) => {
  const client = await pool.connect();
  try {
      await client.query('BEGIN');
      const { donorId, donationAmount, donationDetails } = req.body;
      await client.query('SAVEPOINT donation_savepoint');
      const donationQuery = `
          INSERT INTO donation (donor_id, donation_amount, donation_date, donation_status, donation_details)
          VALUES ($1, $2, CURRENT_TIMESTAMP, 'Pending', $3) RETURNING donation_id, donation_amount, donation_date, donation_details;
      `;
      const donationResult = await client.query(donationQuery, [donorId, donationAmount, JSON.stringify(donationDetails)]);
      const donation = donationResult.rows[0];
      await client.query('COMMIT');
      res.json({ message: 'Donation recorded successfully', donation });
  } catch (err) {
      console.error('Error during donation submission:', err);
      await client.query('ROLLBACK TO SAVEPOINT donation_savepoint');
      res.status(500).json({ error: 'Failed to submit donation' });
  } finally {
      client.release();
  }
});


// Fetch all donations for a specific donor or all donations
app.get('/get-donations', async (req, res) => {
  const donorId = req.query.donorId;  // Optional query parameter for filtering by donor ID
  const client = await pool.connect(); // Connect to the database
  try {
    let donationsQuery;
    let queryParams = [];
    if (donorId) {
      // Query for donations by a specific donor using the view
      donationsQuery = `
        SELECT * 
        FROM donor_donations
        WHERE donor_id = $1;
      `;
      queryParams = [donorId];
    } else {
      // Query for all donations using the view
      donationsQuery = `SELECT * FROM donor_donations;`;
      queryParams = [];
    }
    // Execute the query
    const donationResult = await client.query(donationsQuery, queryParams);
    const donations = donationResult.rows;
    // Send the donations data back as JSON
    res.json({ donations });
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ error: 'Failed to fetch donations' });
  } finally {
    client.release();  // Release the database connection
  }
});

app.post('/update-donation-status', async (req, res) => {
  const client = await pool.connect();
  try {
    const { donationId, newStatus } = req.body;
    // Ensure donationId is an integer and newStatus is a string
    const donationIdInt = parseInt(donationId, 10);
    const newStatusStr = String(newStatus);
    // Check if the donationId is a valid number
    if (isNaN(donationIdInt)) {
      return res.status(400).json({ error: 'Invalid donation ID' });
    }
    // Call the stored procedure to update the donation status
    const result = await client.query('CALL update_donation_status($1, $2)', [donationIdInt, newStatusStr]);
    // Handle the result
    if (result.rowCount > 0) {
      const updatedDonation = result.rows[0];
      res.json({ message: 'Donation status updated successfully', donation: updatedDonation });
    } else {
      return res.status(404).json({ error: 'Donation not found' });
    }
  } catch (err) {
    console.error('Error updating donation status:', err);
    res.status(500).json({ error: 'Failed to update donation status' });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
