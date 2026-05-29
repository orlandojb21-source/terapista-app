const GAS_URL = 'https://script.google.com/macros/s/AKfycbzKd7JBt51tojV9SvkailXleSrvOJn29V3GYH4xKBMl44buOKOD7_q-iS3NrEyZlNg7Qw/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const params = new URLSearchParams(req.query).toString();
    const url = params ? `${GAS_URL}?${params}` : GAS_URL;

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });

    const text = await response.text();

    // Intentar parsear como JSON
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      return res.status(200).send(text);
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
