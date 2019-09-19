const BASE_URL = "http://localhost:3000"


let artistId = 1
// let projectId = 2
// let songId = undefined
// songId = 6

const ARTIST_URL = `${BASE_URL}/artists/`
const PROJECT_URL = `${BASE_URL}/projects/`
const SONG_URL = `${BASE_URL}/songs/`
const PART_URL = `${BASE_URL}/parts/`

const $ = {
    pageContainer: document.querySelector("#page-container-hidden"),
    projectName: document.querySelector('#project-name'),
    projectNotes: document.querySelector('#project-notes'),
    projectSongList: document.querySelector('#song-list'),
    projectList: document.querySelector('#project-lists'),
    newProjectForm: document.querySelector('#new-project-form'),
    newProjectInput: document.querySelector('#new-project-input'),
    newProjectNote: document.querySelector('#new-project-note'),
    newProjectSubmit: document.querySelector('#new-project-submit'),
    songCard: document.querySelector('#song-card'),
    songName: document.querySelector('#song-name'),
    songNote: document.querySelector('#song-note'),
    songList: document.querySelector('#song-list'),
    partList: document.querySelector('#part-list'),
    menuBar: document.querySelector('#menu-bar'),
    projectNameMenu: document.querySelector('#project-name-menu'),
    addProjectButton: document.querySelector('#new-project-btn'),
    addProjectForm: document.querySelector('.project-container'),
    partNameInput: document.querySelector('#new-part-input'),
    partNoteInput: document.querySelector('#new-part-note-input'),
    partInputButton: document.querySelector('#new-part-submit'),
    newPartForm: document.querySelector('#new-part-form'),
    songNameInput: document.querySelector('#new-song-input'),
    songNoteInput: document.querySelector('#new-song-note-input'),
    newSongForm: document.querySelector('#new-song-form'),
    songInputButton: document.querySelector('#new-song-submit'),
    editSongButton: document.querySelector('#edit-song-button'),
    deleteSongButton: document.querySelector('#delete-song-button'),
    notice: document.querySelector('#notice')
}

function parseJson(response){
    return response.json()
}


let isAddingProject = false
$.addProjectButton.addEventListener('click', () => {
    isAddingProject = !isAddingProject
    if (isAddingProject) {
        $.addProjectForm.style.display = 'block'
        $.newProjectSubmit.addEventListener('click', addProject)
        $.notice.innerText = "CHOOSE A SONG TO GET RECORDING"
        
    } else {
        $.addProjectForm.style.display = 'none'
    }
})

// let projectLoaded = false
// $.
renderProjects(artistId)
function renderProjects(artistId) {
    $.projectList.innerHTML = ""
    fetch(PROJECT_URL)
    .then(parseJson)
    .then(projects => {
      
        projects.forEach( project => {
            if (project.artist_id == artistId){
                let eachProject = document.createElement('li')
                eachProject.setAttribute('data-id', project.id)
                // let editProjectButton = document.createElement('button')
                // editProjectButton.innerText = 'Edit Project Details'
                // let deleteProjectButton = document.createElement('button')
                // deleteProjectButton.innerText = "Remove Project"
                eachProject.innerText = project.project_name
                // eachProject.append(editProjectButton, deleteProjectButton)
                $.projectList.appendChild(eachProject)
                eachProject.addEventListener('click', () => {
                    projectId = eachProject.dataset.id, 
                    renderProjectCard(projectId), 
                    renderSongs(event, projectId),
                    $.pageContainer.setAttribute('id', 'page-container'),
                    $.addProjectForm.style.display = 'none'
                    
                    // console.log('works', projectId)
                })
            }
        })
    })
}

function renderProjectCard(projectId){
    fetch(`${PROJECT_URL}${projectId}`)
    .then(parseJson)
    .then(project => {
        $.projectName.innerText = project.project_name
        $.projectNotes.innerText = project.project_notes
        $.projectNameMenu.innerText = project.project_name
        $.notice.innerText = "SELECT A SONG AND GET RECORDING"
        // $.songCard.style.display = 'none'
    })
}

