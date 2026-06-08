var danhSachHocSinh = [];
var danhSachTaiKhoan = [];

function luuHocSinhVaoMay() { localStorage.setItem("KHO_HOC_SINH", JSON.stringify(danhSachHocSinh)); }
function layHocSinhTuMay() {
    var data = localStorage.getItem("KHO_HOC_SINH");
    if (data !== null) danhSachHocSinh = JSON.parse(data);
}

function luuTaiKhoanVaoMay() { localStorage.setItem("KHO_TAI_KHOAN", JSON.stringify(danhSachTaiKhoan)); }
function layTaiKhoanTuMay() {
    var data = localStorage.getItem("KHO_TAI_KHOAN");
    if (data !== null) danhSachTaiKhoan = JSON.parse(data);
    else danhSachTaiKhoan = [{ tenDangNhap: "admin", matKhau: "123", vaiTro: "giaovien" }];
}

function tinhDiemTB(toan, van, anh) { return ((toan + van + anh) / 3).toFixed(1); }
function xepLoaiHS(diemTB) {
    if (diemTB >= 8.0) return "Giỏi";
    if (diemTB >= 6.5) return "Khá";
    if (diemTB >= 5.0) return "TrungBình";
    return "Yếu";
}

function xoaHocSinh(id) {
    if (confirm("Xóa học sinh này?")) {
        danhSachHocSinh = danhSachHocSinh.filter(hs => hs.id !== id);
        luuHocSinhVaoMay(); 
        veLaiBang();
    }
}

function suaHocSinh(id) {
    var hs = danhSachHocSinh.find(h => h.id === id);
    if (hs) {
        document.getElementById("edit-id").value = hs.id;
        document.getElementById("student-name").value = hs.hoTen;
        document.getElementById("student-sbd").value = hs.sbd || "";
        document.getElementById("student-dob").value = hs.ngaySinh;
        document.getElementById("student-gender").value = hs.gioiTinh;
        document.getElementById("math-score").value = hs.toan;
        document.getElementById("lit-score").value = hs.van;
        document.getElementById("eng-score").value = hs.anh;
        
        // Điền thêm thông tin liên lạc bổ sung
        document.getElementById("student-email").value = hs.email || "";
        document.getElementById("student-phone").value = hs.sodt || "";
        document.getElementById("student-address").value = hs.diaChi || "";
        
        document.getElementById("form-title").innerText = "Sửa Thông Tin";
    }
}

document.getElementById("student-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var idSua = document.getElementById("edit-id").value;
    
    // Lấy dữ liệu từ giao diện
    var ten = document.getElementById("student-name").value;
    var sbd = document.getElementById("student-sbd").value;
    var dob = document.getElementById("student-dob").value;
    var gender = document.getElementById("student-gender").value;
    var toan = parseFloat(document.getElementById("math-score").value);
    var van = parseFloat(document.getElementById("lit-score").value);
    var anh = parseFloat(document.getElementById("eng-score").value);
    var email = document.getElementById("student-email").value;
    var sodt = document.getElementById("student-phone").value;
    var diaChi = document.getElementById("student-address").value;

    if (toan > 10 || toan < 0 || van > 10 || van < 0 || anh > 10 || anh < 0) {
        alert("❌ Lỗi: Điểm số chỉ được phép nhập từ 0 đến 10!");
        return; 
    }

    if (idSua !== "") {
        var hs = danhSachHocSinh.find(h => h.id === parseInt(idSua));
        if (hs) {
            hs.hoTen = ten; hs.sbd = sbd; 
            hs.ngaySinh = dob; hs.gioiTinh = gender;
            hs.toan = toan; hs.van = van; hs.anh = anh;
            hs.email = email; hs.sodt = sodt; hs.diaChi = diaChi;
        }
    } else {
        var idMoi = danhSachHocSinh.length > 0 ? danhSachHocSinh[danhSachHocSinh.length - 1].id + 1 : 1;
        danhSachHocSinh.push({ 
            id: idMoi, hoTen: ten, sbd: sbd, ngaySinh: dob, gioiTinh: gender, 
            toan: toan, van: van, anh: anh, email: email, sodt: sodt, diaChi: diaChi 
        });
    }
    
    luuHocSinhVaoMay(); 
    donDepForm(); 
    veLaiBang();
});

