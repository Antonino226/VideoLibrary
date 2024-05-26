<?php
// update_video.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $videoUrl = $_POST['videoUrl'] ?? '';
    $newTitle = $_POST['newTitle'] ?? '';

    if ($videoUrl && $newTitle) {
        $oldFilePath = '../images/' . basename($videoUrl);
        $newFilePath = '../images/' . $newTitle . '.mp4';

        if (file_exists($oldFilePath)) {
            if (rename($oldFilePath, $newFilePath)) {
                echo 'success|' . 'images/' . $newTitle . '.mp4';
            } else {
                echo 'error|Failed to rename file.';
            }
        } else {
            echo 'error|File does not exist.';
        }
    } else {
        echo 'error|Invalid input.';
    }
}
?>