import { createCookieSessionStorage, json } from "@remix-run/node";

export const { getSession, commitSession, destroySession } =
    createCookieSessionStorage({
        cookie: {
            name: "client_66",
            secrets: ["n3wsecr3t"],

        },
    });


export async function SetCookie(userId, clientfileId, financeId, dashboardId, request) {
    const session = await getSession(request.headers.get("Cookie"))
    session.set("userId", userId)
    session.set("clientfileId", clientfileId)
    session.set("dashboardId", dashboardId)
    session.set("financeId", financeId)
    await commitSession(session)
    console.log(session, 'set cookie')
    return { headers: { "Set-Cookie": session } }
}


/*
const clientfileId = formData.clientfileId
const dashboardId = formData.dashboardId
const financeId = formData.financeId        //console.log(DataForm, 'dataform')
const userId = user?.id

const setCookieData = await setCookie(userId, clientfileId, financeId, dashboardId, request)
{ headers: { "Set-Cookie": setCookieData, }, }

*/
/**
 *
 * // get
const session = await getSession(request.headers.get("Cookie"))
const value = session.get('testcookie')
console.log(value, 'cookie')



  // commit
const session = await getSession(request.headers.get("Cookie"))
const test = '12345';
session.set("testcookie", test)
const cookie = await commitSession(session)

 */
