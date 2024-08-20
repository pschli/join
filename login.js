function loginAsGuest(event) {
  event.preventDefault();
  console.log("Guest logged in");
}

function validateLogin(event) {
  event.preventDefault();
  let [email, password] = getLoginFormData();
  checkLoginData(email, password);
}

async function checkLoginData(username, password) {
  let loginData = await getLoginData();
  let index = findLoginName(loginData, username);
  if (index === -1 || index == undefined) unknownUser();
  else {
    let pwFromDb = loginData[index]["password"];
    if (pwFromDb !== password) incorrectPassword();
    else loginUser(loginData[index]["name"], loginData[index]["initials"]);
  }
}

function loginUser(displayName, initials) {
  let remember = document.getElementById("remember").checked;
  setToken(displayName, initials, remember);
}

function setToken(displayName, initials, remember) {
  let timestamp = Math.floor(Date.now() / 1000);
  let loginToken = {
    name: displayName,
    initials: initials,
    remember: remember,
    timestamp: timestamp,
  };
  saveToken(loginToken);
}

function saveToken(loginToken) {
  console.log(loginToken);
}

function findLoginName(loginData, username) {
  let index = loginData.findIndex((user) => user["login"] == username);
  return index;
}

function getLoginFormData() {
  let email = getLoginFieldData("entermail");
  let password = getLoginFieldData("enterpassword");
  return [email, password];
}

function getLoginFieldData(field) {
  return document.getElementById(field).value;
}

function showInvalidLogin(labelId, inputId) {
  document.getElementById(inputId).style.borderColor = "red";
  document.getElementById(labelId).style = "";
}

function removeInvalidLogin(labelId, inputId) {
  document.getElementById(inputId).style = "";
  document.getElementById(labelId).style = "opacity: 0;";
}

function unknownUser() {
  console.log("Username not registered");
}

function incorrectPassword() {
  console.log("Password not correct");
}

async function saveLoginData(data = {}) {
  if (data) await postData("/logindata", data);
}

async function getLoginData() {
  let loginData = [];
  let userResponse = await fetch(FIREBASE_URL + "/logindata" + ".json");
  let responseToJson = await userResponse.json();
  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      loginData.push({
        id: key,
        name: responseToJson[key]["name"],
        login: responseToJson[key]["login"],
        password: responseToJson[key]["password"],
        initials: responseToJson[key]["initials"],
      });
    });
  }
  return loginData;
}
