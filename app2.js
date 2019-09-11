const BASE_URL = "http://localhost:3000"
// const BASE_URL = "https://quiet-beach-71145.herokuapp.com"

let projectId = 2
let songId = 4
let ArtistId

const ARTIST_URL = `${BASE_URL}/artists/`
const PROJECT_URL = `${BASE_URL}/projects/`
const SONG_URL = `${BASE_URL}/songs/`
const PART_URL = `${BASE_URL}/parts/`

const $ = {
    projectName: document.querySelector('#project-name'),
    projectNotes: document.querySelector('#project-notes'),
    projectSongList: document.querySelector('#song-list'),
    projectList: document.querySelector('#project-list'),
    songCard: document.querySelector('#song-card'),
    songName: document.querySelector('#song-name'),
    songNote: document.querySelector('#song-note'),
    songList: document.querySelector('#song-list'),
    partList: document.querySelector('#part-list'),
    menuBar: document.querySelector('#menu-bar'),
    projectNameMenu: document.querySelector('#project-name-menu'),
    addButton: document.querySelector('#new-project-btn'),
    addForm: document.querySelector('.project-container'),
    partNameInput: document.querySelector('#new-part-input'),
    partNoteInput: document.querySelector('#new-part-note-input'),
    partInputButton: document.querySelector('#new-part-submit'),
    newPartForm: document.querySelector('#new-part-form'),
    songNameInput: document.querySelector('#new-song-input'),
    songNoteInput: document.querySelector('#new-song-note-input'),
    newSongForm: document.querySelector('#new-song-form'),
    songInputButton: document.querySelector('#new-song-submit')
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
.then(displayProjectList)

fetch(`${PROJECT_URL}${projectId}`)
.then(parseJson)
.then(displayProject)

fetch(SONG_URL)
.then(parseJson)
.then(renderSongs)

fetch(`${SONG_URL}${songId}`)
.then(parseJson)
.then(renderSongCard)

fetch(PART_URL)
.then(parseJson)
.then(renderParts)

function displayProjectList(projects){
console.log(projects)
}

function displayProject(project) {
    $.projectName.innerText = project.project_name
    $.projectNotes.innerText = project.project_notes
    $.projectNameMenu.innerText = project.project_name
}


function renderSongs(songs){
    songs.forEach(getSongList)
    $.songInputButton.addEventListener('click', addSong)
}

function getSongList(song) {   
    let eachSong = document.createElement('li')
    eachSong.setAttribute('data-id', song.id)
    eachSong.innerText = song.song_name
    // console.log(eachSong.dataset.id)
    eachSong.addEventListener('click', () => songId = eachSong.dataset.id)
    $.projectSongList.append(eachSong)
    //  console.log(songId)
    
}

function renderSongCard(info) {
    $.songName.innerText = info.song_name
    $.songNote.innerText = info.song_note
    let eachSong = info.id
    $.partInputButton.addEventListener('click', addPart)
    let deleteSongButton = document.createElement('button')
    deleteSongButton.innerText = "Delete Song"
    let editSongButton = document.createElement('button')
    editSongButton.innerText = "Edit Song"
    $.songCard.append(deleteSongButton, editSongButton)
    deleteSongButton.addEventListener('click', () => deleteSong(event, eachSong))
   
}

function renderParts(parts){
    // console.log(parts)
    parts.forEach(getPartList)
}

function getPartList(part) {
    console.log(part)
    if (part.song_id === songId) {
    let eachPart = document.createElement('li')
    let editPartButton = document.createElement('button')
    editPartButton.innerText = "Edit"
    let completePartButton = document.createElement('button')
    completePartButton.innerText = "Finished"
    completePartButton.addEventListener('click', () => 
    eachPart.style.cssText= "color: red; text-decoration: line-through")
    let deletePartButton = document.createElement('button')
    deletePartButton.innerText = "Delete"
    eachPart.innerText = `${part.part_name}: ${part.part_note}`
    eachPart.append(editPartButton, completePartButton, deletePartButton)
    $.partList.append(eachPart)
    deletePartButton.addEventListener('click', ()=> deletePart(event, part, eachPart))
    }
}

function addPart(event) {
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
    .then(getPartList)
    $.newPartForm.reset()
}

function addSong(event) {
    event.preventDefault()
    fetch(SONG_URL, {
        "method":"POST",
        "headers": {
            "Content-Type": "application/json",
            "Accept":"application/json"
        },
        "body": JSON.stringify({
            "project_id": projectId,
            "song_name": $.songNameInput.value,
            "song_note": $.songNoteInput.value
        })
    })
    .then(parseJson)
    .then(getSongList)
    $.newSongForm.reset()
}

function deletePart(event, part, eachPart){
    fetch(`${PART_URL}${part.id}`, {
        "method":"DELETE"
    })
    eachPart.remove()
}

function deleteSong(event, eachSong) {
    console.log(eachSong)
    fetch(`${SONG_URL}${eachSong}`, {
        "method":"DELETE"
    })
    // eachSong.remove()
}

