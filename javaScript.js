const key = "6225f2a2dced170e8c839fef";
const getAllUrl = "https://keawords-3374.restdb.io/rest/keawords";
const putHeaders = {
  "Content-Type": "application/json",
  "x-apikey": key,
};

const getHeaders = {
  "x-apikey": key,
};
const searchWord = document.querySelector("#search_word");
const create = document.querySelector("#search_button");
create.addEventListener("click", createPost);

let results4;
let background = "odd";

document.addEventListener("DOMContentLoaded", loadJSON);

async function loadJSON() {
  const JSONData = await fetch(getAllUrl, {
    headers: getHeaders,
  });
  const JSONContent = await JSONData.json();
  if (JSONContent != "") {
    document.querySelector(".preloader").classList.add("hide");
    searchWord.focus();
  }

  seachResult(searchWord, JSONContent);

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
      console.log("singleWord.word", singleWord.word);
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
      // return singleWord.explanation
      //   .toLowerCase()
      //   .includes(word.value.toLowerCase());
      return;
    } else {
      //hvis søgeboxen for beskrivelse ER tom
      console.log("søgefeltet beskr er  tomt");
      return true;
    }
  });

  console.log("results3", results3);

  let results45 = results1.concat(results2.concat(results3));

  //fjern dubletter
  results4 = results45.filter(
    (item, index) => results45.indexOf(item) === index
  );
  results4.sort(compareWord);
  results4.sort(compareThemes);

  //sort arrayet: først på theme og derefter på word
  function compareThemes(a, b) {
    if (a.themes < b.themes) {
      return -1;
    }
    if (a.themes > b.themes) {
      return 1;
    }
    return 0;
  }
  function compareWord(a, b) {
    if (a.word < b.word) {
      return -1;
    }
    if (a.word > b.word) {
      return 1;
    }
    return 0;
  }
  console.log("results4", results4);

  // document.querySelector("#content").textContent = "";

  // results4.forEach((result) => {
  generateListItem();
  // });
}
function generateEditItem(result, id) {}

function generateListItem(id) {
  document.querySelector("#content").textContent = "";
  results4.forEach((result) => {
    const template = document.querySelector("#my_result");

    const clone = template.content.cloneNode(true);
    if (background == "even") {
      background = "odd";
    } else {
      background = "even";
    }

    //console.log(result.word);
    clone.querySelector(".search_word").textContent = result.word;
    clone.querySelector(".search_word").classList.add(background);

    clone.querySelector(".search_theme").textContent = result.themes;
    clone.querySelector(".search_theme").classList.add(background);

    clone.querySelector(".search_description").textContent = result.explanation;
    clone.querySelector(".search_description").classList.add(background);

    clone.querySelector(".edit_button").classList.add(background);
    //console.log("id: ", id);

    clone.querySelector(".edit_button").addEventListener("click", () => {
      edit_form(result._id, results4);
    });
    document.querySelector("#content").appendChild(clone);
  });
}

function edit_form(id, arr) {
  document.querySelector("#content").textContent = "";

  const mySearchResult = arr.find((x) => x._id === id);
  const template = document.querySelector("#my_edit");
  const clone = template.content.cloneNode(true);
  clone.querySelector(".search_word").value = mySearchResult.word;
  clone.querySelector(".search_theme").value = mySearchResult.themes;
  clone.querySelector(".search_description").value = mySearchResult.explanation;
  // clone.querySelector(".edit_button .save").textContent = "gem";
  clone.querySelector(".edit_button .save").addEventListener("click", () => {
    update(mySearchResult._id);
  });
  // clone.querySelector(".edit_button .delete").textContent = "Slet";
  clone.querySelector(".edit_button .delete").addEventListener("click", () => {
    deleteWord(mySearchResult._id);
  });
  clone.querySelector(".edit_button .cancel").addEventListener("click", () => {
    generateListItem();
  });

  document.querySelector("#content").appendChild(clone);

  document.querySelector("#content .search_word").focus();
}

function update(id) {
  // data to be sent to the POST request
  document.querySelector(".preloader").classList.remove("hide");

  const myUrl = `https://keawords-3374.restdb.io/rest/keawords/${id}`;
  console.log(myUrl);

  const update = {
    word: document.querySelector("#content .search_word").value,
    themes: document.querySelector("#content .search_theme").value.split(","),
    explanation: document.querySelector("#content .search_description").value,
  };

  console.log("update", update);

  const options = {
    method: "PUT",
    headers: putHeaders,
    body: JSON.stringify(update),
  };
  fetch(myUrl, options)
    .then((data) => {
      if (!data.ok) {
        throw Error(data.status);
      }

      //opdaterer listen når vi har rettet
      // results4 = "";
      document.querySelector("#content").textContent = "";
      // document.querySelector(".search_word").textContent = "";

      loadJSON();
      generateListItem();

      return data.json();
    })
    .then((update) => {
      console.log(update);
    })
    .catch((e) => {
      console.log(e);
    });
}

function createPost() {
  document.querySelector("#content").textContent = "";

  const template = document.querySelector("#my_edit");
  const clone = template.content.cloneNode(true);
  clone.querySelector(".search_word").value = "";
  clone.querySelector(".search_theme").value = "";
  clone.querySelector(".search_description").value = "";
  // clone.querySelector(".edit_button .save").textContent = "gem";
  clone.querySelector(".edit_button .save").addEventListener("click", () => {
    post();
  });

  document.querySelector("#content").appendChild(clone);

  document.querySelector("#content .search_word").focus();
}

function post() {
  // data to be sent to the POST request

  const myUrl = `https://keawords-3374.restdb.io/rest/keawords`;
  console.log(myUrl);

  const update = {
    word: document.querySelector("#content .search_word").value,
    themes: document.querySelector("#content .search_theme").value.split(","),
    explanation: document.querySelector("#content .search_description").value,
  };

  console.log("update", update);

  const options = {
    method: "POST",
    headers: putHeaders,
    body: JSON.stringify(update),
  };
  fetch(myUrl, options)
    .then((data) => {
      if (!data.ok) {
        throw Error(data.status);
      }

      //opdaterer listen når vi har rettet
      // results4 = "";
      document.querySelector("#content").textContent = "";
      // document.querySelector(".search_word").textContent = "";

      loadJSON();
      generateListItem();

      return data.json();
    })
    .then((update) => {
      console.log(update);
    })
    .catch((e) => {
      console.log(e);
    });
}

function deleteWord(id) {
  // data to be sent to the POST request
  document.querySelector(".preloader").classList.remove("hide");

  const myUrl = `https://keawords-3374.restdb.io/rest/keawords/${id}`;
  console.log(myUrl);

  const options = {
    method: "DELETE",
    headers: putHeaders,
  };
  fetch(myUrl, options)
    .then((data) => {
      if (!data.ok) {
        throw Error(data.status);
      }

      //opdaterer listen når vi har rettet
      // results4 = "";
      document.querySelector("#content").textContent = "";
      // document.querySelector(".search_word").textContent = "";

      loadJSON();
      generateListItem();

      return data.json();
    })
    .then((update) => {
      console.log(update);
    })
    .catch((e) => {
      console.log(e);
    });
}
