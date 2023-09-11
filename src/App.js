import React, { useEffect, useState } from 'react';
import { uploadFiles } from './components/API/post';
import { getFilesList } from './components/API/get';
import { requirements } from './components/Params/Params';
import './App.css';
import {getInvalidFiles, getValidFiles, isTheNumberOfFilesAllowed, setTheStatusOfFiles } from './components/Functions/functions';
import DisplayFiles from './components/DisplayFiles/DisplayFiles';


function App() {
	const [drag, setDrag] = useState(false)
	const [unusableFiles, setUnusableFiles] = useState([])
	const [filesFromServer, setFilesFromServev] = useState([])

	useEffect(() => {
		getFilesList(setFilesFromServev);
	}, [])
	const dragStartHandler = (e) => {
		e.preventDefault()
		setDrag(true)
	}
	const dragLeaveHandler = (e) => {
		e.preventDefault()
		setDrag(false)
	}
	const fileUploadScript = (files, filesFromServer) => {
		let validFiles = getValidFiles(files);
		let invalidFiles = getInvalidFiles(files);
		let availableSpace = requirements.filesNumbers - filesFromServer.length;
		if (!isTheNumberOfFilesAllowed(files)) {
			try {
				files.map(file => {
					file.status = 'TOO_MANY_FILES'
					return file
				})
				setUnusableFiles(files)
			} catch (error) {
				console.log(error);
			}
		} else if (availableSpace <= 0) {
			try {
				validFiles = validFiles.map(file => {
					file.status = 'TOO_MANY_FILES'
					return file
				})
				setUnusableFiles(files)
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				console.log('отработало последнее событие');
				console.log('валидные файла в загрузку: ', validFiles);
				uploadFiles(validFiles)
				getFilesList(setFilesFromServev)
				setUnusableFiles(invalidFiles)
			} catch (error) {
				console.log(error);
			}
			}
	}
	
	// const postRequest = async (files, validFiles) => {		// загружаем файлы на сервер, после загрузки обновляем статус файлов
	// 	await Promise.all(validFiles.map((file) => {
	// 		const formData = new FormData();
	// 		console.log(file);
	// 		formData.append('file', file)
	// 		axios.post(hostUrl + 'save', formData, {
	// 			headers: {
	// 				"Content-Type": "multipart/form-data",
	// 			}
	// 		})
	// 			.then(() => {
	// 				setFilesFromServev(prev => prev.map(item => {
	// 					if (item.id === file.id) {
	// 						item.status = 'FILE_UPLOADED'
	// 						return item
	// 					} else {
	// 						return item
	// 					}
	// 				}))
	// 			}
	// 			)
	// 	})).then(console.log('Загрузка файлов завершена: ', validFiles.map(file => file.name)), setDropZoneValue([...files]), getFilesList())
	// }

	// useEffect(() => {
	// 	getFilesList()
	// }, [])

	

	// const deleteFile = async (id) => {
	// 	await axios.get(`${hostUrl}delete/${id}`)
	// 	getFilesList()
	// }

	// const downloadFile = async (file) => {
	// 	let response = await axios.get(`${hostUrl}download/${file.id}`)
	// 	if (response.status === 204) {
	// 		console.log(response);
	// 		setTimeout(() => {
	// 			console.log('ID: ', file.id);
	// 			downloadFile(file)
	// 		}, 100);
			
	// 	} else if (response.status === 200) {
	// 		console.log('status 200', response);
	// 		console.log('На входе в конструктор new Blob: ', response);
	// 		const type = response.headers["content-type"];
    //       	let blob = new Blob([response], {type: type});
	// 		let link = document.createElement('a')
	// 		link.href = URL.createObjectURL(blob)
	// 		link.download = file.filename
	// 		console.log('LINK: ', link);
	// 		link.click()
	// 	}
	// }

	const onDropHandler = async (e) => {
		e.preventDefault()
		let files = [...e.dataTransfer.files];
		files = setTheStatusOfFiles(files);
		fileUploadScript(files, filesFromServer)
		setDrag(false)
		}

	return (
	  <div className="App">
		  {drag
			  ? <div
					className='zone-wrapper'
					onDragStart={e => dragStartHandler(e) }
					onDragLeave={e => dragLeaveHandler(e) }
				 	onDragOver={e => dragStartHandler(e)}
				  	onDrop={e => onDropHandler(e)}>
				  		Отпустите файл для их загрузки
			  	</div>
			  : <div
					className='zone-wrapper'
					onDragStart={e => dragStartHandler(e) }
					onDragLeave={e => dragLeaveHandler(e) }
				  	onDragOver={e => dragStartHandler(e)}>
						Перенесите файлы для их загрузки
			  	</div>
			}
			<DisplayFiles state={filesFromServer} setState={setFilesFromServev} />
			<DisplayFiles state={unusableFiles} /> 
			<ol className='item-name-wrapper'>
				Не будут загружены

			</ol>
    </div>
  );
}

export default App;
