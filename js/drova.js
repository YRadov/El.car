//************************************************
//*******ПЕРЕМЕННЫЕ*******************************
//************************************************
//очистка памяти
//localStorage.clear();
$('.total-reset').click(function(){
    var res = confirm('В ХРАНИЛИЩЕ ВСЕ БУДЕТ УДАЛЕНО. ПРОДОЛЖИТЬ?');
    if(res)
    {
        deleteTotalData();
        localStorage.clear();
    }
});
//-------------------------------------
//ДАННЫЕ ПО КОНТЕЙНЕРУ
var contNum   = '';
var contLine  = '';
var contGross = '';
var contTare  = '';
var contPay   = '';
//ПОРОДА ДЕРЕВА
var contPoroda = '';
//ДАННЫЕ ПО РАБОТНИКУ(ФИО)
var Employer = '';
//-------------------------------------
//Общее кол-во бревен в контейнере
var qtyTotal = 0;
var general_qtyTotal = 0;
//Общий объем бревен в контейнере
var valTotal = 0;
var general_valTotal = 0;
//Сумма всех диаметров бревен в контейнере
var diamTotal = 0;
var general_diamTotal = 0;
//Общий средний диаметр по контейнеру
var averDiamTotal = 0;
var general_averDiamTotal = 0;
//минимальное значение при котором поле остатка становится красным
var alarm_min = 2000;
//-----------------------------------
//если нет сохраненных значений, инициализируем хранилище
if(!localStorage.getItem('general_qtyTotal'))
{
    localStorage.setItem('general_qtyTotal', 0);
    localStorage.setItem('general_valTotal', 0);
    localStorage.setItem('general_diamTotal',0);
    localStorage.setItem('general_averDiamTotal',0);

    //данные по каждому диаметру
    localStorage.setItem('general_6', 0);
    localStorage.setItem('general_7', 0);
    localStorage.setItem('general_8', 0);
    localStorage.setItem('general_9', 0);
    localStorage.setItem('general_10', 0);
    localStorage.setItem('general_11', 0);
    localStorage.setItem('general_12', 0);
    localStorage.setItem('general_13', 0);
    localStorage.setItem('general_14', 0);
    localStorage.setItem('general_16', 0);
    localStorage.setItem('general_18', 0);
    localStorage.setItem('general_20', 0);
    localStorage.setItem('general_22', 0);
    localStorage.setItem('general_24', 0);
    localStorage.setItem('general_26', 0);
    localStorage.setItem('general_28', 0);
    localStorage.setItem('general_30', 0);
    localStorage.setItem('general_32', 0);
    localStorage.setItem('general_34', 0);
    localStorage.setItem('general_36', 0);
    localStorage.setItem('general_38', 0);

}

//Диаметр бревна
var D = 0;

//Объем бревна заданного диаметра
var V = 0;

//Массивы соответствий D:V для разных длин
var L_3_8 = [];
var L_5_8 = [];
var LM_2_9 = [];
var LM_3_7 = [];
var LM_3_8 = [];
var LM_3_9 = [];
//************************************************

//ТАБЛИЦЫ СООТВЕТСТВИЙ ДИАМЕТРОВ И ОБЪЕМОВ
LM_3_8 = {
    "6":16,
    "7":20,
    "8":24,
    "9":30,
    "10":34,
    "11":42,
    "12":50,
    "13":58,
    "14":68,
    "16":90,
    "18":113,
    "20":140,
    "22":170,
    "24":200,
    "26":240,
    "28":270,
    "30":310,
    "32":360,
    "34":410,
    "36":460,
    "38":510,
    "40":550,
    "42":610,
    "44":670,
    "46":730,
    "48":790,
    "50":860,
    "52":940,
    "54":1020,
    "56":1100,
    "58":1180,
    "60":1270,
    "62":1350,
    "64":1440,
    "66":1530,
    "68":1620,
    "70":1710,
    "72":1810,
    "74":1910,
    "76":2020,
    "78":2120,
    "80":2230,
    "82":2350,
    "84":2460,
    "86":2580,
    "88":2700,
    "90":2830,
    "92":2960,
    "94":3080,
    "96":3220,
    "98":3350,
    "100":3490
};
LM_2_9 = {
    "12":0,
    "14":50,
    "16":66,
    "18":83,
    "20":103,
    "22":125
};
LM_3_7 = {
    "12":48,
    "14":66,
    "16":87,
    "18":100,
    "20":134,
    "22":164
};
LM_3_9 = {
    "12":0,
    "14":70,
    "16":92,
    "18":117,
    "20":143,
    "22":173
};
L_3_8 = LM_3_8;
L_5_8 = {
    "8":43,
    "10":62,
    "12":89,
    "14":118,
    "16":149,
    "18":186,
    "20":220,
    "22":270,
    "24":320,
    "26":380,
    "28":430,
    "30":500,
    "32":570,
    "34":640,
    "36":710,
    "38":790,
    "40":870,
    "42":960,
    "44":1050,
    "46":1150,
    "48":1250,
    "50":1360,
    "52":1470,
    "54":1590,
    "56":1710,
    "58":1840,
    "60":1970,
    "62":2110,
    "64":2240,
    "66":2360,
    "68":2490,
    "70":2630,
    "72":2770,
    "74":2920,
    "76":3080,
    "78":3260,
    "80":3430,
    "82":3610,
    "84":3780,
    "86":3970,
    "88":4170,
    "90":4370,
    "92":4580,
    "94":4790,
    "96":5010,
    "98":5230,
    "100":5450
};


