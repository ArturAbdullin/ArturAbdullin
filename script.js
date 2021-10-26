function changeFrame (event) {
  let src = event.srcElement.attributes.href.nodeValue;
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


document.getElementById('CaseConverter').addEventListener('click',
changeFrame);

document.getElementById('FlashCards').addEventListener('click',
changeFrame);

document.getElementById('VirtualPiano').addEventListener('click',
changeFrame);