function renderSongs(event, projectId){
    event.preventDefault()
    fetch(SONG_URL)
    .then(parseJson)
    .then(songs => {
        
        $.projectSongList.innerHTML = ""
        songs.forEach(song => {
            if (song.project_id == projectId) {
                let eachSong = document.createElement('li')
                eachSong.setAttribute('data-id', song.id)
                eachSong.setAttribute('data-project', song.project_id)
                // eachSong.setAttribute("id", "songListTwo")
                
                eachSong.innerText = song.song_name
                $.projectSongList.append(eachSong)
                
                console.log(eachSong)
                eachSong.addEventListener('click', () => {
                    songId = eachSong.dataset.id, 
                    console.log(songId)
            
                    // let deleteId = document.querySelector('#songlistTwo')
                    $.deleteSongButton.dataset.songId = songId,
                    $.deleteSongButton.dataset.songProject = projectId,
                    renderSongCard(songId), 
                    renderParts(event, songId), 
                    $.notice.remove()
                    
                })
            }
        })
        $.songInputButton.addEventListener('click', addSong)
    })
}

function renderSongCard(songId) {
    event.preventDefault()
    fetch(`${SONG_URL}${songId}`)
    .then(parseJson)
    .then(info => {
        // console.log(info)
        $.songName.innerText = info.song_name
        $.songNote.innerText = info.song_note
        $.partInputButton.addEventListener('click', addPart)
    })
}

$.deleteSongButton.addEventListener('click', () => {
    songId = $.deleteSongButton.dataset.songId,
    projectId = $.deleteSongButton.dataset.songProject,
    console.log(projectId),
    deleteSong(event, songId, projectId),
    console.log(projectId),
    setTimeout(renderSongs(event, projectId), 500)

})

function renderParts(event, songId) {
    event.preventDefault()
    $.partList.innerHTML = ""
    fetch(PART_URL)
    .then(parseJson)
    .then(parts => {
        // console.log(parts)
        parts.forEach( part => {
            if (part.song_id == songId) {
                let eachPart = document.createElement('li')
                let editPartButton = document.createElement('button')
                editPartButton.innerText = "edit"
                editPartButton.setAttribute("class", "small-button")
                let deletePartButton = document.createElement('button')
                deletePartButton.innerText = "finished"
                deletePartButton.setAttribute("class", "small-button")
                let partName = part.part_name
                let partNote = part.part_note
                eachPart.innerText = `${partName}: ${partNote}`
                eachPart.append(editPartButton, deletePartButton)
                deletePartButton.addEventListener('click', ()=> deletePart(event, part, eachPart))
                $.partList.append(eachPart)
            } 
        })        
    })
}

function addPart(event) {
    event.preventDefault()
    $.partList.innerHTML = ""
    partName = $.partNameInput.value
    partNote = $.partNoteInput.value
    // $.partList.innerHTML = ""
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
    .then(result => {
        partName = result.part_name
        partNote = result.part_note
        renderParts(event, songId)
    })
    $.newPartForm.reset()
}

function addSong(event) {
    event.preventDefault()
    songName = $.songNameInput.value
    songNote = $.songNoteInput.value
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
    .then(result => {
        songName = result.song_name
        songNote = result.song_note
        renderSongs(event, projectId)
    })
    $.newSongForm.reset()
}
function addProject(event) {
    event.preventDefault()
    projectName = $.newProjectInput.value
    projectNote= $.newProjectNote.value
    fetch(PROJECT_URL, {
        "method":"POST",
        "headers": {
            "Content-Type": "application/json",
            "Accept":"application/json"
        },
        "body": JSON.stringify({
            "artist_id": artistId,
            "project_name": $.newProjectInput.value,
            "project_notes": $.newProjectNote.value
        })
    })
    .then(parseJson)
    .then(result => {
        ArtistId = 1
        projectName = result.project_name
        projectNote = result.project_notes
        renderProjects(ArtistId)

    })
    $.newProjectForm.reset()
}

function deletePart(event, part, eachPart){
    fetch(`${PART_URL}${part.id}`, {
        "method":"DELETE"
    })
    // eachPart.remove()
    eachPart.style.cssText= "color: red; text-decoration: line-through"
}

function deleteSong(event, song, project) {
    console.log(project)
    fetch(`${SONG_URL}${song}`, {
        "method":"DELETE"
    })
    $.songName.innerText = ""
    $.songNote.innerText = ""
    $.songList.innerText = ""
    $.partList.innerHTML = ""
    // setTimeout(renderSongs(event, project), 10)

}
