var gui = require('nw.gui');
var win = gui.Window.get();
var cp = require('child_process');
var fs = require("fs");

//OS X Specific Window Menu
if (process.platform === "darwin") {
    var mb = new gui.Menu({type:"menubar"});
    mb.createMacBuiltin("nwMAME");
    win.menu = mb;
}

//Disable any file to drag into application window
window.addEventListener("dragover", function (e) {
    e = e || event;
    e.preventDefault();
}, false);

window.addEventListener("drop", function (e) {
    e = e || event;
    e.preventDefault();
}, false);

//All pre-defined application settings
var excludedFiles = [".DS_Store", "Thumbs.db", ".", ".."],
    missingCoverImage = "public/img/noCoverSepia.jpg";

//Initial Semantic UI functions
angular.element(document).ready(function () {
    angular.element('.ui.checkbox').checkbox();
    angular.element('.ui.dropdown').dropdown();
});

//Global functions
var posixizePath = function(path){
    return path.split("\\").join("/");
};

//Start Angular part of main application
var app = angular.module("nwMAME", ['ngAnimate']);

app.factory("settingsStorage", function(){
    return {
        readAllSettings: function (){
            try{
                var tempSet = JSON.parse(localStorage.getItem("appSettings"));
                if( tempSet !== null )
                {
                    return tempSet;
                }
                return {};
            } catch(e){
                return {};
            }
        },
        writeAllSettings: function (settingsObject) {
            localStorage.setItem("appSettings", JSON.stringify(settingsObject));
        }
    };
});

app.directive("largeCover", function($timeout, settingsStorage){
    return {
        restrict: "E",
        replace: true,
        scope:{
            shortName: "@",
            fullName: "@"
        },
        template: '<div class="nwMAME-largeGameItem" ng-dblclick="run(shortName)" title="{{::fullName}}"><div class="nwMAME-gameCover"></div><div class="nwMAME-gameTitle">{{::fullName}}</div></div>',

        link: function(scope, element){
            var allSettings = settingsStorage.readAllSettings();

            scope.run = function(name){
                scope.$parent.runGame(name);
            };

            var bck = 'url("' + missingCoverImage + '") #222222 no-repeat center center';

            if(
                allSettings.hasOwnProperty("coverDirectory") &&
                allSettings.hasOwnProperty("coverExtension")
            ){
                var filePath = allSettings.coverDirectory +
                    "/" + scope.shortName + allSettings.coverExtension;

                if (fs.existsSync(filePath)) {
                    bck = 'url("' + filePath + '") #222222 no-repeat center center';
                }
            }

            element[0].firstChild.style.background = bck;
            element[0].firstChild.style.backgroundSize = "cover";
        }
    };
});

app.directive("squareCover", function($timeout, settingsStorage){
    return {
        restrict: "E",
        replace: true,
        scope:{
            shortName: "@",
            fullName: "@"
        },
        template: '<div class="nwMAME-squareGameItem" ng-dblclick="run(shortName)" title="{{::fullName}}"><div class="nwMAME-gameCover"></div><div class="nwMAME-gameTitle">{{::fullName}}</div></div>',

        link: function(scope, element){
            var allSettings = settingsStorage.readAllSettings();

            scope.run = function(name){
                scope.$parent.runGame(name);
            };

            var bck = 'url("' + missingCoverImage + '") #222222 no-repeat center center';

            if(
                allSettings.hasOwnProperty("coverDirectory") &&
                allSettings.hasOwnProperty("coverExtension")
            ){
                var filePath = allSettings.coverDirectory +
                    "/" + scope.shortName + allSettings.coverExtension;

                if (fs.existsSync(filePath)) {
                    bck = 'url("' + filePath + '") #222222 no-repeat center center';
                }
            }

            element[0].firstChild.style.background = bck;
            element[0].firstChild.style.backgroundSize = "cover";
        }
    };
});

app.directive("semanticToggle", function () {
    return {
        restrict: "E",
        require: "ngModel",
        transclude: true,
        replace: true,

        template: '<div class="ui toggle checkbox"><input type="checkbox"><label ng-transclude></label></div>',

        link: function (scope, element, attributes, controller) {
            var checked = false;
            var input = element.find('input');

            element.on('click', function () {
                checked = !checked;
                controller.$setViewValue(checked);
            });

            controller.$render = function() {
                checked = controller.$viewValue;
                if(checked){
                    angular.element(element).checkbox("set checked");
                } else {
                    angular.element(element).checkbox("set unchecked");
                }
            };
        }
    };
});

app.directive("fileSelector", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attributes, controller) {
            var fileInputElement = element.find("input[type=file]")[0];
            fileInputElement.style.display = "none";
            var oldValue = fileInputElement.value;

            fileInputElement.onchange = function () {
                if (fileInputElement.value === "") {
                    controller.$setViewValue(posixizePath(oldValue));
                    scope.$apply();
                } else {
                    controller.$setViewValue(posixizePath(fileInputElement.value));
                    scope.$apply();
                }
            };

            element.on("click", function () {
                oldValue = fileInputElement.value;
                fileInputElement.click();
            });
        }
    };
});