//min и max значения перехода курсора
//диапазон 8 - 38
// (int сравнивается с string с пом. != [нестрогое соответствие])
var min_diam = 6;
var max_diam = 38;
//для фокусировки на след/пред поле
var on_focus_elem;
//текущщее поле ввода количества
var current_elem;
//изменение кол-ва с пом. вирт. клавиатуры
var newFieldVal = '';
//максимальный объем
var max_val = 0;
if(localStorage.getItem('maxVal'))
{
    max_val = localStorage.getItem('maxVal');
    $('#max_val').val(max_val);
}

//сдвиг экрана
var position;

//************************************************
//*******ФУНКЦИИ**********************************
//************************************************
//Сброс данных контейнера
function resetContainerData()
{
    contNum   = $('#cont-num').val('');
    contLine  = $('#cont-line').val('');
    contGross = $('#gross-wt').val('');
    contTare  = $('#tare-wt').val('');
    contPay   = $('#pay-wt').val('');
    contPoroda   = $('#cont-poroda').val('');
    Employer  = $('#emp-name').val('');
    localStorage.setItem('contNum',   '');
    localStorage.setItem('contLine',  '');
    localStorage.setItem('contGross', '');
    localStorage.setItem('contTare',  '');
    localStorage.setItem('contPay',   '');
    localStorage.setItem('contPoroda','');
    localStorage.setItem('Employer',  '');

}

//Сброс всех параметров
function allMelcodrevReset() {
    $('.diam').val('0');
    $('.val').val('0');
    $('#diam_total').val('0');
    $('#val_total').val('0');
    $('#diam'+min_diam).trigger('focus');
    current_elem = $('#diam'+min_diam);
    newFieldVal = '';
    qtyTotal = 0;
    valTotal = 0;
    diamTotal = 0;
    averDiamTotal = 0;
    $('#aver_diam').val(0);
    $('.val_preview').val(0);
    $('#rest_val').val('');
    resetContainerData();
}

//Показ сообщений
function errorMessages(message){
    $('.error').html(message).fadeIn().delay(2000).fadeOut();
}


function getVolumeCarrentLog(Lmd, D)
{

    //Расчет объема текущего бревна
    switch (Lmd) {
        case 'LM_2_9':
            V = LM_2_9[D];
            break;
        case 'LM_3_7':
            V = LM_3_7[D];
            break;
        case 'LM_3_8':
            V = LM_3_8[D];
            break;
        case 'LM_3_9':
            V = LM_3_9[D];
            break;
        case 'L_5_8':
            V = L_5_8[D];
            break;
    }
    //console.log ('V = '+V);

    return V;

}

//предварительный показ общей суммы до сохранения
function getTotalPreview()
{
    //общищий объем линии
    var prev_total_line = $('#val_total').val();
    //console.log('\n+++++++++++++++++++++++++++++++');
    //console.log('prev_total_line = '+prev_total_line);
    /**
     * т.к. данные в локальном текстовом формате(прм. 12 325),
     * разбиваем строку по пробелам,
     * а потом снова склеиваем(уже без пробелов)/
     * находим пробел регулярным выражением и вырезаем его
     */
    //var str = prev_total_line.split(" ");
    var pattern = /\s/g; // g - глобальный поиск - все вхождения, а не только первое.
    prev_total_line = parseInt(prev_total_line.replace(pattern, ""));

    //console.log('\n+++++++++++++++++++++++++++++++');
    //console.log('prev_total_line = '+prev_total_line);

    if(0 != prev_total_line)
    {
        //общищий объем контейнера
        var prev_total = parseInt($('#val_total_general').val());

        var prev_show = prev_total_line + prev_total;
        $('.val_preview').val(prev_show);

        // ПОКАЗ ОСТАТКА ЗАГРУЗКИ
        // !!!!! ОЧИСТЬ ПРИ ОБЩЕМ СБРОСЕ!!!!!
        //текущий объем - prev_show
        //максимальный объем
        if(!localStorage.getItem('maxVal'))
        {
            max_val = $('#max_val').val();
            localStorage.setItem('maxVal',max_val);
        }
        else
        {
            max_val = localStorage.getItem('maxVal');
        }
        //остаток
        var rest_val = max_val - prev_show;
        $('#rest_val').val(rest_val.toLocaleString());
        // изменяем цвет при < чем alarm_min cm3(см. вверху)
        if(rest_val < alarm_min)
        {
            $('#rest_val').css({'background-color':'red','color':'white'});
        }
        else
        {
            $('#rest_val').css({'background-color':'white','color':'black'});
        }

    }
    else
    {
        $('.val_preview').val(0);
    }


}


