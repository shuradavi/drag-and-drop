import axios from "axios";
import { hostUrl } from "../Params/Params";

export const getFilesList = async (setFilesFromServev) => {
		const response = await axios.get(hostUrl.list)
		console.log('file list: ', response.data);
		
		setFilesFromServev(response.data)
}
	
export const downloadFile = async (file) => {
	let response = await axios({
		url: `${hostUrl.download}${file.id}`,
		method: 'GET',
		responseType: 'blob',
	})
	if (response.status === 204) {
		console.log('ЗАПРОС');
		setTimeout(() => {
			downloadFile(file)
		}, 100);
		
	} else if (response.status === 200) {
		let data = await response.data
		const href = URL.createObjectURL(data);
		let link = document.createElement('a');
		link.href = href;
		link.setAttribute('download', file.filename);
		document.body.appendChild(link);
		link.click();

		// clean up "a" element & remove ObjectURL
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	}
}

export const deleteFile = async (id, setState) => {
	await axios.get(`${hostUrl.delete}${id}`)
	getFilesList(setState)
}