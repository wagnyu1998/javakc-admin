<template>
  <div id="app-container" style="padding: 30px">
    <el-form label-width="130px">
      <el-form-item label="书名">
        <el-col :span="5">
          <el-input v-model="book.bookName"/>
        </el-col>
      </el-form-item>
      <el-form-item label="作者">
        <el-col :span="5">
          <el-input v-model="book.bookAuthor"/>
        </el-col>
      </el-form-item>
      <!-- TODO 分类 -->
      <el-form-item label="授权开始时间">
        <el-date-picker
          v-model="book.startedDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item label="授权结束时间">
        <el-date-picker
          v-model="book.endedDate"
          type="datetime"
          placeholder="选择结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item label="连载">
        <el-select v-model="book.isSerialize" clearable placeholder="请选择">
          <el-option :value="1" label="是"/>
          <el-option :value="0" label="否"/>
        </el-select>
      </el-form-item>
      <el-form-item label="全本收费">
        <el-select v-model="book.isFullCharge" clearable placeholder="请选择">
          <el-option :value="1" label="收费"/>
          <el-option :value="0" label="免费"/>
        </el-select>
      </el-form-item>
      <el-form-item label="原创">
        <el-select v-model="book.isOriginal" clearable placeholder="请选择">
          <el-option :value="1" label="是"/>
          <el-option :value="0" label="否"/>
        </el-select>
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="book.briefIntroduction" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- TODO 书封 -->
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveBook()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import book from '@/api/cms/book'

export default {
  data() {
    return {
      book: {
        bookName: '',
        bookAuthor: '',
        startedDate: '',
        endedDate: '',
        isSerialize: '',
        isFullCharge: '',
        isOriginal: '',
        briefIntroduction: '',
        cover: ''
      }, // 书籍对象
      saveBtnDisabled: false // 是否禁用按钮 false为不禁用
    }
  },
  methods: {
    saveBook() {
      // 禁用按钮
      this.saveBtnDisabled = true
      book.addBook(this.book)
        .then(response => { // 成功后执行的方法
          // 消息提示
          this.$message({
            message: '保存成功!',
            type: 'success'
          })
          // 跳转回 list 页面
          this.$router.push('/cms/book/list')
        })
    }
  }
}
</script>

