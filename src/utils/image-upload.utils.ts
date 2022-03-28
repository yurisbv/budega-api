import { HttpException, HttpStatus } from '@nestjs/common';

// Allow only images mimetype
export const imageFileFilter = (req, file, callback) => {
  if (
    ![
      'image/gif',
      'image/png',
      'image/jpeg',
      'image/bmp',
      'image/webp',
    ].includes(file.mimetype)
  )
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );

  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const split = file.mimetype.split('/');
  const id = req.params['id'];
  callback(null, `${id}.${split[split.length - 1]}`);
};
