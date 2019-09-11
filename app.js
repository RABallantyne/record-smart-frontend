const BASE_URL = "http://localhost:3000"
// const BASE_URL = "https://quiet-beach-71145.herokuapp.com"

let projectId = 2
let songId = 4


const ARTIST_URL = `${BASE_URL}/artists/`
const PROJECT_URL = `${BASE_URL}/projects/`
const SONG_URL = `${BASE_URL}/songs/`
const PART_URL = `${BASE_URL}/parts/`

const $ = {
    projectName: document.querySelector('#project-name'),
    projectNotes: document.querySelector('#project-notes'),
    projectSongList: document.querySelector('#project-song-list'),
    songCard: document.querySelector('#song-card'),
    songName: document.querySelector('#song-name'),
    songNote: document.querySelector('#song-note'),
    partList: document.querySelector('#part-list'),
    menuBar: document.querySelector('#menu-bar'),
    projectNameMenu: document.querySelector('#project-name-menu'),
    addButton: document.querySelector('#new-project-btn'),
    addForm: document.querySelector('.container'),
    partNameInput: document.querySelector('#new-part-input'),
    partNoteInput: document.querySelector('#new-part-note-input'),
    partInputButton: document.querySelector('#new-part-submit')
}

let isAdding = false
$.addButton.addEventListener('click', () => {
    isAdding = !isAdding
    if (isAdding) {
      $.addForm.style.display = 'block'
    //   $.addForm.addEventListener('submit', event => {
    //     event.preventDefault()
    //     addNewProject(event.target)
    //   })
  
    } else {
      $.addForm.style.display = 'none'
    }
  })

function parseJson(response){
    return response.json();
}

fetch(ARTIST_URL)
.then(parseJson)

fetch(`${PROJECT_URL}${projectId}`)
.then(parseJson)
.then(displayProject)

fetch(SONG_URL)
.then(parseJson)
.then(getSongList)

fetch(`${SONG_URL}${songId}`)
.then(parseJson)
.then(renderSongCard)

fetch(PART_URL)
.then(parseJson)
.then(getPartList)

// fetch(PART_URL)
// .then(parseJson)
// .then(renderParts)

function displayProject(project) {
    $.projectName.innerText = project.project_name
    $.projectNotes.innerText = project.project_notes
    $.projectNameMenu.innerText = project.project_name
}

function getSongList(songs) {
    let allSongs = document.createElement('ul')
    songs.forEach( song => {
        let eachSong = document.createElement('li')
        eachSong.innerText = song.song_name
        allSongs.append(eachSong)
    })
    $.projectSongList.append(allSongs)
}

function renderSongCard(info) {
    $.songName.innerText = info.song_name
    $.songNote.innerText = info.song_note
}

// function renderParts(parts){
//     let allParts = document.createElement('ul')
//     parts.forEach(getPartList)
//     $.partList.append(allParts)
// }


function getPartList(parts) {
    console.log(parts)
    let allParts = document.createElement('ul')
    parts.forEach( part => {
        if (part.song_id === songId) {
        let eachPart = document.createElement('li')
        let editPartButton = document.createElement('button')
        editPartButton.innerText = "Edit"
        let completePartButton = document.createElement('button')
        completePartButton.innerText = "Finished"
        let deletePartButton = document.createElement('button')
        deletePartButton.innerText = "Delete"
        eachPart.innerText = `${part.part_name}: ${part.part_note}`
        eachPart.append(editPartButton, completePartButton, deletePartButton)
        allParts.append(eachPart)
        deletePartButton.addEventListener('click', ()=> deletePart(event, part, eachPart))
    }
    })
    // return allParts
    $.partList.append(allParts)
}

$.partInputButton.addEventListener('click', addPart)

function addPart(event, parts) {
    event.preventDefault()
    fetch(PART_URL, {
        "method":"POST",
        "headers": {
            "Content-Type": "application/json",
            "Accept":"application/json"
        },
        "body": JSON.stringify({
            "song_id": songId,
            "part_name": $.partNameInput.value,
            "part_note": $.partNoteInput.value
        })
    })
    .then(parseJson)
    .then(getPartList(event, parts))
}

function deletePart(event, part, eachPart){
    fetch(`${PART_URL}${part.id}`, {
        "method":"DELETE"
    })
    eachPart.remove()

}

