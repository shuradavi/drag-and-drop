export const requirements = {
	format: ['.pdf', '.docx', '.txt', '.jpg', '.png'],
	maxNameLength: 15,
	maxSize: 130000,
	filesNumbers: 5,
};

export const FILE_STATUS_MAPPER = {
	FILE_NAME_TOO_LONG: 'Некорректная длина названия файла',
	FILE_SIZE_TOO_LARGE: 'Некорректный размер файла',
	FILE_FORMAT_INVALID: 'Некорректный формат файла',
	TOO_MANY_FILES: 'Превышено количество файлов',
	FILE_STATUS_OK: 'Файл загружен',
};

export const hostUrl = {
	upload: 'http://localhost:4003/files/save',
	delete: 'http://localhost:4003/files/delete/',
	download: 'http://localhost:4003/files/download/',
	list: 'http://localhost:4003/files/list',
}
