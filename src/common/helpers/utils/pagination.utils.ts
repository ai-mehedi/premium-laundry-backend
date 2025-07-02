import { join } from 'path';
import { PaginationUI } from './pagination-uri.utils';
import { RenderEjsFile } from './utils';
import { formatBytes } from './data.utils';
import { formatDateTime } from './datetime.utils';

export async function getPaginationUiWithView(
  records: any[],
  total: number,
  page: number,
  limit: number,
  offset: number,
  renderPath: string,
) {
  const pagination = new PaginationUI();

  const paginate_ui = pagination.getAllPageLinks(
    Math.ceil(total / limit),
    Math.abs(page),
  );

  let html_data = '';
  let serial_number = offset;
  for (const result of records) {
    serial_number++;
    html_data += await RenderEjsFile(join(global.ROOT_DIR, renderPath), {
      result,
      serial_number,
      formatBytes,
      formatDateTime,
    });
  }

  return {
    html_data,
    paginate_ui,
  };
}
