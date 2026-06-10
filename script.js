// ==========================================
// 1. CÁC MẢNG LƯU TRỮ DỮ LIỆU (DATABASE ẢO)
// ==========================================
// Mảng này dùng để chứa danh sách tất cả học sinh
var danhSachHocSinh = []; 

// Mảng này dùng để chứa danh sách các tài khoản (giáo viên, học sinh)
var danhSachTaiKhoan = [];

// Biến lưu thông tin người đang đăng nhập
var vaiTroHienTai = ""; 
var taiKhoanHienTai = ""; 

// ==========================================
// 2. CÁC HÀM LƯU VÀ LẤY DỮ LIỆU TỪ TRÌNH DUYỆT (LOCAL STORAGE)
// ==========================================
// Hàm lưu danh sách học sinh vào bộ nhớ máy tính
function luuHocSinhVaoMay() { 
    // Chuyển mảng thành chuỗi chữ để lưu
    var chuoiDuLieu = JSON.stringify(danhSachHocSinh);
    localStorage.setItem("KHO_HOC_SINH", chuoiDuLieu); 
}

// Hàm lấy danh sách học sinh từ bộ nhớ máy tính ra
function layHocSinhTuMay() {
    var duLieu = localStorage.getItem("KHO_HOC_SINH");
    if (duLieu !== null) {
        // Biến chuỗi chữ ngược lại thành mảng
        danhSachHocSinh = JSON.parse(duLieu);
    }
}

// Hàm lưu tài khoản vào máy
function luuTaiKhoanVaoMay() { 
    localStorage.setItem("KHO_TAI_KHOAN", JSON.stringify(danhSachTaiKhoan)); 
}

// Hàm lấy tài khoản từ máy
function layTaiKhoanTuMay() {
    var duLieu = localStorage.getItem("KHO_TAI_KHOAN");
    if (duLieu !== null) {
        danhSachTaiKhoan = JSON.parse(duLieu);
    } else {
        // Nếu chưa có tài khoản nào, tạo sẵn 1 tài khoản giáo viên mặc định (admin)
        var taiKhoanMacDinh = { tenDangNhap: "admin", matKhau: "123", vaiTro: "giaovien" };
        danhSachTaiKhoan.push(taiKhoanMacDinh);
    }
}

// ==========================================
// 3. CÁC HÀM TÍNH TOÁN CƠ BẢN
// ==========================================
// Hàm tính điểm trung bình của 3 môn
function tinhDiemTB(diemToan, diemVan, diemAnh) { 
    var tongDiem = diemToan + diemVan + diemAnh;
    var diemTrungBinh = tongDiem / 3;
    return diemTrungBinh.toFixed(1); // Làm tròn 1 chữ số thập phân
}

// Hàm xếp loại học sinh dựa vào điểm trung bình
function xepLoaiHS(diemTB) {
    if (diemTB >= 8.0) {
        return "Giỏi";
    } else if (diemTB >= 6.5) {
        return "Khá";
    } else if (diemTB >= 5.0) {
        return "TrungBình";
    } else {
        return "Yếu";
    }
}

// ==========================================
// 4. CÁC HÀM QUẢN LÝ HỌC SINH (THÊM, SỬA, XÓA)
// ==========================================

// Hàm xóa học sinh
function xoaHocSinh(idXoa) {
    var xacNhan = confirm("Bạn có chắc chắn muốn xóa học sinh này không?");
    if (xacNhan === true) {
        // Lọc ra các học sinh có id KHÁC với id cần xóa (nghĩa là giữ lại những người kia)
        danhSachHocSinh = danhSachHocSinh.filter(function(hs) {
            return hs.id !== idXoa;
        });
        luuHocSinhVaoMay(); 
        veLaiBang(); // Cập nhật lại giao diện bảng
    }
}

