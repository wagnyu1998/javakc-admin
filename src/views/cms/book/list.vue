<template>
  <div id="app-container" style="padding: 30px">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="书名">
        <el-input v-model="bookQuery.bookName" placeholder="书名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryBook()">查询</el-button>
        <el-button type="primary" @click="reset()">清空</el-button>
        <router-link :to="'/cms/book/create'">
          <el-button type="primary">添加</el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="bookList" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="书籍ID" width="80" />
      <el-table-column prop="bookName" label="书名"/>
      <el-table-column prop="bookAuthor" label="作者" />
      <el-table-column prop="classify1Id" label="一级分类" />
      <el-table-column prop="classify2Id" label="二级分类" />
      <el-table-column label="连载">
        <template slot-scope="scope">
          {{ scope.row.isSerialize === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="wordNumber" label="字数" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '上线' : '未上线'}}
        </template>
      </el-table-column>
      <el-table-column label="全本收费">
        <template slot-scope="scope">
          {{ scope.row.free === 1 ? '收费' : '免费' }}
        </template>
      </el-table-column>
      <el-table-column prop="startedDate" label="授权开始时间" />
      <el-table-column prop="endedDate" label="授权结束时间" />
      <el-table-column label="原创">
        <template slot-scope="scope">
          {{ scope.row.original === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="授权状态">
        <template slot-scope="scope">
          {{ currentTime > scope.row.endedDate ? '过期' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteBook(scope.row.id, scope.row.status)">删除</el-button>
          <router-link :to="'/cms/book/update/'+scope.row.id">
            <el-button type="primary" size="mini" >修改</el-button>
          </router-link>
          <el-button v-if="scope.row.status === 0" type="danger" size="mini" icon="el-icon-delete" @click="upOrDownBook(scope.row.id, 1)">上架书籍</el-button>
          <el-button v-else type="danger" size="mini" @click="upOrDownBook(scope.row.id, 0)">下架书籍</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :page-size="pageSize"
      :current-page="pageNo"
      :total="total"
      :pager-count="11"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="queryBook">
    </el-pagination>
  </div>
</template>

<script>
import book from '@/api/cms/book'

export default {
  data() { // 定义变量和初始值
    return {
      bookList: null, // 数据列表
      bookQuery: {}, // 查询条件封装类
      total: 0, // 总数
      pageNo: 1, // 当前页
      pageSize: 4, // 每页最大条数
      currentTime: '' // 当前时间
    }
  },
  created() { // 在页面未渲染之前执行
    this.queryBook()
  },
  methods: { // 定义函数
    queryBook(pageNo = 1) { // 查询函数
      this.pageNo = pageNo
      book.findBook(this.bookQuery, this.pageNo, this.pageSize)
        .then(response => {
          // 列表
          this.bookList = response.data.list
          // 总数
          this.total = response.data.total
          // 赋值当前时间
          this.currentTime = this.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        })
    },
    format(date, fmt) { // ## 格式化日期
      let o = {
        'M+': date.getMonth() + 1, // ## 月份
        'd+': date.getDate(), // ## 日
        'H+': date.getHours(), // ## 小时
        'm+': date.getMinutes(), // ## 分
        's+': date.getSeconds(), // ## 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // ## 季度
        'S': date.getMilliseconds() // ## 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      return fmt
    },
    reset() { // 重置查询条件数据
      // 清空数据
      this.bookQuery = {}
      // 重新查询
      this.queryBook()
    },
    deleteBook(bookId, status) { // 根据Id进行删除
      if (status === 1) {
        this.$message({
          message: '此书籍为上线状态不允许删除!',
          type: 'error'
        })
        return
      }
      this.$confirm('此操作将永久删除该书籍, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        book.delete(bookId)
          .then(response => {
            // 消息提示
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
            // 刷新页面
            this.queryBook()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    upOrDownBook(bookId, status) { // 设置书籍上架与下架
      this.$confirm('此操作将更改书籍线上与线下状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        book.upOrDownBook(bookId, status)
          .then(response => {
            // 消息提示
            this.$message({
              message: '更改成功!',
              type: 'success'
            })
            // 重新查询
            this.queryBook()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消变更'
        })
      })
    }
  }
}
</script>