function donDepForm() {
    document.getElementById("student-form").reset();
    document.getElementById("edit-id").value = "";
    document.getElementById("form-title").innerText = "Thêm Học Sinh Mới";
}

function veLaiBang() {
    var theBang = document.getElementById("student-tbody");
    theBang.innerHTML = ""; 
    
    // Nếu là Học Sinh, cập nhật Card thông tin hồ sơ của học sinh hiện tại
    if (vaiTroHienTai === "hocsinh") {
        var hsHienTai = danhSachHocSinh.find(h => h.sbd && h.sbd.trim().toLowerCase() === taiKhoanHienTai.trim().toLowerCase());
        if (hsHienTai) {
            document.getElementById("info-name").innerText = hsHienTai.hoTen;
            document.getElementById("info-sbd").innerText = hsHienTai.sbd || "";
            document.getElementById("info-dob").innerText = hsHienTai.ngaySinh;
            document.getElementById("info-gender").innerText = hsHienTai.gioiTinh;
            document.getElementById("info-email").innerText = hsHienTai.email || "Chưa cập nhật";
            document.getElementById("info-phone").innerText = hsHienTai.sodt || "Chưa cập nhật";
            document.getElementById("info-address").innerText = hsHienTai.diaChi || "Chưa cập nhật";

            // Điền sẵn thông tin liên hệ hiện tại vào form tự cập nhật
            document.getElementById("self-email").value = hsHienTai.email || "";
            document.getElementById("self-phone").value = hsHienTai.sodt || "";
            document.getElementById("self-address").value = hsHienTai.diaChi || "";
        } else {
            document.getElementById("info-name").innerText = "Chưa có dữ liệu từ Giáo Viên";
            document.getElementById("info-sbd").innerText = taiKhoanHienTai;
            document.getElementById("info-dob").innerText = "-";
            document.getElementById("info-gender").innerText = "-";
            document.getElementById("info-email").innerText = "-";
            document.getElementById("info-phone").innerText = "-";
            document.getElementById("info-address").innerText = "-";
        }
    }

    for (var i = 0; i < danhSachHocSinh.length; i++) {
        var hs = danhSachHocSinh[i];
        var laHocSinhHienTai = hs.sbd && hs.sbd.trim().toLowerCase() === taiKhoanHienTai.trim().toLowerCase();
        
        if (vaiTroHienTai === "hocsinh") {
            // Học sinh chỉ thấy duy nhất dòng điểm của chính mình
            if (!laHocSinhHienTai) continue; 
        }

        var dtb = tinhDiemTB(hs.toan, hs.van, hs.anh);
        var loai = xepLoaiHS(dtb);

        // Hiển thị email và SĐT nhỏ ngay dưới tên để tiết kiệm diện tích bảng
        var thongTinLienHe = "";
        if (hs.email || hs.sodt) {
            var emailStr = hs.email ? `📧 ${hs.email}` : "";
            var sodtStr = hs.sodt ? `📞 ${hs.sodt}` : "";
            var separator = (hs.email && hs.sodt) ? " | " : "";
            thongTinLienHe = `<br><small style="color: #0ea5e9; font-weight: 500;">${emailStr}${separator}${sodtStr}</small>`;
        }

        var btnStr = vaiTroHienTai === "giaovien" ? `<button onclick="suaHocSinh(${hs.id})" class="btn-edit" style="width:auto; padding:5px 10px">Sửa</button> <button onclick="xoaHocSinh(${hs.id})" class="btn-danger" style="width:auto; padding:5px 10px">Xóa</button>` : "";

        var dongHtml = `<tr>
            <td><strong>${hs.hoTen}</strong><br><small style="color:#64748b">SBD: ${hs.sbd || ""}</small>${thongTinLienHe}</td>
            <td>${hs.toan}</td>
            <td>${hs.van}</td>
            <td>${hs.anh || 0}</td>
            <td><strong>${dtb}</strong></td>
            <td><span class="badge ${loai}">${loai}</span></td>`;
        
        // Chỉ vẽ cột Thao Tác nếu là giáo viên đăng nhập
        if (vaiTroHienTai === "giaovien") {
            dongHtml += `<td>${btnStr}</td>`;
        }

        dongHtml += `</tr>`;
        theBang.innerHTML += dongHtml;
    }
}

