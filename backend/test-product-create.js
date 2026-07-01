const fs = require('fs');
const path = require('path');
(async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'adminobbstore@obbstore.com', password: 'admin30' })
    });
    const loginBody = await loginRes.json();
    console.log('LOGIN', loginRes.status, loginBody.message, loginBody.token ? 'TOKEN_OK' : 'NO_TOKEN');
    if (!loginBody.token) return;
    const imagePath = path.join(__dirname, 'test-create-image.png');
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=', 'base64');
    fs.writeFileSync(imagePath, png);
    const form = new FormData();
    form.append('nom', 'Test AI produit');
    form.append('slug', `test-produit-ai-${Date.now()}`);
    form.append('category', 'maillots');
    form.append('prix', '100');
    form.append('ancienPrix', '120');
    form.append('stock', '20');
    form.append('description', 'Produit test');
    form.append('isActive', 'true');
    form.append('images', fs.createReadStream(imagePath));
    const createRes = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${loginBody.token}`
      },
      body: form
    });
    console.log('CREATE', createRes.status);
    const createBody = await createRes.text();
    console.log(createBody);
  } catch (err) {
    console.error(err);
  }
})();
