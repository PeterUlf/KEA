let myHeaders = {
  "x-apikey": "6225f2a2dced170e8c839fef	",
};
let results4;
let background = "odd";
const searchWord = document.querySelector("#search_word");

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
    seachResult(searchWord, JSONContent);
  });
}

function seachResult(word, arr) {
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
  console.log("results1", results1);
  let results2 = arr.filter((singleWord) => {
    //hvis søgeboxen for tema IKKE er tom
    if (searchWord.value != "") {
      //console.log("temasøg er ikke tom");
      //console.log(singleWord.themes);
      //her bruges "some" til at tjekke om søge temaet er en del af der der står i databasne
      //jeg forstår ikke helt nedenstående, men det bruges sammen med some
      //jeg bruger det til at tjekke hvert element og om det der er skrevet i søgeboksen er en del af det ord der er i arrayet
      const likeInputTheme = (element) =>
        element.toLowerCase().includes(word.value.toLowerCase());

      //hvis nedenstående er sandt kommer den med i filteret
      if (typeof singleWord.themes == "string") {
        return singleWord.themes.includes(word.value.toLowerCase());
      } else {
        return singleWord.themes.some(likeInputTheme);
      }
    } else {
      console.log("temasøg er tom");
      //hvis søgeboxen for tema ER tom
      return true;
    }
  });
  console.log("results2", results2);

  let results3 = arr.filter((singleWord) => {
    //hvis søgeboxen for beskrivelse IKKE er tom
    if (word.value != "") {
      console.log("søgefeltet beskr er IKKE tomt");
      //hvis nedenstående er sandt kommer den med i filteret
      return singleWord.explanation
        .toLowerCase()
        .includes(word.value.toLowerCase());
    } else {
      //hvis søgeboxen for beskrivelse ER tom
      console.log("søgefeltet beskr er  tomt");
      return true;
    }
  });

  console.log("results3", results3);

  results4 = results1.concat(results2.concat(results3));
  console.log("results4", results4);

  document.querySelector("#content").textContent = "";

  results4.forEach((result) => {
    generateListItem(result);
  });
}
function generateEditItem(result, id) {}

function generateListItem(result, id) {
  const template = document.querySelector("#my_result");

  const clone = template.content.cloneNode(true);
  if (background == "even") {
    background = "odd";
  } else {
    background = "even";
  }

  console.log(result.word);
  clone.querySelector(".search_word").textContent = result.word;
  clone.querySelector(".search_word").classList.add(background);

  clone.querySelector(".search_theme").textContent = result.themes;
  //clone.querySelector(".search_theme").textContent = "her kommer theme";
  clone.querySelector(".search_theme").classList.add(background);

  clone.querySelector(".search_description").textContent = result.explanation;
  //clone.querySelector(".search_description").textContent =
  (" her kommer description");
  clone.querySelector(".search_description").classList.add(background);

  clone.querySelector(".edit_button").classList.add(background);
  console.log("id: ", id);

  clone.querySelector(".edit_button").addEventListener("click", () => {
    edit_form(result._id, results4);
  });
  document.querySelector("#content").appendChild(clone);
}

function edit_form(id, arr) {
  document.querySelector("#content").textContent = "";

  const mySearchResult = arr.find((x) => x._id === id);
  const template = document.querySelector("#my_search");
  const clone = template.content.cloneNode(true);
  clone.querySelector(".search_word").value = mySearchResult.word;
  clone.querySelector(".search_theme").value = mySearchResult.themes;
  clone.querySelector(".search_description").value = mySearchResult.explanation;
  clone.querySelector(".edit_button").textContent = "gem";

  document.querySelector("#content").appendChild(clone);
}
