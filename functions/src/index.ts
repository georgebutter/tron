import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

export const createRealTimeGame = functions.firestore.document('/games/{documentId}')
  .onUpdate((snap, context) => {
    const data = snap.after.data()
    if (data.playerCount < 2) return
    const appOptions = JSON.parse(process.env.FIREBASE_CONFIG as string);
    console.log(appOptions)
    appOptions.databaseAuthVariableOverride = context.auth;
    const app = admin.initializeApp(appOptions, 'app');
    const database = app.database()
    functions.logger.log('Creating realtime db', context.params.documentId, data);
    database.ref(`games`).push(data).then((res) => {
      console.log(res)
    })
  })

// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
