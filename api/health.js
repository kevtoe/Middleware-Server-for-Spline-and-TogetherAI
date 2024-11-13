export default function handler(req, res) {
  try {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
