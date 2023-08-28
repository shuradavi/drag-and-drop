import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import requirements from './components/Params/Params';
import { fileValidate, FILE_STATUS_MAPPER, maxNumberOfFiles } from './components/utils/utils'
import { max } from 'ramda';
const { v4: uuidv4 } = require('uuid');

const hostUrl = 'http://localhost:4003/files/save'


function App() {
	const [drag, setDrag] = useState(false)
	const [dropZoneValue, setDropZoneValue] = useState('')
	const [dropZoneRejectedFiles, setDropZoneRejectedFiles] = useState('')

	const dragStartHandler = (e) => {
		e.preventDefault()
		setDrag(true)
	}
	const dragLeaveHandler = (e) => {
		e.preventDefault()
		setDrag(false)
	}


	const onDropHandler = async (e) => {
		e.preventDefault()
		let validFiles = null;  // Создаем переменную для хранения валидный файлов
		let invalidFiles = null; // Создаем переменную для хранения невалидных файлов
		
		let files = [...e.dataTransfer.files] // получаем файлы, помещаем в массив
		
		if (!maxNumberOfFiles(files)) {   // сравниваем кол-во выбранных файлов с максимальным кол-вом файлов, устанавливаем статус для "избыточных фалов"
			validFiles = files.slice(0, 10)
			invalidFiles = files.slice(10)
			for (let i = 0; i < invalidFiles.length; i++) {
				const fileID = uuidv4();
				let file = invalidFiles[i];
				file.status = 'TOO_MANY_FILES';
				file.id = fileID;
			}
		} else validFiles = files;


		
		for (let i = 0; i < validFiles.length; i++) { // проводим валидацию файлов, добавляем соответствующий статус файлу.
			let file = validFiles[i];
			const fileID = uuidv4();
			file.status = fileValidate(file);
			file.id = fileID;
		}

		invalidFiles = files.filter(file => file.status !== 'FILE_STATUS_OK') // файлы непрошедшие валидацию
		validFiles = files.filter(file => file.status === 'FILE_STATUS_OK')  // файлы прошедшие валидацию
		console.log('valid: ', validFiles, 'invalid: ', invalidFiles, 'ALL FILES: ', files);

		if (maxNumberOfFiles([...dropZoneValue, ...validFiles].filter(file => file.status === 'FILE_STATUS_OK'))) { // в случае упешного прохождения проверки суммы загруженных и добавляемых файлов, обновляем состояние
			setDropZoneValue(prev => [...prev, ...files])                                                          
		} else {																									// в противном случае присваиваем добавляемым соответствующий статус	
			for (let i = 0; i < validFiles.length; i++) {
				let file = validFiles[i];
				file.status = 'TOO_MANY_FILES';
			}
			setDropZoneValue(prev => [...prev, ...files])
		}

		await Promise.all(validFiles.map((file) => {
			const formData = new FormData();
			formData.append('file', file)
			axios.post(hostUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				}
			})
				.then(res => {
					(res.status === 200) && setDropZoneValue(prev => prev.map(item => {
						if (item.id === file.id) {
							console.log(item);
							item.status = 'FILE_UPLOADED'
							return item
						} else {
							return item
						}
					}))
				})
		})).then(console.log('UPLOAD COMPLETED'))
	}
	console.log(dropZoneValue);

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
		  {dropZoneValue &&
			  <ol className='item-name-wrapper'>
			  		{dropZoneValue.map((file) =>
						<li style={{color: '#9DFF5A'}}
								key={file.id}>
					  		{file.name.substring(0, file.name.lastIndexOf('.'))}
					  		<div>{FILE_STATUS_MAPPER[file.status]}</div>
				  		</li>
				  )}
			  </ol>
		  }

		  {dropZoneRejectedFiles && dropZoneRejectedFiles.length > 0 &&
			  <ul className='item-name-wrapper'>
				  {(dropZoneRejectedFiles.length <= requirements.filesAmount) && dropZoneRejectedFiles.map((file) => // выводим файлы непрошедшие валидацию и их статусы.
					  <li 
						  key={Math.random()}>
						  {file.name.substring(0, file.name.lastIndexOf('.'))}
						  <div style={{color: '#FE4E4E'}}>{(FILE_STATUS_MAPPER[file.status] !== 'Файл успешно загружен' && FILE_STATUS_MAPPER[file.status]) || ('Превышено количество файлов!')}</div>
					  </li>
				  )}
				  
				  {!maxNumberOfFiles(dropZoneRejectedFiles) && // Выводим информацию о том, что превышено максимально допустимое количество файлов
					  <div style={{ color: '#FE4E4E' }}>
						  {`Превышено количество файлов! Ожидаемое количество файлов: ${requirements.filesAmount}, получено файлов: ${dropZoneRejectedFiles.length}`}
					  </div>}
			  </ul>}
    </div>
  );
}

export default App;
