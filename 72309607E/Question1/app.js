const express = require('express');
const { fetchNumbersData, updateWindow } = require('./services/numberServices');
const app = express();
const PORT = 9876;

app.get('/numbers/:numberid', async (req, res) => {
  const numberid = req.params.numberid;

  if (!['p', 'f', 'e', 'r'].includes(numberid)) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const start = Date.now();
  const fetchedNumbers = await fetchNumbersData(numberid);
  const { windowPrevState, windowCurrState, average } = updateWindow(fetchedNumbers);
  const responseTime = Date.now() - start;


  if (responseTime > 500) {
    return res.status(504).json({ error: "Request timed out" });
  }

  res.json({
    windowPrevState,
    windowCurrState,
    numbers: fetchedNumbers,
    avg: average
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});