// Hàm lấy thông tin học sinh đưa lên form để sửa
function suaHocSinh(idSua) {
    // Tìm học sinh có id khớp với id cần sửa
    var hsCungId = danhSachHocSinh.find(function(hs) {
        return hs.id === idSua;
    });

    if (hsCungId !== undefined) { // Nếu tìm thấy
        // Đưa thông tin của học sinh đó lên các ô nhập liệu (input)
        document.getElementById("edit-id").value = hsCungId.id;
        document.getElementById("student-name").value = hsCungId.hoTen;
        document.getElementById("student-sbd").value = hsCungId.sbd || "";
        document.getElementById("student-dob").value = hsCungId.ngaySinh;
        document.getElementById("student-gender").value = hsCungId.gioiTinh;
        document.getElementById("math-score").value = hsCungId.toan;
        document.getElementById("lit-score").value = hsCungId.van;
        document.getElementById("eng-score").value = hsCungId.anh;
        
        document.getElementById("form-title").innerText = "Sửa Thông Tin Học Sinh";
    }
}

// Bắt sự kiện khi người dùng bấm nút "Lưu Thông Tin" trên Form
document.getElementById("student-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Ngăn chặn trang web tự tải lại khi gửi form
    
    // Lấy ID sửa (nếu có giá trị thì là đang sửa, nếu rỗng thì là thêm mới)
    var idSua = document.getElementById("edit-id").value;
    
    // Lấy dữ liệu từ các ô nhập liệu
    var ten = document.getElementById("student-name").value;
    var sbd = document.getElementById("student-sbd").value;
    var dob = document.getElementById("student-dob").value;
    var gender = document.getElementById("student-gender").value;
    var toan = parseFloat(document.getElementById("math-score").value); // parseFloat biến chữ thành số thập phân
    var van = parseFloat(document.getElementById("lit-score").value);
    var anh = parseFloat(document.getElementById("eng-score").value);

    // Kiểm tra điểm số có hợp lệ không (từ 0 đến 10)
    if (toan > 10 || toan < 0 || van > 10 || van < 0 || anh > 10 || anh < 0) {
        alert("❌ Lỗi: Điểm số chỉ được phép nhập từ 0 đến 10!");
        return; // Dừng hàm lại, không chạy tiếp
    }

    if (idSua !== "") {
        // ===== TRƯỜNG HỢP: SỬA HỌC SINH ĐÃ CÓ =====
        var idCanSua = parseInt(idSua); // Chuyển chữ thành số nguyên
        // Tìm học sinh trong mảng để cập nhật thông tin
        var hs = danhSachHocSinh.find(function(h) { return h.id === idCanSua; });
        if (hs) {
            hs.hoTen = ten; 
            hs.sbd = sbd; 
            hs.ngaySinh = dob; 
            hs.gioiTinh = gender;
            hs.toan = toan; 
            hs.van = van; 
            hs.anh = anh;
            // Không thay đổi email, sodt, diaChi vì đây là thông tin do học sinh tự cập nhật
        }
    } else {
        // ===== TRƯỜNG HỢP: THÊM HỌC SINH MỚI =====
        // Tạo ID mới cho học sinh (bằng ID của người cuối cùng + 1)
        var idMoi = 1;
        if (danhSachHocSinh.length > 0) {
            var nguoiCuoiCung = danhSachHocSinh[danhSachHocSinh.length - 1];
            idMoi = nguoiCuoiCung.id + 1;
        }
        
        // Tạo một đối tượng (object) học sinh mới
        var hocSinhMoi = { 
            id: idMoi, 
            hoTen: ten, 
            sbd: sbd, 
            ngaySinh: dob, 
            gioiTinh: gender, 
            toan: toan, 
            van: van, 
            anh: anh, 
            email: "", 
            sodt: "", 
            diaChi: "" 
        };
        
        // Thêm học sinh mới vào mảng
        danhSachHocSinh.push(hocSinhMoi);
    }
    
    // Lưu lại vào máy tính và cập nhật giao diện
    luuHocSinhVaoMay(); 
    donDepForm(); 
    veLaiBang();
});

// Hàm làm sạch form sau khi thêm/sửa
function donDepForm() {
    document.getElementById("student-form").reset(); // Xóa sạch các ô nhập
    document.getElementById("edit-id").value = "";
    document.getElementById("form-title").innerText = "Thêm Học Sinh Mới";
}

