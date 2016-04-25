/**
 * Created by synder on 16/4/16.
 * @desc elastic search 搜索案例
 */
var elasticSearch = require('elasticsearch');

var client = new elasticSearch.Client({
    host: 'localhost:9200',
    log: 'error'
});


client.indices.analyze({
    filed: 'desc',
    text : '这种过滤器提升性能的方式，查询更少的文档意味着更快的速度',
    analyzer : 'smartcn'
}, function(err, body){

    if(err){
        return console.error(err.stack);
    }

    console.dir(body);
});

client.search({
    q : '过滤器',
    //df : 'desc',
    //analyzer : 'smartcn'
}, function(err, body){
    if(err){
        return console.error(err.stack);
    }

    console.log(body.hits);
});
