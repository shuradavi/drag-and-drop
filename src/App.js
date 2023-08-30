import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import requirements from './components/Params/Params';
import { fileValidate, isUploaded, isValid, isNotLoad, FILE_STATUS_MAPPER, maxNumberOfFiles, clearIsNotLoaded, chageStatusTooMany } from './components/utils/utils'
import { drop } from 'ramda';
const { v4: uuidv4 } = require('uuid');

const hostUrl = 'http://localhost:4003/files/save'


function App() {
	const [drag, setDrag] = useState(false)
	const [dropZoneValue, setDropZoneValue] = useState('')
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
			axios.post(hostUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				}
			})
				.then(() => {
					setDropZoneValue(prev => prev.map(item => {
						if (item.id === file.id) {
							item.status = 'FILE_UPLOADED'
							return item
						} else {
							return item
						}
					}))
				}
				)
		})).then(console.log('Загрузка фаайлов завершена: ', validFiles.map(file => file.name)), setDropZoneValue(prev => [...prev, ...files]))
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
		
		if (dropZoneValue.length && maxNumberOfFiles(dropZoneValue.filter(file => isUploaded(file)).length + validFiles.length)) {		//  условие: 1) непустое состояние ДЗ; 2) сумма кол-ва загруженных файлов и валидных файлов не превышает допустимое значение 
			postRequest(files, validFiles);
			console.log('Отработало первое условие ДЗ + кол-во');
		} 	else if (dropZoneValue.length) {		//		условие: непустое состояние ДЗ
				let availableSpace = requirements.filesAmount - dropZoneValue.filter(file => isUploaded(file)).length;		//  вычисляем свободное пространство на сервере
			if (availableSpace > 0) {		// отработает при наличии свободного простраснства на сервере
					chageStatusTooMany(validFiles.slice(availableSpace-1 ))		// изменения статуса у валидных файлов, которым не хватаает свободного пространства
					validFiles = validFiles.slice(0, availableSpace)		// валидные файлы, которые будут загружены на сервер
					postRequest(files, validFiles);	
					console.log('Отработало второе условие ДЗ + свободное место');

				} else {		// отработает при отсутствии свободного проостранства
					const allFiles = chageStatusTooMany(validFiles).concat(invalidFiles);
					setDropZoneValue(prev => [...prev, ...allFiles])
					console.log('отработало третье условие ДЗ и иначе');
				}
		} else if (maxNumberOfFiles(files)) {		// условие: 1) пустое состояние ДЗ; 2) кол-во принятых файлов не превышает допустимое значение
			postRequest(files, validFiles);
			console.log('отработало четвертое условие кол-во файлов и пустая ДЗ');
		} else {		// условие: кол-во принятых файлов превышает допустимое значение
			const allFiles = chageStatusTooMany(validFiles).concat(invalidFiles);		// изменим статус валидных файлов на соответствующий. Обновим состояние без загрузки файлов на сервер.
			setDropZoneValue(prev => [...prev, ...allFiles])
			console.log('отработало пятое условие иначе - пустая ДЗ, превышено количество файлов');
			}
		}
	dropZoneValue.length && console.log('DZV: ', dropZoneValue);

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
		  {dropZoneValue &&		// выводим список загружаемых/загруженных на сервер файлов
			  <ol className='item-name-wrapper'>
			  		{dropZoneValue.filter(file => isUploaded(file)).map((file) =>
						<li style={{color: '#9DFF5A'}}
								key={file.id}>
					  		{file.name.substring(0, file.name.lastIndexOf('.'))}
					  		<div>{FILE_STATUS_MAPPER[file.status]}</div>
				  		</li>
				  )}
			  </ol>
		  }
			{dropZoneValue &&		// выводим список невалидных файлов
				
			  <ol className='item-name-wrapper'>
			  		{isNotLoad(dropZoneValue).map((file) =>
						<li style={{color: '#FE4E4E'}}
								key={file.id}>
					  		{file.name.substring(0, file.name.lastIndexOf('.'))}
					  		<div>{FILE_STATUS_MAPPER[file.status]}</div>
				  		</li>
				  )}
			  </ol>
		  }

		  {/* {dropZoneRejectedFiles && dropZoneRejectedFiles.length > 0 &&
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
			  </ul>} */}
    </div>
  );
}

export default App;