//ВСЕ РАСЧЕТЫ
function Calculation() {
    //выбор длины
    var Lmd = $('#Lmd').val();
    //console.log('Lmd = '+Lmd);
    D = $(current_elem).attr('diam');
    //console.log('\nD = '+D);

    getVolumeCarrentLog(Lmd,D);
    //console.log ('V = '+V);

    if(V == null)
    {
        errorMessages('Нет данных для диаметра');
        $(current_elem).val(0);
        return;
    }
    //console.log('V = '+V);
    //получаем текущий id полей количества
    // и общего объема
    var diam_temp = '#diam' + D;
    var val_temp = '#val' + D;
    //console.log('diam_temp = '+diam_temp);
    //console.log('val_temp = '+val_temp);

    $(val_temp).val($(diam_temp).val() * V);
    //***************************************
    //********ОБЩИЕ ДАННЫЕ*******************
    //***************************************
    //ОБЩЕЕ КОЛИЧЕСТВО+СУММА ВСЕХ ДИАМЕТРОВ
    var diam_total = 0;
    //сумма всех диаметров
    var sum_diam = 0;
    var temp_diam_total = $('.diam');
    //console.log(temp_var);
    $.each(temp_diam_total, function () {
        var qty = parseInt($(this).val());
        //console.log('qty = '+qty);
        diam_total += qty;
        var current_diam = $(this).attr('diam');
        sum_diam += current_diam * qty;
        //console.log('sum_diam = '+sum_diam);
    });
    //console.log('sum_diam final = ' + sum_diam);
    //console.log('diam_total = ' + diam_total);
    //общее кол-во
    $('#diam_total').val(diam_total.toLocaleString());
    //общий средний диаметр !!!деление на ноль
    //убираем деление на ноль
    var aver_diam = sum_diam/((diam_total)?diam_total:1);
    $('#aver_diam').val(aver_diam.toFixed(3));
    //***************************************
    //ОБЩИЙ ОБЪЕМ
    var val_total = 0;
    var temp_val_total = $('.val');
    //console.log('temp_val_total = '+temp_val_total);
    $.each(temp_val_total, function () {
        var qty = parseInt($(this).val());
        //console.log('qty = '+qty);
        val_total += qty;
    });
    //console.log('val_total = ' + val_total);

    $('#val_total').val(val_total.toLocaleString());
    //----------------------------------------------
    //предварительный показ общей суммы до сохранения
    getTotalPreview();
    //-----------------------------------------------

    //СОХРАНЕНИЕ ДАННЫХ ДЛЯ ВСЕЙ ПАРТИИ
    qtyTotal = diam_total;
    valTotal = val_total;
    diamTotal = sum_diam;
    averDiamTotal = aver_diam;
    //-------------TEST-----------------------------------
    //console.log('При наборе с клавиатуры'
    //    +'\nqtyTotal = ' + qtyTotal
    //    + '\nvalTotal = ' + valTotal
    //    + '\ndiamTotal = ' + diamTotal
    //    + '\naverDiamTotal = ' + averDiamTotal
    //);
    //----------------------------------------------------

}

