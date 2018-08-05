const path = require('path');  // node.js中的路径模块
const htmlWebpackPlugin = require('html-webpack-plugin');

// 通过模块的方式向外暴露配置对象
module.exports = {
    mode:'production',
//    手动配置入口和出口文件
    entry: path.join(__dirname,'./src/main.js'),
    output:{
        path:path.join(__dirname,'./dist'), //出口文件路径
        filename:'bundle.js'  // 出口文件名
    },
    plugins: [
     new htmlWebpackPlugin({  // 在内存中生成HTML的插件
        template: path.join(__dirname,'./src/index.html'), // 指定模板页面，将来会根据指定的页面路径，去生成内存中的页面
         filename:'index.html'  //指定生成的页面的名称
     })
    ],
    module: {  // 配置第三方模块加载器
        rules: [
            {test:/\.css$/,use:['style-loader','css-loader']},
            {test:/\.less$/,use:['style-loader','css-loader','less-loader']},
            {test:/\.scss$/,use:['style-loader','css-loader','sass-loader']}, // 注意：下载的是sass-loader
            {test:/\.(jpg|png|gif|bmp|jpeg)$/,use:'url-loader?limit=9000'}
        ]
    }
}

//（一） 在控制台输入 webpack（没有指定入口文件路径和出口文件路径） 命令执行的时候，webpack做了一下几步

/*
* 1. 首先webpack发现我没有通过命令的形式指定入口和出口路径
* 2. 于是，webpack去项目的根目录，查找webpack.config.js文件
* 3. webpack解析执行这个配置文件，并导出配置对象
* 4. 当webpack拿到配置对象后，就拿到了配置对象中指定的出口和入口，然后进行打包构建。
*
* */


// （二）自动打包编译工具  webpack-dev-server
/*
* 作用： 不必每次修改入口文件都要手动执行webpack命令
* 使用步骤：
* 1.  npm install webpack-dev-server --save-dev
* 2.  在package.json文件scripts中，配置运行命令 "dev":"webpack-dev-server"
* 3. 这样就可以用npm run dev 命令执行自动打包编译工具
*
*【注意】：
*  webpack-dev-server打包的bundle.js并没有存放到物理磁盘上，而是直接托管到内存中。
*
*  如果要实时更新需引入根目录下的 /bundle.js
*
*
*  webpack-dev-server 参数
* --open 自动打开浏览器
* --port 3000 指定端口
* --contentBase src   默认以src目录为根路径打开
* --hot 热更新
*
*
* 【方式一】 推荐
* 在package.json文件scripts中， 命令 "dev":"webpack-dev-server --open --port 3000 --contentBase src --hot"
*
*
* 【方式二】配置webpack-dev-server
* 将参数的配置放在packege.config.js中
*
*

const webpack  = require('webpack')

module.exports = {
    mode:'production',
//    手动配置入口和出口文件
    entry: path.join(__dirname,'./src/main.js'),
    output:{
        path:path.join(__dirname,'./dist'), //出口文件路径
        filename:'bundle.js'  // 出口文件名
    },
    devServer: {
        open: true, //自动打开浏览器
        port: 3000,
        contentBase: 'src',
        hot:true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()   // 创建一个热更新的模块
    ]

}
*
* */


// （三）安装在内存中生成HTML的插件 html-webpack-plugin
/*
=> bundle.js  是在内存中的,那如何将页面也放在内存中呢

* 1.  npm install html-webpack-plugin --save-dev
* 2. const htmlWebpackPlugin = require('html-webpack-plugin');
*
* 3.
 plugins: [
     new htmlWebpackPlugin({  // 在内存中生成HTML的插件
        template: path.join(__dirname,'./src/index.html'), // 指定模板页面，将来会根据指定的页面路径，去生成内存中的页面
         filename:'index.html'  //指定生成的页面的名称
     })
    ]

    【小结】：
    这个插件的两个作用
    （1）自动在内存中根据指定页面生成一个内存的页面
    （2）自动把打包好的bundle.js 追加到页面中去

* */

// （四） loader的配置
/*
=> webpack默认只能打包JS文件，如果要处理非JS文件，需要加载第三方loader

【例子1】css

步骤1：npm install style-loader css-loader --save-dev

步骤2：在webpack.config.js中，新增module -> rules 配置

  module: {  // 配置第三方模块加载器
        rules: [
            {test:/\.css$/,use:['style-loader','css-loader']}  // loader的调用规则是从左到右
        ]
    }

【例子2】url-loader

cnpm i url-loader file-loader -D

{test:/\.(jpg|png|gif|bmp|jpeg)$/,use:'url-loader?limit=9000'}
// limit 大图片不转base64

// 图片路径是哈希值，目的是防止文件重名

如果是原路径名字输出
{test:/\.(jpg|png|gif|bmp|jpeg)$/,use:'url-loader?limit=9000&name=[name].[ext]'}

*
* */