window.lang = "hu"; //nyelv
let root = document.getElementById("root"); //képernyő
window.char = {}; //aktuális user tulajdonságai
window.correctIns = [0, 0, 0, 0, 0, 0, 0];

function message(id, textHu, textEn, vanish) {
  const m = document.getElementById(id);
  const text = lang === "hu" ? textHu : textEn;
  m.classList.remove("disappear");
  m.classList.add("appear");
  m.innerHTML = text;
  if (vanish) {
    setTimeout(function () {
      m.classList.remove("appear");
      m.classList.add("disappear");
    }, text.length * 70);
    setTimeout(function () {
      m.innerHTML = "";
    }, text.length * 90 + 2001);
  }
}

function registrate() {
  let userName = document.getElementById("user").value; //Ezt a Login résznél kapja meg, ha oylan felhasználót kap meg, aki nincs az adatbázisban
  root.innerHTML = `
  <div id="formDiv">
    <h3 id="formTitle"></h3>
    <form>
      <div id="formPart1" class="formPart">
        <label id="nameLabel" for="name"></label>
        <input id="name" type="text" name="name" value="${userName}" required> <br>
        <div id="nameError" class="errorDiv"></div> <br>
        <label for="email">Email:</label>
        <input type="email" name="email" id="email" required> <br>
        <div id="emailError" class="errorDiv"></div> <br>
        <label id="pw1label" for="password1"></label>
        <input type="password" id="password1" name="password1" required> <br>
        <div id="password1Error" class="errorDiv"></div> <br>
        <label id="pw2label" for="password2"></label>
        <input type="password" id="password2" name="password2" required> <br>
        <div id="password2Error" class="errorDiv"></div> <br>
        <label id="genderLabel" for="gender"></label>
        <select name="gender" id="gender">
          <option id="maleSex" value="male"></option>
          <option id="femaleSex" value="female"></option>
        </select> <br>
        <div id="genderMes"></div> <br>
      </div>
      <div id="formPart2" class="formPart">
        <label id="langLabel" for="langSelect"></label>
        <select name="langSelect" id="langSelect">
          <option id="huLang" value="hu"></option>
          <option id="enLang" value="en"></option>
        </select> <br> <br>
        <label id="birthLabel" for="birth"></label>
        <input type="number" id="birth" min="1920" max="${
          new Date().getFullYear() - 3
        }" name="birth" required> <br>
        <div id="birthError" class="errorDiv"></div> <br>
        <label id="heightLabel" for="height"></label>
        <input type="number" id="height" min="40" max="300" name="height" required> <br>
        <div id="heightError" class="errorDiv"></div> <br>
        <label id="weightLabel" for="weight"></label>
        <input type="number" id="weight" min="10" max="300" name="weight" required> <br>
        <div id="weightError" class="errorDiv"></div> <br>
        <button id="submitBtn" type="button" class="newUserBtn yesBtn bigger"></button>
        <button id="cancelBtn" type="button" class="newUserBtn noBtn bigger"></button> <br>
      </div> <br>
      <div id="globalError" class="messageDiv"></div>	
    </form>
  </div>
  `;

  //Ezek a feliratok, amit egy nagyobb (JSON) adatbázisból kap meg, de az egyszerűség kedvéért itt beraktam csak ezt a részt
  const prints = {
    formDiv: [
      [
        "formTitle",
        "Üdvözlünk, Harcos! Mesélj egy kicsit magadról!",
        "Welcome, Warrior! Please tell us more about yourself.",
        false,
      ],
      ["nameLabel", "Felhasználó:", "User:", false],
      ["pw1label", "Jelszó:", "Password:", false],
      ["pw2label", "Jelszó:", "Password:", false],
      ["genderLabel", "Nemed:", "Gender:", false],
      [
        "genderMes",
        "A nemed a játék típusát is meghatározza!",
        "Your gender determines the type of game, too!",
        false,
      ],
      ["maleSex", "férfi", "male", false],
      ["femaleSex", "nő", "female", false],
      ["langLabel", "Nyelv:", "Language:", false],
      ["huLang", "magyar", "Hungarian", false],
      ["enLang", "angol", "English", false],
      ["birthLabel", "Születési év:", "Year of Birth:", false],
      ["heightLabel", "Magasság (cm):", "Height (cm):", false],
      ["weightLabel", "Súly (kg):", "Weight (kg):", false],
      ["submitBtn", "Regisztrálok", "Register", false],
      ["cancelBtn", "Mégsem", "Cancel", false],
    ],
  };
  prints.formDiv.map((text) => {
    message(text[0], text[1], text[2], text[3]);
  }); //Ez írja ki
  if (lang === "en") {
    document.getElementById("enLang").selected = true;
  }
  document.getElementById("name").focus();
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("submitBtn").addEventListener("click", performReg);
  document.getElementById("cancelBtn").addEventListener("click", cancelReg);
  let inputs = document.querySelectorAll("input");
  for (let x of inputs) {
    x.addEventListener("blur", checkInput);
    x.addEventListener("keypress", function (e) {
      if (e.keyCode === 13) {
        x.blur();
      }
    });
  }

  //Regisztrációs adatok validálása, mentése
  function checkInput(e) {
    let item = e.target;
    let val = e.target.value;
    let sBtn = document.getElementById("submitBtn");
    function correctI(x) {
      item.classList.remove("incorrect");
      item.classList.add("correct");
      correctIns[x] = 1;
    }
    function incorrectI(x) {
      item.classList.remove("correct");
      item.classList.add("incorrect");
      correctIns[x] = 0;
      sBtn.disabled = true;
    }
    switch (item.id) {
      case "name":
        if (val.length < 3 || val.length > 15) {
          message(
            "nameError",
            "Min. 3, max. 15 karakter!",
            "Min. 5, max. 15 characters!",
            1
          );
          char.name = "";
          incorrectI(0);
        } else {
          char.name = val;
          correctI(0);
        }
        break;

      case "email":
        let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let checkEmail = chars.findIndex((user) => user.email === val);

        if (val.match(mailformat) && checkEmail === -1) {
          char.email = val;
          correctI(1);
        } else {
          if (checkEmail > -1) {
            message(
              "emailError",
              "Ilyen emailcímmel már regisztráltak",
              "Email already registered.",
              1
            );
          } else {
            message(
              "emailError",
              "Légyszi, valami normális emailt írj be!",
              "Provide a correct email!",
              1
            );
          }
          char.email = "";
          incorrectI(1);
        }
        break;

      case "password1":
        let pwformat = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6}$/;
        if (val.match(pwformat)) {
          //password eltárolása - server
          correctI(2);
        } else {
          message(
            "password1Error",
            "Min. 6 kis- és nagybetű és szám kell!",
            "Min. 6 upper & lower case letters and digits!",
            1
          );
          //password törlése - server
          incorrectI(2);
          item.focus();
        }
        break;

      case "password2":
        if (val === document.getElementById("password1").value) {
          correctI(3);
        } else {
          message(
            "password2Error",
            "Nem egyezik a fentivel!",
            "Passwords don't match!",
            1
          );
          incorrectI(3);
        }
        break;

      case "birth":
        val = parseInt(val);
        maxYear = new Date().getFullYear() - 3;
        if (val < 1920 || val > maxYear || isNaN(val)) {
          message(
            "birthError",
            "1920 és " + maxYear + " között legyen inkább!",
            "Rather provide something between 1920 and " + maxYear,
            1
          );
          incorrectI(4);
        } else {
          char.birth = val;
          correctI(4);
        }
        break;

      case "height":
        val = parseInt(val);
        if (val < 40 || val > 300 || isNaN(val)) {
          message(
            "heightError",
            "Valami reálisat adj meg cm-ben!",
            "Provide a realistic data in centimeters!",
            1
          );
          incorrectI(5);
        } else {
          char.height = val;
          correctI(5);
        }
        break;

      case "weight":
        val = parseInt(val);
        if (val < 10 || val > 300 || isNaN(val)) {
          message(
            "weightError",
            "Valami reálisat adj meg kg-ban!",
            "Provide a realistic data in kilograms!",
            1
          );
          incorrectI(6);
        } else {
          char.weight = val;
          correctI(6);
        }
        break;

      default:
        break;
    }
    let canSubmit = true;
    for (let x of correctIns) {
      if (x === 0) {
        canSubmit = false;
      }
    }
    if (canSubmit) {
      sBtn.disabled = false;
    }
  }

  function performReg() {
    char.gender = document.getElementById("gender").value;
    char.language = document.getElementById("langSelect").value;
    lang = char.language;
    char.score = 0;
    char.sta = [0, "-"];
    char.bre = [0, "-"];
    char.sld = [0, "-"];
    char.bic = [0, "-"];
    char.tri = [0, "-"];
    char.bre = [0, "-"];
    char.abs = [0, "-"];
    char.bak = [0, "-"];
    char.but = [0, "-"];
    char.leg = [0, "-"];
    char.bre = [0, "-"];
    char.logins = [new Date().toLocaleDateString()];
    char.extras = [];
    chars.push(char); // server
    console.log(char);
    initMain();
  }

  function cancelReg() {
    char = {};
    correctIns = [0, 0, 0, 0, 0, 0, 0];
    initIntro();
  }
}
