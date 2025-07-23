import express from 'express';
import { checkConnection, healthCheck } from '../config/db.js';

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = checkConnection();
    const dbHealth = await healthCheck();
    
    // Check server status
    const serverStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development'
    };

    // Overall health status
    const isHealthy = dbStatus.isConnected && dbHealth.status === 'healthy';
    
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        server: serverStatus,
        database: {
          connection: dbStatus,
          health: dbHealth
        }
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * Database status endpoint
 * GET /api/health/database
 */
router.get('/database', async (req, res) => {
  try {
    const dbStatus = checkConnection();
    const dbHealth = await healthCheck();
    
    res.status(dbStatus.isConnected ? 200 : 503).json({
      connection: dbStatus,
      health: dbHealth
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
