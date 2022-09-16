$(document).ready(function () {
    Filter();
    getPositionName();
    getDepartmentName();
    eventInits();
});
var EmployeeId; // Id nhân viên cần sửa

var Mode; // Xác định xem sửa hay thêm mới dữ liệu

var employee= {}; // Gồm thông tin nhân viên muốn thêm mới hoặc sửa

// Thực hiện đẩy thông tin lên API để thêm mới, sửa, nhân bản
function saveData() {
// Điền các thông tin từ input vào object employee
  let inputs= $('.popup-add input,select');
  for (const input of inputs) {
    var value=$(input).attr('prop');
// Format lại giá trị các ô input 
    switch (value) {
        case "Gender": employee[value]=toIntGender($(input).val());
            break;
        case "WorkStatus": employee[value]=toIntWorkStatus($(input).val());
            break;
        case "PositionName": employee["PositionId"]=PositionId[$(input).val()];
            break;
        case "DepartmentName": employee["DepartmentId"]=DepartmentId[$(input).val()];
            break;
        case "Salary" : employee[value]=toNumberSalary($(input).val());
            break;
        default:employee[value]=$(input).val() || null;
            break;
    }
  }
  if (Mode=="edit") {  // Sửa thông tin nhân viên
    $.ajax({
        type: "PUT",
        url: "http://localhost:20012/api/v1/Employees/"+EmployeeId,
        data: JSON.stringify(employee), 
        dataType: "json",
        contentType: "application/json",
        error : function(res) {
// Thành công nhưng vẫn là Error với status 200 🙄  
            if (res.status==200) {
                $(".t-edit").fadeIn();   // Hiện thông báo sửa thành công ở góc màn hình, load lại dữ liệu, đóng form
                setTimeout(function() {
                    $(".t-edit").fadeOut();
                },4000);
                Filter();
                closePopupform();
            }
            else checkDuplicate(res); // Hiển thị cảnh báo trùng mã 
        }
    }); 
  } else // Thêm mới nhân viên
        $.ajax({
            type: "POST",
            url: "http://localhost:20012/api/v1/Employees",
            data: JSON.stringify(employee), 
            dataType: "json",
            contentType: "application/json",
            success: function (res) { // Hiện thông báo thêm thành công, đóng form, load dữ liệu
                $(".t-new").fadeIn();
                setTimeout(function() {
                    $(".t-new").fadeOut();
                },4000);
                closePopupform();
                Filter();
            },
            error : function(res) {
                checkDuplicate(res); // Hiển thị cảnh báo trùng mã
            }
        })
}
// Thực hiện lọc danh sách nhân viên, hiển thị lên UI
var totalPage=0, rowHeight=0, tableWidth=0;
function Filter() {
    $.ajax({
        type: "GET",
        url: `http://localhost:20012/api/v1/Employees/Filter?keyword=${encodeURIComponent($("#inp-field").val())}&pageSize=
        ${$(".page-size").val().slice(0,2)}&pageNumber=${$(".bot-nav-num").filter(".bgc-green").text()}
        &DepartmentId=${DepartmentId[$("#DepartmentName").val()] || ''}
        &PositionId=${PositionId[$("#PositionName").val()] || ''}`,
        success: function (res) {
        // Hiển thị số nhân viên / số trang thỏa mãn điều kiện lọc
            totalPage=Math.floor(res.totalCount/ parseInt($(".page-size").val().slice(0,2)));
            if (res.totalCount % parseInt($(".page-size").val().slice(0,2)) !=0) totalPage++;
            $(".total-count").text(res.totalCount + " nhân viên/ " + totalPage + " trang");
        // Hiển thị danh sách nhân viên
            $("#employeeTable tbody").empty();
            var ths= $("#employeeTable thead tr th"); // Lấy ra tất cả các thead
        for (const emp of res.data) {       // Duyệt mỗi khách hàng trong file dữ liệu
            var row=$('<tr></tr>');     // Mỗi khách ứng với 1 hàng trong bảng 
            for (const th of ths) {     // Duyệt mỗi theader thêm 1 tData
                let Code=$(th).attr("code");
                let value=emp[Code];
                switch (Code) {
                    case "order": value=order;
                        break;
                    case "DateOfBirth" : value=formatDate(value);
                        break;
                    case "Salary":{ 
                        value=formatMoney(value); }
                        break;
                    case "Gender": value=formatGender(value);
                        break;
                    case "WorkStatus": value=formatWorkStatus(value);
                        break;  
                }
                row.append(`<td> ${value|| ""}</td>`);
            }
            $(row).data("object",emp);
            // Set chiều cao cho các dòng
            rowHeight= Math.max(screen.availHeight / 17.3,rowHeight);
            $(row).height(rowHeight);
            $("#employeeTable tbody").append(row);
        }
        tableWidth = Math.max(screen.availWidth * 0.94,tableWidth);
        $("#employeeTable").width(tableWidth);  // Set chiều rộng cho table
        }
    });
}
// Các sự kiện chung
function eventInits() {
    movePage(); // Chuyển trang bằng các nút
    pageSize(); // Chọn số nhân viên/ trang
    Searching(); // Tìm kiếm
    deleteValueInput();  // Xóa giá trị ô tìm kiếm bằng cách nhấn nút x bên trong
// Lọc trang bằng Combobox 
    $(document).on("click",".cbb-select",function() {     // Nhấn nút mũi tên để hiển thị các lựa chọn
        if ($(this).children().hasClass("tg-sel")) close_Combobox(this);
        else {open_Combobox(this);}
    });
    var iconn='<i class="fa-solid fa-check" style="color:#e5e5e5; margin:0px 10px 0px -22px;"></i>';
    // Chọn Vị trí, Phòng ban từ Combobox
    $(document).on("click",".cbb-item",function() {
         var unmarker=$(this).siblings(".bgc-selected"); // tìmtrong 1 hộp select xem có thành phần nền xanh không?
         if (unmarker.html()) {                        // nếu có thì bỏ các thuộc tính 
         unmarker.children().remove();
         unmarker.removeClass("bgc-selected");
         }
         if (!$(this).hasClass("bgc-selected")) {
            $(this).addClass("bgc-selected");  // đổi màu nền item được chọn thành xanh.
            $(this).parent().prev().children().val($(this).text()); // gán giá trị của item cho input
            $(this).html(iconn+$(this).html()); // thêm dấu tích vào bên trái chữ :3
         }
         close_Combobox($(this).parent().prev().find("button"));
         resetPageNumber();
         Filter();
    });

// Hover lên hàng, hiện thông báo chỉnh sửa
    $(document).on("mouseover","table tbody tr",function() {
        $(this).attr("title","Nhấn đúp chuột để chỉnh sửa thông tin");
    });

// Doubleclick vào hàng, mở form
    $(document).on("dblclick","table tbody tr",function() {
        const row=$(this);
        row.removeClass("click-row");
        Mode="edit";
        OpenForm(row);
    });

// Click chọn hàng
$(document).on("click","table tbody tr",function() {
    const row=$(this);
    row.siblings().removeClass("click-row");
    row.addClass("click-row");
});

// Xóa nhân viên
$(".button-delete").click(function() {
    var row=$("table tbody tr").filter(".click-row");
    if (row.html()) {
        var Id=row.data('object').EmployeeId;  // Lấy Id để xóa nhân viên
        // console.log(Id);
        let Code=row.data('object').EmployeeCode; // Lấy mã nhân viên để thêm vào popup cảnh báo xóa nhân viên
        $(".pop-close").show();
        $(".content ,.top-nav").addClass("dark-class").find("button").prop("disabled",true);
        $(".pop-close strong").text(Code);
// Nhấn nút x hoặc Không, đóng form, bỏ chọn hàng
        $(".pop-close .close-icon,.pop-close .nav-continue").click(function(){
        closeDeletePopup(row);
        Id='';
        });
// Nhấn nút Có, thực hiện xóa nhân viên
        $(".pop-close .nav-close").click(function(){
            $.ajax({
                type: "DELETE",
                url: "http://localhost:20012/api/v1/Employees/"+Id,
                success: function () {
// Hiện thông báo xóa thành công, tự ẩn sau 4s, hoặc sau khi nhấn x ; Load lại thông tin
                        $(".t-delete").fadeIn();
                        setTimeout(function() {
                            $(".t-delete").fadeOut();
                        },4000);
                        Filter();
                }
            });
            closeDeletePopup(row);
        }) 
    }
})

// Nhân bản nhân viên
$(document).on("click",".button-duplicate", function() {
    var row=$("table tbody tr").filter(".click-row");
    if (row.html()) {
        Mode="add";
        OpenForm(row);
        row.removeClass("click-row"); 
    }
})

// Nút refresh load lại dữ liệu, set lại giá trị phòng ban, vị trí, số trang, ô tìm kiếm
$(".button-refresh").click(function() {
    $("#DepartmentName").val("Tất cả phòng ban");
    getDepartmentName();
    $("#PositionName").val("Tất cả vị trí");
    getPositionName();
    resetPageNumber();
    $("#inp-field").val("");
    Filter();
});

// Đóng toast mess trước khi nó tự biến mất
$(".toast-close").click(function() {
    $(this).parent().parent().fadeOut();
})

// Định dạng tiền khi thêm mới, sửa nhân viên
$(".popup-add input[prop=Salary]").blur(function(){ // Nhấn ra ngoài ô input, định dạng thành VNĐ
    $(this).val(formatMoney($(this).val()));
});
$(".popup-add input[prop=Salary]").focus(function(){ // Nhấn vào để nhập, hiện số
    if  ($(this).val()) $(this).val(toNumberSalary($(this).val()));
});

// Khi nhấn nút lưu, validate các dữ liệu
$(".submit").click(function(){
    let checkData=true; // Kiểm tra xem toàn bộ dữ liệu đã được nhập đúng hay chưa

// Validate mã nhân viên, 2 trường hợp : Nhập sai, hoặc chưa nhập
    if (!isCode($("input[prop=EmployeeCode]").val())) {
        checkData=false;
        $("input[prop=EmployeeCode]").addClass("wrong-input");
        if ($("input[prop=EmployeeCode]").val())
            $("input[prop=EmployeeCode]").next().text("Mã không đúng định dạng. VD: NVx, x là các chữ số");
        else $("input[prop=EmployeeCode]").next().text("Vui lòng nhập mã nhân viên ");
    }
// Validate số CMND/CCCD
    if (!$("input[prop=IdentityID]").val()) {
        checkData=false;
        $("input[prop=IdentityID]").addClass("wrong-input").next().text("Vui lòng nhập số CMND/CCCD");
    }
//Validate tên nhân viên
    if (!$("input[prop=EmployeeName]").val()) {
        checkData=false;
        $("input[prop=EmployeeName]").addClass("wrong-input").next().text("Vui lòng nhập tên nhân viên");  
    }
// Validate số điện thoại VN
    if (!isVietnamesePhoneNumber($("input[prop=PhoneNumber]").val())) {
        checkData=false;
        $("input[prop=PhoneNumber]").addClass("wrong-input");
        if ($("input[prop=PhoneNumber]").val())
        $("input[prop=PhoneNumber]").next().text("Số điện thoại không đúng định dạng");
        else $("input[prop=PhoneNumber]").next().text("Vui lòng nhập số điện thoại");
    }
// Validate Email
    if (!isEmail($("input[prop=Email]").val())) {
        checkData=false;
        $("input[prop=Email]").addClass("wrong-input");
        if ($("input[prop=Email]").val())
        $("input[prop=Email]").next().text("Email không đúng định dạng");
        else $("input[prop=Email]").next().text("Vui lòng nhập email");
    }
// Validate ngày
    for (const date of $("input[type=date]")) {
       if ($(date).val()>formatDatePopup(new Date())) 
       {
        checkData=false;
        $(date).addClass("wrong-input").next().text("Không được lớn hơn ngày hiện tại");
       }
    }
// Khi nhấn vào ô input để sửa, bỏ các thuộc tính viền đỏ, chữ đỏ cảnh báo
    $(".popup-add input").focus(function() {
        $(this).removeClass("wrong-input");
        $(this).next(".wrong-input-text").text("");
    });
// Nếu dữ liệu đúng thì gọi API sửa hoặc thêm mới
if (checkData == true) saveData();
});

// Thêm nhân viên, hiện popupform + mã nhân viên tự động tăng
    $(".bt-add-employee").click(function() {
        Mode="add";
        openPopupForm();
        $.ajax({
            type: "GET",
            url: "http://localhost:20012/api/v1/Employees/NewCode",
            success: function (Code) {
                $(".employeeId").val(Code);
            }
        });
    });
// Khi đóng form mà dữ liệu còn bị sai, thì reset
    $(".close-icon,.cancel").click(function(){
        $(".popup-add input").removeClass("wrong-input").next(".wrong-input-text").text("");
        closePopupform(); 
    });

// Chọn 1 trong các thành phần trong side bar, đổi màu :
{
    $(".sb-item").eq(3).addClass("click-item");
    $(".sb-item").click(function () {
        $(this).siblings().removeClass("click-item");
        $(this).addClass("click-item");
        if (k%2==0) {
            closeSidebar();
            ++k;
        }
    });
}

// Bấm vào icon hình Menu góc trái trên cùng để thu gọn hoặc mở rộng sidebar
{    
    var k = 0; // k biểu thị trạng thái đang đóng hoặc mở của thanh bên
    $(".nav-logo-icon").click(function () {
        ++k;
        if (k%2==1) closeSidebar();
        else openSidebar();
    }) 
}

// Mặc định ẩn sidebar, nếu màn hình nhỏ thì không cho mở rộng sidebar
{
    if ($(window).width()<=5000 && k%2==0) {closeSidebar();++k;} 
    if ($(window).width()<=1211) $(".nav-logo-icon").prop('disabled', true);
    else $(".nav-logo-icon").prop('disabled', false);
    $(window).resize(function() {
        if ($(window).width()<=1211 && k%2==0) {closeSidebar();++k;}
        if ($(window).width()<=1211) $(".nav-logo-icon").prop('disabled', true);
    else $(".nav-logo-icon").prop('disabled', false);
    }); 
}
$(".cbb-value").width(235);
}

