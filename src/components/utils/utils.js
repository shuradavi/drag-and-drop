// import requirements from "../Params/Params"


// export const checkDownloadFileStatus = (response) => {
// 	if (response.status === 204) {
// 		return 204
// 	} else if (response.status === 200)
// 		return 200;
// }

// export const isValid = (file) => {		// прооверка на валидацию	
// 	return (file.status === 'FILE_STATUS_OK')
// }


// export const isNotLoad = (files) => {		// получение списка файлов, неподлежащих загрузке
// 	return files.filter(file => (file.status !== 'FILE_STATUS_OK') && (file.status !== 'FILE_UPLOADED'))
// }

// export const clearIsNotLoaded = (state) => {		// очистка списка неподлежащих загрузке файлов
// 		return state.filter(file => (file.status === 'FILE_STATUS_OK') || (file.status === 'FILE_UPLOADED'))
// }
// export const isUploaded = (file) => {		// проверка статуса завершенной загрузки
// 	return (file.status === 'FILE_UPLOADED')
// }

// export const chageStatusTooMany = (files) => {		// изменить статус файлов на TOO_MANY_FILES
// 	return files.map(file => {
// 		file.status = 'TOO_MANY_FILES'
// 		return file
// 	})
// }








