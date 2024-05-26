<?php
// get_videos.php

$videoDir = '../images/';
$videos = [];

if (is_dir($videoDir)) {
    if ($dh = opendir($videoDir)) {
        while (($file = readdir($dh)) !== false) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'mp4') {
                $videos[] = $videoDir . $file . '|' . pathinfo($file, PATHINFO_FILENAME);
            }
        }
        closedir($dh);
    }
}

// Echo the video details as plain text without specifying Content-Type
echo implode("\n", $videos);
?>