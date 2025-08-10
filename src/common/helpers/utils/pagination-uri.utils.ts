export class PaginationUI {
  per_page = 0;
  constructor() {
    this.per_page = 1;
  }
  getAllPageLinks(pages: number, current: number) {
    let output = '';
    if (pages > 0) {
      if (current == 1) {
        output +=
          '<li class="page-item disabled"><a class="page-link">First</a></li>';
      } else {
        output +=
          '<li class="page-item"><a class="page-link" href="javascript:;" onclick="get_paginate_result(this,1)">First</a></li>';
      }
      if (current - 1 > 0) {
        const pr_page = current - 1;
        output +=
          '<li><a class="page-link" href="javascript:;" onclick="get_paginate_result(this,' +
          pr_page +
          ')" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
      }
      let i = Number(current) > 5 ? Number(current) - 4 : 1;
      if (i !== 1) {
        output +=
          '<li class="page-item disabled"><a class="page-link">...</a></li>';
      }
      for (; i <= Number(current) + 4 && i <= pages; i++) {
        if (i == current) {
          output +=
            '<li class="page-item active"><a class="page-link">' +
            i +
            '</a></li>';
        } else {
          output +=
            '<li class="page-item"><a class="page-link" href="javascript:;" onclick="get_paginate_result(this,' +
            i +
            ')">' +
            i +
            '</a></li>';
        }
        if (i == Number(current) + 4 && i < pages) {
          output +=
            '<li class="page-item disabled"><a class="page-link">...</a></li>';
        }
      }
      if (pages >= current + 1) {
        const n_page = current + 1;
        output +=
          '<li class="page-item"><a class="page-link" href="javascript:;" onclick="get_paginate_result(this,' +
          n_page +
          ')" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
      }
      if (current == pages) {
        output +=
          '<li class="page-item disabled"><a class="page-link">Last</a></li>';
      } else {
        output +=
          '<li class="page-item"><a class="page-link" href="javascript:;" onclick="get_paginate_result(this,' +
          pages +
          ')">Last</a></li>';
      }
    }
    return output;
  }
}
