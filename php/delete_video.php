<?php
// delete_video.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $videoUrl = $_POST['videoUrl'] ?? '';

    if ($videoUrl) {
        $videoPath = '../' . $videoUrl;
        if (file_exists($videoPath)) {
            if (unlink($videoPath)) {
                echo 'success';
            } else {
                echo 'error';
            }
        } else {
            echo 'file not found';
        }
    } else {
        echo 'no video url';
    }
}
?>
