import requirements from "../Params/Params"

export const FILE_STATUS_MAPPER = {
	FILE_NAME_TOO_LONG: 'Некорректная длина названия файла',
	FILE_SIZE_TOO_LARGE: 'Некорректный размер файла',
	FILE_FORMAT_INVALID: 'Некорректный формат файла',
	TOO_MANY_FILES: 'Превышено количество файлов!',
	FILE_STATUS_OK: 'Файл загружается',
	FILE_UPLOADED: 'Файл успешно загружен',
}
// Проверка на соответствие формата файла
export const fileNameValidate = (file) => {
	return (requirements.format.includes(file.name.substring(file.name.lastIndexOf('.'))))

}

// Проверка на соответствие длины файла
export const fileNameLengthValidate = (file) => {
	return (file.name.substring(0, file.name.lastIndexOf('.')).length <= requirements.maxNameLength)
}

// Проверка на соответствие размера файла
export const fileSizeValidate = (file) => {
	return (file.size <= requirements.maxSize)
	
}

// Ограничение максимально допустимого количества файлов
export const maxNumberOfFiles = (files) => {
	return (files.length <= requirements.filesAmount)
}

// Общая валидация файла
export const fileValidate = (file, files) => {
	if (!fileNameValidate(file)) return 'FILE_FORMAT_INVALID';
	else if (!fileNameLengthValidate(file)) return 'FILE_NAME_TOO_LONG';
	else if (!fileSizeValidate(file)) return 'FILE_SIZE_TOO_LARGE';
	else return 'FILE_STATUS_OK'
};

// П