// Gọi API lấy tên vị trí, điền vào các Combobox
var PositionId = {};
function getPositionName() {
    $.ajax({
        type: "GET",
        url: "http://localhost:20012/api/v1/Positions",
        success: function (res) {
            $("#cbb-option-pos").empty();
            let allPos =`<div class="cbb-item">Tất cả vị trí </div>`;
            $("#cbb-option-pos").append(allPos); 
            for (const pos of res) {
                let option= `<option> ${pos["positionName"]}</option>`;
                PositionId[pos["positionName"]]=pos["positionId"];
                $("select[prop=PositionName]").append(option);
                let option_filter = `<div class="cbb-item">${pos["positionName"]}</div>`;
                $("#cbb-option-pos").append(option_filter);
            }
        }
    });
    // console.log(PositionId);
}

// Gọi API lấy tên phòng ban, điền vào các Combobox
var DepartmentId = {};
function getDepartmentName() { 
    $.ajax({
        type: "GET",
        url: "http://localhost:20012/api/v1/Departments",
        success: function (res) {
            $("#cbb-option-dep").empty();
            let allDep =`<div class="cbb-item">Tất cả phòng ban </div>`;
            $("#cbb-option-dep").append(allDep);
            for (const dep of res) {
                let option= `<option> ${dep["departmentName"]}</option>`;
                DepartmentId[dep["departmentName"]]=dep["departmentId"];
                $("select[prop=DepartmentName]").append(option);
                let option_filter = `<div class="cbb-item">${dep["departmentName"]}</div>`;
                $("#cbb-option-dep").append(option_filter);
            }
        }
    });
}

