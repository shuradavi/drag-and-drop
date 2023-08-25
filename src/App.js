import React, { useState } from 'react';
import './App.css';
import requirements from './components/Params/Params';
import { fileValidate, FILE_STATUS_MAPPER, maxNumberOfFiles } from './components/utils/utils'

const hostUrl = '/files'

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

	const onDropHandler = (e) => {
		e.preventDefault()
		// получаем файлы в виде FileList
		let files = e.dataTransfer.files
		// let files = e.target.files // Вариант для инпута
		// проводим валидацию файлов, добавляем соответствующий статус файлу.
		for (let i = 0; i < files.length; i++) {
			let file = files.item(i)
			file.status = fileValidate(file)
		}
		// Файлы прошедшие валидацию помещаем в succesFiles
		const succesFiles = Array.from(files).filter(file => file.status === 'FILE_STATUS_OK')
		// Файлы непрошедшие валидацию помещаем в rejectedFiles
		const rejectedFiles = Array.from(files).filter(file => file.status !== 'FILE_STATUS_OK')
		// В случае упешного прохождения количественной проверки добавляемых файлов, а так же количественной проверки суммы загруженных и добавляемых файлов, обновляем состояние dropZOneValue, обновляем состояние setDropZoneRejectedFiles.
		if (maxNumberOfFiles(files) && maxNumberOfFiles([...dropZoneValue, ...succesFiles])) {
			setDropZoneValue((prev) => [...prev, ...succesFiles])
			setDropZoneRejectedFiles([...rejectedFiles])
		}
		// В случае провала количественной проверки загружаемых файлов или суммы загруженных и добавляемых файлов, перемещаем все добавляемые файлы в setDropZoneRejectedFiles.
		else setDropZoneRejectedFiles([...files])
		setDrag(false)
	}


  return (
	  <div className="App">
		  {/* <input
			  accept={requirements.format}
			  type='file'
			  multiple
			  onChange={e => onDropHandler(e)}
		  /> */}
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
