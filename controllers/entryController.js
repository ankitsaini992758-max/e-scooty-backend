import Entry from '../models/Entry.js';

// Create new entry
export const createEntry = async (req, res) => {
  try {
    const { vehicleName, actualPrice, sellingPrice } = req.body;

    // Validate required fields
    if (!vehicleName || actualPrice === undefined || sellingPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Calculate profit
    const profit = sellingPrice - actualPrice;

    // Get current month and year
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const monthYear = `${month}-${year}`;

    const entry = await Entry.create({
      vehicleName,
      actualPrice,
      sellingPrice,
      profit,
      month: monthYear,
      year,
    });

    res.status(201).json({
      success: true,
      message: 'Entry created successfully',
      data: entry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all entries
export const getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get entries by month
export const getEntriesByMonth = async (req, res) => {
  try {
    const { month } = req.params;

    const entries = await Entry.find({ month }).sort({ createdAt: -1 });

    if (!entries || entries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No entries found for this month',
      });
    }

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all months with entries
export const getAllMonths = async (req, res) => {
  try {
    const months = await Entry.aggregate([
      {
        $group: {
          _id: '$month',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: months,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get profit statistics
export const getProfitStats = async (req, res) => {
  try {
    // Overall profit
    const overallStats = await Entry.aggregate([
      {
        $group: {
          _id: null,
          totalProfit: { $sum: '$profit' },
          totalCount: { $sum: 1 },
          avgProfit: { $avg: '$profit' },
        },
      },
    ]);

    // Profit by month
    const monthlyStats = await Entry.aggregate([
      {
        $group: {
          _id: '$month',
          totalProfit: { $sum: '$profit' },
          count: { $sum: 1 },
          avgProfit: { $avg: '$profit' },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: overallStats[0] || { totalProfit: 0, totalCount: 0, avgProfit: 0 },
        byMonth: monthlyStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete an entry
export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await Entry.findByIdAndDelete(id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Entry deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete all entries for a month
export const deleteEntriesByMonth = async (req, res) => {
  try {
    const { month } = req.params;

    const result = await Entry.deleteMany({ month });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No entries found for this month',
      });
    }

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} entries from ${month}`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete multiple entries by ids
export const deleteMultipleEntries = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a non-empty ids array',
      });
    }

    const result = await Entry.deleteMany({
      _id: { $in: ids },
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} selected entries`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update an entry
export const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { vehicleName, actualPrice, sellingPrice } = req.body;

    let updateData = {
      vehicleName,
      actualPrice,
      sellingPrice,
    };

    // Recalculate profit if prices are updated
    if (actualPrice !== undefined && sellingPrice !== undefined) {
      updateData.profit = sellingPrice - actualPrice;
    }

    const entry = await Entry.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Entry updated successfully',
      data: entry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