// Mở hộp lựa chọn Vị trí hoặc Phòng ban , tham số a là chỉ nút mũi tên
function open_Combobox(a) {
    $(a).children().addClass("tg-sel");
    $(a).prev().addClass("border-1");
    $(a).addClass("border-2"); 
    $(a).parent().next().slideDown(500);
}

// Đóng hộp lựa chọn Vị trí hoặc Phòng ban, tham số a là chỉ nút mũi tên
function close_Combobox(a) {
    $(a).parent().next().slideUp(500,function() {
        $(a).prev().removeClass("border-1");
        $(a).removeClass("border-2");
        $(a).children().removeClass("tg-sel");
    })
} 

// Mở popupform 
function openPopupForm() {
    $(".popup-add").show();
    $(".content ,.top-nav").addClass("dark-class").find("button").prop("disabled",true);
    $("#inp-field").prop("disabled",true);
    $(".employeeId").focus();
    $('.popup-add input').val(null);
}

// Đóng popupform 
function closePopupform() {
    $(".popup-add").hide();
    $(".content, .top-nav").removeClass("dark-class").find("button").prop("disabled",false);
    $("#inp-field").prop("disabled",false);
}
// Đóng thanh bên
function closeSidebar() { 
    $(".sidebar").width(45);
    $(".main").width('calc(100% - 45px)');
    $(".sb-item").children().next().hide();
}

