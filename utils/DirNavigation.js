var navigation;
var shell;
var workingDir;
var count;
var titleBar;
var isHidden;

function DirectoryNavigation(nav, workingDirc, titleBarBtn, shell_instance) {
    navigation  = nav;
    shell       = shell_instance;
    workingDir  = workingDirc;
    titleBar    = titleBarBtn; 
    isHidden    = false;
    
    appendHideBtn();
    DirectoryNavigation.prototype.refresh();
};

DirectoryNavigation.prototype.refresh = function() {
    refreshDir();
    refreshWorkingDir();
};

function appendHideBtn() {
    titleBar.prepend(                              ''+
        '<button id="HideBtn" class="btn btn-default">'+
        '  Hide Directory                                      '+
        '</button>                                    '
    );
    handleHide();
}

function handleHide() {
    $("#HideBtn").click(()=>{
        if(isHidden) {
            $("#HideBtn").text("Hide Directory");
            navigation.animate({width: '20%'},350);
            $("#container").animate({width: '100%'},350);
            isHidden = false;
        }
        else {
            $("#HideBtn").text("Show Directory");
            navigation.animate({width: '0'},350);
            $("#container").animate({width: '100%'},350);
            isHidden = true;
        }
    });
}

function refreshDir() {
    var count = 0;
    $(".nav-group-item").text("");
    $("span").removeClass("nav-group-item icon-folder", ()=>{
        if(count > 0) {
            return;
        };
        count++;
        getFileList((files)=>{
            files = sortDirByType(files);
            for(var i = 0; i < files.length; i++) {
                if(files[i].indexOf(".") != -1) {
                    navigation.append('            ' +
                        '<span class="nav-group-item">' +
                           files[i]                     +
                        '</span>'
                    );
                }
                else {
                    navigation.append('                       ' +
                        '<span class="nav-group-item">           ' +
                        '  <span class="icon icon-folder"></span>' +
                           files[i]                                +
                        '</span>'
                    );
                }
            }
        });
    });
};

function refreshWorkingDir() {
    getWorkingDir((dir)=>{
        workingDir.text(dir);
    });
};

function sortDirByType(files) {
    for(var i = 0; i < files.length; i++) {
        if(files[i].length === 0) {
            files.splice(i, 1);
            continue;
        }
        if(files[i].indexOf(".") === -1) {
            var file = files.splice(i, 1);
            files.unshift(file);
        }
    }
    return files;
};

function getFileList(callback) {
    var cmd = "ls";
    var count = 0;

    shell.write(cmd, (data)=>{
        if(count === 0) {
            callback(data.split("<br />"));
        }
        count++;
    });
};

function getWorkingDir(callback) {
    var cmd = "pwd";
    var count = 0;

    shell.write(cmd, (data)=>{
        if(count === 0) {
            callback(data.replace("<br />",""));
        }
        count++;
    });
};

module.exports = DirectoryNavigation;
