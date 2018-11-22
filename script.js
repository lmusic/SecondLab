
var globalPath = 'MainFolder/'; //path to opened folder or requested file
var request = getXmlHttp();

window.onload = openFolder;

//handler on click on any "li" item
function handler(e)
{
    var liName = e.target.innerHTML.toString();
    setPathForRequestedDir(liName)  // path will be written to "globalPath"
    if(isFile(liName)){
        downloadFile();
        return;
    }
    else{
        openFolder()
    }
}

//main functions of App
function deleteCurrentFolder() {
    var arr = globalPath.split('/');
    var value = arr[arr.length-2];
    globalPath = getPrevPath(globalPath);
    var path = globalPath + '?' + 'delete=' + value.toString();
    request.open('GET', path, false);
    request.send(null);
    hideConfirmDialog();
    openFolder();
}
function createNewFolder() {
    var value = document.getElementById('name').value;
    var path = globalPath + '?' + 'create=' + value.toString();
    request.open('GET', path, false);
    request.send(null);
    document.getElementById('name').value = "";
    hideCreateDialog();
    openFolder();
}
function openFolder() {
    // getting list of items in directory from server into "json" variable
    request.open('GET', globalPath.toString(), false);
    request.send(null);
    var json = JSON.parse(request.responseText);

    //Filling Ul in index.html with this elements and writing full path of opened directory.
    FillUl(json);
    SetCurrentDirectoryString();

}
function downloadFile() {
    window.location = globalPath;
    globalPath = getPrevPath(globalPath);
}

//functions Filling and configure Html tags
function SetCurrentDirectoryString() {
    document.getElementById('path').innerHTML = 'Current directory: "' + globalPath.toString() +'"';
    if(globalPath == 'MainFolder/'){
        document.getElementById('deleteButton').style.display = 'none';
    }
    else{
        document.getElementById('deleteButton').style.display = 'block';
    }
}
function FillUl(listOfItems) {
    document.getElementById('UL').innerHTML = '';

    for(var i = 0; i<listOfItems.length;i++){
        CreateNewLiItem(listOfItems[i].toString())
    }
    if(globalPath.split('/').length > 2)
    {
        CreateNewLiItem('back');
    }
}
function CreateNewLiItem(name) {
    var li = document.createElement('li');
    li.innerHTML = name;
    if(name == 'back'){
        li.className = 'back'
    }
    li.addEventListener('click', handler);
    document.getElementById('UL').appendChild(li);
}

//functions for dialog with users
function ShowConfirmDialog(){
    document.getElementById('confirmBlock').style.display = 'block';
    document.getElementById('confirmText').innerHTML = 'Are you sure you want to delete: ' + "<br>" + '"' + globalPath.toString() + '"';
}
function deleteCurrentFolder() {
    var arr = globalPath.split('/');
    var value = arr[arr.length-2];
    globalPath = getPrevPath(globalPath);
    var path = globalPath + '?' + 'delete=' + value.toString();
    request.open('GET', path, false);
    request.send(null);
    hideConfirmDialog();
    openFolder();
}
function showCreateDialog(){
    document.getElementById('block1').style.display = 'block';
}
function hideCreateDialog() {
    document.getElementById('block1').style.display = 'none';
}
function hideConfirmDialog(){
    document.getElementById('confirmBlock').style.display = 'none';
}

//Some supporting functions
function setPathForRequestedDir(liName) {

    if(liName == 'back'){
        globalPath = getPrevPath(globalPath);
    }
    else{
        globalPath = globalPath + liName + '/';
    }
}
function isFile(path) {
    return (path.split('.').length >= 2);
}
function getPrevPath(path) {
    var array = path.split('/');
    var prevPath = '';
    if(typeof array == 'undefined' ){
        return prevPath;
    }
    for (var i = 0;i<array.length-2;i++){
        prevPath = prevPath + array[i].toString() + '/';
    }
    return prevPath;
}

//typical crossbrowser initialization of "XMLHttpRequest" object
function getXmlHttp()
{
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}
