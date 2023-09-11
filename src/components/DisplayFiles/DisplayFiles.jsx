import React from 'react';
import {downloadFile } from '../API/get';
import { fileNameWithoutFormat } from '../Functions/functions';

const DisplayFiles = ({state, deleteFile}) => {
	return (
		<>
			{!!state.length && 
				<ol
					className='item-name-wrapper'>
					<div style={{color: 'black'}}>Файлы на сервере</div>
					{state.map(file => 
						<li style={{ color: 'yellow', textAlign: 'start' }}
							key={file.id}>
							{fileNameWithoutFormat(file.filename)}
							<button className='btn' onClick={() => downloadFile(file)}>save</button>
							<button className='btn' onClick={() => deleteFile(file.id)}>del</button>
						</li>)}
				</ol>
			}
		</>
	);
};

export default DisplayFiles;