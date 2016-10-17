var app = angular.module("lesModule", []);
app.controller("LesCtrl", function ($scope) {
    // диаметр
    $scope.diam = '';
    // кол-во данного диаметра
    $scope.qty = 1;
    // массив кол-ва диаметров
    $scope.DiamQty = {
        "6":0,
        "7":0,
        "8":0,
        "9":0,
        "10":0,
        "11":0,
        "12":0,
        "13":0,
        "14":0,
        "16":0,
        "18":0,
        "20":0,
        "22":0,
        "24":0,
        "26":0,
        "28":0,
        "30":0,
        "32":0,
        "34":0,
        "36":0,
        "38":0
    };

    // ВЫВОД МАКСИМАЛЬНОГО И ОСТАВШЕГОСЯ ОБЪЕМОВ
    // текущий объем(из предварительного просмотра)
    $scope.current_val = '';
    // максимальный объем
    $scope.max_val = '';
    // оставшийся для загрузки объем
    $scope.rest_val = $scope.max_val - $scope.current_val;


//******************************************************************
    // ДОПОЛНИТЕЛЬНЫЙ ВВОД ДИАМЕТРОВ
    // номер следующего бревна
    $scope.next_log_num = 1;

    $scope.addDiam = function (diam){
        $scope.diam = diam;
        //console.log('diam'+diam);
    };

    $scope.removeDiam = function (){
        $scope.diam = '';
        $scope.qty = 1;
    };

    $scope.plusDiam = function (){
        $scope.qty++;
    };

    $scope.minusDiam = function (){
        if($scope.qty > 1)
        {
            $scope.qty--;
        }
    };
    
    $scope.addNext = function (){
        // только если в поле есть данные
        if($scope.diam)
        {
            // закрываем подробный показ
            // удаляем таблицу
            $('.additional-diam-data').remove();
            // переключаем флаг
            $scope.show_flag = true;

            //console.log('diam = '+$scope.diam+'; qty = '+$scope.qty);
            /**
             * изменяем кол-во введенного диаметра и заполняем нужное поле
             */
            // старое значение поля
            var current_val = parseInt($('#diam'+$scope.diam).val());
            // новое значение поля
            var new_val = current_val + $scope.qty;
            $('#diam'+$scope.diam).val(new_val);

            //фокус на поле нужного диаметра(убрал, чтоб не было скрола вверх)
            //$('#diam'+$scope.diam).trigger('focus');
            //current_elem = $(this);
            current_elem = $('#diam'+$scope.diam);
            //производим все расчеты в ф-ле drova.js
            Calculation();


            // сохраняем данные в массив
            $scope.DiamQty[$scope.diam] += $scope.qty;

            // находим общее кол-во бревен
            var total_qty = $scope.countTotalSum();
            // на кнопке отображаем общее кол-во
            $('#qty_by_diams').text('Колличество бревен: ' + total_qty + ' шт');
            // номер следующего бревна
            $scope.next_log_num = total_qty + 1;
            // очищаем поля ввода
            $scope.removeDiam();
        }
        else
        {
            errorMessages('Введите данные')
        }
    };

    $scope.show_flag = true;
    $scope.showQtyByDiam = function (){
        //console.log($scope.DiamQty);

        if($scope.show_flag)
        {
            // ВЫВОДИМ ТАБЛИЦУ
            // 1-формируем данные
            var append_data = '';
            var total_sum = 0;
            for(var item in $scope.DiamQty){
                //console.log(item + ' = ' + $scope.DiamQty[item]);
                total_sum += $scope.DiamQty[item];
                // выводим только если есть значение
                if($scope.DiamQty[item])
                {
                    append_data +=
                        '<tr class="additional-data">' +
                        '<td><i class="fa fa-ban"></i>&nbsp;'+item+'</td>'+
                        '<td>'+$scope.DiamQty[item]+' шт</td>'+
                        '</tr>';
                }
            }
            //console.log('Total Sum = ' + total_sum);

            // 2-выводим готовую таблицу
            $('.keyboard').append(
                '<table class="table-responsive table-striped table-bordered additional-diam-data">'+
                append_data+
                '</table>'
            );

            // переключаем флаг
            $scope.show_flag = false;
        }
        else
        {
            // удаляем таблицу
            $('.additional-diam-data').remove();
            // переключаем флаг
            $scope.show_flag = true;
        }


        var total_sum = 0;
        for(var item in $scope.DiamQty){ 
            //console.log(item + ' = ' + $scope.DiamQty[item]);
            total_sum += $scope.DiamQty[item];
        }
        //console.log('Total Sum = ' + total_sum);

    };

    $scope.countTotalSum = function (){
        var total_sum = 0;
        for(var item in $scope.DiamQty){
            //console.log(item + ' = ' + $scope.DiamQty[item]);
            total_sum += $scope.DiamQty[item];
        }
        //console.log('Total Sum = ' + total_sum);
        return total_sum;
    };

    $scope.cleanDiamQty = function () {
        // очищаем массив диаметров
        for(var item in $scope.DiamQty){
            $scope.DiamQty[item] = 0;
        }
        //console.log($scope.DiamQty);
        // надпись на кнопке - в 0
        $('#qty_by_diams').text('Колличество бревен 0 шт');
        // удаляем таблицу
        $('.additional-diam-data').remove();
        // переключаем флаг
        $scope.show_flag = true;
        // номер следующего бревна
        $scope.next_log_num = 1;
        // скрываем дополнительный ввод
        $(".keyboard").css('display','none');
    };
//*******************************************************************


//**************************************************************************************************************
//**************************************************************************************************************
//**************************************************************************************************************
    // РАЗБИВКА ЗАГРУЗКИ ПО МАШИНАМ
//**************************************************************************************************************
//**************************************************************************************************************
//**************************************************************************************************************


    // массив загрузки машин
    $scope.CarsLoadings = [];

    /**
     * ПРОВЕРЯЕМ НАЛИЧИЕ СОХРАНЕННЫХ ЗАГРУЗОК
     * И ЕСЛИ ЕСТЬ, ОБНОВЛЯЕМ $scope.CarsLoadings
     */
    if(localStorage.getItem('CarsLoadings'))
    {
        getCarsFromLocaleStorage();

        //текущая машина - последняя машина в массиве
        var last_car = $scope.CarsLoadings.slice(-1);
        $scope.current_car = last_car[0];
        // номер и дата текущей машины
        $scope.new_car_num = $scope.current_car.num;
        $scope.new_car_date = $scope.current_car.date;
    }

    //------------------------------------------------
    //TEST
    //for(var i = 0; i < 5; i++)
    //{
    //    $scope.current_car = {
    //        num:'',
    //        date:'',
    //        "6":0,
    //        "7":0,
    //        "8":0
    //    };
    //    $scope.current_car.num = i;
    //    $scope.current_car.date = i+i+i+i;
    //    $scope.CarsLoadings.push($scope.current_car);
    //}
    //console.log($scope.CarsLoadings);
    //console.log($scope.CarsLoadings[3][8]);
 //-----------------------------------------------------------

//**************************************************************************************************************
    // СОЗДАНИЕ НОВОЙ МАШИНЫ
//**************************************************************************************************************
    $scope.new_car_num = '';
    $scope.new_car_date = '';

    $scope.addNewCar = function (){
            //--------------------------------------------------------
            //создаем новую машину
        if($scope.new_car_num)
        {
            /**
             *  ЕСЛИ УЖЕ ЕСТЬ ТЕКУЩАЯ МАШИНА, СОХРАНИТЬ ЕЕ В МАССИВЕ В ПОСЛЕДНЕМ СОСТОЯНИИ
             *  ИЛИ ПОСЛЕ КАЖДОГО ИЗМЕНЕНИЯ ТЕКУЩЕЙ МАШИНЫ ПЕРЕЗАПИСЫВАТЬ ЕЕ В ХРАНИЛИЩЕ,
             *  А ТУТ ПРОСТО НАЗНАЧИТЬ ТЕКУЩЕЙ - НОВУЮ МАШИНУ
             */
            var new_car = {
                num: $scope.new_car_num,
                date: $scope.new_car_date,
                "6": 0,
                "7": 0,
                "8": 0,
                "9": 0,
                "10": 0,
                "11": 0,
                "12": 0,
                "13": 0,
                "14": 0,
                "16": 0,
                "18": 0,
                "20": 0,
                "22": 0,
                "24": 0,
                "26": 0,
                "28": 0,
                "30": 0,
                "32": 0,
                "34": 0,
                "36": 0,
                "38": 0
            };
            //помещаем ее в массив машин
            $scope.CarsLoadings.push(new_car);
            console.log('массив машин после нового добавления',$scope.CarsLoadings);
            //назначаем текущей машиной последнюю введенную
            $scope.current_car = new_car;

            //очищаем поля ввода новой машины
            $scope.new_car_num = '';
            $scope.new_car_date = '';

            //console.log('массив с машинами',$scope.CarsLoadings);
            //console.log('последняя машина в массиве', $scope.CarsLoadings.slice(-1));
            /**
             * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
             *  ВОЗВРАЩАЕТ !!!МАССИВ!!!,ГДЕ ОБЪЕКТ ЭТО [0] ЭЛЕМЕНТ!!!
             * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
             */
            //var last_car = $scope.CarsLoadings.slice(-1);
            //console.log('последняя машина в массиве', last_car);
            //console.log('номер последней машины', last_car[0].num);
            //console.log('номер последней машины', last_car[0][9]);
            //for(var i in last_car)
            //{
            //    console.log(last_car[i]);
            //}

            //новый общий массив отправляем, серелизовав, в хранилище
            localStorage.setItem('CarsLoadings', JSON.stringify($scope.CarsLoadings));
            
            console.log('создана новая машина!!!');

            // убираем поля ввода номера и даты
            $(".new-car").css('display','none');
            //---------------------------------------------------------------------------------
            // РАБОТА С ХРАНИЛИЩЕМ
            //console.log('ОБЪЕКТ из хранилища', JSON.parse(localStorage.getItem('CarsLoadings')));
            //var test = JSON.parse(localStorage.getItem('CarsLoadings'));
            // заполняем массив объектом с объектами из хранилища
            //var j = 0;
            //for(var i in test)
            //{
            //    //console.log(test[i].num);
            //    //console.log(test[i][6]);
            //    $scope.CarsLoadings[j] = test[i];
            //    console.log('заполняем массив машин - ',$scope.CarsLoadings[j]);
            //    j++;
            //}
            //console.log('последняя машина из хранилища', $scope.CarsLoadings.slice(-1));
            //---------------------------------------------------------------------------------
        }
        else
        {
            errorMessages('Введите номер машины')
        }
    };//addNewCar

//**************************************************************************************************************
    // ДОБАВЛЕНИЕ КОЛ-ВА БРЕВЕН В ТЕКУЩУЮ МАШИНУ
//**************************************************************************************************************
    // получение массива машин из локального хранилища
    function getCarsFromLocaleStorage()
    {
        var temp = JSON.parse(localStorage.getItem('CarsLoadings'));
        //заполняем массив объектом с объектами из хранилища
        console.log('заполняем массив машин');
        var j = 0;
        for(var i in temp)
        {
            $scope.CarsLoadings[j] = temp[i];
            console.log('машина '+(j+1)+' - ',$scope.CarsLoadings[j]);
            // удаляем $$hashKey
            $scope.CarsLoadings[j].$$hashKey = j;
            //console.log($scope.CarsLoadings[j].$$hashKey);
            j++;
        }
        //console.log('новый $scope.CarsLoadings из хранилища', $scope.CarsLoadings);
    }

    // редактирование последней машины
    function editLastCarInArr()
    {
        // удаляем последний элемент и вставляем текущее значение последней машины
        $scope.CarsLoadings.pop();
        $scope.CarsLoadings.push($scope.current_car);
        console.log('массив с измененной последней машиной', $scope.CarsLoadings);
    }

    // сохранение измененного массива загрузок машин
    function saveAllCarsToLocaleStorage()
    {
        localStorage.setItem('CarsLoadings', JSON.stringify($scope.CarsLoadings));
        console.log('запись в хранилище после перезаписи',localStorage.getItem('CarsLoadings'));
    }

    $scope.saveDataInAllLoading = function (){
        // только если есть данные введена машина
        var qtyTotal = $('#diam_total').val();
        if(qtyTotal > 0 && $scope.current_car != undefined) {
            console.log('***************************************************************************');
            console.log('добавление данных в текущую машину', $scope.current_car);
            var isset_qty = 0;
            var new_qty = 0;
            for (var i = 6; i < 39; i++) {
                if (i < 14) {
                    //старое кол-во бревен данного диаметра
                    isset_qty = $scope.current_car[i];
                    //console.log('$scope.current_car[i]' + $scope.current_car[i]);
                    //новое кол-во бревен данного диаметра
                    new_qty = parseInt($('#diam' + i).val()) + isset_qty;
                    $scope.current_car[i] = new_qty;
                }
                else {
                    if (i % 2 == 0) {
                        //старое кол-во бревен данного диаметра
                        isset_qty = $scope.current_car[i];
                        //console.log('$scope.current_car[i]' + $scope.current_car[i]);
                        //новое кол-во бревен данного диаметра
                        new_qty = parseInt($('#diam' + i).val()) + isset_qty;
                        $scope.current_car[i] = new_qty;
                    }
                }

            }
            //console.log('текущая машина после изменения',$scope.current_car);
            // ПОЛУЧАЕМ МАССИВ МАШИН ИЗ ХРАНИЛИЩА И ПЕРЕЗАПИСЫВАЕМ $scope.CarsLoadings
            getCarsFromLocaleStorage();

            // ПЕРЕЗАПИСЫВАЕМ ИЗМЕНЕННУЮ МАШИНУ В МАССИВ
            editLastCarInArr();

            //ПОМЕЩАЕМ ИЗМЕНЕННЫЙ МАССИВ В ЛОКАЛЬНОЕ ХРАНИЛИЩЕ
            saveAllCarsToLocaleStorage();

            console.log('новые данные добавлены и исправлено локальное хранилище');
        }
    };//saveDataInAllLoading

//**************************************************************************************************************
    // ПОКАЗ ВСЕХ ЗАГРУЗОК ПО МАШИНАМ(вначале невидимо)
//**************************************************************************************************************

    $scope.show_cars = false;
    $scope.showCarsLoadings = function (){
        if($scope.show_cars)
        {
            $scope.show_cars = false;
            $('#all_cars').text('Показать загрузку по машинам');
        }
        else
        {
            $scope.show_cars = true;
            $('#all_cars').text('Скрыть загрузку по машинам');
        }
    };//showCarsLoadings
//-------------------------------------------------------

//**************************************************************************************************************
    // ОЧИСТКА ЛОКАЛЬНОГО ХРАНИЛИЩА
//**************************************************************************************************************
$scope.deleteStore = function (){
    localStorage.removeItem('CarsLoadings');
    $scope.new_car_num = '';
    $scope.new_car_date = '';
    $scope.CarsLoadings.length = 0;
    $scope.current_car = null;
    console.log('current_car = ',$scope.current_car);
    console.log('CarsLoadings = ',$scope.CarsLoadings);
};
});//LesCtrl