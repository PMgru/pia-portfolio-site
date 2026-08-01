const fs = require('fs');
const http = require('http');

async function testUpload() {
  // First, we need to log in to get the admin token
  const loginRes = await fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@pialmahmud.com', password: 'YourSecurePasswordHere' })
  });
  
  if (!loginRes.ok) {
    console.error('Login failed:', await loginRes.text());
    return;
  }
  
  const cookies = loginRes.headers.get('set-cookie');
  console.log('Got cookies:', cookies ? 'yes' : 'no');

  // Create a 1x1 red pixel PNG base64
  const testBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const dataUri = `data:image/png;base64,${testBase64}`;

  // Try uploading
  const uploadRes = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': cookies || ''
    },
    body: JSON.stringify({
      fileName: 'test-upload.png',
      fileType: 'image/png',
      data: dataUri
    })
  });
  
  const status = uploadRes.status;
  const text = await uploadRes.text();
  console.log('Upload response status:', status);
  console.log('Upload response body:', text);
}

testUpload().catch(console.error);
