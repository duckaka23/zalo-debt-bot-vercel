export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({
      ok: true,
      message: 'Vercel webhook is running'
    });
  }

  try {
    const appsScriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;

    if (!appsScriptUrl) {
      return res.status(200).json({
        ok: false,
        error: 'Missing APPS_SCRIPT_WEBHOOK_URL'
      });
    }

    console.log('METHOD:', req.method);
    console.log('HEADERS:', JSON.stringify(req.headers));
    console.log('BODY:', JSON.stringify(req.body));

    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(req.body),
      redirect: 'follow'
    });

    const text = await response.text();

    console.log('APPS_SCRIPT_STATUS:', response.status);
    console.log('APPS_SCRIPT_RESPONSE:', text);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(text);
  } catch (error) {
    console.error('WEBHOOK_ERROR:', error);

    return res.status(200).json({
      ok: false,
      error: error.message
    });
  }
}
