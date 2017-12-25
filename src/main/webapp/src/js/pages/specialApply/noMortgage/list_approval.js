/**
 * Created by yangzb01 on 2017-09-06.
 */

var init = {
    list:function(type){
        var pointType = type
        dtTable1 =  $("#approvalTable").DataTable({
            serverSide: true,//服务端分页
            searching: false,//显示默认搜索框
            ordering: false,//开启排序
            autoWidth: true,//自适应宽度
            "ajax":{
                "url":$(document).api.settings.api['noMortgage approval list'],
                "type":'post',
                data:function(d){
                    var data = {};
                    data.applyCode = $('#applyCode').val();
                    data.borrower = $('#borrower').val();
                    data.addressType = $('#addressType').val();
                    data.loanStatus = $('#loanStatus').val();
                    data.type = pointType;
                    var _d = $.extend({},{searchKeys:data},{start:d.start,length:d.length,draw:d.draw});
                    return JSON.stringify(_d);
                }
            },
            columns: [
                {data: 'applyCode'},
                {data: 'addressType'},
                {data: 'businessSource'},
                {data: 'borrower'},
                {data: 'loanStatus'},
                {data: 'approveStatusDesc'},
                {data: null}
            ],
            columnDefs: [{
                targets:[3,5],
                render:function (data){
                    return data ? data:'--';
                }
            },{
                targets: 1,
                render: function (data, type, row, meta) {
                    return enums.addressType[data];
                }
            }, {
                targets: 4,
                className: 'right aligned',
                render: function (data, type, row, meta) {
                    return enums.approvalStatusTypeList[data];
                }
            },{
                //   指定第最后一列
                targets: 6,
                className:"single line",
                render: function (data, type, row, meta) {
                    return  '<a target="_blank" class="ui button mini basic" href="/house_noMortgage_apply/detail?id='+row.loanId + '&applyId='+row.id+'&type=noMortgage&comeFrom=' + window.location.pathname+'"><i class="info circle icon"></i>查看</a>'+
                            '<a target="_blank" class="ui button mini basic" href="/house_noMortgage_apply/approval?id='+row.loanId+'&applyId='+row.id+'&flowConfigureType=DECOMPRESSION&isApproval=true&pointType='+pointType+'&type=noMortgage&comeFrom='+window.location.pathname+'">审批</a>'
                }
            }],
            "iDisplayLength": 20,
            "aLengthMenu": [
                [20],
                [20]
            ]
        });


        dtTable2 = $('#approvedTable').DataTable({
            serverSide: true,//服务端分页
            searching: false,//显示默认搜索框
            ordering: false,//开启排序
            autoWidth: true,//自适应宽度
            "ajax":{
                "url":$(document).api.settings.api['noMortgage approved list'],
                "type":'post',
                data:function(d){
                    var data = {};
                    data.applyCode = $('#applyCode').val();
                    data.borrower = $('#borrower').val();
                    data.addressType = $('#addressType').val();
                    data.loanStatus = $('#loanStatus').val();
                    data.type = type;
                    var _d = $.extend({},{searchKeys:data},{start:d.start,length:d.length,draw:d.draw});
                    return JSON.stringify(_d);
                }
            },
            columns: [
                {data: 'applyCode'},
                {data: 'addressType'},
                {data: 'businessSource'},
                {data: 'borrower'},
                {data: 'loanStatus'},
                {data: 'approveStatusDesc'},
                {data: null}
            ],
            columnDefs: [{
                targets:[3,5],
                render:function (data){
                    return data ? data:'--';
                }
            },{
                targets: 1,
                render: function (data, type, row, meta) {
                    return enums.addressType[data];
                }
            }, {
                targets: 4,
                className: 'right aligned',
                render: function (data, type, row, meta) {
                    return enums.approvalStatusTypeList[data];
                }
            },{
                //   指定第最后一列
                className:"single line",
                targets: 6,
                render: function (data, type, row, meta) {
                    return  '<a target="_blank" class="ui button mini basic" href="/house_noMortgage_apply/detail?id='+row.loanId + '&applyId='+row.id+'&type=noMortgage&comeFrom=' + window.location.pathname+'"><i class="info circle icon"></i>查看</a>'+
                            '<a target="_blank" class="ui button mini basic" href="/flow/to_approval_list?id='+row.id+'&flowConfigureType=DECOMPRESSION&comeFrom='+window.location.pathname+'"><i class="info circle icon"></i>流程查看</a>';
                }
            }],
            "iDisplayLength": 20,
            "aLengthMenu": [
                [20],
                [20]
            ]
        })

    },

    search:function(){
        var status = $('#tab_menu .item.active').attr('data-status');
        if(status == 'approval'){
            dtTable1.ajax.reload();
        }else{
            dtTable2.ajax.reload();
        }
    },

    reset:function(){
        $('#applyCode').val('');
        $('#borrower').val('');
        $('#addressType').val('');
        $('#loanStatus').val('');
    },

}

var path = window.location.pathname;

$('.ui.menu a.item').on('click', function() {
    init.reset();
    $(this).addClass('active').siblings().removeClass('active');
    var status = $(this).attr('data-status');
    if(status == 'approval'){
        $('#part_one').removeClass('ks-hidden');
        $('#part_two').addClass('ks-hidden');
        $("#disableLoanTime").addClass('disabled');
    }else{
        $("#disableLoanTime").removeClass('disabled');
        $('#part_one').addClass('ks-hidden');
        $('#part_two').removeClass('ks-hidden');
    }
});

if(path.indexOf('/house_noMortgage_apply/process_list') > -1){
    init.list('Y')
}else if(path.indexOf('/house_noMortgage_apply/process_risk_list') > -1){
    init.list('F')
}else if(path.indexOf('/house_noMortgage_apply/process_finance_list') > -1){
    init.list('C')
}