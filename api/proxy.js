const GAS_URL = 'https://script.google.com/macros/s/AKfycbzKd7JBt51tojV9SvkailXleSrvOJn29V3GYH4xKBMl44buOKOD7_q-iS3NrEyZlNg7Qw/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const params = new URLSearchParams(req.query).toString();
    const url = `${GAS_URL}?${params}`;

    // Apps Script siempre redirige — seguir manualmente hasta JSON
    let response = await fetch(url, { redirect: 'follow' });

    // Si sigue siendo HTML (redirect loop), intentar con la URL final
    let text = await response.text();

    // Si recibimos HTML en vez de JSON, el redirect no se siguió bien
    if (text.trim().startsWith('<')) {
      // Intentar obtener la URL final del redirect manualmente
      const r2 = await fetch(url, { redirect: 'manual' });
      const location = r2.headers.get('location');
      if (location) {
        const r3 = await fetch(location, { redirect: 'follow' });
        text = await r3.text();
      }
    }

    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      return res.status(500).json({ success: false, error: 'GAS returned non-JSON: ' + text.slice(0, 200) });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
