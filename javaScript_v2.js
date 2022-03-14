let myHeaders = {
  "x-apikey": "6225f2a2dced170e8c839fef	",
};
const searchWord = document.querySelector("#search_word");
const searchTheme = document.querySelector("#search_theme");
const searchDescription = document.querySelector("#search_description");

document.addEventListener("DOMContentLoaded", loadJSON);

async function loadJSON() {
  const JSONData = await fetch(
    "https://keawords-3374.restdb.io/rest/keawords  ",
    {
      headers: myHeaders,
    }
  );
  const JSONContent = await JSONData.json();
  if (JSONContent != "") {
    document.querySelector(".preloader").classList.add("hide");
    searchWord.focus();
  }

  searchWord.addEventListener("keyup", function () {
    seachResult(searchWord, searchTheme, searchDescription, JSONContent);
  });
  searchTheme.addEventListener("keyup", function () {
    seachResult(searchWord, searchTheme, searchDescription, JSONContent);
  });
  searchDescription.addEventListener("keyup", function () {
    seachResult(searchWord, searchTheme, searchDescription, JSONContent);
  });
  // datalistWord(JSONContent);
  // datalistTheme(JSONContent);
}

// function datalistWord(data) {
//   data.forEach((result) => {
//     const template = document.querySelector("#datalist_builder");
//     const clone = template.content.cloneNode(true);
//     clone.querySelector("option").value = result.word;
//     document.querySelector("#search_words").appendChild(clone);
//   });
// }
// function datalistTheme(data) {
//   data.forEach((result) => {
//     const template = document.querySelector("#datalist_builder");
//     const clone = template.content.cloneNode(true);
//     clone.querySelector("option").value = result.themes;
//     document.querySelector("#search_themes").appendChild(clone);
//   });
// }

function seachResult(word, theme, description, arr) {
  console.log("seachResult");
  // tøm content før det rettes til
  document.querySelector("#content").textContent = "";

  //filter array her
  let results1;
  results1 = arr.filter((singleWord) => {
    if (word.value != "") {
      // singleWord.word.toLowerCase() == word.value.toLowerCase();
      return singleWord.word.toLowerCase().includes(word.value.toLowerCase());
    } else {
      return true;
    }
  });
  console.log(results1);
  let results2 = results1.filter((singleWord) => {
    //hvis søgeboxen for tema IKKE er tom
    if (theme.value != "") {
      console.log("temasøg er ikke tom");
      console.log(singleWord.themes);
      //her bruges "some" til at tjekke om søge temaet er en del af der der står i databasne
      //jeg forstår ikke helt nedenstående, men det bruges sammen med some
      //jeg bruger det til at tjekke hvert element og om det der er skrevet i søgeboksen er en del af det ord der er i arrayet
      const likeInputTheme = (element) =>
        element.toLowerCase().includes(theme.value.toLowerCase());

      //hvis nedenstående er sandt kommer den med i filteret
      if (typeof singleWord.themes == "string") {
        return singleWord.themes.includes(theme.value.toLowerCase());
      } else {
        return singleWord.themes.some(likeInputTheme);
      }
    } else {
      console.log("temasøg er tom");
      //hvis søgeboxen for tema ER tom
      return true;
    }
  });

  let results3 = results2.filter((singleWord) => {
    //hvis søgeboxen for beskrivelse IKKE er tom
    if (description.value != "") {
      console.log("søgefeltet beskr er IKKE tomt");
      //hvis nedenstående er sandt kommer den med i filteret
      return singleWord.explanation
        .toLowerCase()
        .includes(description.value.toLowerCase());
    } else {
      //hvis søgeboxen for beskrivelse ER tom
      console.log("søgefeltet beskr er  tomt");
      return true;
    }
  });

  let background = "odd";
  results3.forEach((result) => {
    const template = document.querySelector("#my_result");
    const clone = template.content.cloneNode(true);
    if (background == "even") {
      background = "odd";
    } else {
      background = "even";
    }
    ////console.log(result.word);
    clone.querySelector(".search_word").textContent = result.word;
    clone.querySelector(".search_word").classList.add(background);

    clone.querySelector(".search_theme").textContent = result.themes;
    clone.querySelector(".search_theme").classList.add(background);

    clone.querySelector(".search_description").textContent = result.explanation;
    clone.querySelector(".search_description").classList.add(background);

    clone.querySelector(".edit_button").classList.add(background);

    document.querySelector("#content").appendChild(clone);
  });
}
