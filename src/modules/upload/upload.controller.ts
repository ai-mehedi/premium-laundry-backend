import { Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as formidable from 'formidable';
import { extname, join } from 'path';
import { RandomString } from 'src/common/helpers/utils/string.utils';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

@Controller('upload')
export class UploadController {
  @Post('file')
  @HttpCode(200)
  async uploadFile(@Req() req: Request, @Res() res: Response) {
    const form = new formidable.Formidable({ multiples: false });
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: 'Upload failed',
        });
      }

      if (!fields?.path) {
        return res.status(400).json({
          message: 'Path is required',
        });
      }

      const file = files.file[0];
      if (!file) {
        return res.status(400).json({
          message: 'File is required',
        });
      }
      if (file.size > maxFileSize) {
        return res.status(400).json({
          message: 'File size exceeds the limit',
        });
      }

      if (file.size === 0) {
        return res.status(400).json({
          message: 'File is empty',
        });
      }

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: 'Invalid file type',
        });
      }

      const ext = extname(file.originalFilename);
      const filePath = fields.path.toString();
      const newFileName = `${file.originalFilename.replace(/[^a-zA-Z0-9]/g, '')}${Date.now()}${RandomString(5)}${ext}`;
      const uploadDir = join(global.ROOT_DIR, 'public/uploads', filePath);
      const newFilePath = join(uploadDir, newFileName);

      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }
      copyFileSync(file.filepath, newFilePath);

      return res.status(200).json({
        message: 'Upload successful',
        payload: {
          originalName: file.originalFilename,
          fileName: newFileName,
          fileSize: file.size,
          mimeType: file.mimetype,
          filePath,
        },
      });
    });
  }
}