// Mở thanh bên
function openSidebar() {
    $(".sidebar").width(200);
    $(".main").width('calc(100% - 200px)');
    $(".sb-item").children().next().show();
}

// Ngoài việc lỗi do trùng mã nhân viên, dựa vào tình hình thực tế, ta có thể thêm lỗi trùng Email, số CCCD,
// mã số thuế (SĐT chắc là ko cần vì có thể gọi chồng thì vợ nghe máy 😎)
function checkDuplicate(res) {
    if (res.responseText.match("Email")) {
        $("input[prop=Email]").addClass("wrong-input");
        $("input[prop=Email]").next().text("Email đã được sử dụng");
    }
    if (res.responseText.match("Identity")) {
        $("input[prop=IdentityID]").addClass("wrong-input");
        $("input[prop=IdentityID]").next().text("Số CMND/CCCD đã tồn tại")
    }
    if (res.responseText.match("EmployeeCode")) {
        $("input[prop=EmployeeCode]").addClass("wrong-input");
        $("input[prop=EmployeeCode]").next().text("Mã nhân viên đã tồn tại");
    }
    if (res.responseText.match("TaxCode")) {
        $("input[prop=TaxCode]").addClass("wrong-input");
        $("input[prop=TaxCode]").next().text("Mã số thuế đã tồn tại");
    }
}
// Định dạng ngày từ DB hiển thị lên UI
function formatDate(date) {
        if (date) {
            date= new Date(date);
        let   dateValue = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        return `${dateValue<10?'0'+dateValue : dateValue}/${month<10?'0'+month : month}/${year}`;
        } else return "";
}

