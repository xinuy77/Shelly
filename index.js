const searchInPage  = require('electron-in-page-search').default;
const remote        = require('electron').remote;
var pty             = require('node-pty');
var Shell           = require('./utils/Shell.js');              

window.$  = window.jQuery = require('jquery');

var shell = new Shell();

$(document).ready(function() {
    $('#close-btn').click(()=>{window.close()});
    
    const terminal = new Terminal('#input-line .cmdline', '#container output', shell);
    
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