//Сохранение общих данных по всему контейнеру
function saveTotalData()
{
    var result = confirm('Данные будут добавлены к общим данным по контейнеру. Продолжить?');
    if(result)
    {
        //новые значения
        var temp_qtyTotal = parseInt(localStorage.getItem('general_qtyTotal'))   + qtyTotal*1;
        var temp_valTotal = parseInt(localStorage.getItem('general_valTotal'))   + valTotal*1;
        var temp_diamTotal = parseInt(localStorage.getItem('general_diamTotal')) + diamTotal*1;

        localStorage.setItem('general_qtyTotal', temp_qtyTotal);
        localStorage.setItem('general_valTotal', temp_valTotal);
        localStorage.setItem('general_diamTotal', temp_diamTotal);

        general_diamTotal = localStorage.getItem('general_diamTotal');
        general_qtyTotal = localStorage.getItem('general_qtyTotal');
        general_averDiamTotal = general_diamTotal / ((general_qtyTotal)?general_qtyTotal:1);

        localStorage.setItem('general_averDiamTotal', general_averDiamTotal);

        //сохраняем кол-во по каждому диаметру
        addAllDiam();

        errorMessages('Данные сохранены');

        //-------------TEST-----------------------------------
        general_qtyTotal = localStorage.getItem('general_qtyTotal');
        general_valTotal = localStorage.getItem('general_valTotal');
        general_diamTotal = localStorage.getItem('general_diamTotal');
        general_averDiamTotal = localStorage.getItem('general_averDiamTotal');

        //все диаметры

        //console.log('ПОСЛЕ СОХРАНЕНИЯ'
        //    + '\n general_qtyTotal = '       + general_qtyTotal
        //    + '\n general_valTotal = '      + general_valTotal
        //    + '\n general_diamTotal = '     + general_diamTotal
        //    + '\n general_averDiamTotal = ' + general_averDiamTotal
        //    //+'\n general_8 = '+localStorage.getItem('general_8')
        //    //+'\n general_10 = '+localStorage.getItem('general_10')
        //    //+'\n general_12 = '+localStorage.getItem('general_12')
        //    //+'\n general_14 = '+localStorage.getItem('general_14')
        //    //+'\n general_16 = '+localStorage.getItem('general_16')
        //    //+'\n general_18 = '+localStorage.getItem('general_18')
        //    //+'\n general_20 = '+localStorage.getItem('general_20')
        //    //+'\n general_22 = '+localStorage.getItem('general_22')
        //    //+'\n general_24 = '+localStorage.getItem('general_24')
        //    //+'\n general_26 = '+localStorage.getItem('general_26')
        //    //+'\n general_28 = '+localStorage.getItem('general_28')
        //    //+'\n general_30 = '+localStorage.getItem('general_30')
        //    //+'\n general_32 = '+localStorage.getItem('general_32')
        //    //+'\n general_34 = '+localStorage.getItem('general_34')
        //    //+'\n general_36 = '+localStorage.getItem('general_36')
        //    //+'\n general_38 = '+localStorage.getItem('general_38')
        //);
        //----------------------------------------------------

        //очищаем данные ввода, чтоб не дублировать
        // ввод одних и тех же данных
        qtyTotal = 0;
        valTotal = 0;
        diamTotal = 0;
        averDiamTotal = 0;

        //заполняем поля общих данных по контейнеру
        $('#diam_total_general').val(general_qtyTotal);
        $('#val_total_general').val(general_valTotal);
        $('#aver_diam_general').val(parseFloat(general_averDiamTotal).toFixed(3));
        //выводим кол-во каждого диаметра
        showTotalData();
    }
}

//показ общих данных
function showTotalData()
{
//только если в хранилище есть данные
    if( localStorage.getItem("general_qtyTotal")
        && localStorage.getItem("general_qtyTotal") > 0)
    {
        //ПОКАЗ ДАННЫХ В ВЕРХНЕЙ ПАНЕЛИ

        //general_qtyTotal = localStorage.getItem('general_qtyTotal');
        //general_valTotal = localStorage.getItem('general_valTotal');
        //general_averDiamTotal = parseFloat(localStorage.getItem('general_averDiamTotal'));
        ////общее кол-во(вверху)
        //$('#diam_total').val(general_qtyTotal.toLocaleString());
        ////общий объем
        //$('#val_total').val(general_valTotal.toLocaleString());
        ////общий средний диаметр
        //$('#aver_diam').val(general_averDiamTotal.toFixed(3));

//*********************************************************************************

        //удаляем старую таблицу с диаметрами
        $('.total-diam-data').remove();
        //создаем новую таблицу с диаметрами
        var append_data = '';
        var count_diam = 0;
        var Lmd = $('#Lmd').val();
        //объем всех бревен одного диаметра
        var volume_summ_current = 0;
        //объем одного бревна данного диаметра
        var volume_current = 0;

        for(var i = 6; i <= 38; i++ )
        {
            if(i < 14)
            {
                count_diam = parseInt(localStorage.getItem('general_'+i));
                //console.log(i+' = '+count_diam+' шт\n');
                volume_current = getVolumeCarrentLog(Lmd,i+'');
                //console.log('volume_current['+i+'] = '+volume_current+' см3\n');


                volume_summ_current = volume_current * count_diam;
                append_data +=
                    '<tr class="additional-data">' +
                    '<td><i class="fa fa-ban"></i>&nbsp;'+i+'</td>'+
                    '<td>'+count_diam+' шт</td>'+
                    '<td>'+volume_summ_current+' cm3</td>'+
                    '</tr>';
            }
            else
            {
                if(i%2 == 0)
                {

                    count_diam = parseInt(localStorage.getItem('general_'+i));
                    //console.log(i+' = '+count_diam+' шт\n');
                    volume_current = getVolumeCarrentLog(Lmd,i+'');
                    //console.log('volume_current['+i+'] = '+volume_current+' см3\n');


                    volume_summ_current = volume_current * count_diam;
                    append_data +=
                        '<tr class="additional-data">' +
                        '<td><i class="fa fa-ban"></i>&nbsp;'+i+'</td>'+
                        '<td>'+count_diam+' шт</td>'+
                        '<td>'+volume_summ_current+' cm3</td>'+
                        '</tr>';
                }
            }

        }
        //добавляем к таблице с дан. по всему контейнеру
        $('.total-container').append(
            '<table class="table-responsive table-striped table-bordered total-diam-data">'+
            append_data+
            '</table>'
        );


//*********************************************************************************

    }
    else
    {
        errorMessages('Нет данных');
    }
}

