const axios = require('axios');

const ENDPOINTS = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand"
};

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ5MDE3MjQ1LCJpYXQiOjE3NDkwMTY5NDUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjFhYjdjOWYxLTk3MzctNDg1MC05MzliLWUyMGQyNWJlNDExYiIsInN1YiI6ImFkaXRpYXB0ZTE1MDRAZ21haWwuY29tIn0sImVtYWlsIjoiYWRpdGlhcHRlMTUwNEBnbWFpbC5jb20iLCJuYW1lIjoiYWRpdGkgYXB0ZSIsInJvbGxObyI6IjcyMzA5NjA3ZSIsImFjY2Vzc0NvZGUiOiJLUmpVVVUiLCJjbGllbnRJRCI6IjFhYjdjOWYxLTk3MzctNDg1MC05MzliLWUyMGQyNWJlNDExYiIsImNsaWVudFNlY3JldCI6IlJ1eGZreXJIVkpnSERBWVMifQ.C2ixlGtpWMkVOaZzfJcMnMEGShLT8pFut76jVXuzBG8"; 

const WINDOW_SIZE = 10;
let numberWindow = [];

async function fetchNumbersData(type) {
  const url = ENDPOINTS[type];
  if (!url) throw new Error("Invalid number type");

  try {
    const response = await axios.get(url, {
      timeout: 500,
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`
      }
    });

    if (response.data && Array.isArray(response.data.numbers)) {
      return response.data.numbers;
    }

    console.log("Unexpected response format:", response.data);
    return [];
  } catch (err) {
    console.error("Fetch error:", err.message);
    return [];
  }
}

function updateWindow(newNumbers) {
  const windowPrevState = [...numberWindow];
  for (const num of newNumbers) {
    if (!numberWindow.includes(num)) {
      numberWindow.push(num);
      if (numberWindow.length > WINDOW_SIZE) {
        numberWindow.shift(); 
      }
    }
  }

  const average = numberWindow.length
    ? Number((numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length).toFixed(2))
    : 0.0;

  return { windowPrevState, windowCurrState: [...numberWindow], average };
}

module.exports = {
  fetchNumbersData,
  updateWindow
};