"use strict";

const request = require("request")

const middleware = require("../middleware"),
    validateAcct = middleware.check,
    getBackUps = middleware.getBackUps

const globals = require("../../../global"),
    apis = globals.apis,
    creds = globals.creds

const url = apis.pirest,
    user = creds.username,
    pass = creds.password,
    auth = "Basic " + new Buffer(`${user}:${pass}`).toString("base64")

const { keys } = require("../../client/app/events/keys")

module.exports = (io, app) => {
    // socket transactions for restapi
    io.of("/restapi").on("connection", socket => {
        console.log("connection found")
        let relay = (message, data) => {
            socket.emit(message, data)
        }
        let sendRequest = (type, data) => {
            let URI,
                { acct, table, list } = data
            if (type === "list") URI = `${url}${acct}/${list}/${table}?out=json`
            if (type === "local") URI = `${url}${acct}/${table}?out=json&limit=500`
            if (type === "global") URI = `${url}/${table}?out=json&limit=500&eq_CLIENT_ID=${acct}`
            request(
                {
                    url: URI,
                    headers: { "authorization": auth }
                }, (err, response, body) => {
                    if (err) {
                        console.log("error: ", err)
                    }
                    try {
                        JSON.parse(body)
                    } catch (e) {
                        return relay("rest error", e)
                    }
                    socket.emit("restapi response", {acct, table, body})
                }
            )
        }
        socket.on(keys.req.local, data => sendRequest("local", data))
        socket.on(keys.req.global, data => sendRequest("global", data))
        socket.on(keys.req.list, data => sendRequest("list", data))
        // handle validation request and respond
        socket.on("validation request", acct => {
            let validation = validateAcct(acct)
            if (validation) getBackUps(acct, relay)
            socket.emit("validation response", {
                pass: validation,
                acct: acct
            })
        })
    })
}