window.saveDataAcrossSessions = true

const LOOK_TIME = 1000
const LEFT_SIDE = window.innerWidth / 4
const RIGHT_SIDE = window.innerWidth - window.innerWidth / 4

let startLookTime = Number.POSITIVE_INFINITY
let lookDirection = null
let currentImageElement = getNewImage();
let nextImageElement = getNewImage(true);

webgazer.setGazeListener((data, timestamp) => {

  if (data == null || lookDirection === 'STOP') return

  if (data.x < LEFT_SIDE && lookDirection !== 'LEFT' && lookDirection !== 'RESET') {
    startLookTime = timestamp
    lookDirection = 'LEFT'
  } else if (data.x > RIGHT_SIDE && lookDirection !== 'RIGHT' && lookDirection !== 'RESET') {
    startLookTime = timestamp
    lookDirection = 'RIGHT'
  } else if (data.x >= LEFT_SIDE && data.x <= RIGHT_SIDE) {
    startLookTime = Number.POSITIVE_INFINITY
    lookDirection = null
  }

  if (startLookTime + LOOK_TIME < timestamp) {
    if (lookDirection === 'LEFT') {
      currentImageElement.classList.add('left')
    } else {
      currentImageElement.classList.add('right')
    }

    startLookTime = Number.POSITIVE_INFINITY
    lookDirection = 'STOP'
    setTimeout(() => {
      currentImageElement.remove()
      nextImageElement.classList.remove('next')
      currentImageElement = nextImageElement
      nextImageElement = getNewImage(true)
      lookDirection = 'RESET'
    }, 200)
  }
}).begin()

webgazer.showVideoPreview(false).showPredictionPoints(false)

function getNewImage(next = false) {
  const img = document.createElement('img')
  img.src = 'https://picsum.photos/1000?' + Math.random()
  console.log(img.src)
  if (next) img.classList.add('next')
  document.body.append(img)

  return img
}
