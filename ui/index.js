const { ipcRenderer }  = require('electron');
const searchInPage = require('electron-in-page-search').default;
const remote       = require('electron').remote;

window.$  = window.jQuery = require('jquery');

$(document).ready(function() {
    $('#close-btn').click(()=>{window.close()});
    
    const terminal = new Terminal('#input-line .cmdline', '#container output');
    
    terminal.init();
    $('.prompt').html('>');

    const search = searchInPage(remote.getCurrentWebContents());
        $('#search-page-button').click(()=>{
    });
    
    $(window).keydown(function(e){
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
    	    search.openSearchWindow();
        }
    });
});
