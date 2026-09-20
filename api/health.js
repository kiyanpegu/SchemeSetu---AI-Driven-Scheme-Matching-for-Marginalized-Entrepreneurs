/* global process */
import { schemes } from '../src/data/schemes.js';

export default function handler(req, res) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'healthy',
    service: 'SchemeSetu REST Backend Engine',
    version: '2.1.0',
    uptime_seconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    total_schemes: schemes.length,
    supported_languages: ['en', 'hi', 'as'],
    ministry: 'Ministry of Social Justice and Empowerment (MoSJE)',
    corporations: ['NSFDC', 'NBCFDC', 'NSKFDC']
  });
}
