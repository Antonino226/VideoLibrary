document.addEventListener('DOMContentLoaded', () => {
    const mainVideo = document.getElementById('main-video');
    const mainVidTitle = document.getElementById('main-vid-title');
    const videoListContainer = document.getElementById('video-list-container');
    const dropArea = document.getElementById('drop-area');
    const fileElem = document.getElementById('fileElem');
    const fileSelect = document.getElementById('fileSelect');

    let videos = [];
    let currentVideoIndex = 0;

    // Funzione per creare e aggiungere un video alla lista
    function addVideoToList(src, title) {
        const videoItem = document.createElement('div');
        videoItem.classList.add('list');
        videoItem.setAttribute('data-video', src);
        videoItem.setAttribute('data-title', title);

        const listVideo = document.createElement('video');
        listVideo.src = src;
        listVideo.classList.add('list-video');

        const listTitle = document.createElement('h3');
        listTitle.classList.add('list-title');
        listTitle.textContent = title;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Elimina';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const videoItem = e.target.closest('.list');
            const videoUrl = videoItem.getAttribute('data-video');

            // Invia la richiesta AJAX per eliminare il video dal server
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'php/delete_video.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        if (xhr.responseText === 'success') {
                            console.log('Video eliminato con successo.');
                            refreshVideoList();
                        } else {
                            alert('Errore durante l\'eliminazione del video: ' + xhr.responseText);
                        }
                    } else {
                        alert('Errore durante la richiesta AJAX: ' + xhr.status);
                    }
                }
            };
            xhr.send('videoUrl=' + encodeURIComponent(videoUrl));
        });

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Modifica Titolo';
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const newTitle = prompt('Inserisci il nuovo titolo del video:', title);
            if (newTitle) {
                listTitle.textContent = newTitle;
                videoItem.setAttribute('data-title', newTitle);
                if (mainVideo.src === src) {
                    mainVidTitle.textContent = newTitle;
                }

                // Invia la richiesta AJAX per aggiornare il titolo sul server
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'php/update_video.php', true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            console.log('Titolo aggiornato con successo.');
                            refreshVideoList();
                        } else {
                            alert('Errore durante l\'aggiornamento del titolo: ' + xhr.status);
                        }
                    }
                };
                xhr.send('videoUrl=' + encodeURIComponent(src) + '&newTitle=' + encodeURIComponent(newTitle));
            }
        });

        videoItem.appendChild(listVideo);
        videoItem.appendChild(listTitle);
        videoItem.appendChild(editButton);
        videoItem.appendChild(deleteButton);
        videoListContainer.appendChild(videoItem);

        videoItem.addEventListener('click', () => {
            document.querySelectorAll('.list').forEach(vid => vid.classList.remove('active'));
            videoItem.classList.add('active');
            mainVideo.src = src;
            mainVidTitle.textContent = title;
            mainVideo.play();
            currentVideoIndex = videos.findIndex(video => video.src === src);
        });
    }

    // Funzione per aggiornare la lista dei video
    function refreshVideoList() {
        // Pulire la lista corrente
        videoListContainer.innerHTML = '';

        // Chiamata AJAX per ottenere i video
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'php/get_videos.php', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const responseText = xhr.responseText;
                    const videoEntries = responseText.trim().split("\n");
                    videos = videoEntries.map(entry => {
                        const [src, title] = entry.split('|');
                        const relativeSrc = src.replace('../images/', 'images/');
                        return { src: relativeSrc, title };
                    });
                    videos.forEach((video, index) => {
                        addVideoToList(video.src, video.title);
                        if (index === 0) {
                            const firstItem = videoListContainer.querySelector('.list');
                            firstItem.classList.add('active');
                            mainVideo.src = video.src;
                            mainVidTitle.textContent = video.title;
                        }
                    });
                } else {
                    alert('Errore durante la richiesta AJAX: ' + xhr.status);
                }
            }
        };
        xhr.send();
    }

    // Inizializza la lista dei video
    refreshVideoList();

    // Gestione della selezione dei file
    fileSelect.addEventListener('click', (e) => {
        if (fileElem) {
            fileElem.click();
        }
    });

    fileElem.addEventListener('change', handleFiles, false);

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('hover');
    });

    dropArea.addEventListener('dragleave', (e) => {
        dropArea.classList.remove('hover');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('hover');
        const files = e.dataTransfer.files;
        handleFiles({ target: { files } });
    });

    function handleFiles(e) {
        const files = e.target.files;
        for (const file of files) {
            if (file.type.startsWith('video/')) {
                const formData = new FormData();
                formData.append('video', file);

                // Invia il video al server
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'php/upload_video.php', true);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const response = JSON.parse(xhr.responseText);
                            if (response.success) {
                                videos.push({
                                    src: response.videoUrl,
                                    title: response.videoTitle
                                });
                                refreshVideoList();
                            } else {
                                alert('Errore nel caricamento del video: ' + response.message);
                            }
                        } else {
                            alert('Errore durante la richiesta AJAX: ' + xhr.status);
                        }
                    }
                };
                xhr.send(formData);
            }
        }
    }

    // Play next video on ended event
    mainVideo.addEventListener('ended', () => {
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        const nextVideo = videos[currentVideoIndex];
        mainVideo.src = nextVideo.src;
        mainVidTitle.textContent = nextVideo.title;
        mainVideo.play();

        // Update active class on video list item
        const activeItem = videoListContainer.querySelector('.active');
        activeItem.classList.remove('active');
        const nextListItem = videoListContainer.children[currentVideoIndex];
        nextListItem.classList.add('active');
    });

    // Gestione errori del video
    mainVideo.addEventListener('error', () => {
        console.error('Errore durante la riproduzione del video');
    });
});