//удаление всех общих данных
function deleteTotalData()
{
    var result = confirm('Данные по общей загрузке будут удалены. Продолжить?');
    if(result)
    {
        localStorage.clear();
        localStorage.setItem('general_qtyTotal', 0);
        localStorage.setItem('general_valTotal', 0);
        localStorage.setItem('general_diamTotal',0);
        localStorage.setItem('general_averDiamTotal',0);

        //данные по каждому диаметру
        localStorage.setItem('general_6', 0);
        localStorage.setItem('general_7', 0);
        localStorage.setItem('general_8', 0);
        localStorage.setItem('general_9', 0);
        localStorage.setItem('general_10', 0);
        localStorage.setItem('general_11', 0);
        localStorage.setItem('general_12', 0);
        localStorage.setItem('general_13', 0);
        localStorage.setItem('general_14', 0);
        localStorage.setItem('general_16', 0);
        localStorage.setItem('general_18', 0);
        localStorage.setItem('general_20', 0);
        localStorage.setItem('general_22', 0);
        localStorage.setItem('general_24', 0);
        localStorage.setItem('general_26', 0);
        localStorage.setItem('general_28', 0);
        localStorage.setItem('general_30', 0);
        localStorage.setItem('general_32', 0);
        localStorage.setItem('general_34', 0);
        localStorage.setItem('general_36', 0);
        localStorage.setItem('general_38', 0);

        errorMessages('Данные по загрузке удалены');


        //-------------TEST-----------------------------------
        general_qtyTotal = localStorage.getItem('general_qtyTotal');
        general_valTotal = localStorage.getItem('general_valTotal');
        general_diamTotal = localStorage.getItem('general_diamTotal');
        general_averDiamTotal = localStorage.getItem('general_averDiamTotal');
        //console.log('ПОСЛЕ ОЧИСТКИ ПАМЯТИ'
        //    +'\ngeneral_qtyTotal = ' + general_qtyTotal
        //    + '\ngeneral_valTotal = ' + general_valTotal
        //    + '\ngeneral_diamTotal = ' + general_diamTotal
        //    + '\ngeneral_averDiamTotal = ' + general_averDiamTotal
        //);
        //----------------------------------------------------
        //заполняем поля общих данных по контейнеру
        $('#diam_total_general').val(0);
        $('#val_total_general').val(0);
        $('#aver_diam_general').val(0);
        //удаляем старую таблицу с диаметрами
        $('.total-diam-data').remove();
        //удаляем предварительный общий объем
        getTotalPreview();

        //удаляем максимальный объем и остаток
        max_val = $('#max_val').val(0);
        localStorage.removeItem('maxVal');
        $('#rest_val').val('');

        //полностью очищаем локальное хранилище
        //localStorage.clear();

    }
}//deleteTotalData

//перемотка к текущему элементу
function scrollVisible(current_elem)
{
    //позиция текущего элемента
    //console.log($(current_elem).offset().top);
    var current_position = $(current_elem).offset().top;
    position = current_position - 80;
    $('body,html').animate({
        scrollTop: position
    }, 600);

}

//сохранение колличества каждого диаметра
function addAllDiam()
{
    var count_diam = 0;
    for(var i = 6; i < 39; i++ )
    {
       if(i < 14)
       {
           count_diam = parseInt($('#diam'+i).val()) + parseInt(localStorage.getItem('general_'+i));
           localStorage.setItem('general_'+i, count_diam);
       }
        else
       {
           if(i%2 == 0)
           {
               count_diam = parseInt($('#diam'+i).val()) + parseInt(localStorage.getItem('general_'+i));
               localStorage.setItem('general_'+i, count_diam);
           }
       }

    }
}
//************************************************
//*******ПРОГРАММА********************************
//************************************************
/**
 * при загрузке страницы
 * первый элемент получает фокус
 */
$(window).load(function(){
    $('#diam'+min_diam).trigger('focus');
    on_focus_elem = $(window.document.activeElement);
    current_elem = on_focus_elem;
});

/**
 * вначале клавиатура скрыта
 * и места для нее нет
 */
$("#numbers").css('display','none');
$('.melcodrev').css('padding-bottom','0');


/**
 * при клике на ячейку она получает фокус
 * и становится current_elem
 */
