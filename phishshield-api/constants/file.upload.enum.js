module.exports = {
    PHOTO_MAX_SIZE: 1024 * 1024 * 1024, // 1GB
    DOCS_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    VIDEO_MAX_SIZE: 15 * 1024 * 1024, // 15MB
    AUDIO_MAX_SIZE: 15 * 1024 * 1024, // 15MB

    PHOTOS_MIMETYPES: [
        'image/gif',
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/tiff',
        'image/webp'
    ],

    AUDIO_MIMETYPES: [
        'audio/wav', // WAV
        'audio/x-wav', // WAV
        'audio/flac', // FLAC
        'audio/mpeg', // MP3
        'audio/mp4' // M4A
    ],

    DOCS_MIMETYPES: [
        'application/msword', // DOC
        'application/pdf', // PDF
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLS
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOC 2007,
        'text/plain', // txt,
        'application/octet-stream', // text
    ],

    VIDEOS_MIMETYPES: [
        'video/mpeg',
        'video/mp4',
    ]
};
