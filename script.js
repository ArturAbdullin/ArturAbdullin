// add GitHub repo prefix to all paths marked with "gitlink" attribute (in my case /ArturAbdullin)
function addGitRepoPrefix() {
  let prefix = "/ArturAbdullin";
  let elements = [...document.querySelectorAll("[git-repo-link]")];
  for (const element of elements) {
    if (element.attributes.src) {
      element.attributes.src.value = prefix + element.attributes.src.value;
    } else if (element.attributes.href) {
      element.attributes.href.value = prefix + element.attributes.href.value;
    }
  }
};
// addGitRepoPrefix();

document.getElementById("months-from-start").textContent = countMonthsBetween(
  new Date(2021, 5, 1),
  new Date()
);

function countMonthsBetween(d1, d2) {
  let months =
    (d2.getFullYear() - d1.getFullYear()) * 12 - d1.getMonth() + d2.getMonth();
  return Math.abs(months);
}

function changeFrame(event) {
  let src = event.srcElement.attributes["data-href"].nodeValue;
  const oldFrame = document.getElementById("frame");
  if (oldFrame) {
    document.body.removeChild(oldFrame);
  }
  const newFrame = document.createElement("iframe");
  newFrame.id = "frame";
  newFrame.src = src;
  newFrame.width = 1000;
  newFrame.height = 1000;
  document.body.appendChild(newFrame);
}

document
  .getElementById("case-converter")
  .addEventListener("click", changeFrame);

document.getElementById("flashcards").addEventListener("click", changeFrame);

document.getElementById("virtual-piano").addEventListener("click", changeFrame);