// ==========================================
// 5. HÀM VẼ BẢNG (HIỂN THỊ DỮ LIỆU RA HTML)
// ==========================================
function veLaiBang() {
    var theBang = document.getElementById("student-tbody");
    theBang.innerHTML = ""; // Xóa nội dung cũ đi để vẽ lại từ đầu
    
    // NẾU người dùng đang đăng nhập là Học Sinh, cập nhật Card thông tin hồ sơ của học sinh hiện tại
    if (vaiTroHienTai === "hocsinh") {
        // Tìm học sinh có Số báo danh (sbd) khớp với tài khoản đăng nhập
        var hsHienTai = danhSachHocSinh.find(function(h) {
            return h.sbd && h.sbd.trim().toLowerCase() === taiKhoanHienTai.trim().toLowerCase();
        });

        if (hsHienTai) { // Nếu tìm thấy
            document.getElementById("info-name").innerText = hsHienTai.hoTen;
            document.getElementById("info-sbd").innerText = hsHienTai.sbd || "";
            document.getElementById("info-dob").innerText = hsHienTai.ngaySinh;
            document.getElementById("info-gender").innerText = hsHienTai.gioiTinh;
            document.getElementById("info-email").innerText = hsHienTai.email || "Chưa cập nhật";
            document.getElementById("info-phone").innerText = hsHienTai.sodt || "Chưa cập nhật";
            document.getElementById("info-address").innerText = hsHienTai.diaChi || "Chưa cập nhật";

            // Điền sẵn thông tin vào form tự cập nhật của học sinh
            document.getElementById("self-email").value = hsHienTai.email || "";
            document.getElementById("self-phone").value = hsHienTai.sodt || "";
            document.getElementById("self-address").value = hsHienTai.diaChi || "";
        } else {
            // Nếu chưa tìm thấy (giáo viên chưa nhập liệu)
            document.getElementById("info-name").innerText = "Chưa có dữ liệu từ Giáo Viên";
            document.getElementById("info-sbd").innerText = taiKhoanHienTai;
            document.getElementById("info-dob").innerText = "-";
            document.getElementById("info-gender").innerText = "-";
            document.getElementById("info-email").innerText = "-";
            document.getElementById("info-phone").innerText = "-";
            document.getElementById("info-address").innerText = "-";
        }
    }

    // Dùng vòng lặp for để duyệt qua từng học sinh trong mảng và tạo ra các dòng trong bảng
    for (var i = 0; i < danhSachHocSinh.length; i++) {
        var hs = danhSachHocSinh[i]; // Lấy ra học sinh thứ i
        
        // Kiểm tra xem học sinh này có phải là người đang đăng nhập không
        var laHocSinhHienTai = hs.sbd && hs.sbd.trim().toLowerCase() === taiKhoanHienTai.trim().toLowerCase();
        
        // Nếu tài khoản đăng nhập là Học sinh, thì CHỈ cho phép hiện dòng điểm của chính họ
        if (vaiTroHienTai === "hocsinh") {
            if (laHocSinhHienTai === false) {
                continue; // Bỏ qua, không vẽ học sinh này
            }
        }

        // Tính điểm trung bình và xếp loại
        var dtb = tinhDiemTB(hs.toan, hs.van, hs.anh);
        var loai = xepLoaiHS(dtb);

        // Hiển thị email và SĐT nhỏ ngay dưới tên
        var thongTinLienHe = "";
        if (hs.email || hs.sodt) {
            var emailStr = hs.email ? `📧 ${hs.email}` : "";
            var sodtStr = hs.sodt ? `📞 ${hs.sodt}` : "";
            var separator = (hs.email && hs.sodt) ? " | " : "";
            thongTinLienHe = `<br><small style="color: #0ea5e9; font-weight: 500;">${emailStr}${separator}${sodtStr}</small>`;
        }

        // Tạo chuỗi HTML chứa nút Sửa và Xóa (chỉ hiển thị nếu là giáo viên)
        var btnStr = "";
        if (vaiTroHienTai === "giaovien") {
            btnStr = `<button onclick="suaHocSinh(${hs.id})" class="btn-edit" style="width:auto; padding:5px 10px">Sửa</button> 
                      <button onclick="xoaHocSinh(${hs.id})" class="btn-danger" style="width:auto; padding:5px 10px">Xóa</button>`;
        }

        // Tạo ra 1 dòng HTML (thẻ tr là hàng, thẻ td là cột)
        var dongHtml = `<tr>
            <td><strong>${hs.hoTen}</strong><br><small style="color:#64748b">SBD: ${hs.sbd || ""}</small>${thongTinLienHe}</td>
            <td>${hs.toan}</td>
            <td>${hs.van}</td>
            <td>${hs.anh || 0}</td>
            <td><strong>${dtb}</strong></td>
            <td><span class="badge ${loai}">${loai}</span></td>`;
        
        // Cột Thao Tác (chỉ giáo viên mới có cột này)
        if (vaiTroHienTai === "giaovien") {
            dongHtml += `<td>${btnStr}</td>`;
        }

        dongHtml += `</tr>`;
        
        // Thêm dòng HTML vừa tạo vào trong bảng
        theBang.innerHTML += dongHtml;
    }
}

