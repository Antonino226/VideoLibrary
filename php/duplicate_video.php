<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['videoUrl'])) {
        $originalFilePath = '../' . $data['videoUrl'];
        $uploadDir = '../images/';
        
        if (file_exists($originalFilePath)) {
            $videoCount = count(glob($uploadDir . 'vid-*.mp4')) + 1;
            $newFilePath = $uploadDir . 'vid-' . $videoCount . '.mp4';

            if (copy($originalFilePath, $newFilePath)) {
                echo json_encode([
                    'success' => true,
                    'videoUrl' => $newFilePath,
                    'videoTitle' => 'Animazione ' . $videoCount
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Errore nel duplicare il video']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Video originale non trovato']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'URL del video non fornito']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Richiesta non valida']);
}
?>