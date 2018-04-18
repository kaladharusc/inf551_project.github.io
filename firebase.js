var config = {
    apiKey: "AIzaSyCMGAwE2t_6EHLGiz6pcp6vyvZSgfvPweE",
    authDomain: "inf551-project-10723.firebaseapp.com",
    databaseURL: "https://inf551-project-10723.firebaseio.com",
    projectId: "inf551-project-10723",
    storageBucket: "inf551-project-10723.appspot.com",
    messagingSenderId: "373729871136"
};
firebase.initializeApp(config);

var database = firebase.database();
var dcRef = database.ref("dc/").orderByChild("name").startAt("S").endAt("S"+"\uf8ff").limitToFirst(10);
dcRef.on("value",function(data) {
    console.log(data.val());
});