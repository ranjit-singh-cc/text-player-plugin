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
    var pluginName = "textplayer";
    var contentClassName = ".textPlayerContent";

    $.fn.textplayer = function (option) {
        if(this.length > 1){
            this.each(function () {$(this).textplayer(option);});
            return this;
        }

        var instance = this;
        var $this = $(this);

        var fullScreenSvg = '<svg height="30" version="1.1" viewBox="0 0 36 36" width="30" fill="#fff" style="vertical-align:middle"><path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path><path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path><path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path><path d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path></svg>';
        var exitFullScreenSvg = '<svg version="1.1" height="30" width="30" viewBox="-10 -13 60 60" fill="#fff" style="vertical-align:middle"><g><g><g><polygon style="fill:#fff;" points="24.586,27.414 29.172,32 32,29.172 27.414,24.586 32,20 20,20 20,32"/><polygon style="fill:#fff;" points="0,12 12,12 12,0 7.414,4.586 2.875,0.043 0.047,2.871 4.586,7.414"/><polygon style="fill:#fff;" points="0,29.172 2.828,32 7.414,27.414 12,32 12,20 0,20 4.586,24.586"/><polygon style="fill:#fff;" points="20,12 32,12 27.414,7.414 31.961,2.871 29.133,0.043 24.586,4.586 20,0"/></g></g></g></svg>';
        var replaySvg = '<svg fill="#fff" height="25" width="25" viewBox="-150 -200 800 800" title="replay"><path d="m512 256c0 68.378906-26.628906 132.667969-74.980469 181.019531-48.351562 48.351563-112.640625 74.980469-181.019531 74.980469s-132.667969-26.628906-181.019531-74.980469c-48.351563-48.351562-74.980469-112.640625-74.980469-181.019531h40c0 119.101562 96.898438 216 216 216s216-96.898438 216-216-96.898438-216-216-216c-77.902344 0-148.230469 41.144531-186.570312 107h60.570312v40h-130v-130h40v61.492188c18.472656-29.011719 42.675781-54.09375 71.480469-73.828126 42.65625-29.21875 92.628906-44.664062 144.519531-44.664062 68.378906 0 132.667969 26.628906 181.019531 74.980469 48.351563 48.351562 74.980469 112.640625 74.980469 181.019531zm-150.027344.566406-169.972656 98.21875v-196.441406zm-129.972656 28.910156 50.027344-28.910156-50.027344-28.910156zm0 0"></path></svg>';
        var dayNightModeSvg = '<svg height="30" viewBox="-20 -100 800 800" width="30" fill="#fff" style="vertical-align:middle"><path d="m142.925781 147.066406c3.925781 3.789063 10.164063 3.738282 14.019531-.121094 3.859376-3.855468 3.910157-10.09375.121094-14.019531l-59.996094-59.996093c-3.925781-3.789063-10.164062-3.738282-14.019531.121093-3.859375 3.855469-3.910156 10.09375-.121093 14.019531zm0 0"/><path d="m100 299.996094c0-5.523438-4.480469-10-10-10h-80c-5.523438 0-10 4.476562-10 10 0 5.523437 4.476562 10 10 10h80c5.519531 0 10-4.476563 10-10zm0 0"/><path d="m142.925781 452.921875-59.996093 60c-2.597657 2.507813-3.644532 6.230469-2.726563 9.726563.914063 3.496093 3.644531 6.226562 7.140625 7.136718 3.496094.917969 7.214844-.125 9.726562-2.722656l59.996094-60c3.789063-3.925781 3.738282-10.160156-.121094-14.019531-3.855468-3.855469-10.09375-3.910157-14.019531-.121094zm0 0"/><path d="m554.492188 353.714844c-18.222657 11.777344-39.605469 17.707031-61.292969 16.996094-65.636719-.867188-118.195313-54.699219-117.496094-120.34375.4375-50.664063 31.484375-96.023438 78.546875-114.777344 3.976562-1.511719 6.5625-5.363282 6.449219-9.609375-.109375-4.25-2.890625-7.964844-6.9375-9.265625-18.78125-5.128906-38.234375-7.394532-57.699219-6.714844-30.042969.03125-59.613281 7.503906-86.066406 21.746094v-121.746094c0-5.523438-4.476563-10-10-10-5.523438 0-10 4.476562-10 10v101.066406c-96.589844 10.292969-169.859375 91.792969-169.859375 188.929688 0 97.136718 73.269531 178.628906 169.859375 188.925781v101.070313c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-121.746094c47.402344 25.480468 103.636718 28.734375 153.664062 8.890625 50.023438-19.84375 88.738282-60.765625 105.78125-111.808594 1.394532-4.050781.058594-8.53125-3.320312-11.160156-3.378906-2.621094-8.054688-2.804688-11.628906-.453125zm-414.496094-53.71875c.132812-86.082032 64.527344-158.507813 150-168.71875v337.4375c-85.472656-10.210938-149.867188-82.636719-150-168.71875zm256.066406 169.996094c-30.4375-.007813-60.261719-8.578126-86.066406-24.722657v-290.550781c25.804687-16.148438 55.628906-24.710938 86.066406-24.722656 7.710938 0 15.941406.152344 24.121094.800781-39.847656 26.8125-63.957032 71.515625-64.480469 119.539063-.695313 76.683593 60.8125 139.46875 137.496094 140.347656 15.914062.253906 31.75-2.265625 46.792969-7.453125-27.910157 53.621093-83.480469 87.117187-143.929688 86.761719zm0 0"/><path d="m599.472656 212.667969c-1.195312-3.566407-4.285156-6.15625-8.003906-6.710938l-36.179688-5.539062-16.277343-34.667969c-1.648438-3.511719-5.175781-5.746094-9.050781-5.746094s-7.402344 2.234375-9.050782 5.746094l-16.277344 34.667969-36.179687 5.539062c-3.703125.566407-6.777344 3.15625-7.96875 6.707031-1.191406 3.546876-.296875 7.46875 2.316406 10.148438l26.511719 27.183594-6.269531 38.4375c-.613281 3.777344.984375 7.574218 4.109375 9.78125 3.128906 2.199218 7.238281 2.429687 10.589844.578125l32.25-17.871094 32.25 17.824219c1.476562.820312 3.140624 1.253906 4.828124 1.25 2.9375 0 5.71875-1.289063 7.617188-3.527344 1.90625-2.230469 2.726562-5.1875 2.253906-8.085938l-6.269531-38.386718 26.476563-27.128906c2.632812-2.695313 3.53125-6.636719 2.324218-10.199219zm-46.640625 26.929687c-2.214843 2.269532-3.222656 5.457032-2.707031 8.585938l3.769531 23.101562-19.074219-10.539062c-3.007812-1.660156-6.648437-1.660156-9.65625 0l-19.074218 10.539062 3.769531-23.101562c.515625-3.128906-.492187-6.316406-2.707031-8.585938l-16.40625-16.824218 22.214844-3.398438c3.296874-.5 6.121093-2.609375 7.539062-5.628906l9.492188-20.210938 9.492187 20.210938c1.414063 3.019531 4.242187 5.128906 7.539063 5.628906l22.214843 3.398438zm0 0"/></svg>';
        var $controlsContainer = $("<div class=\"cm-control-container\"><div class=\"cm-left-control\"><button class=\"cm-button cm-play-btn pause\"></button><span class=\"cm-button replay\">"+replaySvg+"</span></div><div class=\"cm-progress\"><span class=\"cm-progress-tooltip\"></span><span class=\"cm-button cm-progress-value\">&nbsp;</span><div class=\"cm-progress-position\"></div></div><div class=\"cm-right-control\"><span class=\"cm-time-left\">-3:09</span>&nbsp;<span class=\"cm-button fullscreen\" title=\"Toggle full screen mode\">" + fullScreenSvg + "</span><span class=\"cm-button day-night-mode\" title=\"Toggle day night mode\">"+dayNightModeSvg+"</span></div></div>");
        var $changeLog = $("<div class=\"cm-change-log\"></div>")
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
            $this.css({"height" : options.height, "width" : options.width}).addClass("code-movie-outer-container").data("initialized." + pluginName, true).append($controlsContainer.clone()).append($changeLog.clone());
            $this.find(contentClassName).css({"height" : options.height - $this.find(".cm-control-container").height(), "width" : options.width});
            $this.find(".cm-play-btn").on("click", function () {
                if($(this).hasClass("pause"))
                    instance.stop();
                else{
                    $(this).removeClass("play").addClass("pause");
                    runComparisonAndWrite(currentIndex, false);
                }
            });

            var hoverIndex;
            $this.find(".cm-progress, .cm-progress-position").mousemove(function (e) {
                var progressWidth = $this.find(".cm-progress").width();
                var left = e.pageX - $(this).offset().left;
                var percentage = Math.max(0, Math.min(100, left * 100 / progressWidth));
                hoverIndex = Math.ceil(percentage * options.texts.length / 100);
                $this.find(".cm-progress-tooltip").show().text(getTime(hoverIndex * options.slideDurationInMilliSeconds / 1000)).css("left", left - 25);
            }).on("click", function () {
                var isRunning = $this.find(".cm-play-btn").hasClass("pause");
                if(isRunning){
                    instance.stop();
                    $this.find(".cm-play-btn").removeClass("play").addClass("pause");
                    runComparisonAndWrite(hoverIndex - 1, true, true);
                }
                else{
                    $this.find(".cm-button.replay").hide().end().find(".cm-play-btn").show();
                    $this.trigger(pluginName + ".navigation", hoverIndex - 1);
                    updateProgress(hoverIndex, options.texts.length);
                    writeTexts(options.texts[hoverIndex - 1], true);
                    currentIndex = hoverIndex - 1;
                }
            });
            $this.find(".cm-control-container").mouseout(function () {$this.find(".cm-progress-tooltip").hide();});
            $this.find(".cm-button.fullscreen").on("click", function () {
                var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || (document.msFullscreenElement != null);
                if(isFullScreen)
                    closeFullScreen();
                else
                    openFullScreen();
            });
            $this.find(".cm-button.replay").on("click", function () {
                $this.find(".cm-play-btn").show();
                $(this).hide();
                instance.start();
            });
            $this.find(".cm-button.day-night-mode").on("click", function () {$(".code-movie-outer-container").toggleClass("night");});
            bindFullScreenChange();
        }

        this.start = function () {
            if(!options.texts || options.texts.length == 0)
                return;

            $this.find(".cm-play-btn").removeClass("play").addClass("pause");
            runComparisonAndWrite(0, true);
        }

        this.stop = function () {
            clearTimeout(comparisonTimeOut);
            clearTimeout(writeTextTimer);
            clearTimeout(nextTextTime);
            $this.find(".cm-play-btn").removeClass("pause").addClass("play");
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
                    getRequiredOperations($this.find(contentClassName)[0].innerText, options.texts[index + 1]);
                    $this.trigger(pluginName + ".navigation", index + 1);
                    writeNextText(options.texts[index + 1]);
                    index++;
                    currentIndex = Math.max(1, index);
                    comparisonTimeOut = setTimeout(camparisonHandler, options.slideDurationInMilliSeconds);
                }
                else{
                    $this.find(".cm-play-btn").removeClass("pause").addClass("play").hide();
                    $this.find(".cm-button.replay").show();
                    $this.find(".cm-change-log").hide();
                }
            }

            if(reset && options.texts.length > index){
                $this.trigger(pluginName + ".navigation", index);
                updateProgress(index + 1, options.texts.length);
                writeTexts(options.texts[index], withoutTimer);
                comparisonTimeOut = setTimeout(camparisonHandler, withoutTimer ? 1000 : options.slideDurationInMilliSeconds);
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
            var divContent = $this.find(contentClassName)[0];
            if(withoutTimer){
                divContent.innerText = text;
                divContent.scrollTop = divContent.scrollHeight;
                return;
            }

            var i = 0;
            divContent.innerText = "";
            writeOperationOver = false;
            var timeIntervalInMilliSeconds = (options.slideDurationInMilliSeconds - timeBuffer) / text.length;
            if(timeIntervalInMilliSeconds > 1000)
                timeIntervalInMilliSeconds = 1000;
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
            $this.find(".cm-change-log").show().text((operationWithIndex.length == 0 ? "no" : operationWithIndex.length) + " difference");
            var $divContent = $this.find(contentClassName);
            var divContent = $divContent[0];
            var i = 0;
            var indexAdjust = 0;
            var timeIntervalInMilliSeconds = (options.slideDurationInMilliSeconds - timeBuffer) / operationWithIndex.length;
            if(timeIntervalInMilliSeconds > 1000)
                timeIntervalInMilliSeconds = 1000;
            writeOperationOver = false;
            var contentBound = divContent.getBoundingClientRect();
            var yStart = contentBound.y;
            var yEnd = contentBound.y + contentBound.height - 30;
            var writeHandler = function () {
                writeTextTimer = setTimeout(function () {
                    if(i < operationWithIndex.length){
                        var ji = operationWithIndex[i];
                        var text = divContent.innerText;
                        if(ji.type === OperationTypeEnum.Deletion){
                            divContent.innerHTML = getDecodedText(text.substring(0, ji.index2 - indexAdjust)) + "<span class=\"addition\"></span>" + getDecodedText(text.substring(ji.index2 + 1 - indexAdjust, text.length));
                            indexAdjust++;
                        }
                        else if(ji.type === OperationTypeEnum.Insertion)
                            divContent.innerHTML = getDecodedText(text.substring(0, ji.index1)) + "<span class=\"addition\">"+ getDecodedText(nextText[ji.index1]) + "</span>" + getDecodedText(text.substring(ji.index1, text.length));
                        else if(ji.type === OperationTypeEnum.Substitution)
                            divContent.innerHTML = getDecodedText(text.substring(0, ji.index1))+ "<span class=\"addition\">" + getDecodedText(nextText[ji.index1])+ "</span>" + getDecodedText(text.substring(ji.index1 + 1, text.length));
                        i++;
                        writeHandler();
                        var currentCarretBound = $divContent.find(".addition")[0].getBoundingClientRect();
                        if(currentCarretBound.y < yStart)
                            divContent.scrollTop = divContent.scrollTop - (yStart-currentCarretBound.y);
                        else if(currentCarretBound.y >= yEnd)
                            divContent.scrollTop = divContent.scrollTop + (currentCarretBound.y - yEnd);
                    }
                    else
                        writeOperationOver = true;
                }, timeIntervalInMilliSeconds);
            }
            writeHandler();
        }

        function getDecodedText(text) {return $("<span />").text(text).html();}

        function updateProgress(value, outOf) {
            var percentage = Math.max(0, Math.min(100, (value * 100 / outOf)));
            $this.find(".cm-control-container").find(".cm-progress-value").css("left", percentage + "%");
            $this.find(".cm-progress-position").css("width", percentage + "%");
            var totalSeconds = (outOf - value) * options.slideDurationInMilliSeconds / 1000;
            $this.find(".cm-time-left").text("-" + getTime(totalSeconds));
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
                $this.find(".cm-button.fullscreen").html(exitFullScreenSvg);
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
                $this.find(".cm-button.fullscreen").html(fullScreenSvg);
        }

        function bindFullScreenChange() {
            $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function () {
                var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || (document.msFullscreenElement != null);

                console.log(isFullScreen);
                $this.find(".cm-button.fullscreen").html(isFullScreen ? exitFullScreenSvg : fullScreenSvg);
            });
        }

        function getFormatedNumber(num) {return num > 9 ? num : "0" + num;}

        if(!$this.data("initialized." + pluginName))
            this.init();

        return this; //for chaining purpose
    }
})(jQuery);