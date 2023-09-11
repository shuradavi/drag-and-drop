import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FILE_STATUS_MAPPER, requirements, hostUrl } from './components/Params/Params';
import './App.css';
import {setTheStatusOfFiles, fileUploadScript } from './components/Functions/functions';
import DisplayFiles from './components/DisplayFiles/DisplayFiles';
import { uploadFiles } from './components/API/post';


function App() {
	const [unusableFiles, setUnusableFiles] = useState([])
	const [filesFromServer, setFilesFromServev] = useState([])

	const getFilesListAndSetState = async () => {
		const response = await axios.get(hostUrl.list)
		console.log('Получили с сервера: ', response.data);
		setFilesFromServev(response.data)
	}
	const deleteFile = async (id) => {
		await axios.get(`${hostUrl.delete}${id}`)
		getFilesListAndSetState()
	}

	useEffect(() => {
		getFilesListAndSetState();
	}, [])

	const dragStartHandler = (e) => {
		e.preventDefault()
	}

	const uploadFilesAndSetUnusable = (obj) => {
		if (!obj.forUpload.length) {
			try {
				setUnusableFiles(obj.forUnusable)
			} catch (error) {
				console.warn(error);
			}
		}
		else {
			try {
				uploadFiles(obj.forUpload)
				getFilesListAndSetState()
				setUnusableFiles(obj.forUnusable)
			} catch (error) {
				console.warn(console.error());
			}
		}
	}
	const onDropHandler = async (e) => {
		e.preventDefault()
		let availableSpace = requirements.filesNumbers - filesFromServer.length;
		let files = [...e.dataTransfer.files];
		files = setTheStatusOfFiles(files);
		let objWithFiles = fileUploadScript(files, availableSpace);
		uploadFilesAndSetUnusable(objWithFiles);
	}
	
	return (
		<div className="App">
			<div
				className='zone-wrapper'
				onDragOver={e => dragStartHandler(e)}
				onDrop={e => onDropHandler(e)}>
					Перенесите файлы для их загрузки
			</div>
			<DisplayFiles state={filesFromServer} deleteFile={deleteFile} />
			{!!unusableFiles.length &&
				<ol
					className='item-name-wrapper'>
					Ошибка:
						{unusableFiles.map(file =>
							<li style={{ color: 'yellow', textAlign: 'start' }}
								key={file.id}>
									{`${file.item.name.substring(0, file.item.name.lastIndexOf('.'))} ${FILE_STATUS_MAPPER[file.status]}`}
							</li>)
						}
				</ol>
			}
    </div>
  );
}

export default App;
