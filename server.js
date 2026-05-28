

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCfLOfbS5bIvqu4hVIfb99Ok8aMagpoWn0",
  authDomain: "werewolvedb.firebaseapp.com",
  projectId: "werewolvedb",
  storageBucket: "werewolvedb.firebasestorage.app",
  messagingSenderId: "413975273608",
  appId: "1:413975273608:web:d6e2df6f62bc96d8e93f3d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'vercel-firestore-gateway-ready' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST.' });
  }

  const payload = req.body && Object.keys(req.body).length ? req.body : req.query;

  if (!payload || Object.keys(payload).length === 0) {
    return res.status(400).json({ error: 'No data provided.' });
  }

  console.log(payload)
    return res.status(201).json(payload);

  try {
    const doc = await addDoc(collection(db, 'gatewayData'), {
      payload,
      receivedAt: serverTimestamp(),
    });

    return res.status(201).json({ success: true, id: doc.id });
  } catch (error) {
    console.error('Firestore save error:', error);
    return res.status(500).json({ error: 'Unable to save data to Firestore.' });
  }
};
