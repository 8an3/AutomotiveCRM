# env file

- copy and paste
- fill in needed values to use the corresponsding service

## Database

NODE_ENV=development

DATABASE_URL='postgres://postgres:1234@localhost:5432/mydb'

## Remix

VERCEL_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
REMIX_SESSION_SECRET="1234"
REMIX_APP_NAME="DealerCRM"
REMIX_APP_EMAIL="account@crm.com"
COOKIE_SECRET="secret_cookie"
REMIX_ADMIN_EMAIL="account@crm.com"
REMIX_DEV_EMAIL="account@crm.com"
REMIX_ADMIN_PASSWORD="1234abcd"
SESSION_SECRET="secret_cookie"
DEALER_NAME='DealerCRM'
DEALER_NAME2='DealerCRM'
PROD_CALLBACK_URL="http://localhost:3000/auth/login"
CRON_SECRET='1234abcd'

# Services

## The rest are optionals or not always required

## Stripe

STRIPE_SECRET_KEY="sk_live_1234"

## Resend

RESEND_API_KEY="re_1234"

## Microsoft

MICRO_APP_ID='1234'
MICRO_TENANT_ID='1234'
MICRO_CLIENT_SECRET="1234"
TENANT_ID="1234"
CLIENT_ID='1234'
CLIENT_SECRET="1234"
REDIRECT_URI="http://localhost:3000/microsoft/callback"
POST_LOGOUT_REDIRECT_URI="http://localhost:3000"

## Twilio

TWILIO_ACCOUNTSID="1234"
TWILIO_AUTHTOKEN="1234"

## openai

OPEN_AI_SECRET_KEY="sk-proj-1234"

## infobip

YOUR_BASE_URL='1234.api.infobip.com'
YOUR_API_KEY='1234'
TEMP_NUMBER='1234'

## vercel;

BLOB_READ_WRITE_TOKEN="vercel_blob_1234"

# CRM Links

## activix

API_ACTIVIX=1234

# Following values are not required and are grayed out by default

## Microsoft

CLOUD_INSTANCE="Enter_the_Cloud_Instance_Id_Here"

### Cloud instance string should end with a trailing slash

## Upstash

##UPSTASH_REDIS_URL="1234"
##UPSTASH_REDIS_REST_URL="1234"
##UPSTASH_REDIS_REST_TOKEN="1234"

## Cloudinary

##CLOUD_NAME='1234'
##API_KEY='1234'
##API_SECRET='1234'

## Uploadcare

##UPLOADCARE_API="1234"
##UPLOADCARE_PUBLIC_KEY="1234"

## Planetscale

##PLANET_SCALE_USER="1234"
##PLANET_SCALE_PASS="1234"

##GRAPH_API_ENDPOINT="1234"

# graph api endpoint string should end with a trailing slash

##EXPRESS_SESSION_SECRET="Enter_the_Express_Session_Secret_Here"

## Google

##GOOGLE_HMAC_SECRET_CLOUD_SECRET='1234'
##GOOGLE_HMAC_SECRET_CLOUD_ACCESS_KEY_ID="1234"

##GOOGLE_API_KEY="1234"

##OAUTH_ID="578254847364-1234.apps.googleusercontent.com"
##OAUTH_CLIENT_SECRET="1234"

##GOOGLE_CLIENT_ID="1234.apps.googleusercontent.com"
##GOOGLE_CLIENT_SECRET="1234"
