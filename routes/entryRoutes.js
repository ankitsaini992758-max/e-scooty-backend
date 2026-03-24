import express from 'express';
import {
  createEntry,
  getAllEntries,
  getEntriesByMonth,
  getAllMonths,
  getProfitStats,
  deleteEntry,
  deleteEntriesByMonth,
  deleteMultipleEntries,
  updateEntry,
} from '../controllers/entryController.js';

const router = express.Router();

router.post('/entries', createEntry);
router.get('/entries', getAllEntries);
router.get('/entries/:month', getEntriesByMonth);
router.get('/months', getAllMonths);
router.get('/stats/profit', getProfitStats);
router.delete('/entries/month/:month', deleteEntriesByMonth);
router.delete('/entries', deleteMultipleEntries);
router.put('/entries/:id', updateEntry);
router.delete('/entries/:id', deleteEntry);

export default router;
