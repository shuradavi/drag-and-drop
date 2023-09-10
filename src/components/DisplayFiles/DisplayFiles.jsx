import React from 'react';
import { FILE_STATUS_MAPPER, requirements } from '../Params/Params';
import { isTheNumberOfFilesAllowed, fileNameWithoutFormat  } from '../Functions/functions';

const DisplayFiles = ({state}) => {
	return (
		<>
			{!!state.length && 
				<ol
					className='item-name-wrapper'
					style={{ color: '#CC3333', fontWeight: '400'  }}>
					Не будут загружены:
					{!isTheNumberOfFilesAllowed(state)
						? <div>{`Ожидаемое количество файлов: ${requirements.filesNumbers}, получено файлов: ${state.length}`}</div>
						: null
					}
					{state.map(file => 
						<li style={{ color: 'yellow', textAlign: 'start' }}
							key={file.id}>
							{`${fileNameWithoutFormat(file.item)}: ${FILE_STATUS_MAPPER[file.status]}`}
						</li>)}
				</ol>
			}
		</>
	);
};

export default DisplayFiles;