$('.diam').click(function(){
    $(this).trigger('focus');
    current_elem = $(this);
    //сброс нового кол-вы для след. поля
    newFieldVal = '';
    //при переключении, кнопки в положение default
    $('.prev').css('color','green');
    $('.next').css('color','green');
    //включить клавиатуру, если выключена
    var visible = $("#numbers").css('display');
    //console.log(visible);
    if(visible === 'none')
    {
        $('.fa-calculator').trigger('click');
    }
});
//******************************************************

/**
 * Если есть данные в хранилище, инициализируем
 * все переменные сохраненными данными
 */
if( localStorage.getItem("general_qtyTotal")
    && parseInt(localStorage.getItem("general_qtyTotal")) !== 0)
{
    errorMessages('Есть сохраненные данные');
    //сохраненные данные контейнера
    contNum = localStorage.getItem('contNum');
    contLine = localStorage.getItem('contLine');
    contGross = localStorage.getItem('contGross');
    contTare = localStorage.getItem('contTare');
    contPay = localStorage.getItem('contPay');
    contPoroda = localStorage.getItem('contPoroda');
    Employer = localStorage.getItem('Employer');
    $('#cont-num').val(contNum);
    $('#cont-line').val(contLine);
    $('#gross-wt').val(contGross);
    $('#tare-wt').val(contTare);
    $('#pay-wt').val(contPay);
    $('#cont-poroda').val(contPoroda);
    $('#emp-name').val(Employer);

    //сохраненные данные по всей загрузке
    general_qtyTotal = localStorage.getItem('general_qtyTotal');
    general_valTotal = localStorage.getItem('general_valTotal');
    general_diamTotal = localStorage.getItem('general_diamTotal');
    general_averDiamTotal = localStorage.getItem('general_averDiamTotal');

    //заполняем поля общих данных по контейнеру
    $('#diam_total_general').val(general_qtyTotal);
    $('#val_total_general').val(general_valTotal);
    $('#aver_diam_general').val(parseFloat(general_averDiamTotal).toFixed(3));

    //таблица диаметров
    showTotalData();
}
else
{
    errorMessages('Пустой контейнер');
}
//******************************************************
//ПОКАЗАТЬ/СКРЫТЬ ДАННЫЕ КОНТЕЙНЕРА
$('#show_cont').click(function(){
    $( ".table-container-data" ).slideToggle() ;
    return false;
});

//Сброс введенных данных контейнера
$('#reset_cont').click(function(){
    resetContainerData();
    return false;
});

//ДАННЫЕ КОНТЕЙНЕРА СОХРАНИТЬ
$('#save_cont').click(function() {
    //получение
    localStorage.setItem('contNum',$('#cont-num').val());
    localStorage.setItem('contLine',$('#cont-line').val());
    localStorage.setItem('contGross',$('#gross-wt').val());
    localStorage.setItem('contTare',$('#tare-wt').val());
    localStorage.setItem('contPay',$('#pay-wt').val());
    localStorage.setItem('contPoroda',$('#cont-poroda').val());
    localStorage.setItem('Employer',$('#emp-name').val());

    //verification

    contNum   = localStorage.getItem('contNum');
    contLine  = localStorage.getItem('contLine');
    contGross = localStorage.getItem('contGross');
    contTare  = localStorage.getItem('contTare');
    contPay   = localStorage.getItem('contPay');
    contPoroda = localStorage.getItem('contPoroda');
    Employer  = localStorage.getItem('Employer');

    //alert (contNum);

    errorMessages('Данные сохранены');

});

//******************************************************

//ПОКАЗАТЬ/СКРЫТЬ ДОПОЛНИТЕЛЬНЫЙ ВВОД КОЛИЧЕСТВА
$('.edit-enter').click(function() {
    $(".keyboard").slideToggle(function () {
        var visible = $(".keyboard").css('display');
        //console.log(visible);
        if (visible === 'none') {
            scrollVisible($("#diam"+min_diam));
        }
        else {
            scrollVisible($(".keyboard"));
            //убираем основную клавиатуру
            $("#numbers").css('display','none');
        }

    });
});
//******************************************************

//ПОКАЗАТЬ/СКРЫТЬ ВВОД НОВОЙ МАШИНЫ/ВАГОНА
$('.add-car').click(function() {
    $(".new-car").slideToggle();
});
//******************************************************

