import React from 'react';

const File = ({ file, fileValidate}) => {
	fileValidate(file)
	return (
		<>
			{file.name.substring(0, file.name.lastIndexOf('.'))}
		</>
	);
};

export default File;