app.controller('AppCtrl', function ($scope, $timeout, settingsStorage) {
    //Define app's initial variables
    $scope.settingState = "mame";
    $scope.sessionLogs = [];

    //Private App Functions
    var settingsToScope = function(){
        var allSettings = settingsStorage.readAllSettings();

        $scope.userGames = (allSettings.hasOwnProperty("userGames")) ? allSettings.userGames : [];

        $scope.mameDirectory = (allSettings.hasOwnProperty("mameDirectory")) ? allSettings.mameDirectory : "";
        $scope.mameExecutable = (allSettings.hasOwnProperty("mameExecutable")) ? allSettings.mameExecutable : "";

        $scope.romsDirectory = (allSettings.hasOwnProperty("romsDirectory")) ? allSettings.romsDirectory : "";
        $scope.biosDirectory = (allSettings.hasOwnProperty("biosDirectory")) ? allSettings.biosDirectory : "";
        $scope.deviceDirectory = (allSettings.hasOwnProperty("deviceDirectory")) ? allSettings.deviceDirectory : "";

        $scope.enableCheats = (allSettings.hasOwnProperty("enableCheats")) ? allSettings.enableCheats : false;
        $scope.cheatPath = (allSettings.hasOwnProperty("cheatPath")) ? allSettings.cheatPath : "";

        $scope.mameWindow = (allSettings.hasOwnProperty("mameWindow")) ? allSettings.mameWindow : false;

        $scope.coverDirectory = (allSettings.hasOwnProperty("coverDirectory")) ? allSettings.coverDirectory : "";
        $scope.coverExtension = (allSettings.hasOwnProperty("coverExtension")) ? allSettings.coverExtension : ".jpg";
        $scope.coverSize = (allSettings.hasOwnProperty("coverSize")) ? allSettings.coverSize : "large";
    }; //End of settingsToScope

    var scopeToSettings = function(){
        var allSettings = {
            userGames: $scope.userGames,

            mameDirectory: $scope.mameDirectory,
            mameExecutable: $scope.mameExecutable,

            romsDirectory: $scope.romsDirectory,
            biosDirectory: $scope.biosDirectory,
            deviceDirectory: $scope.deviceDirectory,

            enableCheats: $scope.enableCheats,
            cheatPath: $scope.cheatPath,

            mameWindow: $scope.mameWindow,

            coverDirectory: $scope.coverDirectory,
            coverExtension: $scope.coverExtension,
            coverSize: $scope.coverSize
        };

        settingsStorage.writeAllSettings(allSettings);
    }; //End of scopeToSettings

    var createMameCommand = function (gameName) {
        var commandSeperator = (process.platform === "darwin" || process.platform === "linux") ? ";":"&",
            pathSeperator = ";",
            cheatArg = "-cheat",
            windowArg = "-window",
            tempCmd = "cd ";

        tempCmd += '"' + $scope.mameDirectory + '"';
        tempCmd += " " + commandSeperator + " ";
        tempCmd += '"' + $scope.mameExecutable + '"';
        tempCmd += " ";
        tempCmd += gameName;
        tempCmd += " -rompath ";
        tempCmd += '"' + $scope.romsDirectory + pathSeperator + $scope.biosDirectory + pathSeperator + $scope.deviceDirectory + '"';

        //Cheat part of command - optional
        if ($scope.enableCheats === true && $scope.cheatPath) {
            tempCmd += " -cheatpath ";
            tempCmd += '"' + $scope.cheatPath.replace(".7z", "") + '"';
            tempCmd += " ";
            tempCmd += cheatArg;
        }

        //Window Mode part of command - optional
        if ($scope.mameWindow === true) {
            tempCmd += " ";
            tempCmd += windowArg;
        }

        return tempCmd;
    }; //End of createMameCommand

    var checkRequiredSettings = function () {
        return !!(fs.existsSync($scope.mameDirectory) &&
        fs.existsSync($scope.mameExecutable) &&
        fs.existsSync($scope.romsDirectory) &&
        fs.existsSync($scope.biosDirectory) &&
        fs.existsSync($scope.deviceDirectory));
    }; //End of checkMandatorySettings

    var settingsModalOnDeny = function(){
        //check required settings
        if(!checkRequiredSettings()){
            if(!confirm("Are you sure? Some of required settings are not defined?\n\nRequired Settings :\n- Mame Output Directory\n- Mame Executable\n- Roms Directory\n- BIOS Directory\n- Device Directory"))
            {
                return false;
            } else {
                $scope.$apply(function(){
                    settingsToScope();
                });
            }
        } else {
            $scope.$apply(function(){
                settingsToScope();
            });
        }
    }; //End of settingsModalOnDeny

    var settingsModalOnApprove = function(){
        //check all settings
        if(checkRequiredSettings()){
            $scope.$apply(function(){
                scopeToSettings();
                settingsToScope();
            });
        } else {
            alert("You should define all required settings!\n\nRequired Settings :\n- Mame Output Directory\n- Mame Executable\n- Roms Directory\n- BIOS Directory\n- Device Directory");
            return false;
        }
    }; //End of settingsModalOnApprove

    //Public App Functions
    $scope.runGame = function (gameName) {
        if(checkRequiredSettings()){
            //One more check for mame.ini file for proper execution
            var iniPath = $scope.mameExecutable.split("/");
            iniPath.pop();
            iniPath.push("mame.ini");
            iniPath = iniPath.join("/");

            if(!fs.existsSync(iniPath)){
                var gameDimmer = angular.element(".nwMAME-gameRunning");
                gameDimmer.dimmer({closable: false}).dimmer("show"); //Show game dimmer

                $timeout(function () {
                    var fullCommand = createMameCommand(gameName);

                    cp.exec(fullCommand, function (error, stdout, stderr) {
                        if (stdout !== null && stdout !== "") {
                            $scope.sessionLogs.unshift({
                                type: "stdout",
                                output: stdout,
                                process: gameName,
                                date: Date.now()
                            });
                        }

                        if (stderr !== null && stderr !== "") {
                            $scope.sessionLogs.unshift({
                                type: "stderr",
                                output: stderr,
                                process: gameName,
                                date: Date.now()
                            });
                        }

                        if (error !== null && error !== "") {
                            $scope.sessionLogs.unshift({
                                type: "error",
                                output: error,
                                process: gameName,
                                date: Date.now()
                            });
                        }
                        gameDimmer.dimmer("hide"); //Hide game dimmer
                        win.focus(); //Focus nwMAME window
                    });

                }, 1000);
            } else {
                alert(
                    '"mame.ini" file has found next to mame executable!' +
                    '\nYou should delete or rename "mame.ini" file to run games properly with nwMAME settings!'
                );
            }
        } else {
            alert("Some of required settings are not valid. Please check settings window first!");
        }
    }; //End of run

    $scope.settingsModal = function () {
        $scope.settingState = "mame";
        angular.element(".nwMAME-settingsModal")
            .modal({
                closable: false,
                transition: "fly down",
                onDeny: settingsModalOnDeny,
                onApprove: settingsModalOnApprove
            })
            .modal("toggle");
    }; //End of settingsModal

    $scope.updateLibrary = function () {
        if(checkRequiredSettings()){
            alert("Update library process could take time and user interface is probably not going to respond your actions for a while!\n\nPlease be patient and wait until end of the process!");
            cp.exec('"' + $scope.mameExecutable + '" -listfull', {maxBuffer: 10 * 1024 * 1024},
                function (error, stdout, stderr) {
                    if (stdout !== null && stdout !== "") {
                        var re = /(\S+)\s+"(.+)"/gmi;
                        var m;
                        var tempAllGames = [];

                        while ((m = re.exec(stdout)) !== null) {
                            if (m.index === re.lastIndex) {
                                re.lastIndex++;
                            }

                            var tmpShort = m[1];
                            var tmpFull = m[2];

                            tempAllGames.push([tmpShort, tmpFull]);
                        } //End of parsing all games list

                        var readRomDir = fs.readdirSync($scope.romsDirectory);
                        var tempFileArr = [];
                        var tempGamesArr = [];

                        angular.forEach(readRomDir, function (file) {
                            var tempName = file.replace(".zip", "");

                            if (excludedFiles.indexOf(tempName) === -1) {
                                tempFileArr.push(tempName);
                            }
                        }); //Prepare file names for comparison

                        angular.forEach(tempAllGames, function(game){
                            if(tempFileArr.indexOf(game[0]) > -1){
                                tempGamesArr.push(game);
                            }
                        }); //Compare and add games to current library

                        $scope.userGames = tempGamesArr;
                        $scope.sessionLogs.unshift({
                            type: "stdout",
                            output: "Library is updated!",
                            process: "Update library",
                            date: Date.now()
                        });
                        alert("Your MAME library is updated!\nDon't forget the save your settings and have fun :)");

                    } //End of stdout

                    if (stderr !== null && stderr !== "") {
                        $scope.sessionLogs.unshift({
                            type: "stderr",
                            output: stderr,
                            process: "Refresh All Games",
                            date: Date.now()
                        });
                    } //End of stderr

                    if (error !== null && error !== "") {
                        $scope.sessionLogs.unshift({
                            type: "error",
                            output: error,
                            process: "Refresh All Games",
                            date: Date.now()
                        });
                    } //End of error
                });
        } else {
            alert(
                "You have to define required settings first!" +
                "\n\nRequired Settings :" +
                "\n- Mame Output Directory" +
                "\n- Mame Executable" +
                "\n- Roms Directory" +
                "\n- BIOS Directory" +
                "\n- Device Directory"
            );
        }//End of checkRequiredSettings
    }; //End of refreshGameList

    $scope.reloadApplication = function () {
        win.reloadIgnoringCache();
    }; //End of reloadApplication

    $scope.openDevTools = function () {
        win.showDevTools();
    }; //End of openDevTools

    $scope.openGithubPage = function(){
        gui.Shell.openExternal('https://github.com/ozguncagri/nwMAME')
    }; //End of openGithubPage

    //Trigger initial app functions
    settingsToScope();

}); //End of AppCtrl