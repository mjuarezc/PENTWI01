$(document).ready(function () {
    var apiURL = 'https://api.fixer.io/';
    var date = '2017-12-29';
    var base = 'USD';
    $( "#datepicker" ).datepicker({ dateFormat: 'yy-mm-dd' }).val(date);

    $( "#dialog" ).dialog({
        autoOpen: false,
        height: 280,
        width: 390,
        modal: true
    });

    createTable(apiURL, date, base);
    $('#currency-base, #datepicker').change(function (event) {
        console.log(event);
        var base = $('#currency-base').val();
        var date = $('#datepicker').val();
        if(base && date) {
            createTable(apiURL,date,base)
        } else {
            alert('Verify input data');
        }
    });

    $( "#form" ).on( "submit", function( event ) {
        event.preventDefault();
        var rowId = $('#id-currency').val();
        var row = $('#'+rowId);
        var tds = row.find("td");
        $(tds[3]).text($('#value-form').val());
        $( "#dialog" ).dialog( "close" );
    });
});

function createTable(url, date, base) {
    $('#currency-div').empty();
    $.get(url + date,{base : base })
        .done(function (data) {
            $('#currency-div').append(
                '<table id="currency-table">' +
                '<thead><tr><th>Date</th><th>Base</th><th>Currency</th><th>Value</th><th>Actions</th></tr></thead>' +
                '<tbody>' +
                '</tbody>' +
                '</table>'
            );
            for(var rate in data.rates) {
                $( "#currency-table > tbody" ).append(
                    '<tr id="CR-'+rate+'" >' +
                    '<td>'+data.date+'</td><td>'+data.base+'</td><td>'+rate+'</td><td>'+data.rates[rate]+'</td>' +
                    '<td>' +
                    '<button name="delete">Delete</button>'+
                    '<button name="copy"  >Copy</button>'+
                    '<button name="show"  >Show</button>'+
                    '<button name="hide"  >Hide</button>'+
                    '</td>'+
                    '</tr>'
                );
            }
            $(':button[name="delete"]').click(function() {
                $( this ).parent().parent().remove();
            });
            $(':button[name="copy"]').click(function() {
                $( this ).parent().parent().after($( this ).parent().parent().clone(true));
            });
            $(':button[name="hide"]').click(function() {
                $( this ).parent().parent().hide();
            });
            $(':button[name="show"]').on( "click", function() {
                $( "#dialog" ).dialog( "open" );

                var row = $(this).parent().parent();
                var tds = row.find("td");
                console.log(row.attr('id'));
                $('#id-currency').val(row.attr('id'));
                $('#date-form').val($(tds[0]).text());
                $('#base-form').val($(tds[1]).text());
                $('#currency-form').val($(tds[2]).text());
                $('#value-form').val($(tds[3]).text());
            });
        }).fail(function (err) {
        $('#currency-div').append('Error on ajax call');
    });
}