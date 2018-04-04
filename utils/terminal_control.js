var AutoComplete  = require('./utils/AutoComplete.js');
var DirNavigation = require('./utils/DirNavigation.js');

var util     = util || {};
util.toArray = function(list) {
    return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer, shell) {
    window.URL               = window.URL || window.webkitURL;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    var cmdLine_     = document.querySelector(cmdLineContainer);
    var output_      = document.querySelector(outputContainer);
    var autoComplete = new AutoComplete();
    var dirNav       = new DirNavigation($(".nav-group"), $(".nav-group-title"), $("#title-bar-btns"), shell);

    const CMDS_  = []; //for original commands

    var fs_       = null;
    var cwd_      = null;
    var history_  = [];
    var histpos_  = 0;
    var histtemp_ = 0;

    window.addEventListener('click', function(e) {
        cmdLine_.focus();
    }, false);

    cmdLine_.addEventListener('click', inputTextClick_, false);
    cmdLine_.addEventListener('keydown', historyHandler_, false);
    cmdLine_.addEventListener('keydown', processNewCommand_, false);
    
    $(cmdLineContainer).on('input', ()=>{autoComplete.fillDropDown($(cmdLineContainer).val())});

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
