// 所有支持的文件类型及其 MIME 类型
const allFileTypes = {
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".pdf": "application/pdf",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".txt": "text/plain",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".bmp": "image/bmp",

  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".wav": "audio/wav",
  ".flv": "video/x-flv", // not supported by all browsers
  ".swf": "application/x-shockwave-flash",
  ".zip": "application/zip",
  ".rar": "application/x-rar-compressed", // not supported by all browsers
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  ".bz2": "application/x-bzip2", // not supported by all browsers
  ".7z": "application/x-7z-compressed", // not supported by all browsers

  ".json": "application/json", 
  ".xml": "application/xml",
  ".csv": "text/csv",
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".md": "text/markdown", // not supported by all browsers
  ".yaml": "text/yaml", // not supported by all browsers
  ".yml": "text/yaml", // not supported by all browsers
  ".java": "text/x-java-source", // not supported by all browsers
  ".c": "text/x-c", // not supported by all browsers
  ".cpp": "text/x-c++src", // not supported by all browsers
  ".h": "text/x-chdr", // not supported by all browsers
  ".sh": "text/x-shellscript", // not supported by all browsers

  ".php": "text/x-php", // not supported by all browsers
  ".sql": "text/x-sql", // not supported by all browsers
  ".log": "text/plain", // not supported by all browsers
  ".ini": "text/plain", // not supported by all browsers
  ".bat": "text/plain", // not supported by all browsers
  ".ps1": "text/plain", // not supported by all browsers
  ".psm1": "text/plain", // not supported by all browsers
  ".psd1": "text/plain", // not supported by all browsers
  ".ps1xml": "text/plain", // not supported by all browsers
  ".psc1": "text/plain", // not supported by all browsers
  ".mof": "text/plain", // not supported by all browsers
}

// 获取文件类型的 MIME 类型
export const getFileTypeMime = (extension: string): string | undefined => {
  return (allFileTypes as { [key: string]: string })[`.${extension}`]
};


// 检查文件类型是否支持
export const isFileTypeSupported = (extension: string): boolean => {
  return extension in allFileTypes;
};

/**
 * @author jiangtao
 * @date 2024-07-29
 * @description 判断是否是支持的文件类型
 * @param fileMimeType 文件 MIME 类型 -------- application/msword
 * @param allowTypes 允许的文件类型数组 ['doc', 'docx', ... ]
 * @returns 
 */
export const isFileMimeTypeSupported = (fileMimeType: string, allowTypes: Array<string>): boolean => {
  console.log('isFileMimeTypeSupported', fileMimeType);
  // 遍历 allowTypes 数组，判断文件类型是否在 allowTypes 数组中
  return allowTypes.every(item => getFileTypeMime(`.${item}`) === fileMimeType);
}

export default { getFileTypeMime, isFileTypeSupported, isFileMimeTypeSupported };