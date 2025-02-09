# SharedForm

This is an app for users to create forms for various purposes
such as survey, test, etc.

Admin panel credentials:
Username: `danial@danial.com`
Password: `danialdanial`

instructions:

- `npm install`
- run backend via `node app.js`
- run frontend via
    - `cd client`
    - `npm install`
    - `npm run dev`
- go to `http://localhost:5173`

APIs that were used:
- CoinGecko Price API - to fetch price for our token
- CoinMarketCap API - to fetch our token's capitalization
- CoinGecko News API - to fetch crypto-related news
- DetectLanguage.com API - to filter news based on locale
    - (sometimes CG API gives articles on different language than asked locale)