//сохранение общих данных
$('.save-data').click(function(){
    if(qtyTotal > 0)
    {
        saveTotalData();
    }
    else
    {
        errorMessages('Нет новых данных для сохранения');
    }
});
//******************************************************
//показ общих данных
$('.all-data').click(function(){
    showTotalData();
});
//******************************************************
//удаление общих данных
$('.delete-store').click(function(){
    deleteTotalData();
});
//******************************************************
//ВВОД ДАННЫХ С  ВИРТУАЛЬНОЙ КЛАВИАТУРЫ
$(".numbers td").click(function(){

    if( $(this).attr('val') != 'next' &&
        $(this).attr('val') != 'del' &&
        $(this).attr('val') != 'prev'
    )
    {
        //к значению поля добавляем
        // значение кнопки клавиатуры
        newFieldVal += $(this).attr('val');

        //новое значение поля
        $(current_elem).val(newFieldVal)
            .css('color','red')
            .trigger('focus');

        //общие расчеты после
        // каждого изменения поля
        Calculation();

    }
    //перейти на ячейку вниз
    else if($(this).attr('val') == 'next')
    {
        /**
         * Вниз только до диам.38
         */
        if($(current_elem).attr('diam') != max_diam)
        {
            //следующий элемент
            /**
             * При нажатии фокус переходит к клавиатуре!!!
             * Переназначить фокус!
             */
            var next_elem = $(current_elem).parent().parent().next().find("input:first");
            //console.log('Значение текущего элемента = '+next_elem.val());

            //переназначаем текущий элемент
            current_elem = next_elem;
            //focus on current_elem
            $(current_elem).trigger('focus');

            //когда идем вниз, кнопка "вверх" - default
            $('.prev').css('color','green');

            //сброс нового кол-вы для след. поля
            newFieldVal = '';

            //позиция текущего элемента
            scrollVisible(current_elem);
        }
        else
        {
            /**
             * на последней ячейке кнопку в красный цвет
             * и фокус еа последнем элементе
             */
            $(this).css('color','red');
            $('#diam'+max_diam).trigger('focus');
        }
    }//перейти на ячейку вниз

    //перейти на ячейку вверх
    else if($(this).attr('val') == 'prev')
    {
        /**
         * Вверх только до диам.8
         */
        if($(current_elem).attr('diam') != min_diam)
        {
            var next_elem = $(current_elem).parent().parent().prev().find("input:first");
            //console.log('Значение текущего элемента = '+next_elem.val());

            //переназначаем текущий элемент
            current_elem = next_elem;
            //focus on current_elem
            $(current_elem).trigger('focus');

            //когда идем вверх, кнопка "вниз" - default
            $('.next').css('color','green');

            //сброс нового кол-вы для след. поля
            newFieldVal = '';

            //позиция текущего элемента
            scrollVisible(current_elem);
        }
        else
        {
            $(this).css('color','red');
            $('#diam'+min_diam).trigger('focus');
        }
    }//перейти на ячейку вверх
    //убрать последнюю цифру
    else if($(this).attr('val') == 'del')
    {
        /**
         * только если значение > 0
         */
        if($(current_elem).val() !== 0)
        {
            //console.log('текст последнего элемента - '+ $(current_elem).val());
            //значение поля
            var str = $(current_elem).val();
            /**
             * если удаляем последнее число,
             * значение элемента в "0"
             */
            if(str.length > 1)
            {
                //минус последний символ
                var mines_symbol = str.substring(0, str.length - 1)
                //console.log('текст минус последний символ - '+ mines_symbol);
                //новое значение поля
                $(current_elem).val(mines_symbol).trigger('focus');
                //общие расчеты после
                // каждого изменения поля
                Calculation();
                //новое значение для заполнения поля
                newFieldVal = $(current_elem).val();
            }
            else
            {
                $(current_elem).val(0).trigger('focus');
                //общие расчеты после
                // каждого изменения поля
                Calculation();
                //новое значение для заполнения поля(пустое)
                newFieldVal = '';

            }
        }

    }
});
//******************************************************

//************************************************
//*******РАЗНОЕ***********************************
//************************************************
//изменения при переключении режимов
function reloadMode(min, max)
{
    //переназначаем конечные точки
    min_diam = min;
    max_diam = max;
    //фокус на первое поле
    $('#diam'+min_diam).trigger('focus');
    //активный элемент-первое поле в выборке
    current_elem = $(window.document.activeElement);
    //при переключении, кнопки в положение default
    $('.prev').css('color','green');
    $('.next').css('color','green');
}
//выбор ель/мелкодрев
$('.switch-mode input:radio').click(function(){
    var mode = $(this).val();
    if(mode == 1){//ель
        //показать все
        $('.table-diam tr').show();
        reloadMode(8, 38);
    }
    else {//мелкодрев
        //выбрать все кроме .md и скрыть
        $('.table-diam tr:not(.md)').hide();
        //переназначаем конечные точки
        reloadMode(12, 18);
    }
    $('body,html').animate({
        scrollTop: 0
    }, 600);
});

//сбросить все параметры
$('.reset-melcodrev').click(function(){
    allMelcodrevReset();
});

//сброс при изменении длины
$('#Lmd').change(function(){
    allMelcodrevReset();
});

//очистка поля при наведении
$('.diam').focus(function(){
    var current_data = $(this).val();
    $(this).val(current_data).css('color','red');
});

//значение поля при потере фокуса
$('.diam').blur(function(){
    var current_data = $(this).val();
    $(this).val(current_data).css('color','black');
});

