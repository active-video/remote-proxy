# HTTPs usage

To tests HTTPs via a local certificate, edit server.js to uncomment these lines:

```javascript
//for testing only
process.env.SSL_KEY = fs.readFileSync('./ssl/localhost.key');
process.env.SSL_CERT = fs.readFileSync('./ssl/localhost.cert');

```

After you've generated a certificate (mac/linux only)

```bash
cd ./ssl/
SSLDomainName=localhost
openssl genrsa -out localhost.key 2048
openssl req -new -x509 -key localhost.key -out localhost.cert -days 3650 -subj /CN=$SSLDomainName
```
