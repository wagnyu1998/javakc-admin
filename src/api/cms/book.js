import request from '@/utils/request'
import id from 'element-ui/src/locale/lang/id'

const api_name = '/cms/book'

export default {
  // ## 动态条件查询带分页
  findBook(bookQuery, pageNo, pageSize) {
    // 通过axios发送异步请求
    return request({
      // Restful
      url: `${api_name}/findAll/${pageNo}/${pageSize}`,
      method: 'post',
      data: bookQuery
    })
  },
  // 添加
  addBook(book) {
    return request({
      url: `${api_name}/create`,
      method: 'post',
      data: book
    })
  },
  // 回显
  view(bookId) {
    return request({
      url: `${api_name}/${bookId}`,
      method: 'get'
    })
  },
  // 修改
  update(book) {
    return request({
      url: `${api_name}/updateBook`,
      method: 'put',
      data: book
    })
  },
  // 删除
  delete(bookId) {
    return request({
      url: `${api_name}/deleteById/${bookId}`,
      method: 'delete'
    })
  },
  // 设置书架上架与下架
  upOrDownBook(bookId, status) {
    return request({
      url: `${api_name}/upOrDownBook/${bookId}/${status}`,
      method: 'put'
    })
  }
}
