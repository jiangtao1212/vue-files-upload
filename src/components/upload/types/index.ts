/**
 * @author: jiangtao
 * @date: 2024-08-01
 * @description: 文件上传组件类型
 * @param {Array<string>} fileTypes 允许上传的文件类型，如果为空，表示不限制文件类型；
 *        默认值: ['jpg', 'jpeg', 'bmp', 'webp', 'gif', 'png']
 *        文件类型校验: 点击上传文件夹按钮时深层文件类型校验，拖动文件和文件夹时所有文件类型校验
 * @param {number} maxFileSize 允许上传的文件最大尺寸，单位：字节，默认2M；
 * @param {boolean} showFileUploadBtn 是否显示上传文件按钮，默认显示；
 * @param {boolean} showDirectoryUploadBtn 是否显示上传文件夹按钮，默认显示；
 */
export type FileUploadType = {
  fileTypes?: Array<string>,
  maxFileSize?: number,
  showFileUploadBtn?: boolean,
  showDirectoryUploadBtn?: boolean,
};
