import React from 'react';
import { deleteFile, downloadFile } from '../API/get';
import { FILE_STATUS_MAPPER, hostUrl, requirements } from '../Params/Params';
import { isTheNumberOfFilesAllowed, fileNameWithoutFormat } from '../Functions/functions';

const DisplayFiles = ({state, setState}) => {
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
							<button className='btn' onClick={() => deleteFile(file.id, setState)}>del</button>
						</li>)}
				</ol>
			}
		</>
	);
};

export default DisplayFiles;