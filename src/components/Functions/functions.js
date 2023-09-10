import { uploadFiles } from "../API/post";
import { requirements } from "../Params/Params";
const { v4: uuidv4 } = require('uuid');

export const fileNameWithoutFormat = (file) => {
	// console.log('FILE NAME: ', file.item.name.substring(0, file.item.name.lastIndexOf('.')));
	return file.item.name.substring(0, file.item.name.lastIndexOf('.'))
};

export const validationByFormat = (file) => {		// проверка формата файла
	try {
		console.log('Проверка формата файла');
		return (requirements.format.includes(file.name.substring(file.name.lastIndexOf('.'))))
	} catch (error) {
		console.warn(error);
	}
};

export const fileNameLengthValidation = (file) => {		// проверка длины названия файла
	return (file.name.substring(0, file.name.lastIndexOf('.')).length <= requirements.maxNameLength)
};

export const fileSizeValidation = (file) => {		// Проверка размера файла
	return (file.size <= requirements.maxSize)
};

export const fileValidation = (file) => {		// валидация файла
	if (!validationByFormat(file)) return 'FILE_FORMAT_INVALID';
	else if (!fileNameLengthValidation(file)) return 'FILE_NAME_TOO_LONG';
	else if (!fileSizeValidation(file)) return 'FILE_SIZE_TOO_LARGE';
	else return 'FILE_STATUS_OK'
};


// НЕВЕДОМАЯ ХУЙНЯ ВОЗВРАЩАЕТ МАССИВ ОБЪЕКТОВ, МУТИРУЕТ item???

export const setTheStatusOfFiles = (files) => {
	try {
		return files.map(item => {
			const fileID = uuidv4();
			let file = new Object();
			// console.log('FILE 39str: ', file);
			file.item = item;
			file.id = fileID;
			// console.log('FILE: ', file);
			file.status = fileValidation(file.item);
			return file
		})
	} catch (error) {
		console.log(error);
	}
};

export const getValidFiles = (files) => {
	return files.filter(file => file.status === 'FILE_STATUS_OK')
};

export const getInvalidFiles = (files) => {
	return files.filter(file => file.status !== 'FILE_STATUS_OK')
}

export const isTheNumberOfFilesAllowed = (files) => {		// Количество переданных файлов допустимо?
	return (files.length <= requirements.filesNumbers)
}

// export const fileUploadScript = (files, filesFromServer) => {
// 	files = setTheStatusOfFiles(files);
// 	let validFiles = getValidFiles(files);
// 	let invalidFiles = getInvalidFiles(files);
// 	let availableSpace = requirements.filesAmount - filesFromServer.length;


// 	if (!isTheNumberOfFilesAllowed(files)) {
// 		files.map(file => {
// 			file.status = 'TOO_MANY_FILES'
// 			return file
// 		})
// 		setUnusableFiles(files)
// 	} else if (availableSpace <= 0) {
// 		validFiles = validFiles.map(file => {
// 			file.status = 'TOO_MANY_FILES'
// 			return file
// 		})
// 		setUnusableFiles(files)
// 	} else {
// 		uploadFiles(validFiles)
// 		setUnusableFiles(invalidFiles)
// 		}
// }
