let TOTAL_ROWS = 0;
const initApp = () => {
    $('#modalSelectRows').modal('show');
    $("#table").hide();
    setEvents();
}
const setEvents = () => {
    $('#btnSelectRows').click(handleSelectRow);
    $('#btnValidate').click(handleValidate);
}

const handleSelectRow = () => {
    const countRows = $('#rows').val();
    if (!countRows) {
        alert('Debe digitarse un valor');
    } else {
        TOTAL_ROWS = countRows;
        addRows(countRows);
        $('#modalSelectRows').modal('hide');

    }
}
const addEventInputs = () => {

    $('#matriz .input-binary').on('keypress', function(e) {
        // Handle paste
        let key = '';
        if (e.type === 'paste') {
            key = event.clipboardData.getData('text/plain');
        } else {
        // Handle key press
            key = e.keyCode || e.which;
            key = String.fromCharCode(key);
        }
        var regex = /[0-1]|\./;
        if( !regex.test(key) ) {
            e.returnValue = false;
            if(e.preventDefault) e.preventDefault();
        } else if($(this).val() !== '') {
            e.returnValue = false;
            if(e.preventDefault) e.preventDefault();
        }
    });
}
const addRows = (countRows) => {
    const matriz = $('#matriz');
    const matriz_traspuesta = $('#matriz_traspuesta');
    const matriz_resultado = $('#matriz_resultado');

    for(let i = 0; i < countRows; i++) {
        const row = $(`<div class="table_row" id="fila${i}"></div>`);
        for(let f = 0; f < countRows; f++) {
            const input = $(`<input class='form-control input-binary' data-from='${i}' data-to='${f}'  type='text' id="fila${i}_${f}" />`);
            row.append(input);
        }
        matriz.append(row);
    }
    for(let i = 0; i < countRows; i++) {
        const row = $(`<div class="table_row" id="r_fila${i}"></div>`);
        for(let f = 0; f < countRows; f++) {
            const input = $(`<input class='form-control input-binary' data-id='fila${i}_${f}' type='text' id="r_fila${i}_${f}" />`);
            row.append(input);
        }
        matriz_resultado.append(row);
    }
    for(let i = 0; i < countRows; i++) {
        const row = $(`<div class="table_row" id="t_fila${i}"></div>`);
        for(let f = 0; f < countRows; f++) {
            const input = $(`<input class='form-control input-binary' type='text' id="t_fila${i}_${f}" />`);
            row.append(input);
        }
        matriz_traspuesta.append(row);
    }
    addEventInputs();
}
const handleValidate = () => {
    $("#matriz .input-binary").each(function(){
        if ($(this).val() === "") {
            $(this).val("0");
        }
    });
    // creacion traspuesta
    for (var i = 0; i < TOTAL_ROWS; i++) {
        for (var d = 0; d < TOTAL_ROWS; d++) {
            $('#matriz_traspuesta').find(`#t_fila${d}_${i}`).val($(`#fila${i}_${d}`).val());
        }	
    }
    // validacion reflexiva
    let isReflexiva = true;
    for (let i = 0; i < TOTAL_ROWS; i++) {
        const inputDiagonal = $(`#fila${i}_${i}`);
        if (parseInt(inputDiagonal.val()) !== 1) {
            isReflexiva = false;
        }        
    }
    // validacion ireflexiva
    let isIreflexiva = true;
    for (let i = 0; i < TOTAL_ROWS; i++) {
        const inputDiagonal = $(`#fila${i}_${i}`);
        if (parseInt(inputDiagonal.val()) !== 0) {
            isIreflexiva = false;
        }        
    }
    // validador simetrica
    let isSimetrica = true;
    for (var i = 0; i < TOTAL_ROWS; i++) {
        for (var d = 0; d < TOTAL_ROWS; d++) {
            if ($(`#fila${i}_${d}`).val() !== $(`#t_fila${i}_${d}`).val()) {
                isSimetrica = false;
            }
        }	
    }
    // validador asimetrica
    let isAsimetrica = true;
    for (var i = 0; i < TOTAL_ROWS; i++) {
        for (var d = 0; d < TOTAL_ROWS; d++) {
            if ($(`#fila${i}_${d}`).val() != 0 && $(`#t_fila${i}_${d}`).val() != 0) {
                isAsimetrica = false;
            }
        }	
    }
    // validador asimetrica
    let isAntisimetrica = true;
    for (var i = 0; i < TOTAL_ROWS; i++) {
        for (var d = 0; d < TOTAL_ROWS; d++) {
            if (i !== d && parseInt($(`#fila${i}_${d}`).val()) !== 0) {
                isAntisimetrica = false;
            }
        }	
    }
    // multiplicacion matriz principal
    for (let j = 0; j < TOTAL_ROWS; j++) {
        for (var d = 0; d < TOTAL_ROWS; d++) {
            let value = 0;
            for (let y = 0; y < TOTAL_ROWS; y++) {                    
                const valRow = parseInt($(`#fila${j}_${y}`).val());
                const valColumn = parseInt($(`#fila${y}_${d}`).val());
                if (valRow === 1 && valColumn === 1)
                    value = 1;
            }
            $(`#r_fila${j}_${d}`).val(value);
        }
    }
    let isTransitiva = true;
    $("#matriz_resultado .input-binary").each(function(){
        const id = $(this).data('id');
        if (parseInt($(this).val()) === 1 && $(this).val() != $(`#${id}`).val()) {
            isTransitiva = false;
        }
    });
    generarGrafo();
    $('#reflexiva').text(isReflexiva ? 'Si' : 'No');
    $('#irreflexiva').text(isIreflexiva ? 'Si' : 'No');
    $('#simetrica').text(isSimetrica ? 'Si' : 'No');
    $('#asimetrica').text(isAsimetrica ? 'Si' : 'No');
    $('#antisimetrica').text(isAntisimetrica ? 'Si' : 'No');
    $('#transitiva').text(isTransitiva ? 'Si' : 'No');
    
}

const generarGrafo = () => {
    var nodes = [];
    for (let i = 0; i < TOTAL_ROWS; i++) {
        nodes.push({
            id: i,
            label: `Item ${i + 1}`
        })       
    }
    // create an array with edges
    var edges = [];

    // create a network
    var container = document.getElementById('visualization');
    $("#matriz .input-binary").each(function(){
        if (parseInt($(this).val()) === 1) {
            edges.push({
                from: parseInt($(this).data('from')),
                to: parseInt($(this).data('to')),
                arrows:'to'
            });
        }
    });
    var data = {
        nodes: nodes,
        edges: edges
    };
    var network = new vis.Network(container, data, {});
}
$(document).ready(function() {
    initApp();
})

//$(`#r_fila${i}_${j}`).val(value);
