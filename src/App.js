import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import requirements from './components/Params/Params';
import { fileValidate, FILE_STATUS_MAPPER, maxNumberOfFiles } from './components/utils/utils'

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
		// получаем файлы в виде FileList
		let files = e.dataTransfer.files
		// проводим валидацию файлов, добавляем соответствующий статус файлу.
		for (let i = 0; i < files.length; i++) {
			let file = files.item(i)
			file.status = fileValidate(file)
		}

		// Файлы прошедшие валидацию помещаем в successFiles
		const successFiles = Array.from(files).filter(file => file.status === 'FILE_STATUS_OK')
		// Файлы непрошедшие валидацию помещаем в rejectedFiles
		const rejectedFiles = Array.from(files).filter(file => file.status !== 'FILE_STATUS_OK')

		// В случае упешного прохождения количественной проверки добавляемых файлов, а так же количественной проверки суммы загруженных и добавляемых файлов, обновляем состояние dropZOneValue, обновляем состояние setDropZoneRejectedFiles.
		if (maxNumberOfFiles(files) && maxNumberOfFiles([...dropZoneValue, ...successFiles])) {
			setDropZoneValue((prev) => [...prev, ...successFiles])
			setDropZoneRejectedFiles([...rejectedFiles])
		}
		// В случае провала количественной проверки загружаемых файлов или суммы загруженных и добавляемых файлов, перемещаем все добавляемые файлы в setDropZoneRejectedFiles.
		else setDropZoneRejectedFiles([...files])
		setDrag(false)

		if (maxNumberOfFiles(files)) {
			if (successFiles.length > 0) {
				await Promise.all(successFiles.map((file) =>  {
					const formData = new FormData();
				
					formData.append('file', file)
					axios.post(hostUrl, formData, {
						headers: {
							"Content-Type": "multipart/form-data",
						}
					}).then(res => {
						(res.status === 200) && (file.status = 'FILE_UPLOADED')
							setDropZoneValue((prevState) => prevState.map(item => {
							if (item.lastModified === file.lastIndexOf) {
								return { ...item, status: 'FILE_UPLOADED' }
							} else {
								return item
							}
						}))
					}) 
				})).then(console.log('download completed'))
			}
			else return 'MISSING_SECCESS_FILES'
			
		}
		else return 'MAX_AMOUNT_ERROR';
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
		  {dropZoneValue &&
			  <ol className='item-name-wrapper'>
			  		{dropZoneValue.map((file) =>
						<li style={{color: '#9DFF5A'}}
								key={Math.random()}>
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
