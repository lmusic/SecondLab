
var globalPath = 'MainFolder/'; //path to opened folder or requested file
var request = getXmlHttp();

window.onload = openFolder;

//handler on click on any "li" item
function handler(e)
{
    var textInSpan = e.target.innerText
    setPathForRequestedDir(textInSpan)  // path will be written to "globalPath"
    if(isFile(textInSpan)){
        downloadFile();
        return;
    }
    else{
        openFolder()
    }
}

//main functions of App
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
function downloadItem(e) {
    var nameOfItem = getNameOfItem(e);
    window.location = globalPath + '?download=' + nameOfItem.toString();
}
function removeItem(e) {
    var removeTarget = e.target.parentElement.children[0].innerHTML;
    request.open('GET', globalPath + '?delete=' + removeTarget, false);
    request.send(null);
    hideConfirmDialog();
    openFolder();
}

//functions Filling and configure Html tags
function SetCurrentDirectoryString() {
    document.getElementById('path').innerHTML = 'Current directory: "' + globalPath.toString() +'"';
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

    if(name == 'back'){
        li.className = 'back'
        li.innerText = 'back'
        li.addEventListener('click', handler)
    }
    else{
        var download = document.createElement('a');
        var remove = document.createElement('a');
        var span = document.createElement('span');

        span.innerText = name;

        span.addEventListener('click', handler);

        download.innerText = 'download';
        download.className = 'download';
        download.addEventListener('click', downloadItem);

        remove.innerText = 'remove';
        remove.className = 'remove';
        remove.addEventListener('click', ShowConfirmDialog);

        li.appendChild(span);
        li.appendChild(remove);
        li.appendChild(download);
    }

    document.getElementById('UL').appendChild(li);
}

//functions for dialog with users
function ShowConfirmDialog(e){
    var item = getNameOfItem(e);
    document.getElementById('confirmBlock').style.display = 'block';
    document.getElementById('confirmText').innerHTML = item;
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
function getNameOfItem(e) {
    return e.target.parentElement.innerText.split('removedownload')[0];
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