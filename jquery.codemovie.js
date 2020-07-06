/*!
 * jQuery Code Movie Library v1.0.0
 *
 * Author: Ranjit Singh
 * Date: 2020-07-04
 * 
 * Released under the MIT license
 * 
 */

(function ($) {
    "use strict";
    var pluginName = "codemovie";

    $.fn.codemovie = function (option) {
        if(this.length > 1){
            this.each(function () {$(this).codemovie(option);});
            return this;
        }

        var instance = this;
        var $this = $(this);

        var fullScreenSvg = '<svg height="30" version="1.1" viewBox="0 0 36 36" width="30" fill="#fff"><path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path><path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path><path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path><path d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path></svg>';
        var exitFullScreenSvg = '<svg version="1.1" height="30" width="30" viewBox="-10 -13 60 60" fill="#fff"><g><g><g><polygon style="fill:#fff;" points="24.586,27.414 29.172,32 32,29.172 27.414,24.586 32,20 20,20 20,32"/><polygon style="fill:#fff;" points="0,12 12,12 12,0 7.414,4.586 2.875,0.043 0.047,2.871 4.586,7.414"/><polygon style="fill:#fff;" points="0,29.172 2.828,32 7.414,27.414 12,32 12,20 0,20 4.586,24.586"/><polygon style="fill:#fff;" points="20,12 32,12 27.414,7.414 31.961,2.871 29.133,0.043 24.586,4.586 20,0"/></g></g></g></svg>';
        var replaySvg = '<svg fill="#fff" height="25" width="25" viewBox="-150 -200 800 800"><path d="m512 256c0 68.378906-26.628906 132.667969-74.980469 181.019531-48.351562 48.351563-112.640625 74.980469-181.019531 74.980469s-132.667969-26.628906-181.019531-74.980469c-48.351563-48.351562-74.980469-112.640625-74.980469-181.019531h40c0 119.101562 96.898438 216 216 216s216-96.898438 216-216-96.898438-216-216-216c-77.902344 0-148.230469 41.144531-186.570312 107h60.570312v40h-130v-130h40v61.492188c18.472656-29.011719 42.675781-54.09375 71.480469-73.828126 42.65625-29.21875 92.628906-44.664062 144.519531-44.664062 68.378906 0 132.667969 26.628906 181.019531 74.980469 48.351563 48.351562 74.980469 112.640625 74.980469 181.019531zm-150.027344.566406-169.972656 98.21875v-196.441406zm-129.972656 28.910156 50.027344-28.910156-50.027344-28.910156zm0 0"></path></svg>';
        var $controlsContainer = $("<div class=\"cm-control-container\"><div class=\"cm-left-control\"><button class=\"cm-button cm-play-btn pause\"></button><span class=\"cm-button replay\">"+replaySvg+"</span></div><div class=\"cm-progress\"><span class=\"cm-progress-tooltip\"></span><span class=\"cm-button cm-progress-value\">&nbsp;</span><div class=\"cm-progress-position\"></div></div><div class=\"cm-right-control\"><span class=\"cm-time-left\">-3:09</span>&nbsp;<span class=\"cm-button fullscreen\">" + fullScreenSvg + "</span></div></div>");
        var defaults = {version : "1.0.0", slideDurationInMilliSeconds : 5000, texts : [], height : 500, width : 600};
        var options = $.extend({}, defaults, option);

        var OperationTypeEnum = {
            Substitution : 2,
            Deletion : 3,
            Insertion : 4
        };
        var timeBuffer = 2000;
        var operationWithIndex = [];
        var comparisonTimeOut = null, writeTextTimer = null, nextTextTime = null;
        var currentIndex = 0;
        var writeOperationOver = false;

        this.init = function () {
            $this.css({"height" : options.height, "width" : options.width}).addClass("code-movie-outer-container").data("initialized." + pluginName, true).append($controlsContainer.clone());
            $this.find(".codeMovieContent").css({"height" : options.height - $(".cm-control-container").height(), "width" : options.width});
            $(".cm-play-btn").on("click", function () {
                if($(this).hasClass("pause"))
                    instance.stop();
                else{
                    $(".cm-play-btn").removeClass("play").addClass("pause");
                    runComparisonAndWrite(currentIndex - 1, false);
                }
            });

            var hoverIndex;
            $(".cm-progress, .cm-progress-position").mousemove(function (e) {
                var progressWidth = $(".cm-progress").width();
                var left = e.pageX - $(this).offset().left;
                var percentage = Math.max(0, Math.min(100, left * 100 / progressWidth));
                hoverIndex = Math.ceil(percentage * options.texts.length / 100);
                $(".cm-progress-tooltip").show().text(getTime(hoverIndex * options.slideDurationInMilliSeconds / 1000)).css("left", left - 25);
            }).on("click", function () {
                var isRunning = $(".cm-play-btn").hasClass("pause");
                if(isRunning){
                    instance.stop();
                    $(".cm-play-btn").removeClass("play").addClass("pause");
                    runComparisonAndWrite(hoverIndex - 1, true, true);
                }
                else{
                    updateProgress(hoverIndex, options.texts.length);
                    writeTexts(options.texts[hoverIndex - 1], true);
                }
            });
            $(".cm-control-container").mouseout(function () {$(".cm-progress-tooltip").hide();});
            $(".cm-button.fullscreen").on("click", function () {
                var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || (document.msFullscreenElement != null);
                if(isFullScreen)
                    closeFullScreen();
                else
                    openFullScreen();
            });
            $(".cm-button.replay").on("click", function () {
                $(".cm-play-btn").show();
                $(this).hide();
                instance.start();
            });
            bindFullScreenChange();
        }

        this.start = function () {
            if(!options.texts || options.texts.length == 0)
                return;

            $(".cm-play-btn").removeClass("play").addClass("pause");
            runComparisonAndWrite(0, true);
        }

        this.stop = function () {
            clearTimeout(comparisonTimeOut);
            clearTimeout(writeTextTimer);
            clearTimeout(nextTextTime);
            $(".cm-play-btn").removeClass("pause").addClass("play");
        }

        function runComparisonAndWrite(index, reset, withoutTimer) {
            writeOperationOver = true;
            var camparisonHandler = function () {
                //in case of in active tabs lower timer crampy, so this variable will ensure that no two timeout overlap each other
                if(writeOperationOver === false){
                    comparisonTimeOut = setTimeout(camparisonHandler, options.slideDurationInMilliSeconds);
                    return;
                }
                updateProgress(index + 2, options.texts.length);
                if(options.texts.length > index + 1){
                    getRequiredOperations($this.find(".codeMovieContent")[0].innerText, options.texts[index + 1]);
                    writeNextText(options.texts[index + 1]);
                    index++;
                    currentIndex = Math.max(1, index);
                    comparisonTimeOut = setTimeout(camparisonHandler, options.slideDurationInMilliSeconds);
                }
                else{
                    $(".cm-play-btn").removeClass("pause").addClass("play").hide();
                    $(".cm-button.replay").show();
                }
            }

            if(reset && options.texts.length > index){
                updateProgress(index + 1, options.texts.length);
                writeTexts(options.texts[index], withoutTimer);
                comparisonTimeOut = setTimeout(camparisonHandler, options.slideDurationInMilliSeconds);
            }
            else if(options.texts.length > index)
                camparisonHandler();
        }

        //this is a generic method to find the distance between two texts using Levenshtein Distance Algorithm
        function getEditDistance(text1, text2) {
            if(text1.length == 0)
                return text2.length;
            if(text2.length == 0)
                return text1.length;

            var matrix = [];

            // increment along the first column of each row
            var i;
            for(i = 0; i <= text2.length; i++)
                matrix[i] = [i];

            // increment each column in the first row
            var j;
            for(j = 0; j <= text1.length; j++)
                matrix[0][j] = j;

            // Fill in the rest of the matrix
            for(i = 1; i <= text2.length; i++){
                for(j = 1; j <= text1.length; j++){
                    if(text2.charAt(i - 1) == text1.charAt(j - 1))
                        matrix[i][j] = matrix[i - 1][j - 1];
                    else{
                        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                            Math.min(matrix[i][j - 1] + 1, // insertion
                                matrix[i - 1][j] + 1)); // deletion
                    }
                }
            }
            return matrix;
        };

        function getRequiredOperations(text1, text2) {
            var editDistances = getEditDistance(text1, text2);
            var i = text2.length, j = text1.length;
            operationWithIndex = [];
            while(i >= 0 && j >= 0){
                var isSubmissionWord = true;
                var initialI = i;
                var initialJ = j;
                var initialDistance = editDistances[i][j];
                var upperCellDistance = GetDistance(i - 1, j, editDistances);
                var leftCellDistance = GetDistance(i, j - 1, editDistances);
                var diagonalCellDistance = GetDistance(i - 1, j - 1, editDistances);
                if(i > 0 && j > 0 && (diagonalCellDistance <= upperCellDistance && diagonalCellDistance <= leftCellDistance)){
                    if(diagonalCellDistance < initialDistance)
                        storeOperation(text1, text2, i, j, OperationTypeEnum.Substitution);
                    else if(text2.charAt(i - 1) != text1.charAt(j - 1))
                        storeOperation(text1, text2, i, j, OperationTypeEnum.Substitution);

                    i--;
                    j--;
                }
                else if(j > 0 && leftCellDistance <= upperCellDistance && leftCellDistance <= diagonalCellDistance){
                    storeOperation(text1, text2, null, j, OperationTypeEnum.Deletion);
                    j--;
                    isSubmissionWord = false;
                }
                else if(i > 0){
                    storeOperation(text1, text2, i, null, OperationTypeEnum.Insertion);
                    i--;
                }

                var currentChar = isSubmissionWord && initialI > 0 ? text2.charAt(initialI - 1) : initialJ > 0 ? text1.charAt(initialJ - 1) : null;
                if(currentChar == null)
                    break;
            }
            operationWithIndex.reverse();
        }

        function storeOperation(text1, text2, i, j, type) {
            //text1 and text2 is for logging purpose only
            operationWithIndex.push({
                type : type,
                index1 : i - 1,
                index2 : j - 1
            });
        }

        function GetDistance(i, j, editDistance) {
            if(i < 0 || j < 0 || i > editDistance.length || j > editDistance[0].length)
                return 2147483647; //int max value
            return editDistance[i][j];
        }

        //write text of previous slide
        function writeTexts(text, withoutTimer) {
            var divContent = $this.find(".codeMovieContent")[0];
            if(withoutTimer){
                divContent.innerText = text;
                return;
            }

            var i = 0;
            divContent.innerText = "";
            writeOperationOver = false;
            var timeIntervalInMilliSeconds = (options.slideDurationInMilliSeconds - timeBuffer) / text.length;
            var writeHandler = function () {
                writeTextTimer = setTimeout(function () {
                    if(i < text.length){
                        divContent.innerText += text[i];
                        i++;
                        writeHandler();
                        divContent.scrollTop = divContent.scrollHeight;
                    }
                    else
                        writeOperationOver = true;
                }, timeIntervalInMilliSeconds);
            }

            writeHandler();
        }

        //write edited texts
        function writeNextText(nextText) {
            var divContent = $this.find(".codeMovieContent")[0];
            var i = 0;
            var indexAdjust = 0;
            var timeIntervalInMilliSeconds = (options.slideDurationInMilliSeconds - timeBuffer) / operationWithIndex.length;
            writeOperationOver = false;
            var writeHandler = function () {
                writeTextTimer = setTimeout(function () {
                    if(i < operationWithIndex.length){
                        var ji = operationWithIndex[i];
                        var text = divContent.innerText;
                        if(ji.type === OperationTypeEnum.Deletion){
                            divContent.innerText = text.substring(0, ji.index2 - indexAdjust) + text.substring(ji.index2 + 1 - indexAdjust, text.length);
                            indexAdjust++;
                        }
                        else if(ji.type === OperationTypeEnum.Insertion)
                            divContent.innerText = text.substring(0, ji.index1) + nextText[ji.index1] + text.substring(ji.index1, text.length);
                        else if(ji.type === OperationTypeEnum.Substitution)
                            divContent.innerText = text.substring(0, ji.index1) + nextText[ji.index1] + text.substring(ji.index1 + 1, text.length);
                        i++;
                        writeHandler();
                        divContent.scrollTop = divContent.scrollHeight;
                    }
                    else
                        writeOperationOver = true;
                }, timeIntervalInMilliSeconds);
            }
            writeHandler();
        }

        function updateProgress(value, outOf) {
            var percentage = Math.max(0, Math.min(100, (value * 100 / outOf)));
            $(".cm-control-container").find(".cm-progress-value").css("left", percentage + "%");
            $(".cm-progress-position").css("width", percentage + "%");
            var totalSeconds = (outOf - value) * options.slideDurationInMilliSeconds / 1000;
            $(".cm-time-left").text("-" + getTime(totalSeconds));
        }

        function getTime(totalSeconds) {
            if(totalSeconds < 0)
                totalSeconds = 0;
            var seconds = totalSeconds % 60;
            var minutes = totalSeconds > 60 ? (totalSeconds / 60) % 60 : 0;
            var hours = totalSeconds > 3600 ? (totalSeconds / 3600) % 60 : 0;
            return (hours > 0 ? getFormatedNumber(hours) + ":" : "") + getFormatedNumber(minutes) + ":" + getFormatedNumber(seconds);
        }

        function openFullScreen() {
            var elem = $this[0];
            var fullScreenEnabled = false;
            if(elem.requestFullscreen){
                elem.requestFullscreen();
                fullScreenEnabled = true;
            }
            else if(elem.mozRequestFullScreen){/* Firefox */
                elem.mozRequestFullScreen();
                fullScreenEnabled = true;
            }
            else if(elem.webkitRequestFullscreen){/* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
                fullScreenEnabled = true;
            }
            else if(elem.msRequestFullscreen){/* IE/Edge */
                elem = document.body; //overwrite the element (for IE)
                elem.msRequestFullscreen();
                fullScreenEnabled = true;
            }
            if(fullScreenEnabled)
                $(".cm-button.fullscreen").html(exitFullScreenSvg);
        }

        function closeFullScreen() {
            var elem = document;
            var fullScreenEnabled = false;
            if(elem.exitFullscreen){
                elem.exitFullscreen();
                fullScreenEnabled = true;
            }
            else if(elem.mozCancelFullScreen){/* Firefox */
                elem.mozCancelFullScreen();
                fullScreenEnabled = true;
            }
            else if(elem.webkitExitFullscreen){/* Chrome, Safari and Opera */
                elem.webkitExitFullscreen();
                fullScreenEnabled = true;
            }
            else if(elem.msExitFullscreen){/* IE/Edge */
                elem = document.body; //overwrite the element (for IE)
                elem.msExitFullscreen();
                fullScreenEnabled = true;
            }
            if(fullScreenEnabled)
                $(".cm-button.fullscreen").html(fullScreenSvg);
        }

        function bindFullScreenChange() {
            $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function () {
                var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || (document.msFullscreenElement != null);

                console.log(isFullScreen);
                $(".cm-button.fullscreen").html(isFullScreen ? exitFullScreenSvg : fullScreenSvg);
            });
        }

        function getFormatedNumber(num) {return num > 9 ? num : "0" + num;}

        if(!$this.data("initialized." + pluginName))
            this.init();

        return this; //for chaining purpose
    }
})(jQuery);