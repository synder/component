

var x = {
    say : function(){
        console.log('s');
    }
};

var y = function(){
    this.say();
};

y.bind(x)();

//相当于把make传入的所有函数,原封不动的传给fn.bind()创建的另外一个新函数
var make = function (fn) {
    console.log(Array.prototype.slice.call(arguments));
    return fn.bind.apply(fn, arguments);
};

make(function(){
    console.log(arguments);
}, 100, 200)();