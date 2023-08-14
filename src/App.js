import React, { useState } from 'react';
import File from './components/File/File';
import './App.css';
import requirements from './components/Params/Params';

function App() {
	const [drag, setDrag] = useState(false)
	const [dropZoneValue, setDropZoneValue] = useState('')
	const dragStartHandler = (e) => {
		e.preventDefault()
		setDrag(true)
		// console.log(e.dataTransfer.files);
	}
	const dragLeaveHandler = (e) => {
		e.preventDefault()
		setDrag(false)
	}
	const onDropHandler = (e) => {
		e.preventDefault()
		let files = [...e.dataTransfer.files]
		setDropZoneValue([...dropZoneValue, files].flat())
		setDrag(false)
	}

	const fileNameValidate = (file) => {
		if (requirements.format.includes(file.name.substring(file.name.lastIndexOf('.')))) return true
		else return false
	}
	
	const fileNameLengthValidate = (file) => {
		if (file.name.length <= requirements.maxNameLength) return true
		else return false
	}

	const fileSizeValidate = (file) => {
		if (file.size <= requirements.maxSize) return true
		else return false
	}

	const fileValidate = (file) => {
		if (!fileNameValidate(file)) return 'Некорректный формат файла'
		else if (!fileNameLengthValidate(file)) return 'Некорректное название файла'
		else if (!fileSizeValidate(file)) return 'Некорректный размер файла'
		else return 'STATUS OK!'
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
		  <ol className='item-name-wrapper'>
			  {dropZoneValue && dropZoneValue.slice(0, 10).map((file) =>
				<li key={Math.random()}>
					  <File file={file} fileValidate={fileValidate} />
					  <div>{fileValidate(file)}</div>
			  	</li>
			  )}
			  {(dropZoneValue.length > 10) && <h2>Превышено количество файлов!</h2> }
		  </ol>
    </div>
  );
}

export default App;