// ==========================================
// 6. CÁC HÀM ĐĂNG NHẬP, ĐĂNG KÝ
// ==========================================

// Hàm chuyển đổi giữa form đăng nhập và form đăng ký
function chuyenCheDo(laDangKy) {
    if (laDangKy === true) {
        document.getElementById("login-form").style.display = "none";     // Ẩn đăng nhập
        document.getElementById("register-form").style.display = "block"; // Hiện đăng ký
        document.getElementById("auth-title").innerText = "Đăng Ký Tài Khoản";
    } else {
        document.getElementById("login-form").style.display = "block";    // Hiện đăng nhập
        document.getElementById("register-form").style.display = "none";  // Ẩn đăng ký
        document.getElementById("auth-title").innerText = "Đăng Nhập";
    }
}

// Hàm xử lý khi bấm nút "Tạo tài khoản"
function xuLyDangKy() {
    var roleDangKy = document.getElementById("reg-role").value;
    var tk = document.getElementById("reg-username").value;
    var mk = document.getElementById("reg-password").value;
    
    // Kiểm tra độ dài mật khẩu
    if (mk.length < 6) { 
        alert("Mật khẩu quá ngắn! Phải có ít nhất 6 ký tự."); 
        return; 
    }
    
    // Kiểm tra xem tên đăng nhập đã có người khác dùng chưa
    var daTonTai = false;
    for (var i = 0; i < danhSachTaiKhoan.length; i++) {
        var user = danhSachTaiKhoan[i];
        if (user.tenDangNhap.trim().toLowerCase() === tk.trim().toLowerCase()) {
            daTonTai = true;
            break;
        }
    }

    if (daTonTai === true) { 
        alert("Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác."); 
        return; 
    }
    
    // Tạo đối tượng tài khoản mới và thêm vào mảng
    var taiKhoanMoi = { tenDangNhap: tk, matKhau: mk, vaiTro: roleDangKy };
    danhSachTaiKhoan.push(taiKhoanMoi);
    
    luuTaiKhoanVaoMay(); 
    alert("Đăng ký thành công! Mời bạn đăng nhập."); 
    chuyenCheDo(false); // Chuyển về màn hình đăng nhập
}

