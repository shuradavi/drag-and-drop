import axios from "axios";

export const uploadFiles = async (files, url) => {
	const promise = files.map(file => {
		const formData = new FormData();
		formData.append('file', file.item)
		axios.post(url+'save', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			}
		})
	})
	await Promise.all(promise).then(console.log('Загрузка файлов завершена: '))
}