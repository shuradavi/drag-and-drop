import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import requirements from './components/Params/Params';
import { fileValidate, isUploaded, isValid, isNotLoad, FILE_STATUS_MAPPER, maxNumberOfFiles, clearIsNotLoaded, chageStatusTooMany } from './components/utils/utils'
const { v4: uuidv4 } = require('uuid');

const hostUrl = 'http://localhost:4003/files/'


function App() {
	const [drag, setDrag] = useState(false)
	const [dropZoneValue, setDropZoneValue] = useState([])
	const [filesFromServer, setFilesFromServev] = useState([])
	const dragStartHandler = (e) => {
		e.preventDefault()
		setDrag(true)
	}
	const dragLeaveHandler = (e) => {
		e.preventDefault()
		setDrag(false)
	}
	const postRequest = async (files, validFiles) => {		// загружаем файлы на сервер, после загрузки обновляем статус файлов
		await Promise.all(validFiles.map((file) => {
			const formData = new FormData();
			formData.append('file', file)
			axios.post(hostUrl + 'save', formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				}
			})
				.then(() => {
					setFilesFromServev(prev => prev.map(item => {
						if (item.id === file.id) {
							item.status = 'FILE_UPLOADED'
							return item
						} else {
							return item
						}
					}))
				}
				)
		})).then(console.log('Загрузка файлов завершена: ', validFiles.map(file => file.name)), setDropZoneValue([...files]), getFilesList())
	}

	useEffect(() => {
		getFilesList()
	}, [])

	const getFilesList = async () => {
		const response = await axios.get(hostUrl + 'list')
		console.log('file list: ', response.data);
		setFilesFromServev(response.data)
	}

	const deleteFile = async (id) => {
		await axios.get(`${hostUrl}delete/${id}`)
		getFilesList()
	}

	const downloadFile = async (id) => {
		let response = await axios.get(`${hostUrl}download/${id}`)
		if (response.status === 204) {
			console.log(response);
			setTimeout(() => {
				console.log('ID: ', id);
				downloadFile(id)
			}, 100);
			
		} else if (response.status === 200) {
			console.log('status 200', response);
			let result = await response.data
			const type = response.headers["content-type"];
          	let blob = new Blob([result.data], {type: type});
			let link = document.createElement('a')
			link.href = window.URL.createObjectURL(blob)
			link.download = 'New File'
			link.click()
			console.log('result: ', result, 'blob: ', blob, 'link: ', link);
		}
	}

	const onDropHandler = async (e) => {
		e.preventDefault()
		dropZoneValue && setDropZoneValue(prev => clearIsNotLoaded(prev))		// очищаем dropZoneValue от предыдущих добавленных файлов, неподлежащих загрузке
		let validFiles = null;		// создаем переменную для хранения валидный файлов
		let invalidFiles = null;		// создаем переменную для хранения невалидных файлов
		let files = [...e.dataTransfer.files]		// создаём переменную для хранения полученных файлов
		for (let i = 0; i < files.length; i++) {		// проводим валидацию, присваиваем файлам статус, для валидных файлов добавляем соответствующую пометку, и уникальный ID
			const fileID = uuidv4();
			let file = files[i];
			file.status = fileValidate(file);
			file.isValid = isValid(file);		// булевое значение валидности файла (будет использовано для реализации догрузки файлов)
			file.id = fileID;
		}
		invalidFiles = files.filter(file => !isValid(file)) // файлы непрошедшие валидацию
		validFiles = files.filter(file => isValid(file))  // файлы прошедшие валидацию
		
		if (!!filesFromServer.length && maxNumberOfFiles(filesFromServer.length + validFiles.length)) {		//  условие: 1) непустое состояние ДЗ; 2) сумма кол-ва загруженных файлов и валидных файлов не превышает допустимое значение 
			postRequest(files, validFiles);
			console.log('Отработало первое условие');
		} else if (!!filesFromServer.length) {		//		условие: непустое состояние ДЗ
				let availableSpace = requirements.filesAmount - filesFromServer.length;		//  вычисляем свободное пространство на сервере
			if (availableSpace > 0) {		// отработает при наличии свободного простраснства на сервере
					chageStatusTooMany(validFiles.slice(availableSpace-1 ))		// изменения статуса у валидных файлов, которым не хватаает свободного пространства
					validFiles = validFiles.slice(0, availableSpace)		// валидные файлы, которые будут загружены на сервер
					postRequest(files, validFiles);	
					console.log('Отработало второе условие');

				} else {		// отработает при отсутствии свободного проостранства
					const allFiles = chageStatusTooMany(validFiles).concat(invalidFiles);
					setDropZoneValue(prev => [...prev, ...allFiles])
					console.log('отработало третье условие');
				}
		} else if (maxNumberOfFiles(files)) {		// условие: 1) пустое состояние ДЗ; 2) кол-во принятых файлов не превышает допустимое значение
			postRequest(files, validFiles);
			console.log('отработало четвертое условие');
		} else {		// условие: кол-во принятых файлов превышает допустимое значение
			const allFiles = chageStatusTooMany(validFiles).concat(invalidFiles);		// изменим статус валидных файлов на соответствующий. Обновим состояние без загрузки файлов на сервер.
			setDropZoneValue(prev => [...prev, ...allFiles])
			console.log('отработало пятое условие');
		}
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
			{!!filesFromServer.length && 
				<ol
					className='item-name-wrapper'
					style={{color: 'yellow'}}>
					Загруженные файлы
					{filesFromServer.map((file) => 
						<li style={{ color: '#9DFF5A', textAlign: 'start'}}
							key={file.id}>
								{file.filename}
								<button
									className='del-btn'
									onClick={() => deleteFile(file.id)}>
										delete
								</button>
								<button
									className='del-btn'
									onClick={() => downloadFile(file.id)}>
										Download
								</button>
						</li>)}
						
				</ol>}
			{!!dropZoneValue.length &&		// выводим список невалидных файлов
				<ol className='item-name-wrapper'>
					{!maxNumberOfFiles(isNotLoad(dropZoneValue).length) &&
						<div style={{ color: 'yellow' }}>
							{`Ожидаемое количество файлов: ${requirements.filesAmount}`}
						</div>}
					{isNotLoad(dropZoneValue).map((file) =>
						<li style={{color: 'yellow', textAlign: 'start' }}
								key={file.id}>
					  		{file.name.substring(0, file.name.lastIndexOf('.'))}
					  		<div>{FILE_STATUS_MAPPER[file.status]}</div>
				  		</li>
				 	)}
				</ol>	
			}
    </div>
  );
}

export default App;
