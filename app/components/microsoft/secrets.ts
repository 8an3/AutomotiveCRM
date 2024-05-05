const tenantId = "fa812bd2-3d1f-455b-9ce5-4bfd0a4dfba6";
const clientId = "0fa1346a-ab27-4b54-bffd-e76e9882fcfe"
const clientSecret = "rut8Q~s5LpXMnEjujrxkcJs9H3KpUzxO~LfAOc-D"
const scopes = ["user.read", "mail.send"]
const port = 3000

const redirectUri = `http://localhost:3000/auth/login`;
const authorityHost = "https://login.microsoftonline.com";

// const scopes =  ["openid", "User.ReadWrite", "Mail.ReadWrite", "offline_access"]
const Info = {
    tenantId: tenantId,
    clientId: clientId,
    clientSecret: clientSecret,
    scopes: scopes,
    port: port,
    redirectUri: redirectUri,
    authorityHost: authorityHost,

}
export default Info