// Chuyển định dạng ngày điền vào input trong form 
function formatDatePopup(date) {
        if (date) {
            date= new Date(date);
        let   dateValue = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        return `${year}-${month<10?'0'+month : month}-${dateValue<10?'0'+dateValue : dateValue}`;
        }
}

// Định dạng tiền từ số về VNĐ
function formatMoney(money) {
if (money)  return Intl.NumberFormat('vi-VN',{style:"currency",currency : "VND"}).format(Math.round(money));
}

// Chuyển giới tính từ số về chữ
function formatGender(gender) {
    switch (gender) {
        case 0: return "Khác";
        case 1: return "Nam";
        case 2: return "Nữ";
    }
}
// Chuyển giới tính về định dạng số
function toIntGender(gender) {
    switch (gender) {
        case "Khác": return 0;
        case "Nam": return 1;
        case "Nữ": return 2;
    }
}

// Chuyển tình trạng công việc từ chữ về số để thêm mới hoặc sửa
function toIntWorkStatus(WorkStatus) {
    switch (WorkStatus) {
        case "Đã nghỉ việc": return 0;
        case "Đang làm việc": return 1;
        case "Đang thử việc" : return 2;
    } 
}
// Chuyển tình trạng công việc từ số về chữ
function formatWorkStatus(WorkStatus) {
    switch (WorkStatus) {
        case 0: return "Đã nghỉ việc";
        case 1: return "Đang làm việc";
        case 2: return "Đang thử việc";
    } 
}

