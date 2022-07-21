"use strict";
// All necessary imports
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var basic_setup_1 = require("@codemirror/basic-setup");
var view_1 = require("@codemirror/view");
var commands_1 = require("@codemirror/commands");
var autocomplete_1 = require("@codemirror/autocomplete");
var state_1 = require("@codemirror/state");
var tooltip_1 = require("@codemirror/tooltip");
var language_1 = require("@codemirror/language");
// import {getClientId} from 'launch.html'
var axios_1 = require("axios");
var headers = {
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS"
};
// Initialization
var apiUrl = 'https://api.mi1.ai/api/';
var apiUrl_Dev = 'http://127.0.0.1:5000/';
var dataJson = [];
var isLineChanged = false;
var isLineChangeNum = 1;
var check_order_for_order = false;
var parent_problem;
var orderOnClick = false;
var current_state;
var current_line = 1;
var currentPosition = 0;
var currentRowText = '';
var currentLineFrom = 0;
var currentLineTo = 0;
var arrCUIs = [];
var searchOptions = [];
var lastFetchedCUI = '';
var isCheckingOrder = false;
var suggestions = document.getElementById('suggestions-content');
// for Cerner clinical write testing only 
// Theme Customization
var myTheme = basic_setup_1.EditorView.theme({
    "cm-editor": {
        fontSize: "24px",
        width: "100%",
        minHeight: "600px",
        outline: 0,
        border: 0,
        fontFamily: 'Poppins'
    },
    ".cm-content": {
        fontSize: "24px"
    },
    ".cm-activeLine": {
        backgroundColor: "initial"
    },
    ".cm-gutters": {
        display: "none"
    },
    ".cm-tooltip.cm-tooltip-cursor": {
    // display: "none"
    },
    ".cm-scroller": {
        minHeight: "600px"
    },
    ".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
        lineHeight: 1.8
    },
    ".cm-tooltip": {
        fontSize: "24px",
        fontFamily: 'Poppins'
    },
    ".cm-lineWrapping": {
    // wordBreak: "break-all",
    }
}, { dark: false });
// get patient id and mi1 id from url 
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
// let PatientId= urlParams.get('Patientid')
// let MI1_Client_ID = urlParams.get('MI1ClientID')
// let MI1_Client_ID= document.getElementById("MI1ClientId").innerHTML
for (var key in localStorage) {
    console.log(key, localStorage.getItem(key));
}
var PatientId = localStorage.getItem('fhirpatientid');
var MI1_Client_ID = localStorage.getItem('MI1ClientId');
var encounterReference = localStorage.getItem('encounterRef');
var practitionerReference = '12743472';
console.log(PatientId, MI1_Client_ID);
// document.getElementById("mi1clientid").innerHTML = MI1_Client_ID
// generate id 
// let MI1_Client_ID = '123456789'
// let PatientId = "eq081-VQEgP8drUUqCWzHfw3"
var fhirBody = {
    "PatientId": PatientId,
    "MI1ClientID": MI1_Client_ID
};
var fhirConditionReadBody = {
    "patientId": PatientId,
    "MI1ClientID": MI1_Client_ID
};
var fhirConditionsBody = {
    "patientId": PatientId,
    "category": "problem-list-item",
    "clinical_status": "active",
    "MI1ClientID": MI1_Client_ID
};
// get current time in epoch format
var secondsSinceEpoch = Math.round(Date.now() / 1000);
// get current data in dd/mm/yy format
// let dateObject = new Date()
// let currentDate = dateObject.getDate()+"/"+(dateObject.getMonth()+1)+"/"+dateObject.getFullYear()
dataJson.push({
    "PatientId": PatientId,
    "Order-Date": secondsSinceEpoch,
    "Problems": []
});
// local fhir api call to get patients data 
axios_1["default"].post(apiUrl_Dev + "PatientData", fhirBody)
    .then(function (response) {
    console.log(response);
    if (response.data != []) {
        if (response.data.DOB && response.data.MRN && response.data.Name) {
            var dob = response.data.DOB;
            var mrn = response.data.MRN;
            var name_1 = response.data.Name;
            var fhirHTMl = document.getElementById("fhir");
            var fhirHTMl_div = '';
            fhirHTMl_div += '<div class="fhir-header"><h4>';
            fhirHTMl_div += 'Patient Name : ' + name_1 + '</h4>';
            fhirHTMl_div += '<h4> Medical Record Number (MRN): ' + mrn + '</h4>';
            fhirHTMl_div += '<h4> Date Of Birth : ' + dob + '</h4>';
            fhirHTMl.innerHTML = fhirHTMl_div;
        }
        else {
            var ErrorMessage = response.data.ErrorMessage;
            var StatusCode = response.data.StatusCode;
            var ErrorDescription = response.data.ErrorDescription;
            console.log(ErrorMessage);
            alert("ErrorMessage: " + ErrorMessage + "\nStatusCode: " + StatusCode + "\nErrorDescription: " + ErrorDescription);
        }
    }
    else {
        var ErrorMessage = response.data.ErrorMessage;
        var StatusCode = response.data.StatusCode;
        var ErrorDescription = response.data.ErrorDescription;
        console.log(ErrorMessage);
        alert("ErrorMessage: " + ErrorMessage + "\nStatusCode: " + StatusCode + "\nErrorDescription: " + ErrorDescription);
    }
});
// local fhir api call to get patients condition
// setTimeout(() => { 
// 	a	console.log(response.data)
// 		})xios.post(apiUrl_Dev+"PatientConditions",fhirConditionsBody,{headers})
// 		.then((response)=>{
// 	}, 5000);
// axios.post(apiUrl_Dev+"PatientConditions",fhirConditionsBody,{headers})
// 		.then((response)=>{
// 			console.log(response.data)
// 		})
// Completion list function
// This function determines when should the autocomplete process begin
function myCompletions(context) {
    // Does not give autocompletion after two spaces 
    // if( (currentRowText.length > 0 && currentRowText[0] == ' ') || (currentRowText.length < 3 || currentRowText.split(" ").length>2)){
    if ((currentRowText.length > 0 && currentRowText[0] == ' ') || (currentRowText.length < 3)) {
        searchOptions = [];
    }
    var word = context.matchBefore(/\w*/);
    if (word.from == word.to && !context.explicit)
        return null;
    if (currentRowText.startsWith('\t')) {
        return {
            from: currentLineFrom + 1,
            to: currentLineTo,
            options: searchOptions
        };
    }
    return {
        from: currentLineFrom,
        to: currentLineTo,
        options: searchOptions
    };
}
// Follow cursor movement while typing and when changing by mouse click
var cursorTooltipField = state_1.StateField.define({
    create: getCursorTooltips,
    update: function (tooltips, tr) {
        if (!tr.docChanged && !tr.selection)
            return tooltips;
        return getCursorTooltips(tr.state);
    },
    provide: function (f) { return tooltip_1.showTooltip.computeN([f], function (state) { return state.field(f); }); }
});
function cursorTooltip() {
    return [cursorTooltipField];
}
// Fetch auto completion results from the API
function fetchAutoComplete(startsWith) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        "startsWith": [
                            {
                                "startsWith": startsWith
                            }
                        ]
                    };
                    return [4 /*yield*/, axios_1["default"].post(apiUrl + 'autocompleteProblems', body, { headers: headers })
                            .then(function (response) {
                            if (response.data.length > 0) {
                                searchOptions = [];
                            }
                            var _loop_1 = function () {
                                var info = response.data[i].Known_CUI;
                                var label = response.data[i].Known_Problem;
                                searchOptions.push({
                                    info: info,
                                    label: label,
                                    apply: function () {
                                        var test = dataJson[0].Problems.filter(function (item) {
                                            if (item.ProblemText == label) {
                                                return item;
                                            }
                                        });
                                        if (test.length == 0) {
                                            dataJson[0].Problems.push({
                                                "ProblemText": label,
                                                "ProblemCUI": info,
                                                "Orders": []
                                            });
                                        }
                                        arrCUIs.push({
                                            type: 'problem',
                                            cui: info,
                                            name: label
                                        });
                                        view.dispatch({
                                            changes: { from: currentLineFrom, to: currentLineTo, insert: label }
                                        });
                                        var setCursor = state_1.EditorSelection.cursor(currentPosition);
                                        view.dispatch(view.state.update({
                                            // selection: new EditorSelection([EditorSelection.cursor(currentPosition)], 0)
                                            selection: setCursor
                                        }));
                                    }
                                });
                            };
                            for (var i = 0; i <= response.data.length - 1; i++) {
                                _loop_1();
                            }
                        })["catch"](function (error) { console.log(error); }).then(function () { })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// autocompleteOrders api
function fetchAutoCompleteOrders(startsWith) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        "startsWith": [
                            {
                                "startsWith": startsWith
                            }
                        ]
                    };
                    return [4 /*yield*/, axios_1["default"].post(apiUrl + 'autocompleteOrders', body, { headers: headers })
                            .then(function (response) {
                            if (response.data.length > 0) {
                                searchOptions = [];
                            }
                            searchOptions = [];
                            var _loop_2 = function () {
                                var info = response.data[i].Known_CUI;
                                var label = response.data[i].Known_Order;
                                searchOptions.push({
                                    info: info,
                                    label: label,
                                    apply: function () {
                                        dataJson[0].Problems.filter(function (i) {
                                            if (i.ProblemText == parent_problem) {
                                                i.Orders.push({
                                                    "OrderCUI": info,
                                                    "OrderText": label
                                                });
                                            }
                                        });
                                        arrCUIs.push({
                                            type: 'order',
                                            ordercui: info,
                                            name: label
                                        });
                                        view.dispatch({
                                            changes: { from: currentLineFrom, to: currentLineTo, insert: "\t" + label }
                                        });
                                        var contentLength = currentLineFrom + label.length + 1;
                                        var setCursor = state_1.EditorSelection.cursor(contentLength);
                                        view.dispatch(view.state.update({
                                            // selection: new EditorSelection([EditorSelection.cursor(contentLength)], 0)
                                            selection: setCursor
                                        }));
                                    }
                                });
                            };
                            for (var i = 0; i <= response.data.length - 1; i++) {
                                _loop_2();
                            }
                        })["catch"](function (error) { console.log(error); }).then(function () { })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Fetch problem results from the API
function fetchProblems(CUI) {
    return __awaiter(this, void 0, void 0, function () {
        var cuis, cuisBody;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cuis = [];
                    cuis.push({
                        CUI: CUI
                    });
                    cuisBody = {
                        "CUIs": cuis
                    };
                    document.getElementById('preloader').style.display = 'inline-flex';
                    document.getElementById('particles-js').style.display = 'none';
                    suggestions.innerHTML = '';
                    return [4 /*yield*/, axios_1["default"].post(apiUrl + 'PotentialComorbidities', cuisBody, { headers: headers })
                            .then(function (response) {
                            if (response.data.length === 0) {
                                // suggestions.innerHTML = '<div><h3>No Data for problems:</h3></div>'	
                                document.getElementById("defaultOpen").click();
                                document.getElementById("problem_tab").style.display = 'block';
                                document.getElementById("suggestions-content").style.display = 'none';
                                document.getElementById("orders_tab").style.display = 'none';
                                document.getElementById('preloader').style.display = 'none';
                                document.getElementById('particles-js').style.display = 'block';
                            }
                            else {
                                suggestions.innerHTML = '';
                                if (response.data.length > 0) {
                                    document.getElementById('particles-js').style.display = 'none';
                                    document.getElementById("suggestions-content").style.display = 'block';
                                    document.getElementById("defaultOpen").click();
                                    document.getElementById("problem_tab").style.display = 'block';
                                    document.getElementById("orders_tab").style.display = 'none';
                                    suggestions.innerHTML += '<div><h3>Associated Conditions:</h3></div>';
                                }
                                var suggestion_str = '';
                                for (var i = 0; i <= response.data.length - 1; i++) {
                                    suggestion_str += "<div class='suggestion' data-type='problem' data-cui='" + response.data[i].CUI + "' data-name='" + response.data[i].Problem + "'>";
                                    suggestion_str += "<h5 class='suggestion-text'>";
                                    suggestion_str += response.data[i].Problem;
                                    suggestion_str += "</h5>";
                                    suggestion_str += "</div>";
                                }
                                suggestions.innerHTML += suggestion_str;
                                document.getElementById('preloader').style.display = 'none';
                            }
                        })["catch"](function (error) {
                            document.getElementById('preloader').style.display = 'none';
                            suggestions.innerHTML = '';
                            lastFetchedCUI = '';
                            isCheckingOrder = false;
                        }).then(function () {
                            bindProblemsSuggestions();
                            highlightSuggestions();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Fetch order results from the API
function fetchOrders(CUI) {
    return __awaiter(this, void 0, void 0, function () {
        var bodyUI;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    suggestions.innerHTML = '';
                    bodyUI = {
                        "CUIs": [
                            {
                                "CUI": CUI
                            }
                        ]
                    };
                    document.getElementById('preloader').style.display = 'inline-flex';
                    document.getElementById('particles-js').style.display = 'none';
                    return [4 /*yield*/, axios_1["default"].post(apiUrl + 'AssocOrders', bodyUI, { headers: headers })
                            .then(function (response) {
                            if (response.data.length == 0) {
                                document.getElementById('particles-js').style.display = 'block';
                                // suggestions.innerHTML = '<div><h3>No Data for orders:</h3></div>'
                                document.getElementById("suggestions-content").style.display = 'none';
                                document.getElementById("problem_tab").style.display = 'none';
                                document.getElementById("orders_tab").style.display = 'block';
                                document.getElementById("defaultOpenForOrders").click();
                                document.getElementById('preloader').style.display = 'none';
                            }
                            else {
                                suggestions.innerHTML = '';
                                if (response.data.length > 0) {
                                    if (check_order_for_order == true) {
                                        suggestions.innerHTML += '<div><h3>Orders Associated with Orders:</h3></div>';
                                    }
                                    else {
                                        suggestions.innerHTML += '<div><h3>Orders Associated with Problems:</h3></div>';
                                    }
                                    document.getElementById("problem_tab").style.display = 'none';
                                    document.getElementById("orders_tab").style.display = 'block';
                                    document.getElementById("suggestions-content").style.display = 'block';
                                    document.getElementById("defaultOpenForOrders").click();
                                    document.getElementById('particles-js').style.display = 'none';
                                }
                                var suggestion_str = '';
                                for (var i = 0; i <= response.data.length - 1; i++) {
                                    suggestion_str += "<div class='suggestion' data-type='order' data-problem-cui='" + CUI + "' data-cui='" + response.data[i].Code + "' data-name='" + response.data[i].Order + "' parent-problem='" + parent_problem + "' >";
                                    suggestion_str += "<h5 class='suggestion-text'>";
                                    suggestion_str += response.data[i].Order;
                                    suggestion_str += "</h5>";
                                    suggestion_str += "<span class='tag'>" + response.data[i].Type + "</span>";
                                    suggestion_str += "</div>";
                                }
                                suggestions.innerHTML += suggestion_str;
                                document.getElementById('preloader').style.display = 'none';
                            }
                        })["catch"](function (error) {
                            document.getElementById('preloader').style.display = 'none';
                            suggestions.innerHTML = '';
                            lastFetchedCUI = '';
                            isCheckingOrder = false;
                        }).then(function () {
                            bindOrderSuggestions();
                            highlightSuggestions();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// The function responsible about the cursor
// Takes state as input and processes information
function getCursorTooltips(state) {
    return state.selection.ranges
        .filter(function (range) { return range.empty; })
        .map(function (range) {
        var line = state.doc.lineAt(range.head);
        currentLineFrom = line.from;
        currentLineTo = line.to;
        current_line = line.number;
        current_state = state;
        var text = line.number + ":" + (range.head - line.from);
        var SearchOptionsCount = "#" + searchOptions.length;
        var debugtext = [text, SearchOptionsCount];
        currentRowText = line.text; // Gets the text of the current row
        currentPosition = range.head; // Gets the 	head position
        // Check for line changes
        if (isLineChangeNum == currentLineFrom) {
            isLineChanged = false;
        }
        else {
            orderOnClick = false;
            isLineChanged = true;
            isLineChangeNum = currentLineFrom;
        }
        // remove the length condition to call API cotinuously: (currentRowText.length == 3) && AND currentRowText.length ==4 &&
        if ((currentRowText.length == 3) && currentRowText[0] != '' && currentRowText[0] != '\t') {
            orderOnClick = false;
            fetchAutoComplete(currentRowText);
        }
        if (currentRowText.length == 4 && currentRowText[0] == '\t') {
            orderOnClick = false;
            fetchAutoCompleteOrders(currentRowText.trim());
        }
        var index = arrCUIs.findIndex(function (e) { return e.name.toString().toLowerCase().replace(/\s/g, '').replace('\t', '') === currentRowText.toLowerCase().replace(/\s/g, ''); });
        // console.log(currentRowText, index)	
        if (index !== -1) {
            if (arrCUIs[index]['type'] == 'problem') {
                orderOnClick = false;
                lastFetchedCUI = arrCUIs[index]['cui'].toString();
                isCheckingOrder = false;
                fetchProblems(lastFetchedCUI);
            }
            else {
                if (orderOnClick == false) {
                    check_order_for_order = true;
                    lastFetchedCUI = arrCUIs[index]['ordercui'].toString();
                    isCheckingOrder = true;
                    fetchOrders(lastFetchedCUI);
                }
            }
        }
        if (line.number > 1) {
            var temp_line = line.number;
            var previousLine_1 = "";
            for (; temp_line > 1;) {
                temp_line--;
                if (state.doc.line(temp_line).text.length == state.doc.line(temp_line).text.trim().length) {
                    previousLine_1 = state.doc.line(temp_line).text;
                    parent_problem = previousLine_1;
                    break;
                }
            }
            var index1 = arrCUIs.findIndex(function (e) { return e.name.toString().toLowerCase().replace(/\s/g, '').replace('\t', '') === currentRowText.toLowerCase().replace(/\s/g, ''); });
            if (index1 !== -1) {
                if (isCheckingOrder == false) {
                    if (arrCUIs[index1]['type'] == 'order') {
                        isCheckingOrder = true;
                        check_order_for_order = true;
                        lastFetchedCUI = arrCUIs[index1]['ordercui'].toString();
                        fetchOrders(lastFetchedCUI);
                    }
                }
            }
            var previouslineIndex = arrCUIs.findIndex(function (e) { return e.name.toString().toLowerCase().replace(/\s/g, '').replace('\t', '') === previousLine_1.toLowerCase().replace(/\s/g, ''); });
            if (previouslineIndex !== -1 && index1 === -1 && isLineChanged == true) {
                if (arrCUIs[previouslineIndex]['type'] == 'problem') {
                    check_order_for_order = false;
                    lastFetchedCUI = arrCUIs[previouslineIndex]['cui'].toString();
                    isCheckingOrder = true;
                    fetchOrders(lastFetchedCUI);
                }
            }
        }
        if (line.number == 1 && state.doc.line(line.number).text == '') {
            suggestions.innerHTML = '';
            document.getElementById("problem_tab").style.display = "none";
            document.getElementById("particles-js").style.display = "block";
            lastFetchedCUI = '';
            isCheckingOrder = false;
        }
        highlightSuggestions();
        return {
            pos: range.head,
            above: true,
            strictSide: true,
            arrow: true,
            create: function () {
                var dom = document.createElement("div");
                dom.className = "cm-tooltip-cursor";
                dom.textContent = debugtext.toString();
                return { dom: dom };
            }
        };
    });
}
// Initialization of the state
// All necessary extensions added to it
// Cursor Movement, Auto Completion, and The use of Tab to indent
var initialState = basic_setup_1.EditorState.create({
    doc: '',
    extensions: [
        basic_setup_1.basicSetup,
        view_1.keymap.of([commands_1.indentWithTab]),
        myTheme,
        cursorTooltip(),
        (0, autocomplete_1.autocompletion)({ override: [myCompletions] }),
        basic_setup_1.EditorView.lineWrapping,
        language_1.indentUnit.of("\t")
    ]
});
// Initialization of the EditorView
var view = new basic_setup_1.EditorView({
    parent: document.getElementById('editor'),
    state: initialState
});
// Focuses on the view on page load to let physicians type immediately
window.onload = function () {
    view.focus();
};
// Resets the position back to the view
// When someone clicks the title of the block that contains the editor
document.getElementById('editor-container').onclick = function () {
    view.focus();
};
// document.getElementById('jsondata').onclick = function(){
// 	console.log(dataJson)
// }
// This function handles the behavior of clicking an order
// from the sidebar
function bindOrderSuggestions() {
    var all_suggestions = document.getElementsByClassName('suggestion');
    var index1 = arrCUIs.findIndex(function (e) { return e.name.toString().toLowerCase().replace(/\s/g, '').replace('\t', '') === currentRowText.toLowerCase().replace(/\s/g, ''); });
    for (var i = 0; i <= all_suggestions.length - 1; i++) {
        var elem = all_suggestions[i];
        elem.addEventListener('click', function (e) {
            var _this = this;
            dataJson[0].Problems.filter(function (i) {
                if (i.ProblemText == _this.getAttribute('parent-problem')) {
                    i.Orders.push({
                        "OrderCUI": _this.getAttribute('data-cui'),
                        "OrderText": _this.getAttribute('data-name')
                    });
                }
            });
            arrCUIs.push({
                type: this.getAttribute('data-type'),
                ordercui: this.getAttribute('data-cui'),
                name: this.getAttribute('data-name'),
                problemCui: this.getAttribute('data-problem-cui')
            });
            var content = '';
            if (currentRowText.length == 0 || currentRowText.trim().length == 0) {
                orderOnClick = true;
                content += '\t';
                content += this.getAttribute('data-name');
                content += '\n';
                view.dispatch(view.state.update({
                    changes: { from: currentLineFrom, to: currentLineTo, insert: content }
                }));
                currentPosition = currentLineFrom + content.length;
                var setCursor = state_1.EditorSelection.cursor(currentPosition);
                view.focus();
                view.dispatch(view.state.update({
                    // selection: new EditorSelection([EditorSelection.cursor(currentPosition)], 0)
                    selection: setCursor
                }));
            }
            else if (currentRowText.startsWith('\t') && index1 === -1) {
                content += '\t';
                content += this.getAttribute('data-name');
                view.dispatch({
                    changes: { from: currentLineFrom, to: currentLineTo, insert: content }
                });
                currentPosition = currentLineFrom + content.length;
                var setCursor = state_1.EditorSelection.cursor(currentPosition);
                view.focus();
                view.dispatch(view.state.update({
                    // selection: new EditorSelection([EditorSelection.cursor(currentPosition)], 0)
                    selection: setCursor
                }));
            }
            else {
                var get_line_before_problem = void 0;
                var totalline = current_state.doc.lines;
                for (var i = current_line; i <= totalline; i++) {
                    var get_line = current_state.doc.line(i);
                    if (!get_line.text.startsWith('\t')) {
                        break;
                    }
                    get_line_before_problem = i;
                }
                var final_line = current_state.doc.line(get_line_before_problem);
                content += '\n';
                content += '\t';
                content += this.getAttribute('data-name');
                view.dispatch({
                    changes: { from: final_line.to, insert: content }
                });
            }
            document.getElementById('suggestions-content').innerHTML = '';
            view.focus();
            highlightSuggestions();
        });
        // elem.onclick = function(e){
        // }
    }
}
// This function handles the behavior of clicking a problem
// from the sidebar
function bindProblemsSuggestions() {
    var all_suggestions = document.getElementsByClassName('suggestion');
    for (var i = 0; i <= all_suggestions.length - 1; i++) {
        var elem = all_suggestions[i];
        elem.addEventListener('click', function (e) {
            var _this = this;
            var test = dataJson[0].Problems.filter(function (item) {
                if (item.ProblemText == _this.getAttribute('data-name')) {
                    return item;
                }
            });
            if (test.length == 0) {
                dataJson[0].Problems.push({
                    "ProblemText": this.getAttribute('data-name'),
                    "ProblemCUI": this.getAttribute('data-cui'),
                    "Orders": []
                });
            }
            arrCUIs.push({
                type: this.getAttribute('data-type'),
                cui: this.getAttribute('data-cui'),
                name: this.getAttribute('data-name')
            });
            var content = '\n\n';
            content += this.getAttribute('data-name');
            var newPosition = view.state.doc.length;
            view.dispatch({
                changes: { from: newPosition, insert: content }
            });
            view.focus();
            highlightSuggestions();
        });
        // elem.onclick = function(e){
        // }
    }
}
// Send data to create clinical note apiUrl
var BinaryUrl = "";
var getSendButton = document.getElementById('clinicalCreate');
getSendButton.addEventListener('click', function (e) {
    var clinicalNoteBody = {};
    var EncodedString = window.btoa(current_state.doc.toString());
    // Use - Testing for Cerner Read Note
    // let MI1_Client_ID = '1122334455'
    // let PatientId = "12724066"
    // Use - Testing for Epic Read Note
    // let MI1_Client_ID = '123456789'
    // let PatientId = "eq081-VQEgP8drUUqCWzHfw3"
    console.log(encounterReference);
    console.log(encounterReference == '\n');
    if (encounterReference == '') {
        alert("Couldn't find Encounter Reference");
    }
    else {
        if (MI1_Client_ID == '123456789') {
            clinicalNoteBody = {
                "MI1ClientID": MI1_Client_ID,
                "patientId": PatientId,
                "note_type_code": "11488-4",
                "encounterReference": encounterReference,
                "note_content": EncodedString
            };
        }
        else {
            clinicalNoteBody = {
                "MI1ClientID": MI1_Client_ID,
                "patientId": PatientId,
                "practitionerReference": practitionerReference,
                "encounterReference": encounterReference,
                "note_content": EncodedString
            };
        }
        axios_1["default"].post(apiUrl_Dev + 'ClinicalNote', clinicalNoteBody).then(function (response) {
            console.log(response);
            if (response.data != []) {
                if (response.data.BinaryURL_Location && response.data.Message && response.data.StatusCode) {
                    var BinaryURL_Location = response.data.BinaryURL_Location;
                    var Message = response.data.Message;
                    var StatusCode = response.data.StatusCode;
                    alert("BinaryURL_Location: " + BinaryURL_Location + "\nStatusCode: " + StatusCode + "\nMessage: " + Message);
                }
                else {
                    var ErrorMessage = response.data.ErrorMessage;
                    var StatusCode = response.data.StatusCode;
                    var ErrorDescription = response.data.ErrorDescription;
                    console.log(ErrorMessage);
                    alert("ErrorMessage: " + ErrorMessage + "\nStatusCode: " + StatusCode + "\nErrorDescription: " + ErrorDescription);
                }
            }
            else {
                var ErrorMessage = response.data.ErrorMessage;
                var StatusCode = response.data.StatusCode;
                var ErrorDescription = response.data.ErrorDescription;
                console.log(ErrorMessage);
                alert("ErrorMessage: " + ErrorMessage + "\nStatusCode: " + StatusCode + "\nErrorDescription: " + ErrorDescription);
            }
            // if (parseInt(response.data[0].StatusCode)== 201){
            // 	BinaryUrl = response.data[0].BinaryUrl
            // 	alert("Note Created")
            // }
            // else{
            // 	console.log('Error while processing create Clinical Note ')
            // 	console.log('PatientId: '+PatientId )
            // 	console.log('Response Status Code : '+response.data[0].StatusCode)
            // 	alert('Error while creating note')
            // }
        });
    }
});
// Read Clinical data
// let getReadButton = document.getElementById('clinicalRead')
// getReadButton.addEventListener('click', function(e){
// 	axios.post(apiUrl+'ClinicalNoteRead',{
// 		"MI1ClientID":MI1_Client_ID,
// 		"patientId":"eXbMln3hu0PfFrpv2HgVHyg3",
// 		'binaryId':BinaryUrl
// 	}).then(response=>{
// 		console.log(response.data);
// 	})
// })
// Read latest 5 Clinical data
var getReadButton = document.getElementById('clinicalRead');
var returnData = [];
var clinicalreadresponsedata = '';
// Use - Testing for Cerner Read Note
// let MI1_Client_ID = '1122334455'
// let PatientId = "12724066"
// Use - Testing for Epic Read Note
// let MI1_Client_ID = '123456789'
// let PatientId = "eq081-VQEgP8drUUqCWzHfw3"
getReadButton.addEventListener('click', function (e) {
    axios_1["default"].post(apiUrl_Dev + 'ReadClinicalNotes', {
        "MI1ClientID": MI1_Client_ID,
        "patientId": PatientId
    }).then(function (response) {
        console.log(response);
        if (response.data != []) {
            if (response.data.ContentUrl && response.data.EncodedData && response.data.ContentType) {
                var ContentUrl = response.data.ContentUrl;
                var EncodedData = response.data.EncodedData;
                var ContentType = response.data.ContentType;
                clinicalreadresponsedata = atob(EncodedData);
                EncodedData = null;
                view.dispatch({
                    changes: { from: currentLineFrom, to: currentLineTo, insert: clinicalreadresponsedata }
                });
            }
            else {
                var ErrorMessage = response.data.ErrorMessage;
                var StatusCode = response.data.StatusCode;
                var ErrorDescription = response.data.ErrorDescription;
                console.log(ErrorMessage);
                alert("ErrorMessage: " + ErrorMessage + "\nStatusCode: " + StatusCode + "\nErrorDescription: " + ErrorDescription);
            }
        }
        else {
            var ErrorMessage = response.data.ErrorMessage;
            var StatusCode = response.data.StatusCode;
            var ErrorDescription = response.data.ErrorDescription;
            console.log(ErrorMessage);
            alert("ErrorMessage: " + ErrorMessage + "\nStatusCode: " + StatusCode + "\nErrorDescription: " + ErrorDescription);
        }
    });
});
// This function checks if the document contains problems or orders
// By comparing them to the list of CUIs we collect and save in memory
function highlightSuggestions() {
    var all_suggestions = document.getElementsByClassName('suggestion');
    for (var i = 0; i <= all_suggestions.length - 1; i++) {
        var elem = all_suggestions[i];
        var index = arrCUIs.findIndex(function (e) { return e.cui === elem.getAttribute('data-cui'); });
        if (index !== -1) {
            if (arrCUIs[index]['type'] == elem.getAttribute('data-type')) {
                view ? view.state.doc.toJSON().forEach(function (e) {
                    (e.toString().toLowerCase().replace(/\s/g, '').replace('\t', '') == elem.getAttribute('data-name').toLowerCase().replace(/\s/g, '')) ? elem.classList.add('highlighted') : null;
                }) : null;
            }
        }
        var index1 = arrCUIs.findIndex(function (e) { return e.ordercui === elem.getAttribute('data-cui'); });
        if (index1 !== -1) {
            if (arrCUIs[index1]['type'] == elem.getAttribute('data-type')) {
                view ? view.state.doc.toJSON().forEach(function (e) {
                    (e.toString().toLowerCase().replace(/\s/g, '').replace('\t', '') == elem.getAttribute('data-name').toLowerCase().replace(/\s/g, '')) ? elem.classList.add('highlighted') : null;
                }) : null;
            }
        }
    }
}
