import requirements from "../Params/Params"

export const FILE_STATUS_MAPPER = {
	FILE_NAME_TOO_LONG: 'Некорректная длина названия файла',
	FILE_SIZE_TOO_LARGE: 'Некорректный размер файла',
	FILE_FORMAT_INVALID: 'Некорректный формат файла',
	TOO_MANY_FILES: 'Превышено количество файлов',
	FILE_STATUS_OK: 'Файл загружается',
	FILE_UPLOADED: 'Файл успешно загружен',
}
export const fileNameValidate = (file) => {		// Проверка на соответствие формата файла
	return (requirements.format.includes(file.name.substring(file.name.lastIndexOf('.'))))

}

export const isValid = (file) => {		// прооверка на валидацию	
	return (file.status === 'FILE_STATUS_OK')
}


export const isNotLoad = (files) => {		// получение списка файлов, неподлежащих загрузке
	return files.filter(file => (file.status !== 'FILE_STATUS_OK') && (file.status !== 'FILE_UPLOADED'))
}

export const clearIsNotLoaded = (state) => {		// очистка списка неподлежащих загрузке файлов
		return state.filter(file => (file.status === 'FILE_STATUS_OK') || (file.status === 'FILE_UPLOADED'))
}
export const isUploaded = (file) => {		// проверка статуса завершенной загрузки
	return (file.status === 'FILE_UPLOADED')
}

export const chageStatusTooMany = (files) => {		// изменить статус файлов на TOO_MANY_FILES
	return files.map(file => {
		file.status = 'TOO_MANY_FILES'
		return file
	})
}

export const fileNameLengthValidate = (file) => {		// Проверка на соответствие длины файла
	return (file.name.substring(0, file.name.lastIndexOf('.')).length <= requirements.maxNameLength)
}

export const fileSizeValidate = (file) => {		// Проверка на соответствие размера файла
	return (file.size <= requirements.maxSize)
	
}

export const maxNumberOfFiles = (files) => {		// Ограничение максимально допустимого количества файлов
	return (files.length <= requirements.filesAmount)
}

export const fileValidate = (file, files) => {		// Общая валидация файла
	if (!fileNameValidate(file)) return 'FILE_FORMAT_INVALID';
	else if (!fileNameLengthValidate(file)) return 'FILE_NAME_TOO_LONG';
	else if (!fileSizeValidate(file)) return 'FILE_SIZE_TOO_LARGE';
	else return 'FILE_STATUS_OK'
};
