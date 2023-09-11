import React, { useEffect, useState } from 'react'
import { getFilesList } from './components/API/get';
import { FILE_STATUS_MAPPER } from './components/Params/Params';
import './App.css';
import {fileUploadScript, setTheStatusOfFiles } from './components/Functions/functions';
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
	
	
	const onDropHandler = async (e) => {
		e.preventDefault()
		let files = [...e.dataTransfer.files];
		files = setTheStatusOfFiles(files);
		fileUploadScript(files, filesFromServer, setFilesFromServev, setUnusableFiles)
		setDrag(false)
	}
	
	console.log('render');

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
			<ol
				className='item-name-wrapper'>
					Ошибка:
					{!!unusableFiles.length && unusableFiles.map(file =>
						<li style={{ color: 'yellow', textAlign: 'start' }}
							key={file.id}>
								{`${file.item.name.substring(0, file.item.name.lastIndexOf('.'))} ${FILE_STATUS_MAPPER[file.status]}`}
						</li>)
					}
				</ol>
    </div>
  );
}

export default App;
