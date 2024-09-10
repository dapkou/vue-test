<template>
  <p class="my-4">記事本demo</p>
  <div v-if="isLogin">
    <div class="flex justify-center">
      <p>登入成功</p>
      <input type="button" class="btn btn-xs btn-primary ms-3" value="登出" @click="logout">
    </div>
    <div class="container mx-auto">
    <!-- input -->
    <div class="flex justify-center mt-4 gap-2">
      <input type="text" placeholder="新增代辦事項" 
      class="input input-bordered input-md w-full max-w-xs" 
      v-model="text"/>
      <button class="btn" @click="save" :disabled="isSave || text === '' ">
        <span class="loading loading-spinner loading-xs" v-if="isSave"></span>
        儲存
      </button>
    </div>
    <!-- table -->
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>編號</th>
            <th>內容</th>
            <!-- <th>建立日期</th> -->
            <th>更新日期</th>
            <th>＃</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <th>{{ index + 1 }}</th>
            <td>
              <!-- {{ item.get('text') }} -->
              <p v-if="!item.isEdit">{{ item.text }}</p>
              <input 
              type="text" 
              placeholder="輸入代辦事項" 
              class="input input-bordered input-md w-full max-w-xs" 
              v-model="item.text" 
              v-else 
              />
            </td>
            <!-- <td>{{ formatDate(item.createdAt) }}</td> -->
            <td>{{ formatDate(item.updatedAt) }}</td>
            <td>
              <button class="btn btn-xs" @click="changeMode(index)" v-if="!item.isEdit">
                編輯
              </button>
              <div class="flex gap-2" v-if="item.isEdit">
                <button class="btn btn-success btn-outline btn-xs" @click="update(index)">更新</button>
                <button class="btn btn-error btn-outline btn-xs" @click="dele(index)">刪除</button>
              </div>
            </td>
            
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>

  <div class="flex justify-center" v-else>
    <div class="block max-w-sm p-6 bg-white dark:bg-gray-800 border border-gray-200 shadow rounded-lg">
      <p>ID:admin / Password:111</p>
    <input type="text" class="input input-bordered input-md w-full max-w-xs mb-3"  placeholder="ID" v-model="userId" />
    <br>
    <input type="password" class="input input-bordered input-md w-full max-w-xs mb-3"  placeholder="Password" v-model="password">
    <br>
    <input type="button" class="btn btn-primary"  value="登入" @click="submit">
    </div>
    
  </div>


</template>

<script>
import { ref , onMounted } from 'vue';
import { Parse } from 'parse/dist/parse.min.js';

export default {
  setup(){
    const text = ref('');
    const isSave = ref(false);
    const items = ref([]);

    //讀取toDolist
    async function getData() {
      try {
        const query = new Parse.Query('ToDo');
        let datas = await query.find();
        // items.value = await query.find();

        items.value = []; //清除陣列內所有資料
        datas.forEach( data => {
          items.value.push({
            "id": data.id,
            "text" : data.get('text'),

            "createdAt": data.createdAt, 
            "updatedAt": data.updatedAt,
          })
        });
      }catch(error) {
        console.log(error);
      }
    }

    //上傳資料庫
    async function save() {
      isSave.value = true;

      const toDoList = new Parse.Object('ToDo');
      toDoList.set("text", text.value);

      try{
        await toDoList.save();
        // let result = await toDoList.save();
        text.value = "";
        await getData();
        isSave.value = false;
        // alert('上傳成功' + result.id);
      }
      catch(error){
        alert('上傳失敗' + error.message);
      }
    }

    function changeMode(index) {
      items.value[index].isEdit = true;
    }
    //針對每筆資料可以更新
    async function update(index) {
      let item = items.value[index];

      try{
        const query = new Parse.Query("ToDo");

        query.equalTo("objectId", item.id);
        const toDo = await query.first();
        toDo.set('text', item.text);
        await toDo.save();
        items.value[index].isEdit = false;

        items.value[index].updatedAt = toDo.updatedAt; //更新時間
      } 
      catch(error){
        console.log("更新失敗" + error.message);
      }
    }

    //針對每筆資料可以刪除
    async function dele(index) {
      let item = items.value[index];

      try{
        const query = new Parse.Query("ToDo");

        query.equalTo("objectId", item.id);
        const toDo = await query.first();
        toDo.set('text', item.text);
        await toDo.destroy();
        await getData();

      } catch(error){
        console.log(error);
      }
    }

    //時間
    function formatDate(date) {
      if (!date) return '';
      const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }

//登入
const userId = ref('');
    const password = ref('');
    const isLogin = ref(false);

    function checkLogin(){
      if(userId.value == 'admin' && password.value == '111'){
        isLogin.value = true;
      }else {
        isLogin.value = false;
      }
    }

    function submit(){
      localStorage.setItem('userId', userId.value);
      localStorage.setItem('password', password.value);
      checkLogin();

      if(!isLogin.value) alert('登入失敗');
    }
    function logout(){
      localStorage.setItem('userId', '');
      localStorage.setItem('password', '');
      isLogin.value = false;
    }
//
    onMounted(() => {
      userId.value =localStorage.getItem('userId');
      password.value =localStorage.getItem('password');
      checkLogin();

      getData();
    })

    return{
      //login
      userId, 
      password, 
      isLogin,
      checkLogin, 
      submit, 
      logout,
      //todolist
      text,
      isSave,
      save,
      items,
      changeMode,
      update,
      dele,
      formatDate
    }
  },

}
</script>

<style>
* {
  background-color: aliceblue !important;
  color: #333;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
