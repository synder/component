/**
 * Created by synder on 16/4/15.
 * @desc
 */

var PDFViewer = function(config){

    this.workerFileSrc = config.workerFileSrc;

    this.currentPageNumber = null;
    this.totalPageCount = null;
    this.pageScale = config.pageScale;
    this.canvasContainerID = config.canvasContainerID;
    this.pdf = null;

    this.canvas = null;
    this.context = null;

    this.fileSrc = null;

};

PDFViewer.prototype.__init = function(){
    this.currentPageNumber = 1;
    this.totalPageCount = 1;
    this.pageScale = this.pageScale || 1;

    this.canvas = document.getElementById(this.canvasContainerID);
    this.canvasContext = this.canvas.getContext('2d');
};

PDFViewer.prototype.render = function(){

    var self = this;

    self.pdf.getPage(self.currentPageNumber).then(function (page) {

        var scale = self.pageScale;

        var viewport = page.getViewport(scale);

        self.canvas.height = viewport.height;

        self.canvas.width = viewport.width;

        var renderContext = {
            canvasContext: self.canvasContext,
            viewport: viewport
        };

        page.render(renderContext);
    });

};

/**
 * @desc 加载pdf文件
 * */
PDFViewer.prototype.load = function(src, processCallback, callback){

    var self = this;

    self.__init();

    self.fileSrc = src;

    PDFJS.workerSrc = self.workerFileSrc;

    PDFJS.getDocument(src, null, null, processCallback).then(function (pdf) {

        self.pdf = pdf;

        self.totalPageCount = pdf.numPages;

        self.render();

        callback();

    });
};

/**
 * @desc 按尺寸缩放
 * */
PDFViewer.prototype.zoom = function(scale){
    var self = this;

    if(scale > 0 && scale <= 3){
        self.pageScale = Math.abs(scale);
    }

    self.render();
};

/**
 * @desc 放大
 * */
PDFViewer.prototype.zoomIn = function(){
    var self = this;

    self.pageScale += 1;

    if(self.pageScale > 3){
        self.pageScale = 3;
    }

    self.render();
};

/**
 * @desc 缩小
 * */
PDFViewer.prototype.zoomOut = function(){
    var self = this;

    self.pageScale -= 1;

    if(self.pageScale <= 0){
        self.pageScale = 1;
    }

    self.render();
};

/**
 * @desc 调到第几页
 * */
PDFViewer.prototype.page = function(index){

    var self = this;

    if(index >= 1 && index <= self.totalPageCount){
        self.currentPageNumber = Math.abs(index);
    }

    self.render();
};

/**
 * @desc 上一页
 * */
PDFViewer.prototype.pageUp = function(){

    var self = this;

    self.currentPageNumber -= 1;

    if (self.currentPageNumber < 1){
        self.currentPageNumber = 1;
    }

    self.render();
};

/**
 * @desc 下一页
 * */
PDFViewer.prototype.pageDown = function(){

    var self = this;

    self.currentPageNumber += 1;

    if (self.currentPageNumber > self.totalPageCount){
        self.currentPageNumber = self.totalPageCount;
    }

    self.render();
};