// Hàm xử lý khi bấm nút "Đăng Nhập"
function xuLyDangNhap() {
    var roleChon = document.getElementById("login-role").value;
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    
    // Tìm trong mảng tài khoản xem có ai khớp với thông tin vừa nhập không
    var taiKhoanTimThay = null;
    for (var i = 0; i < danhSachTaiKhoan.length; i++) {
        var u = danhSachTaiKhoan[i];
        // So sánh không phân biệt chữ hoa chữ thường đối với tên đăng nhập
        var trungTen = (u.tenDangNhap.trim().toLowerCase() === user.trim().toLowerCase());
        var trungMatKhau = (u.matKhau === pass);
        var trungVaiTro = (u.vaiTro === roleChon);

        if (trungTen && trungMatKhau && trungVaiTro) {
            taiKhoanTimThay = u;
            break; // Tìm thấy thì dừng vòng lặp
        }
    }

    if (taiKhoanTimThay !== null) {
        // Đăng nhập thành công
        vaiTroHienTai = taiKhoanTimThay.vaiTro; 
        taiKhoanHienTai = taiKhoanTimThay.tenDangNhap; 
        document.getElementById("login-overlay").style.display = "none"; // Ẩn màn hình đăng nhập
        
        // Điều chỉnh giao diện tùy theo vai trò là học sinh hay giáo viên
        if (vaiTroHienTai === "hocsinh") {
            document.getElementById("form-section").style.display = "block";
            document.getElementById("teacher-form-container").style.display = "none"; // Học sinh không thấy form thêm HS
            document.getElementById("student-form-container").style.display = "block"; // Học sinh thấy form cập nhật thông tin cá nhân
            
            document.getElementById("cot-hanh-dong").style.display = "none"; // Ẩn cột sửa/xóa
            document.getElementById("student-info-card").style.display = "block"; // Hiện thẻ thông tin hồ sơ
        } else {
            // Giáo viên
            document.getElementById("form-section").style.display = "block"; 
            document.getElementById("teacher-form-container").style.display = "block"; // Giáo viên thấy form thêm HS
            document.getElementById("student-form-container").style.display = "none"; // Ẩn form cập nhật thông tin cá nhân
            
            document.getElementById("cot-hanh-dong").style.display = "table-cell"; // Hiện cột sửa/xóa
            document.getElementById("student-info-card").style.display = "none"; // Ẩn thẻ thông tin hồ sơ
        }
        
        // Vẽ lại bảng dữ liệu
        veLaiBang();
    } else {
        alert("Đăng nhập thất bại! Kiểm tra lại tài khoản, mật khẩu hoặc CHỨC VỤ.");
    }
}

// ==========================================
// 7. CÁC HÀM KHÁC (HỌC SINH TỰ CẬP NHẬT, ĐĂNG XUẤT)
// ==========================================

// Hàm khi học sinh tự cập nhật số điện thoại, email
function xuLyCapNhatHocSinh() {
    var emailVal = document.getElementById("self-email").value.trim();
    var phoneVal = document.getElementById("self-phone").value.trim();
    var addressVal = document.getElementById("self-address").value.trim();

    // Tìm hồ sơ học sinh của tài khoản đang đăng nhập
    var hsCuaToi = null;
    for (var i = 0; i < danhSachHocSinh.length; i++) {
        var h = danhSachHocSinh[i];
        if (h.sbd && h.sbd.trim().toLowerCase() === taiKhoanHienTai.trim().toLowerCase()) {
            hsCuaToi = h;
            break;
        }
    }

    if (hsCuaToi !== null) {
        // Cập nhật thông tin mới
        hsCuaToi.email = emailVal;
        hsCuaToi.sodt = phoneVal;
        hsCuaToi.diaChi = addressVal;
        
        luuHocSinhVaoMay(); // Lưu lại vào máy tính
        veLaiBang(); // Vẽ lại để cập nhật bảng
        alert("🎉 Cập nhật thông tin cá nhân thành công!");
    } else {
        alert("❌ Lỗi: Không tìm thấy hồ sơ học sinh khớp với Số báo danh của tài khoản này. Vui lòng liên hệ giáo viên nhập điểm.");
    }
}

// Hàm đăng xuất
function dangXuat() {
    vaiTroHienTai = ""; 
    taiKhoanHienTai = "";
    document.getElementById("login-overlay").style.display = "flex"; // Hiện lại màn hình đăng nhập
    document.getElementById("login-form").reset(); // Xóa sạch form đăng nhập
    document.getElementById("student-self-form").reset(); // Xóa sạch form học sinh
    donDepForm(); // Xóa sạch form giáo viên
}

// ==========================================
// 8. KHI TRANG WEB VỪA TẢI XONG
// ==========================================
// Lệnh này tự động chạy khi người dùng vừa mở trang web lên
window.onload = function() { 
    layHocSinhTuMay(); // Lấy dữ liệu cũ ra
    layTaiKhoanTuMay(); // Lấy tài khoản cũ ra
};
