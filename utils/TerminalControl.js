
var AutoComplete  = require('./utils/AutoComplete.js');
var DirNavigation = require('./utils/DirNavigation.js');
var nativeCmds    = require('./config/nativeCommands.json');
var Shell         = require('./utils/Shell.js');
var fs            = require('fs');
var os            = require('os');
var storage       = require('electron-json-storage');
var util          = util || {};

util.toArray = function(list) {
    return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
    const CMDS_              = []; //for original commands
    window.URL               = window.URL || window.webkitURL;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
 
    var shell;
    var dirNav;
    var cmdLine_     = document.querySelector(cmdLineContainer);
    var output_      = document.querySelector(outputContainer);
    var autoComplete = new AutoComplete();
    var fs_          = null;
    var cwd_         = null;
    var history_     = [];
    var histpos_     = 0;
    var histtemp_    = 0;

    window.addEventListener('click', function(e) {
        cmdLine_.focus();
    }, false);

    storage.setDataPath(os.homedir());

    storage.get('nativeCommands', (err, data)=>{
        if(err) {
            console.log(err);
        }
        if(Object.keys(data).length === 0 && data.constructor === Object) {
            storage.set('nativeCommands', nativeCmds);
        }
        else {
            nativeCmds = data;
        }
        shell  = new Shell(nativeCmds.list);
        dirNav = new DirNavigation($(".nav-group"), $(".nav-group-title"), $("#title-bar-btns"), shell);
    });

    cmdLine_.addEventListener('click', inputTextClick_, false);
    cmdLine_.addEventListener('keydown', historyHandler_, false);
    cmdLine_.addEventListener('keydown', processNewCommand_, false);
    
    $(cmdLineContainer).on('input', ()=>{autoComplete.fillDropDown($(cmdLineContainer).val())});
    
    document.ondragover = document.ondrop = (ev) => {
        ev.preventDefault();
    }; 

    document.body.ondrop = (event) => {
        var path = event.dataTransfer.files[0].path;
        var cmd  = "vim " + path;
        shell.write(cmd, ()=>{/**/});
        event.preventDefault();
    };

    function inputTextClick_(e) {
        this.value = this.value;
    }

    function historyHandler_(e) {
        if (history_.length) {
            if (e.keyCode == 38 || e.keyCode == 40) {
                if (history_[histpos_]) {
                      history_[histpos_] = this.value;
                } 
                else {
                      histtemp_ = this.value;
                }
            }
            if (e.keyCode == 38) { // up
                histpos_--;
                if (histpos_ < 0) {
                    histpos_ = 0;
                }
            } 
            else if (e.keyCode == 40) { // down
                histpos_++;
                if (histpos_ > history_.length) {
                    histpos_ = history_.length;
                }
            }

            if (e.keyCode == 38 || e.keyCode == 40) {
                this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
                this.value = this.value; // Sets cursor to end of input.
            }
        }
    }

    function processNewCommand_(e) {
        if (e.keyCode == 9) { // tab
            e.preventDefault();
            // Implement tab suggest.
        } 
        else if (e.keyCode == 13) { // enter
        // Save shell history.
            if (this.value) {
                history_[history_.length] = this.value;
                histpos_ = history_.length;
            }
            
            var line = document.createElement("HR"); 

            output_.appendChild(line);

            shell.write(this.value, (data)=>{
               if(data === "Changed Directory") {
                   dirNav.refresh();        
               }
               if(data.constructor === Array) {
                   nativeCmds.list = data;
                   storage.set('nativeCommands', nativeCmds);                   
                   //fs.writeFileSync('./config/nativeCommands.json', JSON.stringify(nativeCmds));
                   data = "Command Successfully Registered";
               }
               if(data === "CLEAR") {
                   $(outputContainer).val("");
               }
               else {
                   output(data);
                   output_.appendChild(line);
               }
               $('#output-container').scrollTop($('#output-container')[0].scrollHeight);
               this.value = ''; // Clear/setup line for next input.
            });
        }
    }

    function formatColumns_(entries) {
        var maxName = entries[0].name;
        util.toArray(entries).forEach(function(entry, i) {
            if (entry.name.length > maxName.length) {
                maxName = entry.name;
            }
        });

        var height = entries.length <= 3 ?
            'height: ' + (entries.length * 15) + 'px;' : '';

        // 12px monospace font yields ~7px screen width.
        var colWidth = maxName.length * 7;

        return ['<div class="ls-files" style="-webkit-column-width:',
                colWidth, 'px;', height, '">'];
    }

    function output(html) {
        output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
    }

    // Cross-browser impl to get document's height.
    function getDocHeight_() {
        var d = document;
        return Math.max(
            Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
            Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
            Math.max(d.body.clientHeight, d.documentElement.clientHeight)
        );
    }

    return {
        init: function() {
            output('<h2 style="letter-spacing: 4px">Shelly</h2></p><p>Improved UI Shell Terminal</p><p>' + new Date() + '</p><hr>');
        },
        output: output
    }
};
