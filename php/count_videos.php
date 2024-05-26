<?php
$dir = '../images/';
$files = array_filter(scandir($dir), function($file) use ($dir) {
    return is_file($dir . $file) && preg_match('/^vid-\d+\.mp4$/', $file);
});
echo count($files);
?>