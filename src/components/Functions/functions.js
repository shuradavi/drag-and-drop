import { requirements } from "../Params/Params";
import { getFilesList } from "../API/get";
const { v4: uuidv4 } = require('uuid');

export const fileNameWithoutFormat = (name) => {
	// console.log('FILE NAME: ', file.item.name.substring(0, file.item.name.lastIndexOf('.')));
	return name.substring(0, name.lastIndexOf('.'))
};

export const validationByFormat = (file) => {		// проверка формата файла
	try {
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

export const setTheStatusOfFiles = (files) => {
	try {
		return files.map(f => {
			const fileID = uuidv4();
			let file = new Object();
			file.item = f;
			file.id = fileID;
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

const calcTheDifferenceAndSort = (validFiles, space) => {
	let difference = validFiles.length - space;
	for (let i = 0; i < difference; i++) {
		validFiles[i].status = 'TOO_MANY_FILES'
	}
	return validFiles;
}

export const fileUploadScript = (files, availableSpace) => {
	console.log('start:', files);
	let validFiles = getValidFiles(files);
	let invalidFiles = getInvalidFiles(files);
	if (!isTheNumberOfFilesAllowed(files)) {
		files.map(file => {
			file.status = 'TOO_MANY_FILES'
			return file
		})
		console.log('событие 1');
		return {
			forUpload: [],
			forUnusable: files,
		} 
	} else if (availableSpace <= 0) {
		validFiles = validFiles.map(file => {
			file.status = 'TOO_MANY_FILES'
			return file
		})
		console.log('событие 2');
		return {
			forUpload: [],
			forUnusable: files,
		} 
	}
	else if (!validFiles.length) {
		console.log('событие 3');
		return {
			forUpload: [],
			forUnusable: files,
		}
	}
	else if (validFiles.length > availableSpace) {
		let arr = calcTheDifferenceAndSort(validFiles, availableSpace)
		invalidFiles = [...invalidFiles,...arr.filter(f => f.status !== 'FILE_STATUS_OK')]
		validFiles = arr.filter(f => f.status === 'FILE_STATUS_OK')
		console.log('событие 4');
		return {
			forUpload: validFiles,
			forUnusable: invalidFiles,
		} 
	} else {
		console.log('событие 5');
		return {
			forUpload: validFiles,
			forUnusable: invalidFiles,
		}
	}
}