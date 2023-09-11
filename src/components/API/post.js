import axios from "axios";
import { hostUrl } from "../Params/Params";

export const uploadFiles = async (files) => {
	const promise = files.map(file => {
		const formData = new FormData();
		formData.append('file', file.item)
		axios.post(hostUrl.upload, formData)
	})
	await Promise.all(promise).then(console.log('Загрузка файлов завершена: ', files))
}