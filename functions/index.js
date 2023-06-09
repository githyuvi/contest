/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { get } = require("@firebase/database")
const { getDatabase } = require("@firebase/database")
const { ref } = require("@firebase/database")
const { child } = require("@firebase/database")

const {onCall, onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
// const { get, getDatabase, ref, child } = require("@firebase/database")
const { initializeApp } = require("firebase-admin/app");
const  axios  = require("axios")

var {google} = require("googleapis");

// Load the service account key JSON file.
var serviceAccount = {
    "type": "service_account",
    "project_id": "fir-algomuse",
    "private_key_id": "eb8910132991f774155fb4f54bc2256ec08d14fe",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCO2oFJszzrziIg\nXinLPtY5ynAHQXEI+shiM7ed1qy36rzxlYb3amRLSy0DnxG7Z+y4hzNEqhfut1an\nWEaNXUDJK1xW/HJTZo/DfM2IDsDus9Vj2BVaGP9BEzHJTP4Uo5jsJFzMh//Zu+6+\ngeRc91WENSeBTaupD7H+U+yEVIl2esJiPrQR8QOtz8TBW0GW7sVhDziEUNQ5OkWr\n0tKpLEKO4h/9ggVlFWlTL0Z4x7eo8e8Oo5hzIRaexXMpW+u30KFCFM15frFryWmv\nhzDymrIvRvKSvEs1l18cwfOHd3MtgwMXppTvjWAmRN2gSnqJDk/Pjzq6Vc3wDOUq\nzaVU9dSnAgMBAAECggEAEWiqKNkhq3r2HbZb/DDZhTbDwElGr9l1YhemC3jbQ5k6\naBaDhCirCvdLsmKdk+vDpW6UiOGnA6huyaYFsw886Jx9fFGiJ8Jv8rAwO/clppwJ\nJ/RwEF12KJq2OS9GJ4MTDR7BUGD32l5UvKgHtGylN0oNrmxQvHb1MhFNhDLpLaRJ\ni0txQy34Fj4kpVZM3oLfUtbV0ndBAYxng08lT9x+JneKKetMc99YJhktxc76TVDr\nVV0IU07FYzQIBHIOBVSaxnxk0c6EOaTm3Mjftb8Cwp0AQSu4WMmV8WFS6GhW8qaT\nOw9wwdJ3g7ibYYZX/S851y+f5ALnohLKCvEstv/CAQKBgQDHL78F6D3fmiEUYUR0\nbgD+5UGK/XDsv9U79wBOcM7vWGd6Ol0YLiUYfORpK1TzSQlT0VoU8y/dFVKZ6hmQ\nN7EqYZyIrjA+iivtgiZ8Lj6SBF1T87JXP+WOhPEluOOgFJXSUs1Z5N98X4dNR/OW\nMAc+9FBE/ZOJPCt896JRZ8LjYQKBgQC3mWw3ey7OH8qMBaWPjG5QmbGI/Ksjy10N\n/UNo/Debxbmfec1H2HOmDY1/OeSeB4JFZCq7IjRNDC5dYJ0jnnfXyvTfOJvILlYY\ntwCSnvZkqsrBo7K4EVOpQ7sgaBLG3SxBCtpj8bPUiMRCfmgGKyb6xOPJbggSHMRi\nX/DflqO9BwKBgQCPvAigfqKHhHVye24mhmr5hP3zCkg+z39UMj1qXUU2uhiRvyQG\nmuXx8c3xhm9az82HSn8ytvpHE2fz4VZpF4clCiMnDmuJ9bMVROH4onZMcBHYzvZW\nt6kzWwOZMP4xOimTCGVfBSWwXk8ImW9RZX8VEsAJyOJ6GY1YNGpRTAr6gQKBgBJI\nRsxnicugwsyaq1fWBg4kn9ciQfB4ibWg6JuFsgvi7o8A0/45gZqhctueajOKT+CV\nDuQ/jbG2as+FlWA8oXZtkWDBBFI0uwIPBxGSnrp7f2E06dEGeKw8QGADvQrsb0Gy\n0Phu0xdw3wo4CCfFGEaUYJJoUIltL+kT4KqDF571AoGACZXgvU5d8Z2v4bvHGrqr\nCXKWypD3K8glyWIDQW1TOn69VEeFiTDC3U2tGguNzx1OWDXVJuHBYsBeO1yrhIpc\nv5NiPW0dp98tQZUT1KQkmM2Z5BkD5KjAjpEH7wl3Wz7RRhBPpL2/cZ/h5yz0aU7L\nY9w8J6O2W/M5G8xkx/UazSA=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-9gvg1@fir-algomuse.iam.gserviceaccount.com",
    "client_id": "103153330602174735588",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9gvg1%40fir-algomuse.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  };

// Define the required scopes.
var scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database"
];

// Authenticate a JWT client with the service account.
var jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  scopes
);

// Use the JWT client to generate an access token.


// initializeApp({
    
//     apiKey: "AIzaSyBS5C8p33p3bQHVE3r2IlM_XY5hJukuBZs",
//     authDomain: "fir-algomuse.firebaseapp.com",
//     databaseURL: "https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "fir-algomuse",
//     storageBucket: "fir-algomuse.appspot.com",
//     messagingSenderId: "377023861327",
//     appId: "1:377023861327:web:2f7488341d1a81ef8d503a"
// });
// const db = getDatabase();
// const dbRef = ref(db);

// const db = getDatabase();
// var dbRef = ref(db);


const computeStats = (polldata) => {
    var total1 = 0
    var total2 = 0
    const options1 = [
        ['15 or less',0],
        ['16 - 20',0],
        ['21 - 25',0],
        ['26 - 30',0],
        ['31 - 40',0],
    ]
    const options2 = [
        ['0 - 10',0],
        ['11 - 20',0],
        ['21 - 30',0],
        ['31 - 40',0],
        ['41 - 50',0],
        ['51 - 60',0],
        ['61 - 70',0],
        ['71 - 80',0],
    ]
    const length = polldata.length
    for(let i = 0;i<length;i++) {
        var q1 = parseInt(polldata[i].q1)
        var q2 = parseInt(polldata[i].q2)

        options1[q1-1][1]++
        total1++
        options2[q2-1][1]++
        total2++
        
    }

    return {
        options1: options1,
        options2: options2,
        total1: total1,
        total2: total2,
    }
}


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onCall({cors:true},(request) => {
  logger.info("Hello logs!", {structuredData: true});
  return {
    text: "hello World"
  }
});


exports.getPollResults = onCall({cors: true},async (data,context) => {
    var responseData = {}
    // var accessToken
    // jwtClient.authorize(async function(error, tokens) {
    //     if (error) {
    //       console.log("Error making request to generate access token:", error);
    //     } else if (tokens.access_token === null) {
    //       console.log("Provided service account does not have permission to generate access tokens");
    //     } else {
    //         accessToken = tokens.access_token;
            
      
    //       // See the "Using the access token" section below for information
    //       // on how to use the access token to send authenticated requests to
    //       // the Realtime Database REST API.
    //     }
    //   });
      await axios.get('https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/poll.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL' ).then((result) => {
                const resultdata = Object.values(result.data)
                console.log("result" + result)
                console.log("resultdata" + resultdata)
                responseData = computeStats(resultdata)
            }).catch((error) => {
                console.log('insideAxiosError')
                console.log(error)
            })
            
            // return responseData
            // context.send({
            //     responseData
            // })
            return {responseData}
    
                
});