// Chuyển định dạng tiền VNĐ về số
function toNumberSalary(Salary) {
    var x="";
    for(let i=0;i<Salary.length;i++) 
        if (Salary[i]>='0' && Salary[i]<='9')  x = x + Salary[i];
    return parseInt(x);
}

// Kiểm tra số điện thoại
function isVietnamesePhoneNumber(number) {
    return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(number);
}

// Kiểm tra email
function isEmail(Email) {
    return Email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

// Kiểm tra mã nhân viên (NVxxxx)
function isCode(input) {
    let regex = /NV[0-9]+/i;
    for (let i=input.length-1; i>=2 ;i--) 
    if (input[i]<'0' || input[i]>'9') return false;
    return regex.test(input);
}

// Đóng form cảnh báo xóa nhân viên
function closeDeletePopup(row) {
    $(".pop-close").hide();
    $(".content, .top-nav").removeClass("dark-class").find("button").prop("disabled",false);
    $("#inp-field").prop("disabled",false);
    row.removeClass("click-row");
}

// Điền thông tin từ hàng vào form để thực hiện nhân bản hoặc chỉnh sửa
function OpenForm(row) {
    $(".popup-add").show();    // Mở form
    $(".content ,.top-nav").addClass("dark-class").find("button").prop("disabled",true); // Disable các thành phần khác ngoài form
    $("#inp-field").prop("disabled",true);
    $(".employeeId").focus();       // Focus vào ô mã nhân viên
    //  Điền giá trị vào các ô thông tin
    let objEmp=row.data('object');
    EmployeeId = objEmp.EmployeeId;
    let inputs= $('.popup-add input,select');
    for (const input of inputs) {
        if ($(input).attr('prop')) {
            let inp=objEmp[$(input).attr('prop')];
            $(input).val(inp);
            if ($(input).attr('type')=="date") $(input).val(formatDatePopup(inp)); // định dạng ngày điền vào input
            if ($(input).attr('prop')=="Gender") $(input).val(formatGender(inp)); // định dạng giới tính vào input
            if ($(input).attr('prop')=="WorkStatus") $(input).val(formatWorkStatus(inp)); // định dạng tình trạng công việc
            if ($(input).attr('prop')=="Salary") $(input).val(formatMoney(inp));// định dạng lương vào input
        }
    }
} 

// Chọn số nhân viên/ trang
function pageSize() {
 $(".page-size").change(function() {
    resetPageNumber();
    Filter();
 })
}

// Chọn trang hiện tại, có thể chọn bằng cách nhấn vào số trang, hoặc nhấn các nút chuyển trang : đầu tiên, trước, sau, cuối cùng
function movePage() {

// Chọn bằng cách nhấn vào số trang
    $(".bot-nav-num").click(function () {
        if (parseInt($(this).text())<=totalPage) { // Nếu trang định chọn lớn hơn tổng số trang thì không nhấn được
            $(this).siblings().removeClass("bgc-green");
            $(this).addClass("bgc-green");
            Filter();
        }
    });

// Chuyển trang kế tiếp
    $(".bot-nav-next").click(function () {
        let x = $(this).siblings(".bgc-green");
        var i= parseInt(x.text());
        if (i<totalPage) {                 // Nếu trang hiện tại không nhỏ hơn số trang thì không nhấn được chuyển tiếp
            x.removeClass("bgc-green");
            if (i%4) x.next().addClass("bgc-green");
            else {
                for (const num of $(".bot-nav-num"))
                    $(num).text(++i);
                $(".bot-nav-num").eq(0).addClass("bgc-green");
            }  
        }  
        Filter();
    })

// Quay lại trang trước
    $(".bot-nav-prev").click(function () {
        let x = $(this).siblings(".bgc-green");
        var i= parseInt(x.text());
        if (i!=1) {
            x.removeClass("bgc-green");
            if (i%4!=1) x.prev().addClass("bgc-green");
            else {
            for (let j=3;j>=0;--j)
                $(".bot-nav-num").eq(j).text(--i);
            $(".bot-nav-num").eq(3).addClass("bgc-green");
            }
        Filter();
        }
    })

// Quay trở lại trang đầu tiên
    $(".bot-nav-fp").click(function(){
        let x = $(this).siblings(".bgc-green");
        var i= parseInt(x.text());
        if (i>1) {
            x.removeClass("bgc-green");
            for(let j=1;j<=4;++j)
                $(".bot-nav-num").eq(j-1).text(j);
            $(".bot-nav-num").eq(0).addClass("bgc-green");
            Filter();
        }
    })

// Chuyển đến trang cuối cùng 
    $(".bot-nav-lp").click(function(){
        let x = $(this).siblings(".bgc-green");
        var i= parseInt(x.text());
        if (i< totalPage ) {
            x.removeClass("bgc-green");
            let lastPagePos=totalPage %4 ==0 ? 4 : totalPage %4; // Vị trí của trang cuối cùng trong ô hiển thị
            for(let j=0;j<=3;++j)
                $(".bot-nav-num").eq(j).text(totalPage-lastPagePos+1+j);
            $(".bot-nav-num").eq(lastPagePos-1).addClass("bgc-green");
            Filter();
        }
    })
}

// Khi thay đổi các thuộc tính, set trang hiện tại về trang đầu tiên
function resetPageNumber() {
    let i=0;
    $(".bot-nav-num").removeClass("bgc-green");
    for (const num of $(".bot-nav-num"))
        $(num).text(++i);
    $(".bot-nav-num").eq(0).addClass("bgc-green");
}

// Thực hiện tìm kiếm
function Searching() {
    $("#inp-field").keyup(function () { 
        Filter();
        resetPageNumber();
    });
}

// Xóa dữ liệu bằng dấu x trong ô tìm kiếm
function deleteValueInput() {
    function showCloseBt(a) { 
        $(a).show();
        $(a).parent().next().css("margin-left","-30px");
    }
    function hideCloseBt(a) { 
        $(a).hide();
        $(a).parent().next().css("margin-left","0px");
    }
    $(".del-icon").click(function(){
        $(this).prev().val('');
        Filter();
        resetPageNumber();
        hideCloseBt(this);
    })
    // Nhập dữ liệu, nút xóa hiện lên
    $("#inp-field").on({
        keyup : function(){
        if ($(this).val().length>0) showCloseBt($(this).next());
        else hideCloseBt($(this).next());} ,
        click : function() {       // Click vào, nếu có giá trị,nút x hiện
            if ($(this).val().length>0)       
            showCloseBt($(this).next());
        }
    })
     //Click ra ngoài, nút x mất
        {$(window).click(function() {
            hideCloseBt($("#inp1"));
         });
    
         $('#inp-field').click(function(event){
          event.stopPropagation();
          }
          );}
}