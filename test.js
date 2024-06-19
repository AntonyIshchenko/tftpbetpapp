import { generateTokens } from './helpers/generateTokens.js';

const {
  accessToken,
  refreshToken,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
} = generateTokens('userId_example', 'sessionId_example');

console.log('Access Token:', accessToken);
console.log('Refresh Token:', refreshToken);
console.log('Access Token Expiry Date (UTC):', accessTokenExpiresIn);
console.log('Refresh Token Expiry Date (UTC):', refreshTokenExpiresIn);

console.log('________________________________');

setTimeout(() => {
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  console.log('Access Token Expiry Date (UTC):', accessTokenExpiresIn);
  console.log('Refresh Token Expiry Date (UTC):', refreshTokenExpiresIn);

  const parsedAccessTokenExpiryDate = new Date(
    JSON.parse(JSON.stringify({ date: accessTokenExpiresIn })).date
  );
  const parsedRefreshTokenExpiryDate = new Date(
    JSON.parse(JSON.stringify({ date: refreshTokenExpiresIn })).date
  );

  console.log(
    'Parsed Access Token Expiry Date (UTC):',
    parsedAccessTokenExpiryDate
  );
  console.log(
    'Parsed Refresh Token Expiry Date (UTC):',
    parsedRefreshTokenExpiryDate
  );

  const newDate = new Date();
  const tokenDate = new Date(parsedAccessTokenExpiryDate);
  console.log(newDate);
  console.log(tokenDate);
  console.log(newDate - tokenDate);
}, 3000);
