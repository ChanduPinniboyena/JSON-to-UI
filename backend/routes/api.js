const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * GET /api/clients
 * Fetches all clients with their address and state information
 * Returns dynamic JSON that can be used to render UI
 */
router.get('/clients', async (req, res) => {
    console.log(req.path)
    try {
        const query = `
      SELECT 
        p."PTY_ID" as "id",
        p."PTY_FirstName" as "firstName",
        p."PTY_LastName" as "lastName",
    
        p."PTY_SSN" as "ssn",
        a."Add_Line1" as "addressLine1",
        a."Add_City" as "city",
       s."Stt_Name" as "state",
        s."Stt_Code" as "stateCode",
        a."Add_Zip" as "zip"
      FROM "OPT_Party" p
      LEFT JOIN "OPT_Address" a ON p."PTY_ID" = a."Add_PartyID"
      LEFT JOIN "SYS_State" s ON a."Add_State" = s."Stt_ID"
      ORDER BY p."PTY_ID", p."PTY_FirstName"
    `;

        const result = await pool.query(query);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch clients',
            message: error.message
        });
    }
});



/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            status: 'OK',
            database: 'Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            database: 'Disconnected',
            error: error.message
        });
    }
});

module.exports = router;
