<?php
// upload_video.php

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['video'])) {
    $video = $_FILES['video'];
    $uploadDir = '../images/';
    $originalFileName = pathinfo($video['name'], PATHINFO_FILENAME);
    $extension = pathinfo($video['name'], PATHINFO_EXTENSION);
    $uploadFile = $uploadDir . basename($video['name']);

    $index = 1;
    while (file_exists($uploadFile)) {
        $newFileName = $originalFileName . "($index)." . $extension;
        $uploadFile = $uploadDir . $newFileName;
        $index++;
    }

    if (move_uploaded_file($video['tmp_name'], $uploadFile)) {
        echo json_encode([
            'success' => true,
            'videoUrl' => 'images/' . basename($uploadFile),
            'videoTitle' => pathinfo($uploadFile, PATHINFO_FILENAME)
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Upload failed']);
    }
}
?>