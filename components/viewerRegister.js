const pool = require('../config/db');

module.exports = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, college_name, utr_number } = req.body || {};

    // Check if viewer registration is open
    const statusResult = await pool.query(
      "SELECT setting_value FROM settings WHERE setting_key = 'viewer_registration_status'"
    );
    const status = statusResult.rows.length > 0 ? statusResult.rows[0].setting_value : 'open';
    if (status !== 'open') {
      return res.status(403).json({ 
        success: false, 
        message: 'Viewer registration is currently closed. Please contact coordinators for more information.' 
      });
    }

    if (!name || !college_name || !utr_number) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate UTR number format (must be exactly 12 digits)
    const utrTrimmed = utr_number.trim();
    if (!/^\d{12}$/.test(utrTrimmed)) {
      return res.status(400).json({ success: false, message: 'UTR number must be exactly 12 digits' });
    }

    await client.query('BEGIN');

    // Check if UTR already exists in viewer_registrations (prevent duplicates)
    const existingViewer = await client.query(
      `SELECT vr.id FROM viewer_registrations vr 
       JOIN utr_number u ON vr.utr_id = u.utr_id 
       WHERE u.utr = $1`,
      [utrTrimmed]
    );
    
    if (existingViewer.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ 
        success: false, 
        message: 'This UTR number has already been used for viewer registration' 
      });
    }

    // Insert new UTR (don't reuse - each viewer registration must have unique UTR)
    const utrInsertQuery = `INSERT INTO utr_number (utr) VALUES ($1) RETURNING utr_id`;
    const utrResult = await client.query(utrInsertQuery, [utrTrimmed]);
    const utrId = utrResult.rows[0].utr_id;

    // Insert into viewer_registrations with utr_id reference
    const insertQuery = `INSERT INTO viewer_registrations (name, college_name, utr_id) VALUES ($1, $2, $3) RETURNING id, created_at`;
    const { rows } = await client.query(insertQuery, [name.trim(), college_name.trim(), utrId]);

    // Generate registration ID like WINGSVIEWER001, WINGSVIEWER002, etc.
    const viewerId = rows[0].id;
    const registrationId = `WINGSVIEWER${String(viewerId).padStart(3, '0')}`;

    // Update the registration_id in the database
    await client.query('UPDATE viewer_registrations SET registration_id = $1 WHERE id = $2', [registrationId, viewerId]);

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Viewer registered successfully',
      data: {
        id: viewerId,
        registration_id: registrationId,
        created_at: rows[0].created_at,
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Viewer registration error:', err);
    
    const errorCode = err?.code || '';
    const errorDetail = (err?.detail || '').toLowerCase();
    const errorConstraint = (err?.constraint || '').toLowerCase();
    
    // Handle duplicate UTR number
    if (errorCode === '23505' && (errorDetail.includes('utr') || errorConstraint.includes('utr'))) {
      return res.status(409).json({ 
        success: false, 
        message: 'This UTR number has already been used for viewer registration. Each payment can only be used once. Please check your UTR number and try again.' 
      });
    }
    
    // Handle any other duplicate entry
    if (errorCode === '23505') {
      return res.status(409).json({ 
        success: false, 
        message: 'A registration with these details already exists. You may have already registered as a viewer.' 
      });
    }
    
    // Handle missing required fields
    if (errorCode === '23502') {
      return res.status(400).json({ 
        success: false, 
        message: 'Some required fields are missing. Please fill in all the information and try again.' 
      });
    }
    
    // Handle input too long
    if (errorCode === '22001') {
      return res.status(400).json({ 
        success: false, 
        message: 'Your name or college name is too long. Please shorten it and try again.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'An unexpected error occurred during registration. Please try again. If the problem persists, contact the coordinators.' 
    });
  } finally {
    client.release();
  }
};