//Скролл вверх
$('.to-top').click(function () {
    $('body,html').animate({
        scrollTop: 0
    }, 600);
    return false;
});

//отключение двойного клика
$(".numbers td").dblclick(function(){
    $(this).trigger('click');
});

//включение/выключение клавиатуры
$('.fa-calculator').click(function(){
    $("#numbers" ).slideToggle('slow',function(){
        var visible = $("#numbers").css('display');
        //console.log(visible);
        if(visible === 'none')
        {
            $('.melcodrev').css('padding-bottom','0');
            $('.fa-calculator').css('color','white');
        }
        else
        {
            $('.melcodrev').css('padding-bottom','115px');
            $('.fa-calculator').css('color','red');
        }
    }) ;
    //console.log($("#numbers").css('visibility'));
});
//СИНХРОНИЗАЦИЯ
$('#sinhro').click(function() {
    var result = confirm('Данные будут отправлены в хранилище. Продолжить?');
    if(result)
    {
        contNum   = localStorage.getItem('contNum');
        contLine  = localStorage.getItem('contLine');
        contGross = localStorage.getItem('contGross');
        contTare  = localStorage.getItem('contTare');
        contPay   = localStorage.getItem('contPay');
        contPoroda = localStorage.getItem('contPoroda');
        Employer  = localStorage.getItem('Employer');
        //Отправка данных только с заполненным контейнером
        if(
            contNum    &&
            contLine   &&
            contGross  &&
            contTare   &&
            contPay    &&
            contPoroda &&
            Employer
        )
        {
            //данные о загрузке
            Partia = {
            "diam_6":localStorage.getItem('general_6'),
            "diam_7":localStorage.getItem('general_7'),
            "diam_8":localStorage.getItem('general_8'),
            "diam_9":localStorage.getItem('general_9'),
            "diam_10":localStorage.getItem('general_10'),
            "diam_11":localStorage.getItem('general_11'),
            "diam_12":localStorage.getItem('general_12'),
            "diam_13":localStorage.getItem('general_13'),
            "diam_14" :localStorage.getItem('general_14'),
            "diam_16" :localStorage.getItem('general_16'),
            "diam_18" :localStorage.getItem('general_18'),
            "diam_20" :localStorage.getItem('general_20'),
            "diam_22" :localStorage.getItem('general_22'),
            "diam_24" :localStorage.getItem('general_24'),
            "diam_26" :localStorage.getItem('general_26'),
            "diam_28" :localStorage.getItem('general_28'),
            "diam_30" :localStorage.getItem('general_30'),
            "diam_32" :localStorage.getItem('general_32'),
            "diam_34" :localStorage.getItem('general_34'),
            "diam_36" :localStorage.getItem('general_36'),
            "diam_38" :localStorage.getItem('general_38'),
            "total_qty" :localStorage.getItem('general_qtyTotal'),
            "total_vol" :localStorage.getItem('general_valTotal')
            };

            var DATA = {
                "contNum"  : contNum,
                "contLine" : contLine,
                "contGross": contGross,
                "contTare" : contTare,
                "contPay"  : contPay,
                "contPoroda" : contPoroda,
                "Employer" : Employer,
                "Partia"   : Partia
            };
            //console.log(Partia);
            //$.ajax({
            //    //локальный сервер
            //    //"url": "",
            //    //удаленный сервер
            //    "url": "",
            //    "type": "post",
            //    "data": {
            //        "melkodrev": "yes",
            //        "DATA": DATA
            //    },
            //    "dataType": 'json',
            //    timeout: 30000,
            //    "success": function (data) {
            //        errorMessages(data.message);
            //        alert ('Данные успешно отправлены.');
            //    },
            //    error: function (XMLHttpRequest, textStatus, errorThrown)
            //    {
            //        errorMessages('Данные не ушли. <br>Попробуйте еще раз.');
            //    }
            //
            //});
            //конец отправки данных на сервер
            errorMessages('Синхронизация ОТКЛЮЧЕНА!!!');
        }
        else
        {
            errorMessages('Введены не все данные контейнера');
        }

    }

    return false;
});

// ВЫВОД МАКСИМАЛЬНОГО И ОСТАВШЕГОСЯ ОБЪЕМОВ(доп. см. фн.getTotalPreview )
$('#max_val').keyup(function(){
    var max_val = $(this).val();
    localStorage.setItem('maxVal',max_val);
    var current_val = parseInt($('#val_preview').val());
    var rest_val = max_val - current_val;
    $('#rest_val').val(rest_val.toLocaleString());
    // изменяем цвет при < чем alarm_min cm3(см. вверху)
    if(rest_val < alarm_min)
    {
        $('#rest_val').css({'background-color':'red','color':'white'});
    }
    else
    {
        $('#rest_val').css({'background-color':'white','color':'black'});
    }
});