var vaiTroHienTai = ""; var taiKhoanHienTai = ""; 

function chuyenCheDo(laDangKy) {
    document.getElementById("login-form").style.display = laDangKy ? "none" : "block";
    document.getElementById("register-form").style.display = laDangKy ? "block" : "none";
    document.getElementById("auth-title").innerText = laDangKy ? "Đăng Ký Tài Khoản" : "Đăng Nhập";
}

function xuLyDangKy() {
    var roleDangKy = document.getElementById("reg-role").value;
    var tk = document.getElementById("reg-username").value;
    var mk = document.getElementById("reg-password").value;
    
    if (mk.length < 6) { alert("Mật khẩu quá ngắn! Phải có ít nhất 6 ký tự."); return; }
    if (danhSachTaiKhoan.find(user => user.tenDangNhap.trim().toLowerCase() === tk.trim().toLowerCase())) { 
        alert("Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác."); 
        return; 
    }
    
    danhSachTaiKhoan.push({ tenDangNhap: tk, matKhau: mk, vaiTro: roleDangKy });
    luuTaiKhoanVaoMay(); 
    alert("Đăng ký thành công! Mời bạn đăng nhập."); 
    chuyenCheDo(false);
}

function xuLyDangNhap() {
    var roleChon = document.getElementById("login-role").value;
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    
    // Tìm tài khoản không phân biệt hoa thường tên đăng nhập
    var found = danhSachTaiKhoan.find(u => u.tenDangNhap.trim().toLowerCase() === user.trim().toLowerCase() && u.matKhau === pass && u.vaiTro === roleChon);

    if (found) {
        vaiTroHienTai = found.vaiTro; 
        taiKhoanHienTai = found.tenDangNhap; 
        document.getElementById("login-overlay").style.display = "none"; 

        if (vaiTroHienTai === "hocsinh") {
            document.getElementById("form-section").style.display = "block";
            document.getElementById("teacher-form-container").style.display = "none";
            document.getElementById("student-form-container").style.display = "block";
            
            document.getElementById("cot-hanh-dong").style.display = "none";
            document.getElementById("student-info-card").style.display = "block";
        } else {
            document.getElementById("form-section").style.display = "block"; 
            document.getElementById("teacher-form-container").style.display = "block";
            document.getElementById("student-form-container").style.display = "none";
            
            document.getElementById("cot-hanh-dong").style.display = "table-cell";
            document.getElementById("student-info-card").style.display = "none";
        }
        veLaiBang();
    } else {
        alert("Đăng nhập thất bại! Kiểm tra lại tài khoản, mật khẩu hoặc CHỨC VỤ.");
    }
}

function xuLyCapNhatHocSinh() {
    var emailVal = document.getElementById("self-email").value.trim();
    var phoneVal = document.getElementById("self-phone").value.trim();
    var addressVal = document.getElementById("self-address").value.trim();

    var hs = danhSachHocSinh.find(h => h.sbd && h.sbd.trim().toLowerCase() === taiKhoanHienTai.trim().toLowerCase());

    if (hs) {
        hs.email = emailVal;
        hs.sodt = phoneVal;
        hs.diaChi = addressVal;
        
        luuHocSinhVaoMay();
        veLaiBang();
        alert("🎉 Cập nhật thông tin cá nhân thành công!");
    } else {
        alert("❌ Lỗi: Không tìm thấy hồ sơ học sinh khớp với Số báo danh của tài khoản này. Vui lòng liên hệ giáo viên nhập điểm.");
    }
}

function dangXuat() {
    vaiTroHienTai = ""; taiKhoanHienTai = "";
    document.getElementById("login-overlay").style.display = "flex"; 
    document.getElementById("login-form").reset();
    document.getElementById("student-self-form").reset();
    donDepForm();
}

window.onload = function() { layHocSinhTuMay(); layTaiKhoanTuMay(); };