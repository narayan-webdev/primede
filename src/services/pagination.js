export async function getPagination(pagination = {}) {
  if (pagination.hasOwnProperty("page") && pagination.hasOwnProperty("pageSize")) {
    let pageSize = pagination.pageSize <= 0 ? 25 : pagination.pageSize === "undefined" || null ? 25 : pagination.pageSize;
    let page = parseInt(pagination.page <= 0 ? 1 : pagination.page === "undefined" || null ? 1 : pagination.page);
    let offset = (page - 1) * pageSize;
    let limit = pageSize;
    console.log(page, pageSize);
    return { offset, limit, pageSize, page };
  } else return { offset: null, limit: null, page: 1, pageSize: 25 };
}
export async function getMeta(pagination, count) {
  try {
    const { page, pageSize } = pagination;
    return {
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize || count),
        pageCount: Math.ceil(count / (pageSize || count)),
        total: count,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
