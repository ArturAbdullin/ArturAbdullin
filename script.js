function changeFrame (event) {
  let src = event.srcElement.attributes['data-href'].nodeValue;
  const oldFrame = document.getElementById('frame');
  if (oldFrame) {
    document.body.removeChild(oldFrame);
  }
  const newFrame = document.createElement('iframe');
  newFrame.id = 'frame';
  newFrame.src = src;
  newFrame.width = 1000;
  newFrame.height = 1000;
  document.body.appendChild(newFrame);
}


document.getElementById('case-converter').addEventListener('click',
changeFrame);

document.getElementById('flashcards').addEventListener('click',
changeFrame);

document.getElementById('virtual-piano').addEventListener('click',
changeFrame);